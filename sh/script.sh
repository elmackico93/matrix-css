#!/bin/bash
# ╔════════════════════════════════════════════════════════════╗
# ║                                                            ║
# ║       MATRIX.CSS NEXT.JS FRAMEWORK EXTRACTION TOOL         ║
# ║                   Version 1.0.0                            ║
# ║                                                            ║
# ╚════════════════════════════════════════════════════════════╝
#
# This script extracts a Matrix.css Next.js framework from a consolidated file
# and creates a fully functional project structure.
#
# USAGE:
#   ./extract-matrix.sh [options]
#
# OPTIONS:
#   -h, --help             Show this help message
#   -f, --file FILE        Specify input consolidated file (default: ./consolidated.txt)
#   -n, --name NAME        Specify output project name (default: matrix-nextjs)
#   -y, --yes              Non-interactive mode (skip confirmations)
#   -v, --verbose          Enable verbose output

# ┌────────────────────────────────────────────────────────────┐
# │ 1. METADATA & CONFIGURATION SECTION                        │
# └────────────────────────────────────────────────────────────┘

# Strict error handling
set -e                  # Exit on any error
set -o pipefail         # Pipe fails on any command failure
set -u                  # Fail on undefined variables

# Define terminal color codes for visual feedback
RESET='\033[0m'
BOLD='\033[1m'
BLACK='\033[30m'
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
WHITE='\033[37m'
BG_BLACK='\033[40m'
BG_RED='\033[41m'
BG_GREEN='\033[42m'
BG_YELLOW='\033[43m'
BG_BLUE='\033[44m'
BG_MAGENTA='\033[45m'
BG_CYAN='\033[46m'
BG_WHITE='\033[47m'

# Configuration variables
DEFAULT_PROJECT_NAME="matrix-nextjs"
DEFAULT_INPUT_FILE="./consolidated.txt"
TEMP_DIR=$(mktemp -d)
SCRIPT_START_TIME=$(date +%s)
LOG_FILE="extraction.log"
INTERACTIVE=true
VERBOSE=false
INPUT_FILE=""
PROJECT_NAME=""

# ┌────────────────────────────────────────────────────────────┐
# │ 2. UTILITY FUNCTIONS SECTION                               │
# └────────────────────────────────────────────────────────────┘

# Display help information
show_help() {
  echo -e "${BOLD}Matrix.css Framework Extraction Utility${RESET}"
  echo
  echo "This script extracts a Matrix.css Next.js framework from a consolidated file"
  echo "and creates a fully functional project structure."
  echo
  echo -e "${BOLD}USAGE:${RESET}"
  echo "  ./extract-matrix.sh [options]"
  echo
  echo -e "${BOLD}OPTIONS:${RESET}"
  echo "  -h, --help             Show this help message"
  echo "  -f, --file FILE        Specify input consolidated file (default: ./consolidated.txt)"
  echo "  -n, --name NAME        Specify output project name (default: matrix-nextjs)"
  echo "  -y, --yes              Non-interactive mode (skip confirmations)"
  echo "  -v, --verbose          Enable verbose output"
}

# Logging function with severity levels
log() {
  local level="$1"
  local message="$2"
  local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  local color=""
  
  case "$level" in
    "INFO")  color="$BLUE";;
    "WARN")  color="$YELLOW";;
    "ERROR") color="$RED";;
    "SUCCESS") color="$GREEN";;
    *) color="$RESET";;
  esac
  
  # Log to console with color
  echo -e "${color}[${timestamp}] [${level}]${RESET} ${message}"
  
  # Log to file without color codes
  echo "[${timestamp}] [${level}] ${message}" >> "$LOG_FILE"
  
  # Extra debug information if verbose
  if [[ "$VERBOSE" = true ]] && [[ "$level" = "INFO" ]]; then
    echo -e "  ${CYAN}$(caller)${RESET}" >> "$LOG_FILE"
  fi
}

