import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { GlitchText } from '@/components/effects/GlitchText';
import { Terminal } from '@/components/effects/Terminal';
import { Scanline } from '@/components/effects/Scanline';
import { Card, CardContent } from '@/components/ui/Card';

interface MatrixCarouselProps {
  className?: string;
  onEnterMatrix?: () => void;
  onExploreComponents?: () => void;
  initialSlide?: number;
}

export const MatrixCarousel: React.FC<MatrixCarouselProps> = ({ 
  className, 
  onEnterMatrix,
  onExploreComponents,
  initialSlide = 0
}) => {
  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [matrixEntered, setMatrixEntered] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const totalSlides = 5;

  // Set initial slide if provided
  useEffect(() => {
    setActiveSlide(initialSlide);
  }, [initialSlide]);

  // Terminal commands for installation section
  const terminalCommands = {
    help: () => 'Available commands: help, install, version, features, components',
    install: () => 'Installing Matrix.css...\nDone! Ready to immerse in the digital realm.',
    version: () => 'Matrix.css v2.0.0',
    features: () => 'Core features: Visual Effects, React Components, Dark/Light Themes, Grid System',
    components: () => 'UI components: Button, Card, Alert, Modal, Progress, Switch, etc.',
  };

  // Trigger glitch effect during slide change
  const triggerGlitchEffect = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 500);
  };

  // Handle "Enter the Matrix" action
  const handleEnterMatrix = () => {
    if (isTransitioning) return;
    
    triggerGlitchEffect();
    setIsTransitioning(true);
    setShowTerminal(true);
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += 5;
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(loadingInterval);
        
        // Complete transition after loading
        setTimeout(() => {
          setMatrixEntered(true);
          setIsTransitioning(false);
          setActiveSlide(0); // Reset to first slide
          
          // Call the external callback if provided
          if (onEnterMatrix) onEnterMatrix();
        }, 500);
      }
    }, 100);
  };

  // Handle "Explore Components" action
  const handleExploreComponents = () => {
    if (isTransitioning) return;
    
    triggerGlitchEffect();
    setIsTransitioning(true);
    
    setTimeout(() => {
      // Navigate directly to Components slide (slide index 2)
      setActiveSlide(2);
      setIsTransitioning(false);
      
      // Call the external callback if provided
      if (onExploreComponents) onExploreComponents();
      
      // Scroll to "getting-started" section if it exists
      const gettingStartedSection = document.getElementById('getting-started');
      if (gettingStartedSection) {
        gettingStartedSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  // Handle next slide with glitch transition
  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    triggerGlitchEffect();
    
    setTimeout(() => {
      setActiveSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  // Handle previous slide with glitch transition
  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    triggerGlitchEffect();
    
    setTimeout(() => {
      setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  // Navigate to a specific slide
  const goToSlide = (index: number) => {
    if (isTransitioning || index === activeSlide) return;
    
    setIsTransitioning(true);
    triggerGlitchEffect();
    
    setTimeout(() => {
      setActiveSlide(index);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape' && showTerminal) {
        setShowTerminal(false);
        setLoadingProgress(0);
        setIsTransitioning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlide, isTransitioning, showTerminal]);

  // Automatic data corruption lines
  useEffect(() => {
    const generateCorruptionLines = () => {
      if (!carouselRef.current) return;
      
      // Create a data corruption line
      const corruptionLine = document.createElement('div');
      corruptionLine.classList.add('data-corruption-line');
      
      // Randomize position and opacity
      const top = Math.random() * 100;
      const opacity = 0.1 + Math.random() * 0.4;
      
      corruptionLine.style.cssText = `
        position: absolute;
        top: ${top}%;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: var(--m-text-bright);
        opacity: ${opacity};
        box-shadow: 0 0 8px var(--m-glow);
        z-index: 10;
        transform: translateY(-50%);
        pointer-events: none;
      `;
      
      carouselRef.current.appendChild(corruptionLine);
      
      // Remove after animation
      setTimeout(() => {
        if (corruptionLine && corruptionLine.parentNode) {
          corruptionLine.parentNode.removeChild(corruptionLine);
        }
      }, 800);
    };
    
    // Generate occasional data corruption lines
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        generateCorruptionLines();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className={cn(
        'relative pt-16 pb-24 overflow-hidden bg-matrix-bg border-t border-matrix-border',
        className
      )}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.05)_0,transparent_70%)]"></div>
      
      {/* Glitch overlay effect that activates during transitions */}
      <div 
        className={cn(
          "fixed inset-0 pointer-events-none z-50 opacity-0 transition-opacity",
          glitchActive && "opacity-70 transition-none"
        )}
        style={{
          backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4wMQFgQZFcuKGAAAAARnQU1BAACxjwv8YQUAAAOVSURBVGjezZpLaBNRFIZPYt/gIzZqmmTikpBM0kVFKFJBBUVw4UJciCKCGxFcuHEjgmtdiAvBhQtxIaI7FbuQqoigpSmxpnk0M80jkzTNq4nJOPdMJpNMJ51H0/zgMNyZuff8c+45c+6ZMdlsNhPDMMrYAQygvJA6k+2vGCmKoowZjUYT0WgUdnZ2IBKJgM1mE76Hggyfzwe6urqgt7dXeM9qteIB0pxROp0GsqPXsrKyQHJ2DlIxlwhxhUg5Jx5zRYn39Pf36/fWCDGzw0bvxQmMQnxeF0ql0vQYCUkB8XhcsLfZbJDP58UJGysrK2A2m6G5uRk8Hg+YTCYoFovgdDoF4XA4IPVhsVggFAqB2+2G1dVVcDgcsLi4CL29vZDL5aCrqwva29uF526PR7PbGBSoLJfLX8jmfS2q3SLPfReLxZ/Y7mI+n/+JG/6I7z6Kx+NfS6XSt1QqRe6dQnPFvIeZ6bsRnPN9Ugy9h61AW6xhbKo5NC/IGUEjERAkAALB5XI/eDzeN6iVl9vb23+XU6/q6hq9vb0PpFJpo1QqfQYgbxOJxNdIJPKHZLkqlZpqbGw8gbofw4FvwEXfICh/0+n0ByIxGovFaYZl4VT4XVFReSIQCL7kOO7LEZpHiESiC7W1tf0Gg6EPRT4gGPMoEAiE8/PzP3EhM7u7u9+I3GAwOI2i3wGkH2q1+lJLS8sNvV7f0dDQoPX7/S82NjbGsKMvMfdHVN1sNtsyOzs7gX1+NJvNj1Qq1WVMTL2rq6vf8Zvx+fl52Nvbm0qlUm8RgLGxsfuYIAbQR2/juG2oM4JVwQjqvb6+/jSVSpVYWVlZGhoaAhSlUSgUA7hAL+mdLnEOh2OstbV1FM8F4+Pjt9fW1p48Hb6LLnV0mM3mMezwcHd398Py8vLH7u7uRwL7KBnRQiQSSb1Wq72H95fReygIcnxudrsdA0QFLS0tN7FTbXd3941QKLTJcZxLLpeH0HYZj9KmSqW6ZTAY7uh0OqlUKpXgfeGZN27F6RlXgYrw2TmZVLKMZxKaxpscURSTnq4TjGwHZziqqqpE2Wwpw6NZn89HPp93DA4OPkVDr9cL+XxesMnlckEoFIJEIkGJQ7LJ5/Pg9XohGo3C5OQkWCyWt2qFQvGcxJ5YPF4hXl6MZl4VLqpnixBfNSu2s1kUmK0qZqvOCvG5oUaxQko14L/aBaSGiJ5S638AQC0a+/GRfWUAAAAASUVORK5CYII=")',
          backgroundBlendMode: 'overlay',
        }}
      ></div>
      
      {/* Scanline effect */}
      <Scanline intensity="light" type="horizontal" className="absolute inset-0 pointer-events-none">
        <div></div>
      </Scanline>

      {/* Terminal overlay for "Enter The Matrix" transition */}
      {showTerminal && !matrixEntered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-all duration-500">
          <div className="w-full max-w-2xl p-4">
            <Terminal
              title="MATRIX SYSTEM INITIALIZATION"
              prompt=">"
              commands={terminalCommands}
              initialCommands={["help", "install"]}
              height="300px"
              allowUserInput={false}
              readOnly={true}
            />
            
            {/* Loading progress bar */}
            <div className="mt-4 h-2 bg-black border border-matrix-border overflow-hidden">
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

            {/* Cancel button */}
            <div className="text-center mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowTerminal(false);
                  setLoadingProgress(0);
                  setIsTransitioning(false);
                }}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Container>
        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            variant="primary" 
            hasGlow={true}
            onClick={handleEnterMatrix}
            className="uppercase tracking-wider"
          >
            Enter The Matrix
          </Button>
          
          <Button 
            variant="terminal"
            onClick={handleExploreComponents}
            className="uppercase tracking-wider"
          >
            Explore Components
          </Button>
        </div>
        
        <div 
          ref={carouselRef}
          className={cn(
            "matrix-carousel relative w-full overflow-hidden border border-matrix-border rounded",
            isTransitioning && "transitioning"
          )}
          style={{ 
            height: '500px',
            backgroundColor: 'rgba(0, 10, 0, 0.7)',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 15px var(--m-glow)'
          }}
        >
          {/* Dot Navigation */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={`dot-${index}`}
                className={cn(
                  "w-3 h-3 rounded-full border border-matrix-border transition-all",
                  activeSlide === index 
                    ? "bg-matrix-text-bright border-matrix-text-bright" 
                    : "bg-transparent hover:bg-matrix-text hover:bg-opacity-20"
                )}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  boxShadow: activeSlide === index ? '0 0 5px var(--m-glow)' : 'none',
                  transform: activeSlide === index ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
          
          {/* Arrow Navigation */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-60 w-10 h-10 rounded-full flex items-center justify-center border border-matrix-border hover:border-matrix-text-bright transition-colors"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-matrix-text"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-60 w-10 h-10 rounded-full flex items-center justify-center border border-matrix-border hover:border-matrix-text-bright transition-colors"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-matrix-text"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          
          {/* Slides */}
          <div 
            className={cn(
              "h-full w-full flex transition-transform duration-700 ease-out",
              isTransitioning && "transform-glitch"
            )}
            style={{ 
              transform: `translateX(-${activeSlide * 100}%)`,
              willChange: 'transform'
            }}
          >
            {/* Slide 1: Core Features */}
            <div className="flex-shrink-0 w-full h-full p-8 flex flex-col">
              <div className="mb-6 flex flex-col items-center text-center">
                <h2 className="inline-block relative mb-2">
                  <GlitchText
                    text="CORE FEATURES" 
                    intensity="medium"
                    className="text-3xl font-bold text-matrix-text-bright tracking-wider"
                  />
                </h2>
                <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-matrix-text to-transparent my-2"></div>
                <p className="text-matrix-text opacity-80 max-w-3xl mx-auto">
                  The complete Matrix-inspired framework with everything you need to build immersive digital interfaces
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 flex-1">
                {/* Feature 1 */}
                <div className="feature-card bg-matrix-panel bg-opacity-50 border border-matrix-border p-5 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3 flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 border border-matrix-text flex items-center justify-center text-sm rounded">01</span>
                    Visual Effects
                  </h3>
                  <p className="text-matrix-text opacity-80">
                    Iconic Matrix-inspired visual effects including code rain, glitch text, terminals, and scanlines.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">Canvas</span>
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">Animations</span>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="feature-card bg-matrix-panel bg-opacity-50 border border-matrix-border p-5 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3 flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 border border-matrix-text flex items-center justify-center text-sm rounded">02</span>
                    UI Components
                  </h3>
                  <p className="text-matrix-text opacity-80">
                    Complete library of styled React components, from buttons and cards to modals and forms.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">React</span>
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">TypeScript</span>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="feature-card bg-matrix-panel bg-opacity-50 border border-matrix-border p-5 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3 flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 border border-matrix-text flex items-center justify-center text-sm rounded">03</span>
                    Theming
                  </h3>
                  <p className="text-matrix-text opacity-80">
                    Dark and light themes with global CSS variables for easy customization and theme switching.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">CSS Variables</span>
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">Context API</span>
                  </div>
                </div>
                
                {/* Feature 4 */}
                <div className="feature-card bg-matrix-panel bg-opacity-50 border border-matrix-border p-5 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3 flex items-center">
                    <span className="inline-block w-6 h-6 mr-2 border border-matrix-text flex items-center justify-center text-sm rounded">04</span>
                    Layout System
                  </h3>
                  <p className="text-matrix-text opacity-80">
                    Responsive grid layout with Container, Row, and Col components for flexible page structure.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">Grid</span>
                    <span className="text-xs bg-matrix-primary bg-opacity-10 text-matrix-text px-2 py-1 rounded border border-matrix-border">Responsive</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Slide 2: Installation */}
            <div className="flex-shrink-0 w-full h-full p-8 flex flex-col">
              <div className="mb-6 flex flex-col items-center text-center">
                <h2 className="inline-block relative mb-2">
                  <GlitchText
                    text="INSTALLATION" 
                    intensity="medium"
                    className="text-3xl font-bold text-matrix-text-bright tracking-wider"
                  />
                </h2>
                <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-matrix-text to-transparent my-2"></div>
                <p className="text-matrix-text opacity-80 max-w-3xl mx-auto">
                  Get started with Matrix.css in minutes
                </p>
              </div>
              
              <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
                <Terminal
                  title="matrix-terminal.sh"
                  prompt="$"
                  commands={terminalCommands}
                  initialCommands={["help", "version"]}
                  height="300px"
                  allowUserInput={true}
                  showHeader={true}
                  autoFocus={false}
                />
                
                <div className="mt-6 bg-matrix-panel bg-opacity-50 border border-matrix-border p-4 rounded font-mono text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    <span className="ml-2 text-matrix-text-dim text-xs">index.tsx</span>
                  </div>
                  <pre className="text-matrix-text overflow-x-auto p-2">
                    <code>
{`// Import components
import { CodeRain, GlitchText } from 'matrix-css';
import { Button } from 'matrix-css/ui';

export default function App() {
  return (
    <>
      {/* Matrix code rain background */}
      <CodeRain className="fixed inset-0 -z-10" />
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl mb-4">
          <GlitchText text="Hello, Matrix" />
        </h1>
        <Button variant="primary" hasGlow>Enter</Button>
      </main>
    </>
  );
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Slide 3: Components */}
            <div id="getting-started" className="flex-shrink-0 w-full h-full p-8 flex flex-col">
              <div className="mb-6 flex flex-col items-center text-center">
                <h2 className="inline-block relative mb-2">
                  <GlitchText
                    text="COMPONENTS" 
                    intensity="medium"
                    className="text-3xl font-bold text-matrix-text-bright tracking-wider"
                  />
                </h2>
                <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-matrix-text to-transparent my-2"></div>
                <p className="text-matrix-text opacity-80 max-w-3xl mx-auto">
                  Extensive library of fully styled UI components
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
                {/* Component 1 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Button</h3>
                    <div className="mb-3">
                      <Button variant="primary" size="sm" className="mr-2 mb-2">Primary</Button>
                      <Button variant="outline" size="sm" className="mb-2">Outline</Button>
                      <Button variant="terminal" size="sm" hasGlow className="mb-2">Terminal</Button>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Multiple variants, sizes, and effects</div>
                  </CardContent>
                </Card>
                
                {/* Component 2 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Card</h3>
                    <div className="mb-3 border border-matrix-border p-2 rounded">
                      <div className="p-2 border-b border-matrix-border mb-2">Header</div>
                      <div className="p-2">Content</div>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Cards with header, content, footer sections</div>
                  </CardContent>
                </Card>
                
                {/* Component 3 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Form</h3>
                    <div className="mb-3">
                      <div className="border border-matrix-border rounded p-2 mb-2 h-8"></div>
                      <div className="flex space-x-2 items-center mb-2">
                        <div className="w-4 h-4 border border-matrix-border rounded-full"></div>
                        <div className="text-xs">Option</div>
                      </div>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Input, Select, Checkbox, Radio, Switch</div>
                  </CardContent>
                </Card>
                
                {/* Component 4 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Effects</h3>
                    <div className="mb-3 flex flex-col gap-1">
                      <div className="text-xs bg-black bg-opacity-50 p-1 border border-matrix-text-dim">CodeRain</div>
                      <div className="text-xs bg-black bg-opacity-50 p-1 border border-matrix-text-dim">Terminal</div>
                      <div className="text-xs bg-black bg-opacity-50 p-1 border border-matrix-text-dim">GlitchText</div>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Visual effects and animations</div>
                  </CardContent>
                </Card>
                
                {/* Component 5 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Alert</h3>
                    <div className="mb-3 border border-matrix-border bg-matrix-primary bg-opacity-10 p-2 rounded text-xs">
                      <span className="font-bold block mb-1">System Notice</span>
                      <span>Important information</span>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Multiple status variations</div>
                  </CardContent>
                </Card>
                
                {/* Component 6 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Modal</h3>
                    <div className="mb-3 border border-matrix-border p-2 rounded text-xs">
                      <div className="p-1 border-b border-matrix-border mb-1">Dialog Title</div>
                      <div className="p-1 mb-1">Content</div>
                      <div className="p-1 border-t border-matrix-border flex justify-end">
                        <div className="inline-block px-2 py-1 bg-matrix-primary bg-opacity-20 rounded text-[0.6rem]">Confirm</div>
                      </div>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Overlaid dialog windows</div>
                  </CardContent>
                </Card>
                
                {/* Component 7 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Progress</h3>
                    <div className="mb-3">
                      <div className="w-full h-4 bg-black bg-opacity-50 rounded overflow-hidden">
                        <div className="h-full bg-matrix-primary" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Progress bars with animations</div>
                  </CardContent>
                </Card>
                
                {/* Component 8 */}
                <Card className="bg-black bg-opacity-50 transform transition-all hover:scale-105 hover:shadow-[0_0_15px_var(--m-glow)]">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-matrix-text-bright mb-2">Layout</h3>
                    <div className="mb-3 grid grid-cols-3 gap-1">
                      <div className="bg-matrix-border bg-opacity-30 p-1 text-[0.6rem] text-center">Col</div>
                      <div className="bg-matrix-border bg-opacity-30 p-1 text-[0.6rem] text-center">Col</div>
                      <div className="bg-matrix-border bg-opacity-30 p-1 text-[0.6rem] text-center">Col</div>
                    </div>
                    <div className="text-xs text-matrix-text-dim">Container, Row, Col grid system</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Slide 4: Use Cases */}
            <div className="flex-shrink-0 w-full h-full p-8 flex flex-col">
              <div className="mb-6 flex flex-col items-center text-center">
                <h2 className="inline-block relative mb-2">
                  <GlitchText
                    text="USE CASES" 
                    intensity="medium"
                    className="text-3xl font-bold text-matrix-text-bright tracking-wider"
                  />
                </h2>
                <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-matrix-text to-transparent my-2"></div>
                <p className="text-matrix-text opacity-80 max-w-3xl mx-auto">
                  Perfect for projects requiring a distinctive digital aesthetic
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Use Case 1 */}
                <div className="bg-matrix-panel bg-opacity-50 border border-matrix-border p-6 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3">Tech Portfolios</h3>
                  <p className="text-matrix-text opacity-80 mb-4">
                    Create distinctive developer portfolios and personal websites that showcase technical skills with an immersive digital interface.
                  </p>
                  <div className="h-24 border border-matrix-border rounded overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-matrix-text-bright text-xl font-mono tracking-wider">PORTFOLIO.CSS</div>
                  </div>
                </div>
                
                {/* Use Case 2 */}
                <div className="bg-matrix-panel bg-opacity-50 border border-matrix-border p-6 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3">Digital Dashboards</h3>
                  <p className="text-matrix-text opacity-80 mb-4">
                    Design monitoring interfaces, analytics dashboards, and system administration panels with a futuristic aesthetic.
                  </p>
                  <div className="h-24 border border-matrix-border rounded overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2 w-full p-2">
                      <div className="bg-matrix-primary bg-opacity-10 rounded h-5"></div>
                      <div className="bg-matrix-primary bg-opacity-10 rounded h-5"></div>
                      <div className="bg-matrix-primary bg-opacity-10 rounded h-5"></div>
                      <div className="bg-matrix-primary bg-opacity-10 rounded h-5"></div>
                      <div className="bg-matrix-primary bg-opacity-10 rounded h-5"></div>
                      <div className="bg-matrix-primary bg-opacity-10 rounded h-5"></div>
                    </div>
                  </div>
                </div>
                
                {/* Use Case 3 */}
                <div className="bg-matrix-panel bg-opacity-50 border border-matrix-border p-6 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3">Tech Events</h3>
                  <p className="text-matrix-text opacity-80 mb-4">
                    Build websites for technology conferences, hackathons, and digital events that capture a cutting-edge atmosphere.
                  </p>
                  <div className="h-24 border border-matrix-border rounded overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-matrix-text-bright font-bold">
                      HACK<span className="text-matrix-danger">CON</span> 2025
                    </div>
                  </div>
                </div>
                
                {/* Use Case 4 */}
                <div className="bg-matrix-panel bg-opacity-50 border border-matrix-border p-6 rounded relative overflow-hidden transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)] group">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-matrix-text to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-matrix-text-bright mb-3">Gaming Interfaces</h3>
                  <p className="text-matrix-text opacity-80 mb-4">
                    Develop game companion sites, launcher interfaces, and digital gaming platforms with an immersive theme.
                  </p>
                  <div className="h-24 border border-matrix-border rounded overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 border border-matrix-text-bright rounded-full"></div>
                      <div className="text-matrix-text-bright">LEVEL UP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Slide 5: Performance */}
            <div className="flex-shrink-0 w-full h-full p-8 flex flex-col">
              <div className="mb-6 flex flex-col items-center text-center">
                <h2 className="inline-block relative mb-2">
                  <GlitchText
                    text="PERFORMANCE" 
                    intensity="medium"
                    className="text-3xl font-bold text-matrix-text-bright tracking-wider"
                  />
                </h2>
                <div className="w-full max-w-lg h-px bg-gradient-to-r from-transparent via-matrix-text to-transparent my-2"></div>
                <p className="text-matrix-text opacity-80 max-w-3xl mx-auto">
                  Matrix.css delivers stunning visuals without compromising on speed or usability
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                {/* Metric 1 */}
                <div className="bg-black bg-opacity-30 border border-matrix-border rounded p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)]">
                  <div className="text-4xl font-bold text-matrix-text-bright mb-2">99<span className="text-xl">/100</span></div>
                  <div className="text-center text-matrix-text opacity-80">Lighthouse Performance</div>
                </div>
                
                {/* Metric 2 */}
                <div className="bg-black bg-opacity-30 border border-matrix-border rounded p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)]">
                  <div className="text-4xl font-bold text-matrix-text-bright mb-2">60<span className="text-xl">FPS</span></div>
                  <div className="text-center text-matrix-text opacity-80">Animation Smoothness</div>
                </div>
                
                {/* Metric 3 */}
                <div className="bg-black bg-opacity-30 border border-matrix-border rounded p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)]">
                  <div className="text-4xl font-bold text-matrix-text-bright mb-2">15<span className="text-xl">KB</span></div>
                  <div className="text-center text-matrix-text opacity-80">Core CSS Size</div>
                </div>
                
                {/* Metric 4 */}
                <div className="bg-black bg-opacity-30 border border-matrix-border rounded p-6 flex flex-col items-center justify-center transition-all duration-300 hover:border-matrix-text hover:shadow-[0_0_15px_var(--m-glow)]">
                  <div className="text-4xl font-bold text-matrix-text-bright mb-2">100<span className="text-xl">%</span></div>
                  <div className="text-center text-matrix-text opacity-80">Mobile Responsive</div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button variant="terminal" size="lg" hasGlow className="group">
                  <span className="inline-block transition-transform group-hover:translate-x-1">EXPLORE DOCUMENTATION</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      <style jsx global>{`
        @keyframes matrix-data-corruption {
          0% {
            transform: skew(0);
            filter: brightness(1);
          }
          20% {
            transform: skew(3deg, 0);
            filter: brightness(1.5);
          }
          40% {
            transform: skew(-1deg, 0);
            filter: brightness(0.8);
          }
          60% {
            transform: skew(2deg, 0);
            filter: brightness(1.2);
          }
          80% {
            transform: skew(-2deg, 0);
            filter: brightness(1);
          }
          100% {
            transform: skew(0);
            filter: brightness(1);
          }
        }
        
        .transform-glitch {
          animation: matrix-data-corruption 0.3s linear;
        }
        
        .matrix-carousel.transitioning::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(0,255,65,0) 0%, rgba(0,255,65,0.1) 50%, rgba(0,255,65,0) 100%);
          z-index: 10;
          pointer-events: none;
          animation: matrix-scan 0.5s linear;
        }
        
        @keyframes matrix-scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .feature-card:hover {
          transform: translateY(-3px);
        }
        
        /* Generate random data corruption line effect */
        .data-corruption-line {
          animation: data-line-flow 0.8s linear;
        }
        
        @keyframes data-line-flow {
          0% {
            transform: translateX(-100%) translateY(-50%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) translateY(-50%);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default MatrixCarousel;