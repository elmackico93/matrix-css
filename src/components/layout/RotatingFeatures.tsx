import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';

interface RotatingFeaturesProps {
  className?: string;
  baseText?: string;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: string; // Using ASCII/Unicode art for icons
}

// Features data array - each will be shown in sequence
const MATRIX_FEATURES: FeatureItem[] = [
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
  baseText = "Immerse your users in the digital realm with the complete Matrix-inspired design framework."
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleText, setVisibleText] = useState(baseText);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [allFeaturesTexts, setAllFeaturesTexts] = useState<string[]>([]);
  
  // Character set for the matrix effect
  const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";

  // Precompute all feature texts on mount to measure max height
  useEffect(() => {
    const texts = MATRIX_FEATURES.map(feature => 
      `${feature.icon} ${feature.title}: ${feature.description}`
    );
    // Add base text to the mix
    texts.push(baseText);
    setAllFeaturesTexts(texts);
  }, [baseText]);

  // Pre-set a fixed height value to prevent any measurement issues
  useEffect(() => {
    // Fixed height value that's large enough for all possible content
    // This is a more reliable approach than measuring in the browser
    setContainerHeight(160);
    
    // Add resize listener to adjust height if window size changes dramatically
    const handleResize = () => {
      // For smaller screens, increase height to accommodate more lines
      if (window.innerWidth < 640) { // Mobile breakpoint
        setContainerHeight(220);
      } else if (window.innerWidth < 768) { // Small tablet
        setContainerHeight(180);
      } else {
        setContainerHeight(160);
      }
    };
    
    // Initial check
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Effect for handling the feature rotation
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      // Start transition animation
      setIsTransitioning(true);
      setGlitchEffect(true);
      
      // Schedule text update after transition starts
      setTimeout(() => {
        // Update to next feature
        setCurrentIndex((prevIndex) => (prevIndex + 1) % MATRIX_FEATURES.length);
      }, 500);
      
      // End glitch effect
      setTimeout(() => {
        setGlitchEffect(false);
      }, 1000);
      
      // End transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1500);
      
    }, 10000); // Change every 10 seconds
    
    return () => clearInterval(rotationInterval);
  }, []);
  
  // Effect to update the visible text based on current feature
  useEffect(() => {
    // If we're at base state (index 0 and not transitioning), show the base text
    if (currentIndex === -1) {
      setVisibleText(baseText);
      return;
    }
    
    const currentFeature = MATRIX_FEATURES[currentIndex];
    
    if (isTransitioning) {
      // During transition, create a "digital decoding" effect
      let transitionSteps = 6;
      let stepCount = 0;
      
      const textDecoder = setInterval(() => {
        stepCount++;
        
        if (stepCount >= transitionSteps) {
          // Final state - show the clean text
          setVisibleText(`${currentFeature.icon} ${currentFeature.title}: ${currentFeature.description}`);
          clearInterval(textDecoder);
        } else {
          // Transitional states - gradually "decode" the text
          const targetText = `${currentFeature.icon} ${currentFeature.title}: ${currentFeature.description}`;
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
      }, 100);
      
      return () => clearInterval(textDecoder);
    } else {
      // Not transitioning - show the clean text
      setVisibleText(`${currentFeature.icon} ${currentFeature.title}: ${currentFeature.description}`);
    }
  }, [currentIndex, isTransitioning, baseText]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "matrix-rotating-features relative overflow-hidden",
        isTransitioning && "is-transitioning",
        glitchEffect && "text-glitch",
        className
      )}
      style={containerHeight ? { 
        height: `${containerHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      } : {}}
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
        <div className="text-container">{visibleText}</div>
      </div>
      
      {/* Digital scanner line effect */}
      {isTransitioning && (
        <div className="scan-line absolute left-0 right-0 h-[2px] bg-[var(--m-text-bright)] opacity-50 z-10 pointer-events-none" />
      )}
      
      <style jsx>{`
        .matrix-rotating-features {
          transition: opacity 300ms ease;
          /* Fixed height container to prevent layout shifts */
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
          /* Center content vertically and horizontally */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .text-container {
          /* Limit width to prevent overflow */
          max-width: 100%;
          /* Center text */
          text-align: center;
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