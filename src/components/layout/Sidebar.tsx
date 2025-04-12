import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/utils/cn';

// Interface for sidebar sections and links
interface SidebarSection {
  title: string;
  links: {
    id: string;
    text: string;
    href: string;
  }[];
}

// Component props
interface MatrixSidebarProps {
  className?: string;
  sections?: SidebarSection[];
  activeSectionId?: string;
  showMobileToggle?: boolean;
  showConnectionLines?: boolean;
  onSectionChange?: (sectionId: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  scrollThreshold?: number; // Pixels from top to start showing the sidebar
}

// Default sidebar sections (all sections from vanilla version)
const DEFAULT_SECTIONS: SidebarSection[] = [
  {
    title: "Getting Started",
    links: [
      { id: "introduction", text: "Introduction", href: "#introduction" },
      { id: "installation", text: "Installation", href: "#installation" },
      { id: "colors", text: "Colors", href: "#colors" },
      { id: "typography", text: "Typography", href: "#typography" }
    ]
  },
  {
    title: "Layout",
    links: [
      { id: "containers", text: "Containers", href: "#containers" },
      { id: "grid", text: "Grid System", href: "#grid" },
      { id: "spacing", text: "Spacing", href: "#spacing" }
    ]
  },
  {
    title: "Components",
    links: [
      { id: "buttons", text: "Buttons", href: "#buttons" },
      { id: "alerts", text: "Alerts", href: "#alerts" },
      { id: "cards", text: "Cards", href: "#cards" },
      { id: "badges", text: "Badges", href: "#badges" },
      { id: "progress", text: "Progress Bars", href: "#progress" },
      { id: "spinners", text: "Spinners", href: "#spinners" }
    ]
  },
  {
    title: "Advanced Components",
    links: [
      { id: "neural-network", text: "Neural Network", href: "#neural-network" },
      { id: "terminal", text: "Terminal", href: "#terminal" },
      { id: "glitch-text", text: "Glitch Text", href: "#glitch-text" },
      { id: "identity-card", text: "Identity Card", href: "#identity-card" },
      { id: "code-rain", text: "Code Rain", href: "#code-rain" }
    ]
  },
  {
    title: "Utilities",
    links: [
      { id: "effects", text: "Visual Effects", href: "#effects" },
      { id: "animations", text: "Animations", href: "#animations" },
      { id: "transforms", text: "Transforms", href: "#transforms" },
      { id: "responsive", text: "Responsive Design", href: "#responsive" }
    ]
  }
];

export const MatrixSidebar: React.FC<MatrixSidebarProps> = ({
  className,
  sections = DEFAULT_SECTIONS,
  activeSectionId,
  showMobileToggle = true,
  showConnectionLines = true,
  onSectionChange,
  isOpen = false,
  onToggle,
  scrollThreshold = 500, // Default scroll threshold to show the sidebar
}) => {
  // State for active section, hover effects, etc.
  const [activeId, setActiveId] = useState(activeSectionId || '');
  const [hoverLinkIndex, setHoverLinkIndex] = useState<number | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const [terminalText, setTerminalText] = useState<string>("");
  const [terminalGlitching, setTerminalGlitching] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Controls sidebar visibility based on scroll position
  
  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const connectionLinesRef = useRef<HTMLDivElement>(null);
  const typeTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Effect for initial active section
  useEffect(() => {
    if (activeSectionId) {
      setActiveId(activeSectionId);
      
      // Get section title for terminal effect
      const targetSection = document.getElementById(activeSectionId);
      if (targetSection) {
        const heading = targetSection.querySelector('h2, h3');
        if (heading) {
          typeTerminalText(heading.textContent?.trim().toUpperCase() || '');
        }
      }
    }
  }, [activeSectionId]);
  
  // Handle scroll to determine when to show the sidebar and update active section
  useEffect(() => {
    const handleScroll = () => {
      if (scrolling) return;
      
      setScrolling(true);
      
      // Use requestAnimationFrame for better performance
      window.requestAnimationFrame(() => {
        // Show sidebar after scrolling past the threshold
        setIsVisible(window.scrollY > scrollThreshold);
        
        updateActiveSection();
        setScrolling(false);
      });
    };
    
    const updateActiveSection = () => {
      // Get all sections with IDs
      const sections = document.querySelectorAll('section[id]');
      if (!sections.length) return;
      
      // Calculate current scroll position with offset
      const scrollPosition = window.pageYOffset + 100;
      
      // Find the current section
      let currentSection = '';
      for (const section of sections) {
        const sectionTop = getOffsetTop(section);
        const sectionHeight = section.offsetHeight;
        const sectionId = section.id;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = sectionId;
          break;
        }
      }
      
      // Update active section if needed
      if (currentSection && currentSection !== activeId) {
        setActiveId(currentSection);
        
        // Get section title for terminal effect
        const targetSection = document.getElementById(currentSection);
        if (targetSection) {
          const heading = targetSection.querySelector('h2, h3');
          if (heading) {
            typeTerminalText(heading.textContent?.trim().toUpperCase() || '');
          }
        }
        
        // Callback for parent component
        if (onSectionChange) {
          onSectionChange(currentSection);
        }
        
        // Create matrix rain particles effect
        createMatrixRainParticles();
        
        // Activate random connection lines
        if (showConnectionLines) {
          activateRandomConnectionLines();
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial update
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeId, scrolling, onSectionChange, scrollThreshold, showConnectionLines]);
  
  // Click handler for smooth scrolling
  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    // Get the target section
    const targetSection = document.getElementById(id);
    if (!targetSection) return;
    
    // Update active section
    setActiveId(id);
    
    // Callback for parent component
    if (onSectionChange) {
      onSectionChange(id);
    }
    
    // Get section heading for terminal effect
    const heading = targetSection.querySelector('h2, h3');
    if (heading) {
      typeTerminalText(heading.textContent?.trim().toUpperCase() || '');
    }
    
    // Calculate offset (navbar height + padding)
    const navHeight = document.querySelector('.matrix-nav')?.clientHeight || 70;
    const yOffset = -navHeight - 20;
    
    // Get element position
    const y = getOffsetTop(targetSection) + window.pageYOffset + yOffset;
    
    // Smooth scroll
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
    
    // Update URL without jump
    history.pushState(null, null, `#${id}`);
    
    // Add highlight effect to the target section
    targetSection.classList.add('highlight-target');
    setTimeout(() => {
      targetSection.classList.remove('highlight-target');
    }, 2000);
    
    // Create matrix rain particles effect
    createMatrixRainParticles();
    
    // Activate random connection lines
    if (showConnectionLines) {
      activateRandomConnectionLines();
    }
    
    // Close mobile sidebar if open
    if (isOpen && onToggle) {
      onToggle();
    }
  }, [isOpen, onToggle, onSectionChange, showConnectionLines]);
  
  // Terminal typing effect with glitch
  const typeTerminalText = useCallback((text: string) => {
    if (typeTimeout.current) {
      clearTimeout(typeTimeout.current);
    }
    
    // Add glitch effect
    setTerminalGlitching(true);
    
    setTimeout(() => {
      setTerminalGlitching(false);
      
      // Clear current text
      setTerminalText('');
      
      // Type characters one by one
      let i = 0;
      const typeChar = () => {
        if (i < text.length) {
          setTerminalText(prev => prev + text.charAt(i));
          i++;
          
          // Random delay for realistic typing
          const randomDelay = Math.floor(Math.random() * 50) + 30;
          typeTimeout.current = setTimeout(typeChar, randomDelay);
          
          // Occasionally add glitch during typing
          if (Math.random() < 0.1) {
            setTerminalGlitching(true);
            setTimeout(() => {
              setTerminalGlitching(false);
            }, 100);
          }
        }
      };
      
      typeChar();
    }, 300);
  }, []);
  
  // Create matrix rain particles during transitions
  const createMatrixRainParticles = useCallback(() => {
    const container = document.querySelector('.matrix-particles-container');
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Matrix chars
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'matrix-particle';
      
      // Random character
      particle.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
      
      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 1.5 + 's';
      
      container.appendChild(particle);
    }
    
    // Remove particles after animation completes
    setTimeout(() => {
      container.innerHTML = '';
    }, 3500);
  }, []);
  