# Progress bar for visual feedback
show_progress() {
  local current="$1"
  local total="$2"
  local width=50
  local percentage=$((current * 100 / total))
  local completed=$((width * current / total))
  local remaining=$((width - completed))
  
  # Create the bar
  local bar="["
  for ((i=0; i<completed; i++)); do bar+="="; done
  if [[ $completed -lt $width ]]; then bar+=">"; fi
  for ((i=0; i<remaining-1; i++)); do bar+=" "; done
  bar+="]"
  
  # Print the bar and percentage
  printf "\r%-${width}s %3d%% (%d/%d)" "$bar" "$percentage" "$current" "$total"
}

# Error handling function
handle_error() {
  local exit_code=$?
  local line_no=$1
  
  log "ERROR" "Failed at line ${line_no} with exit code ${exit_code}"
  log "ERROR" "Cleaning up temporary files..."
  
  # Clean up temporary files
  rm -rf "$TEMP_DIR"
  
  # Show error message
  echo -e "\n${RED}${BOLD}Extraction failed!${RESET}"
  echo -e "Please check the log file: ${LOG_FILE}"
  
  exit $exit_code
}

# Set up the error trap
trap 'handle_error $LINENO' ERR

# Create a README for the generated project
create_readme() {
  local project_dir="$1"
  
  cat > "${project_dir}/README.md" << EOF
# Matrix.css Next.js Framework

A cyberpunk-inspired UI framework for Next.js applications, featuring Matrix-style visual effects and components.

## Features

- Complete set of Matrix-styled UI components
- Visual effects including code rain, glitch text, and terminals
- Responsive layout system with Container, Row, and Col components
- Dark mode with Matrix-inspired color palette
- Built with TypeScript and React

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Components

- UI Components: Button, Card, Alert, Modal, Progress, etc.
- Layout Components: Container, Row, Col, Footer, Navbar, etc.
- Effect Components: CodeRain, GlitchText, Terminal, NeuralNetwork, etc.

## License

MIT

## Acknowledgements

This framework was extracted using the Matrix.css Extraction Tool.
EOF

  log "INFO" "README.md created"
}

# Create a simple favicon for the project
create_favicon() {
  local project_dir="$1"
  
  # Create public directory if it doesn't exist
  mkdir -p "${project_dir}/public"
  
  # Create a basic HTML structure for the project
  cat > "${project_dir}/public/favicon.ico" << EOF
data:image/x-icon;base64,AAABAAEAAQECAAEA
EOF

  log "INFO" "Favicon created"
}

# ┌────────────────────────────────────────────────────────────┐
# │ 3. CORE OPERATION FUNCTIONS                                │
# └────────────────────────────────────────────────────────────┘

# Check system requirements
check_requirements() {
  log "INFO" "Validating system requirements..."
  
  local missing_reqs=0
  
  # Check for required commands
  for cmd in node npm xxd mktemp; do
    if ! command -v "$cmd" &>/dev/null; then
      log "ERROR" "Required command not found: $cmd"
      missing_reqs=1
    else
      local version_info=""
      case "$cmd" in
        node) version_info=$(node -v 2>/dev/null) ;;
        npm)  version_info=$(npm -v 2>/dev/null) ;;
        *)    version_info="✓" ;;
      esac
      log "INFO" "Found $cmd: $version_info"
    fi
  done
  
  # Check for disk space (need at least 100MB)
  local free_space=$(df -k . | tail -1 | awk '{print $4}')
  if [[ $free_space -lt 102400 ]]; then
    log "ERROR" "Insufficient disk space. Need at least 100MB free."
    missing_reqs=1
  else
    log "INFO" "Sufficient disk space available: $((free_space / 1024)) MB"
  fi
  
  # Verify appropriate permissions
  if [[ ! -w "." ]]; then
    log "ERROR" "No write permission in current directory."
    missing_reqs=1
  else
    log "INFO" "Write permission verified in current directory."
  fi
  
  if [[ $missing_reqs -eq 1 ]]; then
    return 1
  fi
  return 0
}

