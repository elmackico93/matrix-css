import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/utils/cn';

export interface FeatureItem {
  title: string;
  description: string;
  icon: string; // Using ASCII/Unicode art for icons
}

export interface RotatingFeaturesProps {
  className?: string;
  baseText?: string;
  features?: FeatureItem[];
  transitionInterval?: number;
  autoRotate?: boolean;
  glitchIntensity?: 'light' | 'medium' | 'heavy';
  showNavigation?: boolean;
  minHeight?: string;
  fixedHeight?: boolean;
  onFeatureChange?: (feature: FeatureItem, index: number) => void;
}

// Default features data array - each will be shown in sequence
const DEFAULT_MATRIX_FEATURES: FeatureItem[] = [
  {
    title: "UI COMPONENTS",
    description: "Complete set of Matrix-styled UI elements with cyberpunk aesthetics and digital glitch effects",
    icon: "◉ □ ▣",
  },
  {
    title: "CODE RAIN",
    description: "Authentic digital rain animations with customizable density, speed and character sets",
    icon: "⋮⋮⋮⋮⋮",
  },
  {
    title: "DARK MODE",
    description: "Toggle between dark terminal and light interfaces with full theming support",
    icon: "◐ ◑",
  },
  {
    title: "RESPONSIVE",
    description: "Fully adaptive layouts for all devices with Matrix-inspired grid system",
    icon: "◧ ◨ ◩",
  },
  {
    title: "HACKER EFFECTS",
    description: "Text glitches, scan lines, and terminal animations for immersive digital experiences",
    icon: "▓▒░",
  },
  {
    title: "TYPESCRIPT",
    description: "Fully typed components with strong type safety and code intelligence",
    icon: "{ }",
  }
];