  // Activate random connection lines
  const activateRandomConnectionLines = useCallback(() => {
    if (!connectionLinesRef.current) return;
    
    // Reset all connection lines
    const lines = connectionLinesRef.current.querySelectorAll('.connection-line');
    if (!lines.length) {
      createConnectionLines();
      return;
    }
    
    for (const line of lines) {
      line.classList.remove('active');
    }
    
    // Activate random connection lines
    setTimeout(() => {
      const lineCount = lines.length;
      const activeCount = Math.floor(lineCount * 0.3) + 1; // Activate ~30% of lines
      
      const randomIndices = new Set<number>();
      while (randomIndices.size < activeCount) {
        randomIndices.add(Math.floor(Math.random() * lineCount));
      }
      
      randomIndices.forEach(index => {
        if (lines[index]) {
          lines[index].classList.add('active');
        }
      });
    }, 300);
  }, []);
  
  // Create connection lines
  const createConnectionLines = useCallback(() => {
    if (!connectionLinesRef.current || !showConnectionLines) return;
    
    // Clear existing lines
    connectionLinesRef.current.innerHTML = '';
    
    // Create connection lines
    const lineCount = 8 + Math.floor(Math.random() * 5); // 8-12 lines
    
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'connection-line';
      
      // Random positioning
      const startX = Math.random() * 100;
      const startY = Math.random() * 70 + 30;
      const endX = 100 + Math.random() * 50;
      
      // Calculate line properties
      const deltaX = endX - startX;
      const length = Math.sqrt(deltaX * deltaX + 900);
      const angle = Math.atan2(30, deltaX) * 180 / Math.PI;
      
      // Set styles
      line.style.left = `${startX}%`;
      line.style.top = `${startY}%`;
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      
      // Randomly activate some lines
      if (Math.random() > 0.6) {
        line.classList.add('active');
      }
      
      connectionLinesRef.current.appendChild(line);
    }
  }, [showConnectionLines]);
  
  // Initialize connection lines
  useEffect(() => {
    createConnectionLines();
    
    // Handle window resize
    const handleResize = () => {
      createConnectionLines();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createConnectionLines]);
  
  // Helper: Get element's offset from the top
  const getOffsetTop = (element: Element) => {
    let offsetTop = 0;
    let currentElement = element;
    
    while(currentElement && 'offsetTop' in currentElement) {
      offsetTop += (currentElement as HTMLElement).offsetTop;
      currentElement = (currentElement as HTMLElement).offsetParent as Element;
    }
    
    return offsetTop;
  };
  
  // Random glitch effects at intervals
  useEffect(() => {
    const randomGlitchEffects = () => {
      if (Math.random() > 0.9) {
        setTerminalGlitching(true);
        setTimeout(() => {
          setTerminalGlitching(false);
        }, 150);
      }
      
      // Randomly activate connection lines
      if (connectionLinesRef.current && Math.random() > 0.8) {
        const lines = connectionLinesRef.current.querySelectorAll('.connection-line');
        if (lines.length > 0) {
          // Pick a random line
          const randomIndex = Math.floor(Math.random() * lines.length);
          const randomLine = lines[randomIndex];
          randomLine.classList.add('active');
          
          setTimeout(() => {
            if (Math.random() > 0.5) {
              randomLine.classList.remove('active');
            }
          }, 2000);
        }
      }
      
      // Schedule next glitch
      setTimeout(randomGlitchEffects, 2000 + Math.random() * 3000);
    };
    
    // Initialize random effects
    const glitchTimeout = setTimeout(randomGlitchEffects, 2000);
    
    return () => {
      clearTimeout(glitchTimeout);
    };
  }, []);
  
  // Only render the sidebar when it should be visible
  if (!isVisible && !isOpen) {
    return null; // Don't render anything until scrolled past threshold
  }
  
  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={cn(
          "sidebar-backdrop fixed inset-0 bg-black/50 z-[899]",
          isOpen ? "block" : "hidden"
        )}
        onClick={onToggle}
        aria-hidden={!isOpen}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "docs-sidebar w-[var(--docs-sidebar-width,280px)] sticky top-[var(--navbar-height,70px)] h-[calc(100vh-var(--navbar-height,70px))] overflow-y-auto",
          "bg-[var(--m-panel)] border-r border-[var(--m-border)] py-4 flex-shrink-0 z-[900]",
          "transition-all duration-[var(--sidebar-transition-speed,0.3s)] ease",
          "scrollbar-thin scrollbar-thumb-[var(--m-text-dim)] scrollbar-track-[var(--m-bg)] scrollbar-thumb-rounded",
          isOpen ? "left-0" : "-left-[300px] md:left-0",
          className
        )}
      >
        {/* Search container */}
        <div className="px-6 mb-4">
          <div className="search-container relative w-full">
            <span className="search-icon text-[var(--m-text-dim)] absolute left-3 top-1/2 transform -translate-y-1/2">⌕</span>
            <input 
              type="text" 
              className="search-input w-full py-2 px-8 bg-[rgba(0,0,0,0.3)] border border-[var(--m-border)] rounded-[var(--m-radius)] text-[var(--m-text)] font-mono text-sm transition duration-300"
              placeholder="Search documentation..."
            />
          </div>
        </div>
        
        {/* Terminal display for active section */}
        {showConnectionLines && (
          <div className="matrix-terminal-display relative mx-4 mb-6 h-10 flex items-center px-3 bg-[rgba(0,10,0,0.7)] border border-[var(--m-border)] rounded overflow-hidden">
            <span className="terminal-prefix text-[var(--m-text-dim)] mr-2">&gt;</span>
            <div 
              className={cn(
                "terminal-text-box relative text-[var(--m-text-bright)] uppercase tracking-wider",
                terminalGlitching && "glitch"
              )} 
              data-content={terminalText}
            >
              {terminalText}
            </div>
            <span className="terminal-cursor ml-1 inline-block w-[2px] h-[15px] bg-[var(--m-text)] animate-[cursor-blink_1s_step-end_infinite]"></span>
          </div>
        )}
        
        {/* Connection lines container */}
        {showConnectionLines && (
          <div 
            ref={connectionLinesRef}
            className="terminal-connection-lines absolute inset-0 pointer-events-none overflow-hidden z-[1]"
          ></div>
        )}
        
        {/* Sidebar sections and links */}
        {sections.map((section, sectionIndex) => (
          <div key={`section-${sectionIndex}`} className="px-6 mb-6">
            <h6 className="uppercase text-[var(--m-text-dim)] text-xs mb-2 pb-1 border-b border-[var(--m-border)]">
              {section.title}
            </h6>
            <ul className="list-none p-0">
              {section.links.map((link, linkIndex) => {
                const isActive = activeId === link.id;
                const globalIndex = sections.slice(0, sectionIndex).reduce(
                  (acc, section) => acc + section.links.length, 0
                ) + linkIndex;
                const isHovered = hoverLinkIndex === globalIndex;
                
                return (
                  <li key={`link-${link.id}`} className="mb-2">
                    <a 
                      href={`#${link.id}`}
                      className={cn(
                        "docs-sidebar-link relative block py-1 px-2 text-[var(--m-text)] no-underline transition-all duration-200",
                        isActive && "active text-[var(--m-text-bright)] bg-[rgba(0,255,65,0.05)] pl-4 relative",
                        isHovered && !isActive && "text-[var(--m-text-bright)] bg-[rgba(0,255,65,0.02)]"
                      )}
                      onClick={(e) => handleLinkClick(e, link.id)}
                      onMouseEnter={() => setHoverLinkIndex(globalIndex)}
                      onMouseLeave={() => setHoverLinkIndex(null)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active indicator line */}
                      {isActive && (
                        <span className="absolute left-0 top-0 w-[3px] h-full bg-[var(--m-text)] shadow-[0_0_10px_var(--m-glow)]"></span>
                      )}
                      
                      {/* Link text with hover effect */}
                      <span className="relative z-[2]">
                        {link.text}
                        
                        {/* Terminal cursor for active link */}
                        {isActive && (
                          <span className="ml-1 inline-block w-[3px] h-[0.8em] bg-[var(--m-text-dim)] opacity-70 align-middle animate-[cursor-blink_1s_step-end_infinite]"></span>
                        )}
                      </span>
                      
                      {/* Hover highlight */}
                      {isHovered && !isActive && (
                        <span className="absolute inset-0 bg-[var(--m-text)] opacity-[0.02] pointer-events-none"></span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      {/* CSS for Matrix effects */}
      <style jsx>{`
        /* Terminal effects */
        .terminal-text-box.glitch {
          animation: terminal-glitch 0.3s ease-in-out;
        }
        
        .terminal-text-box.glitch::before,
        .terminal-text-box.glitch::after {
          content: attr(data-content);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        
        .terminal-text-box.glitch::before {
          color: #ff0080;
          clip: rect(44px, 450px, 56px, 0);
          left: 3px;
          text-shadow: -2px 0 #ff0080;
          animation: glitch-anim-1 0.3s linear alternate-reverse;
        }
        
        .terminal-text-box.glitch::after {
          color: #00ff97;
          clip: rect(44px, 450px, 56px, 0);
          left: -3px;
          text-shadow: 2px 0 #00ff97;
          animation: glitch-anim-2 0.3s linear alternate-reverse;
        }
        
        /* Connection lines */
        .connection-line {
          position: absolute;
          height: 1px;
          background-color: var(--m-text-dim, #0a3f0a);
          transform-origin: left center;
          z-index: 1;
        }
        
        .connection-line.active {
          background-color: var(--m-text, #00ff41);
          box-shadow: 0 0 5px var(--m-glow, rgba(0, 255, 65, 0.6));
          animation: connection-pulse 1.5s infinite;
        }
        
        /* Matrix particle for transitions */
        .matrix-particle {
          position: absolute;
          color: var(--m-text, #00ff41);
          font-family: monospace;
          font-size: 12px;
          animation: fall-fade 2s forwards;
        }
        
        /* Highlight effect for section targets */
        .highlight-target {
          position: relative;
        }
        
        .highlight-target::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--m-text, #00ff41);
          opacity: 0.1;
          animation: fadeOut 2s forwards;
          pointer-events: none;
          z-index: -1;
        }
        
        /* Animations */
        @keyframes terminal-glitch {
          0%, 100% { transform: skew(0); }
          25% { transform: skew(2deg); }
          75% { transform: skew(-2deg); }
        }
        
        @keyframes glitch-anim-1 {
          0% { clip: rect(0, 0, 0, 0); }
          10% { clip: rect(89px, 9999px, 92px, 0); }
          20% { clip: rect(26px, 9999px, 66px, 0); }
          30% { clip: rect(8px, 9999px, 11px, 0); }
          40% { clip: rect(89px, 9999px, 99px, 0); }
          50% { clip: rect(8px, 9999px, 44px, 0); }
          60% { clip: rect(37px, 9999px, 37px, 0); }
          70% { clip: rect(81px, 9999px, 91px, 0); }
          80% { clip: rect(1px, 9999px, 1px, 0); }
          90% { clip: rect(69px, 9999px, 77px, 0); }
          100% { clip: rect(19px, 9999px, 29px, 0); }
        }
        
        @keyframes glitch-anim-2 {
          0% { clip: rect(0, 0, 0, 0); }
          10% { clip: rect(40px, 9999px, 47px, 0); }
          20% { clip: rect(27px, 9999px, 31px, 0); }
          30% { clip: rect(85px, 9999px, 89px, 0); }
          40% { clip: rect(92px, 9999px, 98px, 0); }
          50% { clip: rect(36px, 9999px, 42px, 0); }
          60% { clip: rect(13px, 9999px, 16px, 0); }
          70% { clip: rect(69px, 9999px, 72px, 0); }
          80% { clip: rect(65px, 9999px, 66px, 0); }
          90% { clip: rect(5px, 9999px, 11px, 0); }
          100% { clip: rect(49px, 9999px, 58px, 0); }
        }
        
        @keyframes connection-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        @keyframes fall-fade {
          0% { transform: translateY(-20px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        
        @keyframes fadeOut {
          from { opacity: 0.1; }
          to { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default MatrixSidebar;