import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { RotatingFeatures } from './RotatingFeatures'; // Import our new component

interface MatrixHeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  showScrollIndicator?: boolean;
  showVersion?: boolean;
  version?: string;
  disableRainEffect?: boolean;
  enableFeatureRotation?: boolean; // New prop to toggle feature rotation
}

// Custom enhanced matrix glitch text component
const EnhancedGlitchText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  return (
    <div className={cn("relative font-matrix-hacker", className)}>
      {/* Main text */}
      <span className="relative z-[2] text-[var(--m-text-bright)] mix-blend-screen">
        {text}
      </span>
      
      {/* Glitch layers - no backgrounds */}
      <span
        className="absolute top-0 left-0 w-full h-full z-[1] text-[#00f8] opacity-50 blur-[0.5px] animate-[glitch-offset_3.5s_infinite_alternate-reverse]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translateX(-2px)' }}
        aria-hidden="true"
      >
        {text}
      </span>
      
      <span
        className="absolute top-0 left-0 w-full h-full z-[1] text-[#f008] opacity-50 blur-[0.5px] animate-[glitch-offset_2.5s_infinite_alternate]"
        style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)', transform: 'translateX(2px)' }}
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
};

// Terminal component that will replace the subtitle
const MatrixTerminal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Sample code with proper indentation and structure
  const demoCode = `// Matrix.css Framework - Quick Start Example
import { 
  CodeRain, 
  MatrixNavbar, 
  MatrixHero,
  Terminal 
} from 'matrix-css';

/**
 * Create an immersive Matrix-style interface
 * with just a few components
 */
function MatrixApp() {
  return (
    <div className="matrix-app">
      {/* Full-screen digital rain background */}
      <CodeRain 
        density="medium"
        speed="normal"
        charSet="matrix"
        glitchEffect={true}
        className="fixed inset-0 -z-10 opacity-70"
      />
      
      {/* Cyberpunk-style navigation */}
      <MatrixNavbar 
        logoText="MY_PROJECT"
        statusText="SYSTEM ONLINE" 
        links={[
          { text: "HOME", href: "/" },
          { text: "DASHBOARD", href: "/dashboard" },
          { text: "ABOUT", href: "/about" }
        ]} 
      />
      
      {/* Hero section with Matrix styling */}
      <MatrixHero
        title="DIGITAL REVOLUTION"
        subtitle="Enter the digital realm with Matrix.css"
        primaryCta={{ 
          text: "GET STARTED", 
          href: "#start" 
        }}
        secondaryCta={{ 
          text: "DOCUMENTATION", 
          href: "#docs" 
        }}
      />
      
      {/* Interactive terminal for user input */}
      <Terminal
        title="Access Terminal"
        initialCommands={["help"]}
        commands={{
          help: () => "Available commands: status, login, exit",
          status: () => "All systems operational",
          login: () => "Access granted. Welcome to the Matrix."
        }}
      />
    </div>
  );
}

export default MatrixApp;`;

  // Handle realistic typing effect
  useEffect(() => {
    if (isTyping && cursorPosition < demoCode.length) {
      // Variable typing speed with contextual pauses
      let typingSpeed = 25 + Math.random() * 25;
      const currentChar = demoCode[cursorPosition];
      
      // Add natural pauses at different syntactic points
      if (currentChar === '\n') {
        typingSpeed = 200 + Math.random() * 150;
      } else if (currentChar === '{' || currentChar === '}') {
        typingSpeed = 150 + Math.random() * 100;
      } else if (currentChar === '(' || currentChar === ')') {
        typingSpeed = 80 + Math.random() * 50;
      } else if (currentChar === ',' || currentChar === ';') {
        typingSpeed = 120 + Math.random() * 60;
      }
      
      // Random longer "thinking" pause
      if (Math.random() > 0.985) {
        typingSpeed = 400 + Math.random() * 300;
      }
      
      const typingTimer = setTimeout(() => {
        setContent(demoCode.substring(0, cursorPosition + 1));
        setCursorPosition(prev => prev + 1);
        
        // Play typing sound occasionally
        if (Math.random() > 0.7 && currentChar !== ' ' && currentChar !== '\n') {
          playTypingSound();
        }
      }, typingSpeed);
      
      return () => clearTimeout(typingTimer);
    } else if (cursorPosition >= demoCode.length) {
      setIsTyping(false);
    }
  }, [cursorPosition, isTyping]);

  // Scroll terminal to keep content visible
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [content]);

  // Play typing sound effect
  const playTypingSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.value = 100 + Math.random() * 400;
      gainNode.gain.value = 0.05;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 10 + Math.random() * 20);
    } catch (e) {
      // Audio context not available
    }
  };
  
  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(demoCode)
      .then(() => {
        const messageEl = document.createElement('div');
        messageEl.innerText = 'Code copied!';
        messageEl.className = 'absolute top-3 right-3 bg-[var(--m-text)] text-black px-3 py-1 rounded text-sm';
        messageEl.style.animation = 'fadeOut 2s forwards';
        
        if (terminalRef.current) {
          terminalRef.current.appendChild(messageEl);
          setTimeout(() => messageEl.remove(), 2000);
        }
      });
  };

  return (
    <div className="w-full h-[70vh] max-h-[600px] bg-[rgba(0,0,0,0.85)] border border-[var(--m-text)] rounded-md overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.2)] relative">
      {/* Terminal header */}
      <div className="bg-[rgba(0,30,0,0.8)] py-2 px-3 flex justify-between items-center border-b border-[var(--m-border)]">
        <div className="flex items-center">
          <div className="mr-3 flex space-x-2">
            <span className="h-3 w-3 rounded-full bg-[#ff4a4a]"></span>
            <span className="h-3 w-3 rounded-full bg-[#ffbf00]"></span>
            <span className="h-3 w-3 rounded-full bg-[#00cd4e]"></span>
          </div>
          <span className="font-mono text-sm text-[var(--m-text)]">matrix-app.tsx</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={copyCode}
            className="px-3 py-1 text-xs bg-[rgba(0,50,0,0.7)] text-[var(--m-text)] border border-[var(--m-border)] rounded hover:bg-[rgba(0,70,0,0.8)] transition-colors"
          >
            Copy Code
          </button>
          <button 
            onClick={onClose}
            className="px-3 py-1 text-xs bg-[rgba(50,0,0,0.7)] text-[var(--m-text)] border border-[var(--m-border)] rounded hover:bg-[rgba(70,0,0,0.8)] transition-colors"
          >
            Close Terminal
          </button>
        </div>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="font-mono text-sm p-4 h-[calc(100%-40px)] overflow-auto whitespace-pre bg-[rgba(0,5,0,0.95)]"
      >
        <div 
          className="terminal-code" 
          dangerouslySetInnerHTML={{ 
            __html: formatCodeWithSyntaxHighlighting(content) + (isTyping ? '<span class="cursor"></span>' : '')
          }} 
        />
      </div>
      
      {/* Terminal scanlines effect */}
      <div className="scanlines absolute inset-0 pointer-events-none"></div>
    </div>
  );
};