export const RotatingFeatures: React.FC<RotatingFeaturesProps> = ({
  className,
  baseText = "Immerse your users in the digital realm with the complete Matrix-inspired design framework.",
  features = DEFAULT_MATRIX_FEATURES,
  transitionInterval = 10000,
  autoRotate = true,
  glitchIntensity = 'medium',
  showNavigation = false,
  minHeight = '160px',
  fixedHeight = true,
  onFeatureChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [visibleText, setVisibleText] = useState<string>(baseText);
  const [glitchEffect, setGlitchEffect] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  
  // Character set for the matrix effect
  const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";

  // Calculate optimal container height based on content
  useEffect(() => {
    if (!containerRef.current || !fixedHeight) return;
    
    // Create a hidden measure div to accurately determine needed height
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.width = `${containerRef.current.offsetWidth}px`;
    measureDiv.style.fontSize = 'inherit';
    document.body.appendChild(measureDiv);
    
    // Find max height between features and base text
    let maxHeight = 0;
    
    // Check base text height
    measureDiv.textContent = baseText;
    maxHeight = Math.max(maxHeight, measureDiv.offsetHeight);
    
    // Check feature text heights
    features.forEach(feature => {
      const featureText = `${feature.icon} ${feature.title}: ${feature.description}`;
      measureDiv.textContent = featureText;
      maxHeight = Math.max(maxHeight, measureDiv.offsetHeight);
    });
    
    // Add padding and set min height
    const minHeightValue = parseInt(minHeight) || 160;
    const calculatedHeight = Math.max(maxHeight + 40, minHeightValue);
    
    // Set container height and cleanup
    setContainerHeight(calculatedHeight);
    document.body.removeChild(measureDiv);
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        // For smaller screens, allow more space for wrapped text
        if (window.innerWidth < 640) { // Mobile breakpoint
          setContainerHeight(calculatedHeight + 60);
        } else if (window.innerWidth < 768) { // Small tablet
          setContainerHeight(calculatedHeight + 20);
        } else {
          setContainerHeight(calculatedHeight);
        }
      }
    };
    
    // Initial check
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [baseText, features, fixedHeight, minHeight]);
  
  // Handle auto-rotation with ability to pause on user interaction
  useEffect(() => {
    if (!autoRotate || userInteracted || features.length <= 1 || isTransitioning) return;
    
    // Initialize with base text first, then start rotation
    if (initialLoad) {
      setInitialLoad(false);
      setVisibleText(baseText);
      
      // Start rotating after initial display period
      autoRotateTimerRef.current = setTimeout(() => {
        rotateFeature(0);
      }, transitionInterval);
      
      return () => {
        if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
      };
    }
    
    // Set up regular rotation
    autoRotateTimerRef.current = setTimeout(() => {
      rotateFeature((currentIndex + 1) % features.length);
    }, transitionInterval);
    
    return () => {
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    };
  }, [autoRotate, userInteracted, currentIndex, features.length, isTransitioning, initialLoad, baseText, transitionInterval]);
  
  // Get glitch animation intensity parameters
  const getGlitchIntensityStyles = () => {
    switch (glitchIntensity) {
      case 'light':
        return {
          transitionSteps: 4,
          stepDelay: 120,
          glitchDuration: 800,
          transitionDuration: 1200
        };
      case 'heavy':
        return {
          transitionSteps: 8,
          stepDelay: 80,
          glitchDuration: 1200,
          transitionDuration: 1800
        };
      default: // medium
        return {
          transitionSteps: 6,
          stepDelay: 100,
          glitchDuration: 1000,
          transitionDuration: 1500
        };
    }
  };
  
  // Function to handle feature rotation with transitions
  const rotateFeature = useCallback((index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    // Reset auto-rotation if active
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
    }
    
    const intensityStyles = getGlitchIntensityStyles();
    
    // Start transition animation
    setIsTransitioning(true);
    setGlitchEffect(true);
    
    // Schedule text update after transition starts
    setTimeout(() => {
      setCurrentIndex(index);
      
      // Notify if callback provided
      if (onFeatureChange) {
        onFeatureChange(features[index], index);
      }
    }, 300);
    
    // End glitch effect
    setTimeout(() => {
      setGlitchEffect(false);
    }, intensityStyles.glitchDuration);
    
    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
      
      // Restart auto-rotation if enabled
      if (autoRotate && !userInteracted) {
        autoRotateTimerRef.current = setTimeout(() => {
          rotateFeature((index + 1) % features.length);
        }, transitionInterval);
      }
    }, intensityStyles.transitionDuration);
  }, [autoRotate, currentIndex, features, isTransitioning, onFeatureChange, transitionInterval, userInteracted]);
  
  // Handle text updates during transition
  useEffect(() => {
    if (initialLoad) return;
    
    const currentFeature = features[currentIndex];
    const targetText = `${currentFeature.icon} ${currentFeature.title}: ${currentFeature.description}`;
    
    if (isTransitioning) {
      // During transition, create a "digital decoding" effect
      const intensityStyles = getGlitchIntensityStyles();
      let transitionSteps = intensityStyles.transitionSteps;
      let stepCount = 0;
      
      const textDecoder = setInterval(() => {
        stepCount++;
        
        if (stepCount >= transitionSteps) {
          // Final state - show the clean text
          setVisibleText(targetText);
          clearInterval(textDecoder);
        } else {
          // Transitional states - gradually "decode" the text
          let decodingText = "";
          
          for (let i = 0; i < targetText.length; i++) {
            // Probability of showing the correct character increases with each step
            if (Math.random() < (stepCount / transitionSteps) * 0.9) {
              decodingText += targetText[i];
            } else {
              // Random character from matrix character set
              decodingText += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            }
          }
          
          setVisibleText(decodingText);
        }
      }, intensityStyles.stepDelay);
      
      return () => clearInterval(textDecoder);
    } else {
      // Not transitioning - show the clean text
      setVisibleText(targetText);
    }
  }, [currentIndex, isTransitioning, features, matrixChars, initialLoad]);
  
  // Handler for navigation dots
  const handleDotClick = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setUserInteracted(true);
    rotateFeature(index);
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "matrix-rotating-features relative overflow-hidden",
        isTransitioning && "is-transitioning",
        glitchEffect && "text-glitch",
        className
      )}
      style={{ 
        height: containerHeight ? `${containerHeight}px` : minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'height 0.3s ease'
      }}
      aria-live="polite"
    >
      {/* Data stream overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 data-stream-overlay pointer-events-none" aria-hidden="true" />
      )}
      
      {/* Text container */}
      <div 
        className={cn(
          "text-content relative z-1 w-full max-w-full flex items-center justify-center",
          isTransitioning && "opacity-90"
        )}
      >
        <div className="text-container">
          {visibleText}
        </div>
      </div>
      
      {/* Navigation dots */}
      {showNavigation && features.length > 1 && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 z-20">
          {features.map((_, index) => (
            <button
              key={`dot-${index}`}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentIndex === index 
                  ? "bg-matrix-text opacity-90" 
                  : "bg-matrix-text opacity-30"
              )}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to feature ${index + 1}`}
              aria-current={currentIndex === index ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
      
      {/* Digital scanner line effect */}
      {isTransitioning && (
        <div className="scan-line absolute left-0 right-0 h-[2px] bg-[var(--m-text-bright)] opacity-50 z-10 pointer-events-none" />
      )}
      
      <style jsx>{`
        .matrix-rotating-features {
          transition: opacity 300ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .is-transitioning {
          position: relative;
        }
        
        .data-stream-overlay {
          background-image: linear-gradient(0deg, 
            rgba(0, 255, 65, 0.1) 25%, 
            rgba(0, 0, 0, 0) 25%, 
            rgba(0, 0, 0, 0) 50%, 
            rgba(0, 255, 65, 0.1) 50%, 
            rgba(0, 255, 65, 0.1) 75%, 
            rgba(0, 0, 0, 0) 75%, 
            rgba(0, 0, 0, 0) 100%
          );
          background-size: 4px 4px;
          opacity: 0.2;
          animation: data-stream 1s linear infinite;
        }
        
        .scan-line {
          top: 0;
          animation: scan-effect 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }
        
        .text-glitch {
          animation: text-glitch-effect 1s ease;
        }
        
        .text-content {
          width: 100%;
          max-height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .text-container {
          max-width: 100%;
          text-align: center;
          line-height: 1.5;
        }
        
        @keyframes data-stream {
          0% { background-position: 0 0; }
          100% { background-position: 0 -8px; }
        }
        
        @keyframes scan-effect {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        
        @keyframes text-glitch-effect {
          0%, 100% { transform: translateX(0); filter: brightness(1); }
          10% { transform: translateX(-2px); filter: brightness(1.2); }
          20% { transform: translateX(2px); filter: brightness(0.9); }
          30% { transform: translateX(0); filter: brightness(1.1); }
          40% { transform: translateX(1px); filter: brightness(0.85); }
          50% { transform: translateX(-1px); filter: brightness(1.2); }
          60% { transform: translateX(0); filter: brightness(1); }
          70% { transform: translateX(2px); filter: brightness(0.9); }
          80% { transform: translateY(1px); filter: brightness(1.2); }
          90% { transform: translateY(-1px); filter: brightness(1); }
        }
      `}</style>
    </div>
  );
};

export default RotatingFeatures;