# Extract files from consolidated file to output directory
extract_files() {
  local consolidated_file="$1"
  local output_dir="$2"
  
  log "INFO" "Beginning file extraction process from $consolidated_file"
  
  # Count total files for progress tracking
  local total_files=$(grep -c '^===== ' "$consolidated_file")
  log "INFO" "Found $total_files files to extract"
  
  # Setup variables for processing
  local current_file=""
  local extract_content=false
  local extracted_files=0
  local temp_file="$TEMP_DIR/current_file.tmp"
  
  # Process the consolidated file line by line
  while IFS= read -r line; do
    # Check if this line starts a new file section
    if [[ "$line" =~ ^===== ]]; then
      # If we were extracting content, write the temp file to destination
      if [[ "$extract_content" = true ]] && [[ -n "$current_file" ]]; then
        # Create directory if it doesn't exist
        mkdir -p "$(dirname "$output_dir/$current_file")"
        
        # Write temp file to destination
        cp "$temp_file" "$output_dir/$current_file"
        
        # Increment counter and update progress
        extracted_files=$((extracted_files + 1))
        show_progress $extracted_files $total_files
        
        # Reset temp file
        > "$temp_file"
      }
      
      # Extract file path from the line (remove the ===== markers)
      current_file=$(echo "$line" | sed 's/^===== //;s/ =====$//')
      extract_content=true
      
    # If we're extracting content and this is not a file marker, add it to the temp file
    elif [[ "$extract_content" = true ]]; then
      echo "$line" >> "$temp_file"
    fi
  done < "$consolidated_file"
  
  # Handle the last file
  if [[ "$extract_content" = true ]] && [[ -n "$current_file" ]]; then
    mkdir -p "$(dirname "$output_dir/$current_file")"
    cp "$temp_file" "$output_dir/$current_file"
    extracted_files=$((extracted_files + 1))
    show_progress $extracted_files $total_files
  fi
  
  echo "" # New line after progress bar
  log "SUCCESS" "Extracted $extracted_files files successfully"
  
  return 0
}

# Verify project integrity
verify_project() {
  local project_dir="$1"
  log "INFO" "Verifying project integrity in $project_dir"
  
  # Define critical files that must exist
  local critical_files=(
    "package.json"
    "tsconfig.json"
    "next.config.js"
    "src/pages/_app.tsx"
    "src/pages/index.tsx"
    "src/styles/globals.css"
    "src/utils/cn.ts"
  )
  
  # Check for missing critical files
  local missing_files=0
  for file in "${critical_files[@]}"; do
    if [[ ! -f "$project_dir/$file" ]]; then
      log "ERROR" "Critical file missing: $file"
      missing_files=1
    fi
  done
  
  # Validate package.json format
  if [[ -f "$project_dir/package.json" ]]; then
    if command -v jq &>/dev/null && ! jq . "$project_dir/package.json" &>/dev/null; then
      log "ERROR" "package.json is not valid JSON"
      missing_files=1
    else
      log "INFO" "package.json validated"
    fi
  fi
  
  # Check for expected directories
  local expected_dirs=(
    "src/components/ui"
    "src/components/layout"
    "src/components/effects"
    "src/context"
    "src/hooks"
    "src/utils"
    "src/styles"
    "src/pages"
  )
  
  for dir in "${expected_dirs[@]}"; do
    if [[ ! -d "$project_dir/$dir" ]]; then
      log "ERROR" "Expected directory missing: $dir"
      missing_files=1
    fi
  done
  
  # Count total files extracted
  local total_files=$(find "$project_dir" -type f | wc -l)
  log "INFO" "Total files extracted: $total_files"
  
  if [[ $missing_files -eq 0 ]]; then
    log "SUCCESS" "Project verification completed successfully"
    return 0
  else
    log "ERROR" "Project verification failed"
    return 1
  fi
}

# Generate default package.json if missing
create_default_package_json() {
  local project_dir="$1"
  
  if [[ ! -f "$project_dir/package.json" ]]; then
    log "WARN" "package.json not found, creating default version"
    
    cat > "$project_dir/package.json" << EOF
{
  "name": "matrix-css-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "class-variance-authority": "^0.4.0",
    "clsx": "^1.2.1",
    "next": "^13.2.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^1.10.0"
  },
  "devDependencies": {
    "@types/node": "^18.15.3",
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.36.0",
    "eslint-config-next": "^13.2.4",
    "postcss": "^8.4.21",
    "tailwindcss": "^3.2.7",
    "typescript": "^5.0.2"
  }
}
EOF
  }
}

