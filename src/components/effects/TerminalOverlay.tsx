import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import Terminal, { TerminalProps } from '@/components/effects/Terminal';

export interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  commands?: Record<string, (args: string[]) => string>;
  initialCommands?: string[];
  sourceElementId?: string; // ID of the element to animate from
  className?: string;
  overlayClassName?: string;
  terminalClassName?: string;
  showLoadingProgress?: boolean;
  loadingDuration?: number;
  maxWidth?: string;
  matrixEffects?: boolean;
  onComplete?: () => void;
  terminalProps?: Partial<TerminalProps>;
}

export const TerminalOverlay: React.FC<TerminalOverlayProps> = ({
  isOpen,
  onClose,
  title = 'MATRIX SYSTEM INITIALIZATION',
  commands = {},
  initialCommands = ['help'],
  sourceElementId,
  className,
  overlayClassName,
  terminalClassName,
  showLoadingProgress = true,
  loadingDuration = 3000, // 3 seconds loading by default
  maxWidth = '2xl',
  matrixEffects = true,
  onComplete,
  terminalProps = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [sourcePosition, setSourcePosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Default terminal commands
  const defaultCommands = {
    help: () => 'Available commands: help, system, status, exit',
    system: () => 'Matrix System Online. Version 2.0.0',
    status: () => 'All systems operational. Connection secure.',
    exit: () => {
      handleClose();
      return 'Exiting system...';
    },
  };
  
  const allCommands = {
    ...defaultCommands,
    ...commands,
  };

  // Get position of source element for animation
  useEffect(() => {
    if (isOpen && sourceElementId) {
      const sourceElement = document.getElementById(sourceElementId);
      if (sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        setSourcePosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    }
  }, [isOpen, sourceElementId]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus trap to be implemented here
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Animation timing
  useEffect(() => {
    if (isOpen) {
      // Start animation sequence
      setIsVisible(true);
      setIsLoading(true);
      setLoadingProgress(0);
      
      // Simulate loading progress
      let startTime = Date.now();
      const loadingInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.round((elapsed / loadingDuration) * 100), 100);
        
        setLoadingProgress(progress);
        
        if (progress >= 100) {
          clearInterval(loadingInterval);
          setIsLoading(false);
          
          if (onComplete) {
            onComplete();
          }
        }
      }, 50);
      
      return () => {
        clearInterval(loadingInterval);
      };
    }
  }, [isOpen, loadingDuration, onComplete]);
  
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);
  
  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    
    // Animation timing
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, 500);
  };
  
  // Classes based on maxWidth parameter
  const getMaxWidthClass = () => {
    const widthClasses: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      full: 'max-w-full',
    };
    
    return widthClasses[maxWidth] || 'max-w-2xl';
  };
  
  if (!isOpen && !isVisible) {
    return null;
  }
  
  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-all duration-500',
        isVisible ? 'opacity-100' : 'opacity-0',
        isClosing && 'animate-[fadeOut_0.5s_ease-in-out]',
        overlayClassName
      )}
      onClick={(e) => {
        // Close when clicking outside the terminal
        if (terminalRef.current && !terminalRef.current.contains(e.target as Node)) {
          handleClose();
        }
      }}
    >
      {/* Matrix effects overlay */}
      {matrixEffects && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      )}
      
      {/* Terminal container - animated from source if specified */}
      <div
        ref={terminalRef}
        style={sourcePosition ? {
          // Start animation from source element position
          transform: isVisible ? 'scale(1)' : `scale(0.5) translate(
            ${sourcePosition.left - window.innerWidth/2 + sourcePosition.width/2}px, 
            ${sourcePosition.top - window.innerHeight/2 + sourcePosition.height/2}px
          )`,
        } : {}}
        className={cn(
          'w-full p-4 transition-all duration-500',
          getMaxWidthClass(),
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
          className
        )}
      >
        <Terminal
          title={title}
          commands={allCommands}
          initialCommands={initialCommands}
          className={cn(terminalClassName)}
          height={showLoadingProgress ? "300px" : "400px"}
          allowUserInput={!isLoading}
          readOnly={isLoading}
          syntaxHighlighting={true}
          typingEffect={true}
          theme="matrix"
          {...terminalProps}
        />
        
        {/* Loading progress bar */}
        {showLoadingProgress && (
          <div className="mt-4">
            <div className="h-2 bg-black border border-matrix-border overflow-hidden">
              <div 
                className="h-full bg-matrix-text transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-right text-xs mt-1 text-matrix-text">
              {loadingProgress}% COMPLETE
            </div>
            
            {loadingProgress >= 100 && (
              <div className="text-center mt-4 animate-pulse">
                <span className="text-matrix-text-bright">INITIALIZATION COMPLETE - ENTERING THE MATRIX</span>
              </div>
            )}
          </div>
        )}

        {/* Cancel button */}
        <div className="text-center mt-6">
          <button 
            className="px-4 py-2 bg-black border border-matrix-border rounded text-matrix-text hover:text-matrix-text-bright hover:border-matrix-text transition-colors"
            onClick={handleClose}
          >
            CANCEL
          </button>
        </div>
      </div>
      
      {/* CSS for Matrix effects */}
      <style jsx global>{`
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
        
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(rgba(0, 255, 65, 0.3) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          opacity: 0.2;
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TerminalOverlay;