// Helper function to add syntax highlighting
function formatCodeWithSyntaxHighlighting(code: string): string {
  return code
    // Replace one type of tokens at a time
    .replace(
      /(\/\/.*|\/\*[\s\S]*?\*\/|\*.*)/g, 
      '<span class="comment">$1</span>'
    )
    .replace(
      /\b(import|from|function|return|export|default|const|let|var)\b/g,
      '<span class="keyword">$1</span>'
    )
    .replace(
      /(<\/?[\w\d]+|className|href|text|title|commands|density|charSet|opacity|glitchEffect|statusText|logoText|links|initialCommands|showVersion|version|primaryCta|secondaryCta)\b/g,
      '<span class="tag">$1</span>'
    )
    .replace(
      /(".*?"|'.*?')/g,
      '<span class="string">$1</span>'
    )
    .replace(
      /\b(true|false)\b/g,
      '<span class="boolean">$1</span>'
    );
}

export const MatrixHero: React.FC<MatrixHeroProps> = ({
  className,
  title = 'MATRIX.CSS',
  subtitle = 'Immerse your users in the digital realm with the complete Matrix-inspired design framework. Build stunning cyberpunk interfaces with minimal effort.',
  primaryCta = { text: 'ENTER THE MATRIX', href: '#getting-started' },
  secondaryCta = { text: 'EXPLORE COMPONENTS', href: '#components' },
  showScrollIndicator = true,
  showVersion = true,
  version = 'VERSION 2.0',
  disableRainEffect = false,
  enableFeatureRotation = true, // Default to true
}) => {
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  
  // Digital grid background ref for hacker terminal mode
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialize matrix rain animation
  useEffect(() => {
    if (!rainCanvasRef.current || disableRainEffect) return;

    const canvas = rainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setIsCanvasReady(true);

    // Matrix characters (including Japanese katakana for authenticity)
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Set up columns
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -20);
    }
    
    // Animation function
    const draw = () => {
      // Check if terminal is active - if so, fade out the matrix rain
      if (terminalActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';  // Faster fade when terminal is active
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      
      // Semi-transparent black background for the trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set green text color
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      // Loop over each column
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        // Randomize brightness for some characters
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#00ff97'; // Brighter green
        } else {
          ctx.fillStyle = '#00ff41'; // Regular green
        }
        
        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        // Move drops down
        drops[i]++;
        
        // Reset to top with randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.floor(Math.random() * -20);
        }
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    const animationRef = { current: requestAnimationFrame(draw) };
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [disableRainEffect, terminalActive]);
  
  // Subtle digital grid background when terminal is active
  useEffect(() => {
    if (!gridCanvasRef.current || !terminalActive) return;
    
    const canvas = gridCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Grid parameters
    const cellSize = 40;
    const nodeRadius = 1;
    const lineWidth = 0.5;
    
    // Data pulses (moving dots along the grid lines)
    const dataPulses: {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      size: number;
      color: string;
    }[] = [];
    
    // Generate initial pulses
    const generatePulses = () => {
      const maxPulses = 15; // Number of pulses to show at once
      
      while (dataPulses.length < maxPulses) {
        // Start position (random grid node)
        const startX = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
        const startY = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
        
        // End position (adjacent node - only horizontal or vertical movement)
        let endX = startX;
        let endY = startY;
        
        if (Math.random() > 0.5) {
          // Move horizontally
          endX = startX + (Math.random() > 0.5 ? cellSize : -cellSize);
        } else {
          // Move vertically
          endY = startY + (Math.random() > 0.5 ? cellSize : -cellSize);
        }
        
        // Only add if within canvas bounds
        if (endX >= 0 && endX <= canvas.width && endY >= 0 && endY <= canvas.height) {
          dataPulses.push({
            x: startX,
            y: startY,
            targetX: endX,
            targetY: endY,
            progress: 0,
            speed: 0.005 + Math.random() * 0.015, // Random speed
            size: 1 + Math.random() * 2,
            color: `rgba(0, ${150 + Math.floor(Math.random() * 105)}, ${30 + Math.floor(Math.random() * 50)}, ${0.5 + Math.random() * 0.5})`
          });
        }
      }
    };
    
    // Create initial pulses
    generatePulses();
    
    // Draw function
    const draw = () => {
      // Clear canvas with transparent black
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set grid style
      ctx.strokeStyle = 'rgba(0, 60, 20, 0.15)';
      ctx.lineWidth = lineWidth;
      
      // Draw horizontal grid lines
      for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw vertical grid lines
      for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw grid nodes
      ctx.fillStyle = 'rgba(0, 100, 30, 0.25)';
      for (let x = 0; x <= canvas.width; x += cellSize) {
        for (let y = 0; y <= canvas.height; y += cellSize) {
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Update and draw data pulses
      for (let i = dataPulses.length - 1; i >= 0; i--) {
        const pulse = dataPulses[i];
        
        // Update progress
        pulse.progress += pulse.speed;
        
        // Remove completed pulses
        if (pulse.progress >= 1) {
          dataPulses.splice(i, 1);
          continue;
        }
        
        // Calculate current position
        const currentX = pulse.x + (pulse.targetX - pulse.x) * pulse.progress;
        const currentY = pulse.y + (pulse.targetY - pulse.y) * pulse.progress;
        
        // Draw pulse
        ctx.fillStyle = pulse.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, pulse.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Create glowing effect
        const gradient = ctx.createRadialGradient(
          currentX, currentY, 0,
          currentX, currentY, pulse.size * 3
        );
        gradient.addColorStop(0, pulse.color);
        gradient.addColorStop(1, 'rgba(0, 100, 30, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, pulse.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Add new pulses if needed
      if (dataPulses.length < 15 && Math.random() > 0.95) {
        generatePulses();
      }
      
      // Occasionally add binary/hex numbers
      if (Math.random() > 0.98) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const text = Math.random() > 0.5 
          ? Math.floor(Math.random() * 256).toString(16).toUpperCase() // Hex
          : Math.floor(Math.random() * 2).toString(); // Binary
          
        ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
        ctx.font = '20px monospace';
        ctx.fillText(text, x, y);
      }
      
      gridAnimationRef.current = requestAnimationFrame(draw);
    };
    
    // Start animation
    const gridAnimationRef = { current: requestAnimationFrame(draw) };
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (gridAnimationRef.current) {
        cancelAnimationFrame(gridAnimationRef.current);
      }
    };
  }, [terminalActive]);

  // Fade in title and subtitle after slight delays
  useEffect(() => {
    // Title appears first
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
    }, 200);
    
    // Subtitle appears slightly after
    const subtitleTimer = setTimeout(() => {
      setSubtitleVisible(true);
    }, 600);
    
    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
    };
  }, []);

  // Terminal activation with smooth transition
  const handleEnterMatrix = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Store title position to keep it stable
    const titleRect = titleRef.current?.getBoundingClientRect();
    const titleTop = titleRect?.top || 0;
    
    // Play activation sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // System power-up sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
      
      // Add digital "access granted" beep
      setTimeout(() => {
        const beep = audioContext.createOscillator();
        const beepGain = audioContext.createGain();
        
        beep.type = 'square';
        beep.frequency.value = 440;
        
        beepGain.gain.setValueAtTime(0.1, audioContext.currentTime);
        beepGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
        
        beep.connect(beepGain);
        beepGain.connect(audioContext.destination);
        
        beep.start();
        beep.stop(audioContext.currentTime + 0.2);
      }, 400);
    } catch (e) {
      // Audio context not available
    }
    
    // Activate terminal after transition
    setTimeout(() => {
      setTerminalActive(true);
      
      // Center the page to show terminal fully
      setTimeout(() => {
        if (terminalContainerRef.current) {
          terminalContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }, 600);
  };

  // Hacker-inspired button effects
  const handlePrimaryButtonMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    
    // Subtle vertical shift
    target.style.transform = "translateY(-2px)";
    
    // Reduce glow intensity
    target.style.boxShadow = "0 0 8px rgba(0, 255, 65, 0.4)";
    
    // More subtle background color
    target.style.background = "linear-gradient(to bottom, rgba(0, 180, 45, 0.7), rgba(0, 120, 20, 0.7))";
    
    // Add data interference effect
    target.classList.add('data-interference');
    
    // Get or create binary overlay
    let binaryOverlay = target.querySelector('.btn-binary-overlay') as HTMLDivElement;
    if (!binaryOverlay) {
      binaryOverlay = document.createElement('div');
      binaryOverlay.className = 'btn-binary-overlay';
      binaryOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.07;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
      `;
      target.appendChild(binaryOverlay);
      
      // Add random binary digits
      const chars = '01';
      const rows = 5;
      const cols = Math.floor(target.offsetWidth / 8);
      
      for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.style.cssText = `
          display: flex;
          font-family: monospace;
          font-size: 8px;
          line-height: 8px;
          letter-spacing: 1px;
          color: var(--m-text-bright);
        `;
        
        for (let j = 0; j < cols; j++) {
          row.innerHTML += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        binaryOverlay.appendChild(row);
      }
    }
    
    // Make binary code visible
    binaryOverlay.style.opacity = "0.07";
    
    // Add horizontal scan line
    let scanLine = target.querySelector('.btn-scan-line') as HTMLDivElement;
    if (!scanLine) {
      scanLine = document.createElement('div');
      scanLine.className = 'btn-scan-line';
      scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(0, 255, 65, 0.7);
        box-shadow: 0 0 2px rgba(0, 255, 65, 0.6);
        pointer-events: none;
        z-index: 1;
        animation: scan-line 1.5s linear infinite;
      `;
      target.appendChild(scanLine);
    }
    
    // Add subtle borders for a terminal-like effect
    let topLine = target.querySelector('.btn-top-line') as HTMLDivElement;
    if (!topLine) {
      topLine = document.createElement('div');
      topLine.className = 'btn-top-line';
      topLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(0, 255, 65, 0.3);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
        pointer-events: none;
      `;
      target.appendChild(topLine);
    }
    
    let bottomLine = target.querySelector('.btn-bottom-line') as HTMLDivElement;
    if (!bottomLine) {
      bottomLine = document.createElement('div');
      bottomLine.className = 'btn-bottom-line';
      bottomLine.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: rgba(0, 255, 65, 0.3);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
        pointer-events: none;
      `;
      target.appendChild(bottomLine);
    }
    
    // Animate lines
    requestAnimationFrame(() => {
      topLine.style.transform = "scaleX(1)";
      bottomLine.style.transform = "scaleX(1)";
    });
  };

  const handlePrimaryButtonMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    target.style.transform = "translateY(0)";
    target.style.boxShadow = "0 0 5px rgba(0, 255, 65, 0.2)";
    target.style.background = "linear-gradient(to bottom, rgba(0, 180, 45, 0.7), rgba(0, 120, 20, 0.7))";
    
    target.classList.remove('data-interference');
    
    const binaryOverlay = target.querySelector('.btn-binary-overlay') as HTMLDivElement;
    if (binaryOverlay) {
      binaryOverlay.style.opacity = "0";
    }
    
    const topLine = target.querySelector('.btn-top-line') as HTMLDivElement;
    const bottomLine = target.querySelector('.btn-bottom-line') as HTMLDivElement;
    
    if (topLine) topLine.style.transform = "scaleX(0)";
    if (bottomLine) bottomLine.style.transform = "scaleX(0)";
  };

  const handleSecondaryButtonMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    
    // Subtle vertical shift
    target.style.transform = "translateY(-2px)";
    
    // Reduce glow intensity
    target.style.boxShadow = "0 0 8px rgba(0, 255, 65, 0.2)";
    
    // More hacker-like background color
    target.style.backgroundColor = "rgba(7, 28, 7, 0.8)";
    target.style.color = "var(--m-text)";
    
    // Simulate terminal cursor blink
    let cursor = target.querySelector('.terminal-cursor') as HTMLSpanElement;
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      cursor.style.cssText = `
        display: inline-block;
        width: 4px;
        height: 16px;
        background: var(--m-text);
        vertical-align: middle;
        margin-left: 6px;
        animation: cursor-blink 1s step-end infinite;
      `;
      
      // Get the text span
      const textSpan = target.querySelector('span') as HTMLSpanElement;
      if (textSpan) {
        textSpan.appendChild(cursor);
      }
    }
    
    // Add a typing effect
    target.classList.add('terminal-effect');
    
    // Add subtle terminal-style border
    let topLine = target.querySelector('.btn-top-line') as HTMLDivElement;
    if (!topLine) {
      topLine = document.createElement('div');
      topLine.className = 'btn-top-line';
      topLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--m-text);
        opacity: 0.2;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
      `;
      target.appendChild(topLine);
    }
    
    let bottomLine = target.querySelector('.btn-bottom-line') as HTMLDivElement;
    if (!bottomLine) {
      bottomLine = document.createElement('div');
      bottomLine.className = 'btn-bottom-line';
      bottomLine.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--m-text);
        opacity: 0.2;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      `;
      target.appendChild(bottomLine);
    }
    
    // Animate lines
    requestAnimationFrame(() => {
      topLine.style.transform = "scaleX(1)";
      bottomLine.style.transform = "scaleX(1)";
    });
    
    // Add typing sound effect
    const playTypingSound = () => {
      if (Math.random() > 0.5) {
        const freq = 100 + Math.random() * 500;
        const duration = 10 + Math.random() * 20;
        const volume = 0.05;
        
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.type = 'square';
          oscillator.frequency.value = freq;
          gainNode.gain.value = volume;
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.start();
          
          setTimeout(() => {
            oscillator.stop();
            audioContext.close();
          }, duration);
        } catch (e) {
          // Audio context might not be available
          console.log('Audio context not available');
        }
      }
    };
    
    // Simulate random key presses
    target.dataset.typingInterval = setInterval(playTypingSound, 80).toString();
  };

  const handleSecondaryButtonMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    target.style.transform = "translateY(0)";
    target.style.boxShadow = "0 0 3px rgba(0, 255, 65, 0.1)";
    target.style.backgroundColor = "rgba(7, 39, 7, 0.7)";
    target.style.color = "var(--m-text)";
    
    target.classList.remove('terminal-effect');
    
    const topLine = target.querySelector('.btn-top-line') as HTMLDivElement;
    const bottomLine = target.querySelector('.btn-bottom-line') as HTMLDivElement;
    
    if (topLine) topLine.style.transform = "scaleX(0)";
    if (bottomLine) bottomLine.style.transform = "scaleX(0)";
    
    // Clear typing sound interval
    if (target.dataset.typingInterval) {
      clearInterval(parseInt(target.dataset.typingInterval));
    }
  };

  const handleButtonMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    // Added glitch effect on click
    target.classList.add('button-glitch');
    target.style.transform = "translateY(1px)";
    
    // Remove glitch class after animation
    setTimeout(() => {
      target.classList.remove('button-glitch');
    }, 300);
  };

  const handlePrimaryButtonMouseUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleSecondaryButtonMouseUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  return (
    <section className={cn('relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden', className)}>
      {/* Digital Rain Canvas */}
      {!disableRainEffect && (
        <canvas 
          ref={rainCanvasRef}
          className={cn(
            "absolute top-0 left-0 w-full h-full -z-10",
            isCanvasReady ? "opacity-100" : "opacity-0",
            "transition-opacity duration-1000"
          )}
        />
      )}
      
      {/* Terminal Overlay */}
      {terminalActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center terminal-overlay-container">
          {/* Overlay Background with Matrix Effect */}
          <div className="absolute inset-0 bg-black bg-opacity-80 terminal-overlay">
            {/* Digital code elements */}
            <div className="matrix-overlay-effect"></div>
            
            {/* Lock icon and status text */}
            <div className="absolute top-6 right-6 flex items-center">
              <div className="w-8 h-8 border-2 border-[var(--m-text)] rounded-full flex items-center justify-center mr-3 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--m-text)]">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div className="text-[var(--m-text)] font-mono text-xs uppercase tracking-wider">
                System Locked • Terminal Access Only
              </div>
            </div>
            
            {/* Binary rain columns */}
            <div className="binary-rain-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="binary-column" style={{ 
                  left: `${i * 5}%`, 
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`
                }}>
                  {Array.from({ length: 15 }).map((_, j) => (
                    <div key={j} className="binary-digit" style={{
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: Math.random() < 0.7 ? 0.4 : 0.8
                    }}>
                      {Math.random() > 0.5 ? '1' : '0'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Matrix system warnings */}
            <div className="absolute bottom-8 left-8 text-left">
              <div className="text-[var(--m-text)] font-mono text-xs mb-2 opacity-70">SYSTEM STATUS</div>
              <div className="system-warning">WARNING: Unauthorized access detected</div>
              <div className="system-warning">ALERT: Security protocol engaged</div>
              <div className="system-warning">NOTICE: Terminal mode active</div>
            </div>
            
            {/* Grid lines */}
            <div className="grid-overlay"></div>
          </div>
          
          {/* Terminal Window */}
          <div className="w-full max-w-4xl z-50 opacity-0 terminal-window-animation">
            <MatrixTerminal onClose={() => setTerminalActive(false)} />
          </div>
        </div>
      )}
      
      {/* Hero Content */}
      <div className={cn(
        "relative z-2 text-center px-5 max-w-4xl w-full",
        terminalActive ? "opacity-50 pointer-events-none" : ""
      )}>
        {/* Title - stays in fixed position */}
        <div 
          ref={titleRef}
          className={cn(
            "inline-block relative mb-8",
            "transition-all duration-800 ease-out",
            titleVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-6"
          )}
        >
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-bold tracking-[6px] mb-2 uppercase">
            {/* Enhanced glitch text without background */}
            <EnhancedGlitchText 
              text={title} 
              className="text-shadow-[0_0_20px_var(--m-glow),0_0_40px_var(--m-glow)] animate-[pulse_3s_infinite]" 
            />
          </h1>
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--m-text)] to-transparent my-5 animate-[expand_2s_ease]"></div>
        </div>
        
        {/* Subtitle area */}
        <div 
          ref={subtitleRef}
          className={cn(
            "subtitle-container relative w-full",
            "transition-all duration-500 ease-in-out",
            subtitleVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
          )}
        >
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 backdrop-blur-sm rounded bg-gradient-to-b from-[rgba(0,0,0,0.25)] to-[rgba(0,0,0,0.5)] border border-[var(--m-border)]"></div>
          
          {/* Rotating features or static subtitle */}
          {enableFeatureRotation ? (
            <div className="relative z-1 text-[clamp(1rem,2vw,1.5rem)] max-w-3xl mx-auto mb-12 leading-relaxed text-shadow-[0_0_10px_var(--m-glow)] p-5 rounded">
              <RotatingFeatures baseText={subtitle} />
            </div>
          ) : (
            <p className="relative z-1 text-[clamp(1rem,2vw,1.5rem)] max-w-3xl mx-auto mb-12 leading-relaxed text-shadow-[0_0_10px_var(--m-glow)] p-5 rounded">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Button container */}
        <div className="flex gap-6 justify-center mt-8 flex-wrap">
          <a 
            href={primaryCta.href} 
            className="m-btn-primary relative overflow-hidden inline-flex items-center justify-center px-8 py-3 min-w-[180px] text-[var(--m-black)] bg-gradient-to-b from-[rgba(0,180,45,0.7)] to-[rgba(0,120,20,0.7)] border border-[var(--m-text)] rounded-[var(--m-radius)] font-bold text-xl uppercase tracking-wider shadow-[0_0_5px_rgba(0,255,65,0.2)] transition-all duration-250"
            onMouseEnter={handlePrimaryButtonMouseEnter}
            onMouseLeave={handlePrimaryButtonMouseLeave}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handlePrimaryButtonMouseUp}
            onClick={handleEnterMatrix}
          >
            <span className="relative z-2">{primaryCta.text}</span>
          </a>
          
          <a 
            href={secondaryCta.href} 
            className="m-btn-secondary relative overflow-hidden inline-flex items-center justify-center px-8 py-3 min-w-[180px] text-[var(--m-text)] bg-[rgba(7,39,7,0.7)] border border-[var(--m-border)] rounded-[var(--m-radius)] font-bold text-xl uppercase tracking-wider shadow-[0_0_3px_rgba(0,255,65,0.1)] transition-all duration-250"
            onMouseEnter={handleSecondaryButtonMouseEnter}
            onMouseLeave={handleSecondaryButtonMouseLeave}
            onMouseDown={handleButtonMouseDown}
            onMouseUp={handleSecondaryButtonMouseUp}
          >
            <span className="relative z-2">{secondaryCta.text}</span>
          </a>
        </div>
        
        {/* Version badge */}
        {showVersion && (
          <div className="mt-12 opacity-80 text-[0.9rem]">
            <span className="py-[0.3rem] px-[0.8rem] text-[0.9rem] tracking-[1px] border border-[var(--m-border)] rounded bg-[rgba(0,0,0,0.3)]">
              {version}
            </span>
          </div>
        )}
      </div>
      
      {/* Scroll indicator - only show if terminal is not active */}
      {showScrollIndicator && !terminalActive && (
        <div className="absolute bottom-[2rem] left-1/2 transform -translate-x-1/2 animate-[bounce_2s_infinite] cursor-pointer">
          <a href="#features" className="text-[var(--m-text)] flex flex-col items-center no-underline">
            <span className="text-[0.8rem] block mb-2 uppercase tracking-[2px]">
              Scroll Down
            </span>
            <span className="block transform rotate-45 w-[15px] h-[15px] border-r-2 border-b-2 border-[var(--m-text)]"></span>
          </a>
        </div>
      )}
      
      {/* Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.9; text-shadow: 0 0 20px var(--m-glow); }
          50% { opacity: 1; text-shadow: 0 0 30px var(--m-glow), 0 0 40px var(--m-glow); }
        }
        
        @keyframes expand {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-15px) translateX(-50%); }
          60% { transform: translateY(-10px) translateX(-50%); }
        }
        
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        
        @keyframes scan-line {
          0%   { top: 0; }
          100% { top: 100%; }
        }
        
        @keyframes glitch-offset {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(0); }
          75% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Terminal overlay animations */
        .terminal-overlay-container {
          animation: overlay-appear 0.5s forwards;
        }
        
        @keyframes overlay-appear {
          from { background-color: rgba(0, 0, 0, 0); }
          to { background-color: rgba(0, 0, 0, 0.8); }
        }
        
        .terminal-window-animation {
          animation: terminal-popup 0.8s forwards 0.3s;
        }
        
        @keyframes terminal-popup {
          0% { 
            opacity: 0;
            transform: scale(0.8);
          }
          70% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .binary-column {
          position: absolute;
          top: -20%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          animation: binary-fall linear infinite;
        }
        
        @keyframes binary-fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(120vh); }
        }
        
        .binary-digit {
          color: var(--m-text);
          font-family: monospace;
          font-size: 14px;
          margin: 4px 0;
          animation: digit-flicker 3s infinite alternate;
        }
        
        @keyframes digit-flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .system-warning {
          font-family: monospace;
          color: var(--m-text);
          font-size: 12px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: warning-blink 4s infinite;
          opacity: 0.8;
        }
        
        @keyframes warning-blink {
          0%, 92%, 96%, 100% { opacity: 0.8; }
          94%, 98% { opacity: 1; }
        }
        
        .matrix-overlay-effect {
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, rgba(0, 255, 65, 0.1) 0px, transparent 1px, transparent 2px),
            repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.1) 0px, transparent 1px, transparent 2px);
          background-size: 30px 30px;
          animation: grid-movement 30s linear infinite;
        }
        
        @keyframes grid-movement {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(rgba(0, 255, 65, 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          opacity: 0.2;
        }
        
        .subtitle-container.terminal-transition {
          animation: matrix-transition 0.6s forwards;
        }
        
        @keyframes matrix-transition {
          0% { 
            transform: scale(1);
            filter: brightness(1);
          }
          20% { 
            transform: scale(1.02);
            filter: brightness(1.5);
          }
          30% { 
            transform: scale(0.98) skewX(2deg);
            filter: brightness(0.8);
          }
          50% { 
            transform: scale(1.05) skewX(-2deg);
            filter: brightness(1.2);
          }
          100% { 
            transform: scale(0.9);
            opacity: 0; 
            filter: brightness(0);
          }
        }
        
        .terminal-container {
          animation: terminal-appear 0.5s ease-out forwards;
        }
        
        @keyframes terminal-appear {
          from { 
            transform: scale(0.9);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .data-interference {
          position: relative;
        }
        
        .data-interference::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(transparent 0%, rgba(0, 255, 65, 0.03) 50%, transparent 100%);
          opacity: 0;
          animation: data-interference 2s linear infinite;
        }
        
        @keyframes data-interference {
          0% { opacity: 0; transform: translateY(-100%); }
          50% { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(100%); }
        }
        
        .terminal-effect {
          position: relative;
        }
        
        .button-glitch {
          animation: button-glitch 0.3s linear;
        }
        
        @keyframes button-glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .scanlines {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 255, 65, 0.02) 50%,
            rgba(0, 0, 0, 0) 100%
          );
          background-size: 100% 2px;
          animation: scanline 0.5s linear infinite;
        }
        
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(2px); }
        }
        
        .cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: var(--m-text);
          animation: cursor-blink 1s step-end infinite;
          vertical-align: text-bottom;
          margin-left: 2px;
        }
        
        .terminal-code {
          line-height: 1.6;
          color: var(--m-text);
        }
        
        .terminal-code .comment {
          color: #7d7d7d;
        }
        
        .terminal-code .keyword {
          color: #c586c0;
        }
        
        .terminal-code .tag {
          color: #569cd6;
        }
        
        .terminal-code .string {
          color: #ce9178;
        }
        
        .terminal-code .boolean {
          color: #569cd6;
        }
        
        /* Digital background animation */
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out forwards;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .terminal-container {
            margin-top: 0;
          }
        }
        
        @media (max-width: 640px) {
          .m-btn-primary, .m-btn-secondary {
            min-width: 160px;
            font-size: 1rem;
          }
        }
        
        a.m-btn-primary::after, a.m-btn-secondary::after {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default MatrixHero;