# Generate default tsconfig.json if missing
create_default_tsconfig() {
  local project_dir="$1"
  
  if [[ ! -f "$project_dir/tsconfig.json" ]]; then
    log "WARN" "tsconfig.json not found, creating default version"
    
    cat > "$project_dir/tsconfig.json" << EOF
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF
  }
}

# Generate default next.config.js if missing
create_default_next_config() {
  local project_dir="$1"
  
  if [[ ! -f "$project_dir/next.config.js" ]]; then
    log "WARN" "next.config.js not found, creating default version"
    
    cat > "$project_dir/next.config.js" << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
EOF
  }
}

# Generate default tailwind.config.js if missing
create_default_tailwind_config() {
  local project_dir="$1"
  
  if [[ ! -f "$project_dir/tailwind.config.js" ]]; then
    log "WARN" "tailwind.config.js not found, creating default version"
    
    cat > "$project_dir/tailwind.config.js" << EOF
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          bg: "var(--m-bg)",
          border: "var(--m-border)",
          panel: "var(--m-panel)",
          text: "var(--m-text)",
          "text-bright": "var(--m-text-bright)",
          "text-dim": "var(--m-text-dim)",
          primary: "var(--m-primary)",
          secondary: "var(--m-secondary)",
          success: "var(--m-success)",
          danger: "var(--m-danger)",
          warning: "var(--m-warning)",
          info: "var(--m-info)",
        },
      },
      fontFamily: {
        matrix: "var(--m-font)",
        "matrix-alt": "var(--m-font-alt)",
        "matrix-hacker": "var(--m-font-hacker)",
      },
    },
  },
  plugins: [],
}
EOF
  }
}

# Generate default globals.css if missing
create_default_globals_css() {
  local project_dir="$1"
  
  if [[ ! -f "$project_dir/src/styles/globals.css" ]]; then
    log "WARN" "globals.css not found, creating default version"
    
    mkdir -p "$project_dir/src/styles"
    
    cat > "$project_dir/src/styles/globals.css" << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Base colors */
  --m-bg: #000000;
  --m-border: #0a3f0a;
  --m-panel: #071a07;
  --m-text: #00ff41;
  --m-text-bright: #00ff97;
  --m-text-dim: #003b0d;
  --m-glow: rgba(0, 255, 65, 0.6);
  
  /* Semantic colors */
  --m-primary: #00ff41;
  --m-secondary: #092e09;
  --m-success: #00dd00;
  --m-danger: #ff0055;
  --m-warning: #ffbb00;
  --m-info: #0099ff;
  
  /* Font families */
  --m-font: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --m-font-alt: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --m-font-hacker: "Courier New", monospace;
  
  /* Layout */
  --m-radius: 4px;
  --m-gap: 1.5rem;
  --m-container-width: 1200px;
}

[data-theme="light"] {
  --m-bg: #f0f0f0;
  --m-border: #217a21;
  --m-panel: #e8f0e8;
  --m-text: #0a5b0a;
  --m-text-bright: #042f04;
  --m-text-dim: #77cc77;
  --m-glow: rgba(10, 91, 10, 0.2);
}

html,
body {
  background-color: var(--m-bg);
  color: var(--m-text);
  font-family: var(--m-font);
}

@keyframes cursor-blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes glitch-1 {
  0% { clip: rect(0, 9999px, 9px, 0); }
  4% { clip: rect(0, 9999px, 85px, 0); }
  8% { clip: rect(0, 9999px, 47px, 0); }
  12% { clip: rect(0, 9999px, 23px, 0); }
  16% { clip: rect(0, 9999px, 34px, 0); }
  20% { clip: rect(0, 9999px, 3px, 0); }
  24% { clip: rect(0, 9999px, 82px, 0); }
  28% { clip: rect(0, 9999px, 73px, 0); }
  32% { clip: rect(0, 9999px, 20px, 0); }
  36% { clip: rect(0, 9999px, 53px, 0); }
  40% { clip: rect(0, 9999px, 47px, 0); }
  44% { clip: rect(0, 9999px, 86px, 0); }
  48% { clip: rect(0, 9999px, 38px, 0); }
  52% { clip: rect(0, 9999px, 38px, 0); }
  56% { clip: rect(0, 9999px, 81px, 0); }
  60% { clip: rect(0, 9999px, 33px, 0); }
  64% { clip: rect(0, 9999px, 88px, 0); }
  68% { clip: rect(0, 9999px, 90px, 0); }
  72% { clip: rect(0, 9999px, 41px, 0); }
  76% { clip: rect(0, 9999px, 29px, 0); }
  80% { clip: rect(0, 9999px, 76px, 0); }
  84% { clip: rect(0, 9999px, 56px, 0); }
  88% { clip: rect(0, 9999px, 72px, 0); }
  92% { clip: rect(0, 9999px, 25px, 0); }
  96% { clip: rect(0, 9999px, 99px, 0); }
  100% { clip: rect(0, 9999px, 4px, 0); }
}

