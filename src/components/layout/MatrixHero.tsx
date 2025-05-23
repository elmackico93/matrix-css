import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import TerminalOverlay from '@/components/effects/TerminalOverlay';
import { RotatingFeatures } from './RotatingFeatures';

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
  enableFeatureRotation?: boolean;
  featureRotationInterval?: number;
  featureGlitchIntensity?: 'light' | 'medium' | 'heavy';
  showFeatureNavigation?: boolean;
  terminalLoadingDuration?: number;
  onEnterMatrix?: () => void;
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
  enableFeatureRotation = true,
  featureRotationInterval = 7000,
  featureGlitchIntensity = 'medium',
  showFeatureNavigation = false,
  terminalLoadingDuration = 3000,
  onEnterMatrix,
}) => {
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [matrixEntered, setMatrixEntered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<number>(-1);
  
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLAnchorElement>(null);
  
  // Define terminal commands
  const terminalCommands = {
    help: () => 'Available commands: help, install, version, features, components',
    install: () => 'Installing Matrix.css...\nDone! Ready to immerse in the digital realm.',
    version: () => 'Matrix.css v2.0.0',
    features: () => 'Core features: Visual Effects, React Components, Dark/Light Themes, Grid System',
    components: () => 'UI components: Button, Card, Alert, Modal, Progress, Switch, etc.',
  };

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
    
    // Trigger glitch effect
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 300);
    
    // Open terminal overlay
    setTerminalActive(true);
  };
  
  // Handle terminal completion
  const handleTerminalComplete = () => {
    setMatrixEntered(true);
    
    // Call external callback if provided
    if (onEnterMatrix) {
      onEnterMatrix();
    }
  };
  
  // Handle terminal close
  const handleCloseTerminal = () => {
    setTerminalActive(false);
    setMatrixEntered(false);
  };
  
  // Track feature changes
  const handleFeatureChange = (feature: any, index: number) => {
    setCurrentFeature(index);
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
      
      {/* Terminal Overlay Component */}
      <TerminalOverlay
        isOpen={terminalActive}
        onClose={handleCloseTerminal}
        title="MATRIX SYSTEM INITIALIZATION"
        commands={terminalCommands}
        initialCommands={["help", "install"]}
        sourceElementId={primaryButtonRef.current?.id || undefined}
        showLoadingProgress={true}
        loadingDuration={terminalLoadingDuration}
        maxWidth="2xl"
        matrixEffects={true}
        onComplete={handleTerminalComplete}
        terminalProps={{
          typingEffect: true,
          syntaxHighlighting: true,
          height: "300px",
        }}
      />
      
      {/* Glitch overlay effect that activates during transitions */}
      <div 
        className={cn(
          "fixed inset-0 pointer-events-none z-50 opacity-0 transition-opacity",
          glitchActive && "opacity-70 transition-none"
        )}
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wMQFgQZFcuKGAAAAARnQU1BAACxjwv8YQUAAAOVSURBVGjezZpLaBNRFIZPYt/gIzZqmmTikpBM0kVFKFJBBUVw4UJciCKCGxFcuHEjgmtdiAvBhQtxIaI7FbuQqoigpSmxpnk0M80jkzTNq4nJOPdMJpNMJ51H0/zgMNyZuff8c+45c+6ZMdlsNhPDMMrYAQygvJA6k+2vGCmKoowZjUYT0WgUdnZ2IBKJgM1mE76Hggyfzwe6urqgt7dXeM9qteIB0pxROp0GsqPXsrKyQHJ2DlIxlwhxhUg5Jx5zRYn39Pf36/fWCDGzw0bvxQmMQnxeF0ql0vQYCUkB8XhcsLfZbJDP58UJGysrK2A2m6G5uRk8Hg+YTCYoFovgdDoF4XA4IPVhsVggFAqB2+2G1dVVcDgcsLi4CL29vZDL5aCrqwva29uF526PR7PbGBSoLJfLX8jmfS2q3SLPfReLxZ/Y7mI+n/+JG/6I7z6Kx+NfS6XSt1QqRe6dQnPFvIeZ6bsRnPN9Ugy9h61AW6xhbKo5NC/IGUEjERAkAALB5XI/eDzeN6iVl9vb23+XU6/q6hq9vb0PpFJpo1QqfQYgbxOJxNdIJPKHZLkqlZpqbGw8gbofw4FvwEXfICh/0+n0ByIxGovFaYZl4VT4XVFReSIQCL7kOO7LEZpHiESiC7W1tf0Gg6EPRT4gGPMoEAiE8/PzP3EhM7u7u9+I3GAwOI2i3wGkH2q1+lJLS8sNvV7f0dDQoPX7/S82NjbGsKMvMfdHVN1sNtsyOzs7gX1+NJvNj1Qq1WVMTL2rq6vf8Zvx+fl52Nvbm0qlUm8RgLGxsfuYIAbQR2/juG2oM4JVwQjqvb6+/jSVSpVYWVlZGhoaAhSlUSgUA7hAL+mdLnEOh2OstbV1FM8F4+Pjt9fW1p48Hb6LLnV0mM3mMezwcHd398Py8vLH7u7uRwL7KBnRQiQSSb1Wq72H95fReygIcnxudrsdA0QFLS0tN7FTbXd3943QiQnjMrfNxHYcPFaXP4X5GVtTDsvdvY4n5V7D9HGQJFfsFtZPHyWFPpK0Z5KyXrM/l0vvbSV6c9kzdv6iOUlZ8yz9/vfS9bJZkgCSSUqr25KUt9fnZG0k0UZDg6QsOF6QJeXP8kVTkpBX1fJlHnhO1kBJ/v0Xeek6tgRxgCQjSU0kCe8hCQa27JUlvZYk5deynJpIsnAcIG9I7uQ/SBrYf5A0sN9I/gX6kZhIpc+0jAAAAABJRU5ErkJggg==")',
          backgroundBlendMode: 'overlay',
        }}
      ></div>
      
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
              <RotatingFeatures 
                baseText={subtitle}
                transitionInterval={featureRotationInterval}
                glitchIntensity={featureGlitchIntensity}
                showNavigation={showFeatureNavigation}
                fixedHeight={true}
                onFeatureChange={handleFeatureChange}
              />
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
            id="matrix-cta-primary"
            ref={primaryButtonRef}
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
      `}</style>
    </section>
  );
};

export default MatrixHero;