@keyframes glitch-2 {
  0% { clip: rect(0, 9999px, 9px, 0); }
  4% { clip: rect(0, 9999px, 76px, 0); }
  8% { clip: rect(0, 9999px, 12px, 0); }
  12% { clip: rect(0, 9999px, 82px, 0); }
  16% { clip: rect(0, 9999px, 37px, 0); }
  20% { clip: rect(0, 9999px, 68px, 0); }
  24% { clip: rect(0, 9999px, 13px, 0); }
  28% { clip: rect(0, 9999px, 57px, 0); }
  32% { clip: rect(0, 9999px, 39px, 0); }
  36% { clip: rect(0, 9999px, 48px, 0); }
  40% { clip: rect(0, 9999px, 91px, 0); }
  44% { clip: rect(0, 9999px, 16px, 0); }
  48% { clip: rect(0, 9999px, 43px, 0); }
  52% { clip: rect(0, 9999px, 64px, 0); }
  56% { clip: rect(0, 9999px, 93px, 0); }
  60% { clip: rect(0, 9999px, 3px, 0); }
  64% { clip: rect(0, 9999px, 30px, 0); }
  68% { clip: rect(0, 9999px, 94px, 0); }
  72% { clip: rect(0, 9999px, 4px, 0); }
  76% { clip: rect(0, 9999px, 24px, 0); }
  80% { clip: rect(0, 9999px, 57px, 0); }
  84% { clip: rect(0, 9999px, 10px, 0); }
  88% { clip: rect(0, 9999px, 23px, 0); }
  92% { clip: rect(0, 9999px, 96px, 0); }
  96% { clip: rect(0, 9999px, 46px, 0); }
  100% { clip: rect(0, 9999px, 91px, 0); }
}

@keyframes progress-bar-stripes {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

@keyframes neuron-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
EOF
  }
}

# Generate default cn utility if missing
create_default_cn_utility() {
  local project_dir="$1"
  
  if [[ ! -f "$project_dir/src/utils/cn.ts" ]]; then
    log "WARN" "cn.ts utility not found, creating default version"
    
    mkdir -p "$project_dir/src/utils"
    
    cat > "$project_dir/src/utils/cn.ts" << EOF
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names or conditional class names and 
 * ensures proper handling of Tailwind classes using tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF
  }
}

# Generate default pages if missing
create_default_pages() {
  local project_dir="$1"
  
  # Create _app.tsx
  if [[ ! -f "$project_dir/src/pages/_app.tsx" ]]; then
    log "WARN" "_app.tsx not found, creating default version"
    
    mkdir -p "$project_dir/src/pages"
    
    cat > "$project_dir/src/pages/_app.tsx" << EOF
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
EOF
  }
  
  # Create index.tsx
  if [[ ! -f "$project_dir/src/pages/index.tsx" ]]; then
    log "WARN" "index.tsx not found, creating default version"
    
    mkdir -p "$project_dir/src/pages"
    
    cat > "$project_dir/src/pages/index.tsx" << EOF
import Head from 'next/head';
import { Button } from '@/components/ui/Button';
import { CodeRain } from '@/components/effects/CodeRain';
import { GlitchText } from '@/components/effects/GlitchText';

export default function Home() {
  return (
    <>
      <Head>
        <title>Matrix.css - Next.js Framework</title>
        <meta name="description" content="A cyberpunk-inspired UI framework" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="relative min-h-screen">
        {/* Background effect */}
        <div className="fixed inset-0 -z-10">
          <CodeRain />
        </div>
        
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <GlitchText text="MATRIX.CSS" />
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              A cyberpunk-inspired UI framework for creating immersive digital interfaces
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" hasGlow>Explore Components</Button>
              <Button variant="terminal">View Documentation</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-matrix-panel p-6 rounded border border-matrix-border">
              <h2 className="text-xl font-bold text-matrix-text-bright mb-3">UI Components</h2>
              <p>Comprehensive set of Matrix-styled UI elements including buttons, cards, alerts, and more.</p>
            </div>
            
            <div className="bg-matrix-panel p-6 rounded border border-matrix-border">
              <h2 className="text-xl font-bold text-matrix-text-bright mb-3">Visual Effects</h2>
              <p>Stunning matrix-inspired effects like code rain, glitch text, terminals and neural networks.</p>
            </div>
            
            <div className="bg-matrix-panel p-6 rounded border border-matrix-border">
              <h2 className="text-xl font-bold text-matrix-text-bright mb-3">Layout System</h2>
              <p>Responsive grid system with Container, Row, and Col components for flexible layouts.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
EOF
  }
}

# Fill in any missing critical files with defaults
create_missing_files() {
  local project_dir="$1"
  log "INFO" "Checking for missing critical files..."
  
  create_default_package_json "$project_dir"
  create_default_tsconfig "$project_dir"
  create_default_next_config "$project_dir"
  create_default_tailwind_config "$project_dir"
  create_default_globals_css "$project_dir"
  create_default_cn_utility "$project_dir"
  create_default_pages "$project_dir"
  
  log "SUCCESS" "Missing critical files have been created"
}

# ┌────────────────────────────────────────────────────────────┐
# │ 4. WORKFLOW CONTROL SECTION                                │
# └────────────────────────────────────────────────────────────┘

# Parse command line arguments
parse_arguments() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -h|--help)
        show_help
        exit 0
        ;;
      -f|--file)
        INPUT_FILE="$2"
        shift 2
        ;;
      -n|--name)
        PROJECT_NAME="$2"
        shift 2
        ;;
      -y|--yes)
        INTERACTIVE=false
        shift
        ;;
      -v|--verbose)
        VERBOSE=true
        shift
        ;;
      *)
        log "ERROR" "Unknown option: $1"
        show_help
        exit 1
        ;;
    esac
  done
  
  # Set defaults if not specified
  INPUT_FILE=${INPUT_FILE:-$DEFAULT_INPUT_FILE}
  PROJECT_NAME=${PROJECT_NAME:-$DEFAULT_PROJECT_NAME}
}

# Initialization function to set up the extraction process
initialize() {
  # Initialize log file
  echo "--- Matrix.css Extraction Log - $(date) ---" > "$LOG_FILE"
  
  # Check system requirements
  if ! check_requirements; then
    log "ERROR" "System requirements check failed."
    exit 1
  fi
  
  # Interactive mode - prompt for input file if not specified
  if [[ "$INTERACTIVE" = true ]] && [[ "$INPUT_FILE" = "$DEFAULT_INPUT_FILE" ]]; then
    read -p "Enter path to consolidated file [$DEFAULT_INPUT_FILE]: " user_input
    INPUT_FILE=${user_input:-$DEFAULT_INPUT_FILE}
  }
  
  # Validate input file
  if [[ ! -f "$INPUT_FILE" ]]; then
    log "ERROR" "Consolidated file not found: $INPUT_FILE"
    exit 1
  fi
  
  # Validate file format (check for expected header and section markers)
  if ! grep -q "^# MATRIX.CSS NEXT.JS FRAMEWORK - CONSOLIDATED FILE" "$INPUT_FILE"; then
    log "WARN" "File does not contain expected header. This may not be a valid consolidated file."
    if [[ "$INTERACTIVE" = true ]]; then
      read -p "Continue anyway? (y/N): " confirm
      if [[ ! "$confirm" =~ ^[Yy] ]]; then
        log "INFO" "Extraction canceled by user."
        exit 0
      fi
    fi
  fi
  
  # Interactive mode - prompt for project name if not specified
  if [[ "$INTERACTIVE" = true ]]; then
    read -p "Enter project name [$PROJECT_NAME]: " user_input
    PROJECT_NAME=${user_input:-$PROJECT_NAME}
    
    # Sanitize project name
    PROJECT_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
    
    # Check if directory already exists
    if [[ -d "$PROJECT_NAME" ]]; then
      log "WARN" "Directory '$PROJECT_NAME' already exists."
      read -p "Overwrite? (y/N): " confirm
      if [[ "$confirm" =~ ^[Yy] ]]; then
        log "INFO" "Removing existing directory..."
        rm -rf "$PROJECT_NAME"
      else
        log "INFO" "Extraction canceled by user."
        exit 0
      fi
    fi
  else
    # Non-interactive mode - just check and remove existing directory
    if [[ -d "$PROJECT_NAME" ]]; then
      log "WARN" "Directory '$PROJECT_NAME' already exists and will be overwritten."
      rm -rf "$PROJECT_NAME"
    fi
  fi
}

# Main execution function
main() {
  # Display welcome banner
  echo -e "${BG_BLACK}${GREEN}${BOLD}"
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║                                                        ║"
  echo "║      MATRIX.CSS NEXT.JS FRAMEWORK EXTRACTION TOOL      ║"
  echo "║                                                        ║"
  echo "╚════════════════════════════════════════════════════════╝"
  echo -e "${RESET}"
  
  # Parse command line arguments (if supplied)
  parse_arguments "$@"
  
  # Initialize extraction environment
  initialize
  
  # Create project structure
  log "INFO" "Creating project structure..."
  
  mkdir -p "$PROJECT_NAME"
  mkdir -p "$PROJECT_NAME/src/components/ui"
  mkdir -p "$PROJECT_NAME/src/components/layout"
  mkdir -p "$PROJECT_NAME/src/components/effects"
  mkdir -p "$PROJECT_NAME/src/context"
  mkdir -p "$PROJECT_NAME/src/hooks"
  mkdir -p "$PROJECT_NAME/src/utils"
  mkdir -p "$PROJECT_NAME/src/styles"
  mkdir -p "$PROJECT_NAME/src/pages"
  mkdir -p "$PROJECT_NAME/public"
  
  # Extract files
  extract_files "$INPUT_FILE" "$PROJECT_NAME"
  
  # Fill in any missing critical files
  create_missing_files "$PROJECT_NAME"
  
  # Create additional files
  create_readme "$PROJECT_NAME"
  create_favicon "$PROJECT_NAME"
  
  # Verify project integrity
  if verify_project "$PROJECT_NAME"; then
    # Calculate execution time
    local end_time=$(date +%s)
    local duration=$((end_time - SCRIPT_START_TIME))
    
    # Display success message
    echo -e "\n${BG_BLACK}${GREEN}${BOLD}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║      MATRIX.CSS FRAMEWORK EXTRACTED SUCCESSFULLY       ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    echo
    echo -e "Your project has been created in the ${CYAN}${BOLD}$PROJECT_NAME${RESET} directory."
    echo -e "Extraction completed in ${duration} seconds."
    echo
    echo -e "To get started:"
    echo -e "  1. cd ${CYAN}$PROJECT_NAME${RESET}"
    echo -e "  2. Run ${YELLOW}npm install${RESET}"
    echo -e "  3. Run ${YELLOW}npm run dev${RESET}"
    echo -e "  4. Open ${BLUE}http://localhost:3000${RESET} in your browser"
    echo
    log "SUCCESS" "Matrix.css framework extraction completed successfully."
  else
    echo -e "\n${BG_BLACK}${RED}${BOLD}"
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║                                                        ║"
    echo "║         MATRIX.CSS FRAMEWORK EXTRACTION FAILED         ║"
    echo "║                                                        ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
    echo
    echo -e "Please check the log file (${LOG_FILE}) for details on what went wrong."
    exit 1
  fi
  
  # Clean up temporary files
  rm -rf "$TEMP_DIR"
  
  return 0
}

# ┌────────────────────────────────────────────────────────────┐
# │ 5. EXECUTION ENTRY POINT                                   │
# └────────────────────────────────────────────────────────────┘

# Execute main function with all arguments
main "$@"