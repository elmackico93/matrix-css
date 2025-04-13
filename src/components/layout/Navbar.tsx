import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { cn } from '@/utils/cn';

interface NavLink {
  number: string;
  text: string;
  href: string;
  isActive?: boolean;
}

interface MatrixNavbarProps {
  className?: string;
  containerFluid?: boolean;
  logoText?: string;
  statusText?: string;
  links?: NavLink[];
  disableRainEffect?: boolean;
  activeLink?: string;
}

export const MatrixNavbar: React.FC<MatrixNavbarProps> = memo(({
  className,
  containerFluid = false,
  logoText = 'MATRIX.CSS',
  statusText = 'SYSTEM ONLINE',
  links = [
    { number: '01', text: 'GETTING_STARTED', href: '#getting-started' },
    { number: '02', text: 'COMPONENTS', href: '#components' },
    { number: '03', text: 'UTILITIES', href: '#utilities' },
    { number: '04', text: 'EXAMPLES', href: '#examples' },
    { number: '05', text: 'GITHUB', href: 'https://github.com/example/matrix-css' },
  ],
  disableRainEffect = false,
  activeLink: propActiveLink,
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchStatus, setSearchStatus] = useState('IDLE');
  const [logoGlitching, setLogoGlitching] = useState(false);
  const [activeLink, setActiveLink] = useState(propActiveLink || '');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [logoHovered, setLogoHovered] = useState(false);
  
  // Mobile menu animation states
  const [menuAnimationComplete, setMenuAnimationComplete] = useState(false);
  const [menuItemsVisible, setMenuItemsVisible] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [codeRainOpacity, setCodeRainOpacity] = useState(0);
  
  // Search component state
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchGlitching, setSearchGlitching] = useState(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuCanvasRef = useRef<HTMLCanvasElement>(null);

  // Handle scroll effects with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active link if passed as prop
  useEffect(() => {
    if (propActiveLink) {
      setActiveLink(propActiveLink);
    }
  }, [propActiveLink]);

  // Initialize active link on page load based on hash
  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash) {
      const matchingLink = links.find(link => link.href === hash);
      if (matchingLink) {
        // Ensure only one active link
        setActiveLink(matchingLink.text);
      }
    } else if (links.length > 0) {
      // Set first link as active if no hash
      setActiveLink(links[0].text);
    }
  }, [links]);

  // Setup Matrix rain effect for navbar
  useEffect(() => {
    if (!canvasRef.current || disableRainEffect) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      if (navRef.current && canvas) {
        canvas.width = navRef.current.offsetWidth;
        canvas.height = navRef.current.offsetHeight;
      }
    };

    resizeCanvas();
    
    // Optimal event listener with debounce
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeCanvas, 100);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });

    // Matrix characters - mix of Latin and Japanese katakana
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    // Column settings
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    // Animation loop with optimization for performance
    let animationFrameId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 24; // Optimal frames per second
    
    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);
      
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      
      lastTime = timestamp - (elapsed % fpsInterval);
      
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set green text color
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      // Loop over each drop - optimized to reduce iterations
      for (let i = 0; i < drops.length; i += 2) {
        // Get random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Move drop down or reset to top
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }
    };
    
    animationFrameId = requestAnimationFrame(draw);
    
    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, [disableRainEffect]);

  // Mobile menu matrix rain effect
  useEffect(() => {
    if (!mobileMenuCanvasRef.current || !isOpen) return;

    const canvas = mobileMenuCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas dimensions to viewport (full screen)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    // Column settings - more dense for mobile menu
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Initialize some drops to start from different positions
    for (let i = 0; i < drops.length; i++) {
      // Random starting positions for a more organic look
      drops[i] = Math.floor(Math.random() * -15);
    }

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // Higher FPS for mobile menu
    
    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);
      
      const elapsed = timestamp - lastTime;
      if (elapsed < fpsInterval) return;
      
      lastTime = timestamp - (elapsed % fpsInterval);
      
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Green text color with higher intensity for mobile menu
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Only draw if drop is in view
        if (drops[i] > 0) {
          // Get random character
          const text = chars[Math.floor(Math.random() * chars.length)];
          
          // Random brightness for some characters
          if (Math.random() > 0.98) {
            ctx.fillStyle = '#ffffff'; // Occasional white character for "glitch" effect
          } else {
            ctx.fillStyle = '#00ff41';
          }
          
          // Draw character
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }
        
        // Move drop down or reset to top
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }
    };
    
    // Fade in the code rain
    const fadeInRain = () => {
      setCodeRainOpacity(prev => {
        if (prev < 0.8) {
          requestAnimationFrame(fadeInRain);
          return prev + 0.04;
        }
        return 0.8;
      });
    };
    
    // Start animations
    animationFrameId = requestAnimationFrame(draw);
    requestAnimationFrame(fadeInRain);
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      setCodeRainOpacity(0);
    };
  }, [isOpen]);

  // Minimalist search handlers
  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
    setSearchStatus('READY');
    
    // Subtle glitch effect on focus
    setSearchGlitching(true);
    setTimeout(() => setSearchGlitching(false), 120);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setSearchFocused(false);
    
    // Delay setting status to IDLE
    setTimeout(() => {
      if (!searchValue) {
        setSearchStatus('IDLE');
        setSearchActive(false);
      }
    }, 200);
  }, [searchValue]);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Set active state for minimal animations
    setSearchActive(!!value);
    
    // Update search status with slight delay
    if (value.length > 0) {
      setTimeout(() => {
        setSearchStatus('SEARCHING');
      }, 100);
      
      // Occasionally trigger subtle glitch effect
      if (Math.random() > 0.85) {
        setSearchGlitching(true);
        setTimeout(() => setSearchGlitching(false), 80);
      }
    } else {
      setSearchStatus('READY');
    }
  }, []);

  // Enhanced glitch effect for logo - sequential pattern
  useEffect(() => {
    let glitchTimer: NodeJS.Timeout;
    let sequenceTimer: NodeJS.Timeout;
    let glitchCount = 0;
    const maxGlitchesInSequence = 3;
    
    const triggerGlitchSequence = () => {
      // Reset glitch count for new sequence
      glitchCount = 0;
      
      const doGlitch = () => {
        setLogoGlitching(true);
        
        // Random duration for each glitch
        setTimeout(() => {
          setLogoGlitching(false);
          
          glitchCount++;
          
          // Continue sequence if not reached max
          if (glitchCount < maxGlitchesInSequence) {
            // Short pause between glitches in sequence
            glitchTimer = setTimeout(doGlitch, Math.random() * 100 + 50);
          }
        }, Math.random() * 120 + 60);
      };
      
      // Start glitch sequence
      doGlitch();
      
      // Schedule next sequence with long pause between
      sequenceTimer = setTimeout(triggerGlitchSequence, Math.random() * 5000 + 3000);
    };
    
    // Start first sequence
    triggerGlitchSequence();
    
    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(sequenceTimer);
    };
  }, []);

  // Toggle mobile menu function
  const toggleMenu = useCallback(() => {
    if (isOpen) {
      // Close menu
      setMenuItemsVisible(false);
      setTimeout(() => {
        setGlitchEffect(true);
        setTimeout(() => {
          setMenuAnimationComplete(false);
          setTimeout(() => {
            setIsOpen(false);
            setGlitchEffect(false);
            document.body.style.overflow = ''; // Re-enable scrolling
          }, 300);
        }, 200);
      }, 200);
    } else {
      // Open menu - simpler animation sequence
      document.body.style.overflow = 'hidden'; // Prevent body scrolling
      setIsOpen(true);
      setGlitchEffect(true);
      
      setTimeout(() => {
        setGlitchEffect(false);
        setMenuAnimationComplete(true);
        setTimeout(() => {
          setMenuItemsVisible(true);
        }, 100);
      }, 300);
    }
  }, [isOpen]);
  
  // Clean up body overflow when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Handle link click - ensure only one active link at a time
  const handleLinkClick = useCallback((linkText: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Set this as the ONLY active link
    setActiveLink(linkText);
    
    // Add click effect to the link
    const target = e.currentTarget;
    target.classList.add('nav-link-clicked');
    
    // Remove the class after animation completes
    setTimeout(() => {
      target.classList.remove('nav-link-clicked');
    }, 300);
    
    // Close mobile menu if it's open
    if (isOpen) {
      setTimeout(() => {
        toggleMenu();
      }, 200);
    }
  }, [isOpen, toggleMenu]);

  // Logo hover handlers
  const handleLogoMouseEnter = useCallback(() => {
    setLogoHovered(true);
  }, []);

  const handleLogoMouseLeave = useCallback(() => {
    setLogoHovered(false);
  }, []);

  // Memoized link handlers to prevent re-creation on each render
  const handleMouseEnter = useCallback((index: number) => {
    setHoverIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  return (
    <>
      {/* Mobile Menu Container - Always below navbar in z-index */}
      {isOpen && (
        <div 
          className={`fixed top-0 left-0 right-0 bottom-0 w-full h-screen bg-[rgba(0,10,2,0.97)] border-b border-matrix-border overflow-auto z-[999] ${
            glitchEffect ? 'menu-glitch-effect' : ''
          } ${menuAnimationComplete ? 'menu-active' : 'menu-entering'}`}
          style={{ 
            position: 'fixed', 
            zIndex: 999
          }}
        >
          {/* Matrix Rain Effect Canvas */}
          <canvas 
            ref={mobileMenuCanvasRef} 
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: codeRainOpacity, pointerEvents: 'none' }}
          />
          
          {/* Menu Content Container */}
          <div 
            className="menu-container relative z-10 flex flex-col items-start w-full h-full px-4 sm:px-6 pt-[70px] pb-16 overflow-y-auto"
            style={{
              opacity: menuItemsVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {/* Terminal-style header with improved alignment */}
            <div className="menu-header w-full mb-6 pb-3 border-b border-[rgba(0,255,65,0.2)]">
              <div className="terminal-line flex items-center overflow-hidden text-[var(--m-text-bright)] font-matrix-hacker mb-2">
                <span className="terminal-prompt shrink-0 mr-2 text-[var(--m-text-dim)]">&gt;</span>
                <span className="terminal-command min-w-0 overflow-hidden whitespace-nowrap typing-animation">SYSTEM.MENU.LOAD()</span>
              </div>
              <div className="system-status text-[0.8rem] text-[var(--m-text-dim)] font-matrix-hacker whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="status-indicator text-[var(--m-text)]">ACCESS GRANTED</span> :: SECURITY LEVEL 3 :: USER AUTHENTICATED
              </div>
            </div>
            
            {/* Mobile Menu Links */}
            <div className="menu-links flex flex-col w-full">
              {links.map((link, index) => {
                const isLinkActive = activeLink === link.text;
                const delay = 100 + index * 120;
                
                return (
                  <a 
                    key={`mobile-link-${index}`}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link.text, e)}
                    className={`mobile-nav-link relative w-full py-4 border-b border-[rgba(0,255,65,0.15)] text-[1.1rem] transition-all duration-300 ${
                      isLinkActive ? "text-[var(--m-text-bright)]" : "text-[var(--m-text)]"
                    }`}
                    style={{ 
                      animationDelay: `${delay}ms`,
                      opacity: menuItemsVisible ? 1 : 0,
                      transform: menuItemsVisible ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'opacity 0.3s ease, transform 0.3s ease',
                      transitionDelay: `${delay}ms`
                    }}
                  >
                    <div className="mobile-link-inner flex items-center">
                      <div className={`link-number flex items-center justify-center w-[40px] h-[40px] mr-3 rounded-md transition-all duration-300 border text-center ${
                        isLinkActive 
                          ? "border-[var(--m-text-bright)] text-[var(--m-text-bright)] bg-[rgba(0,255,65,0.1)]" 
                          : "border-[var(--m-text-dim)] text-[var(--m-text-dim)]"
                      }`}>
                        {link.number}
                      </div>
                      
                      <div className="link-content flex flex-col flex-1">
                        <span className={`link-text font-matrix-hacker tracking-wider transition-all duration-300 ${
                          isLinkActive ? "text-shadow-[0_0_10px_var(--m-glow)]" : ""
                        }`}>
                          {link.text}
                          {isLinkActive && (
                            <span className="ml-2 text-[var(--m-text-bright)] animate-[cursor-blink_0.7s_step-end_infinite]">&gt;</span>
                          )}
                        </span>
                        
                        <div className="data-metrics flex items-center mt-1 h-[3px] w-full">
                          <div className={`data-line h-full transition-all duration-500 ${
                            isLinkActive ? "bg-[var(--m-text-bright)] w-[70%]" : "bg-[var(--m-text-dim)] w-[30%]"
                          }`}></div>
                          <div className={`data-pulse-dot ml-1 rounded-full transition-all duration-500 ${
                            isLinkActive 
                              ? "w-[5px] h-[5px] bg-[var(--m-text-bright)] animate-pulse" 
                              : "w-[3px] h-[3px] bg-[var(--m-text-dim)]"
                          }`}></div>
                        </div>
                      </div>
                      
                      {isLinkActive && (
                        <div className="active-indicator flex flex-col items-center ml-2">
                          <span className="indicator-text text-[0.7rem] text-[var(--m-text-bright)]">ACTIVE</span>
                          <div className="indicator-dot w-[4px] h-[4px] mt-1 rounded-full bg-[var(--m-text-bright)] animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
            
            {/* Menu Footer */}
            <div className="menu-footer mt-auto pt-6 w-full text-[0.8rem] text-[var(--m-text-dim)]">
              <div className="footer-line mb-2">
                <span className="text-[var(--m-text)]">MATRIX.CSS</span> :: CORE/v2.1.0-beta
              </div>
              <div className="footer-metrics grid grid-cols-2 gap-2">
                <div className="metric">
                  <span className="metric-label">CPU:</span> 
                  <span className="metric-value text-[var(--m-text)]">32%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">MEM:</span> 
                  <span className="metric-value text-[var(--m-text)]">128MB</span>
                </div>
                <div className="metric">
                  <span className="metric-label">NET:</span> 
                  <span className="metric-value text-[var(--m-text)]">1.2MB/s</span>
                </div>
                <div className="metric">
                  <span className="metric-label">UPT:</span> 
                  <span className="metric-value text-[var(--m-text)]">8:42:15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Navbar */}
      <div 
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 h-[70px] bg-[rgba(0,10,2,0.92)] border-b border-matrix-border backdrop-filter backdrop-blur-[10px] overflow-hidden transition-colors duration-300 z-[1000]',
          isScrolled && 'shadow-[0_0_20px_rgba(0,0,0,0.7)]',
          className
        )}
        aria-label="Main navigation"
      >
        {/* Digital Rain Background Effect */}
        {!disableRainEffect && (
          <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70" aria-hidden="true" />
        )}
        
        {/* Scanline Effect */}
        <div className="nav-scanline absolute inset-0 pointer-events-none z-[1]" aria-hidden="true"></div>
        
        {/* Glitch Line Effect */}
        <div className="nav-glitch-line absolute inset-0 overflow-hidden pointer-events-none z-[4]" aria-hidden="true"></div>
        
        {/* Bottom glowing line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--m-text-bright)] to-transparent opacity-60 z-[2]" aria-hidden="true"></div>
        
        {/* Background panel for better contrast */}
        <div className="absolute inset-0 bg-[rgba(0,10,2,0.85)] z-[1]" aria-hidden="true"></div>
        
        <div className={cn(
          'nav-container max-w-[1400px] h-full mx-auto px-5 flex justify-between items-center relative z-[5]',
          containerFluid && 'w-full'
        )}>
          {/* ENHANCED Logo Section with Digital Animation */}
          <div className="nav-logo-container flex flex-col gap-1 relative">
            {/* Circuit trace pattern background */}
            <div className="circuit-traces absolute inset-0 pointer-events-none opacity-30 z-0" aria-hidden="true"></div>
            
            <a 
              href="#" 
              className="nav-logo flex items-center text-[1.5rem] font-bold text-[var(--m-text-bright)] no-underline tracking-[2px] relative"
              onMouseEnter={handleLogoMouseEnter}
              onMouseLeave={handleLogoMouseLeave}
              aria-label={logoText}
            >
              {/* Enhanced bracket with data pulse effect */}
              <span className={cn(
                'logo-bracket text-[1.6rem] opacity-70 relative top-[-2px] transition-all duration-300',
                logoHovered && 'bracket-active'
              )} aria-hidden="true">
                [
                <span className="data-pulse"></span>
              </span>
              
              {/* Logo text with enhanced container */}
              <div className="logo-text-container relative overflow-hidden">
                <span className={cn(
                  'logo-text relative overflow-hidden font-matrix-hacker z-10',
                  logoGlitching && 'glitching',
                  logoHovered && 'logo-hovered'
                )}>
                  {logoText}
                  
                  {/* Subtle text reflection */}
                  <span className="logo-reflection absolute left-0 right-0 bottom-[-16px] h-[10px] opacity-20 transform scale-y-[-0.3] scale-x-[1.02] blur-[1px] pointer-events-none" aria-hidden="true">
                    {logoText}
                  </span>
                </span>
                
                {/* Scanning line animation */}
                <span className={cn(
                  'logo-scan-line absolute top-0 left-[-100%] w-full h-[20%] bg-gradient-to-r from-transparent via-[rgba(0,255,65,0.15)] to-transparent pointer-events-none',
                  logoHovered && 'scan-active'
                )} aria-hidden="true"></span>
              </div>
              
              {/* Enhanced right bracket with data pulse */}
              <span className={cn(
                'logo-bracket text-[1.6rem] opacity-70 relative top-[-2px] transition-all duration-300',
                logoHovered && 'bracket-active'
              )} aria-hidden="true">
                ]
                <span className="data-pulse"></span>
              </span>
            </a>
            
            {/* Enhanced status indicator with pulse animation */}
            <div className="nav-status group flex items-center text-[0.7rem] py-[2px] px-[6px] ml-[10px] rounded-[3px] bg-[rgba(0,255,65,0.05)] text-[var(--m-text-bright)] relative transition-all duration-300 hover:bg-[rgba(0,255,65,0.1)]">
              {/* Status dot with pulse animation */}
              <div className="status-dot-container relative w-[6px] h-[6px] mr-[5px]" aria-hidden="true">
                <span className="status-dot absolute inset-0 bg-[var(--m-text-bright)] rounded-full opacity-90"></span>
                <span className="status-pulse absolute inset-[-2px] bg-[var(--m-text-bright)] rounded-full animate-ping opacity-30"></span>
              </div>
              
              <span className="status-text text-shadow-[0_0_2px_rgba(0,255,65,0.4)] transition-all duration-300 group-hover:tracking-[0.5px]">
                {statusText}
                
                {/* Version indicator on hover */}
                <span className="status-version absolute left-full top-0 ml-[8px] opacity-0 bg-[rgba(0,10,2,0.9)] px-[6px] py-[2px] rounded-sm border border-[var(--m-border)] transition-all duration-300 group-hover:opacity-100">
                  v2.1.0
                </span>
              </span>
            </div>
          </div>

          {/* ENHANCED Menu Toggle for Mobile with animations - ALWAYS VISIBLE but HIDDEN ON DESKTOP */}
          <button 
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="navLinksContainer"
            className={cn(
              "nav-menu-toggle fixed top-[14px] right-5 flex flex-col cursor-pointer border border-[var(--m-border)] p-[6px] rounded-[var(--m-radius)] transition-all duration-300 z-[1001] md:hidden",
              isOpen ? "bg-[rgba(0,40,0,0.4)] menu-active" : "bg-transparent"
            )}
            onClick={toggleMenu}
          >
            <div className={cn(
              "toggle-icon-container relative flex flex-col justify-between w-[24px] h-[16px] mb-[4px]",
              isOpen && "toggle-active"
            )}>
              <span className={cn(
                'toggle-line w-full h-[2px] bg-[var(--m-text)] transition-all duration-300',
                isOpen && 'transform rotate-45 translate-y-[7px]'
              )}></span>
              <span className={cn(
                'toggle-line w-full h-[2px] bg-[var(--m-text)] transition-all duration-200',
                isOpen ? 'opacity-0 w-0' : 'opacity-100'
              )}></span>
              <span className={cn(
                'toggle-line w-full h-[2px] bg-[var(--m-text)] transition-all duration-300',
                isOpen && 'transform -rotate-45 -translate-y-[7px]'
              )}></span>
              
              {/* Menu button glow effect */}
              {isOpen && (
                <div className="toggle-glow absolute inset-0 bg-[var(--m-text)] opacity-10 filter blur-[8px] rounded-full"></div>
              )}
            </div>
            <div className={cn(
              "toggle-label text-[0.65rem] text-center tracking-[1px] mt-[2px] transition-all duration-300 font-matrix-hacker",
              isOpen ? "text-[var(--m-text-bright)]" : "text-[var(--m-text-dim)]"
            )}>
              {isOpen ? "SYSTEM" : "MENU"}
            </div>
          </button>
          
          {/* Desktop Nav Links Container */}
          <div className="nav-links-container hidden md:flex items-center h-full gap-[30px] relative">
            {/* Enhanced links container */}
            <div className="nav-links flex items-center gap-[24px] h-full">
              {links.map((link, index) => {
                // Ensure only one link is truly active
                const isLinkActive = activeLink === link.text;
                const isHovered = hoverIndex === index;
                
                return (
                  <a 
                    key={`nav-link-${index}`}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link.text, e)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                      'nav-link flex items-center justify-center no-underline text-[0.9rem] tracking-wider relative h-full py-1 px-[12px] overflow-hidden transition-colors duration-250'
                    )}
                    data-active={isLinkActive}
                    aria-current={isLinkActive ? 'page' : undefined}
                  >
                    {/* Active Link Indicator - only for truly active link */}
                    {isLinkActive && (
                      <span className="absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-[var(--m-text-bright)] to-transparent opacity-90" aria-hidden="true"></span>
                    )}
                    
                    {/* Hover Highlight */}
                    <span className={cn(
                      'absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-[var(--m-text)] to-transparent opacity-70 transform origin-center transition-all duration-500 ease-out',
                      isHovered ? 'scale-x-100' : 'scale-x-0'
                    )} aria-hidden="true"></span>
                    
                    {/* Subtle Hover Glow Effect */}
                    <span className={cn(
                      'absolute inset-0 rounded-sm bg-[var(--m-text)] opacity-0 transition-opacity duration-300',
                      isHovered && 'opacity-5'
                    )} aria-hidden="true"></span>
                    
                    {/* Content Container */}
                    <div className="flex items-center justify-center relative z-10 transition-colors duration-300 ease-out">
                      <span className={cn(
                        'link-number text-[0.7rem] mr-[6px] transition-colors duration-300',
                        isLinkActive ? 'text-[var(--m-text-bright)]' : 'text-[var(--m-text-dim)]'
                      )} aria-hidden="true">
                        {link.number}
                      </span>
                      <span className={cn(
                        'link-text transition-colors duration-300',
                        isLinkActive 
                          ? 'text-[var(--m-text-bright)] font-medium text-shadow-[0_0_8px_var(--m-glow)]' 
                          : isHovered 
                            ? 'text-[var(--m-text-bright)]' 
                            : 'text-[var(--m-text)]'
                      )}>
                        {link.text}
                        {/* Cursor character - always present but only visible for active links */}
                        <span className={cn(
                          "link-cursor ml-[2px] text-[var(--m-text)]",
                          isLinkActive 
                            ? "opacity-70 animate-[cursor-blink_0.7s_step-end_infinite]" 
                            : "opacity-0"
                        )} aria-hidden="true">
                          &gt;
                        </span>
                      </span>
                      
                      {/* GitHub icon */}
                      {link.text === 'GITHUB' && (
                        <svg 
                          className={cn(
                            'github-icon ml-[5px] transition-colors duration-300',
                            (isLinkActive || isHovered) ? 'stroke-[var(--m-text-bright)]' : 'stroke-[var(--m-text)]'
                          )} 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
            
            {/* Ultra-Clean Matrix Hacker Search Component */}
            <div className="nav-search ml-[15px]">
              <div className={cn(
                'matrix-search relative w-[240px] h-[34px]',
                searchGlitching && 'search-glitch'
              )}>
                {/* Clean search container */}
                <div className={cn(
                  'search-inner relative w-full h-full border border-matrix-border overflow-hidden transition-all duration-200',
                  searchFocused ? 'border-[var(--m-text)] shadow-[0_0_10px_rgba(0,255,65,0.1)]' : ''
                )}>
                  {/* Command Prompt */}
                  <span className="search-prompt absolute left-[10px] top-0 bottom-0 flex items-center text-[var(--m-text-dim)] tracking-wider font-matrix-hacker" aria-hidden="true">
                    &gt;
                  </span>
                  
                  {/* Search input wrapper */}
                  <div className="search-input-container relative z-10 h-full">
                    <input 
                      type="text" 
                      className="search-input w-full h-full bg-transparent border-none outline-none text-[var(--m-text-bright)] font-matrix-hacker text-[0.9rem] py-0 px-[25px] tracking-wide caret-[var(--m-text-bright)] placeholder:text-[var(--m-text-dim)] placeholder:opacity-70"
                      placeholder={searchFocused ? "_" : "Search the Matrix"}
                      value={searchValue}
                      onChange={handleSearchInput}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      aria-label="Search command"
                    />
                    
                    {/* Cursor for empty state */}
                    {searchFocused && !searchValue && (
                      <span className="empty-cursor absolute left-[25px] top-[10px] h-[14px] w-[7px] bg-[var(--m-text-bright)] opacity-80" aria-hidden="true"></span>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  {searchStatus !== 'IDLE' && (
                    <div className="search-status absolute right-[8px] top-0 bottom-0 flex items-center text-[0.7rem] tracking-wide font-matrix-hacker" aria-live="polite">
                      {searchStatus === 'READY' && (
                        <span className="text-[var(--m-text-dim)]">READY</span>
                      )}
                      
                      {searchStatus === 'SEARCHING' && (
                        <span className="text-[var(--m-text)]">
                          {`SCANNING${'.'.repeat(Math.floor(Date.now() / 500) % 4)}`}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Active indicator line */}
                  {searchActive && (
                    <div className="search-indicator absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--m-text)] opacity-50"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Circuit traces pattern */
        .circuit-traces {
          background-image: 
            radial-gradient(circle at 10% 90%, rgba(0, 255, 65, 0.07) 1px, transparent 1px),
            radial-gradient(circle at 80% 10%, rgba(0, 255, 65, 0.07) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 255, 65, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 65, 0.05) 1px, transparent 1px);
          background-size: 20px 20px, 20px 20px, 10px 10px, 10px 10px;
          background-position: 0 0, 0 0, 0 0, 0 0;
        }
        
        /* Ultra clean search styling */
        .matrix-search {
          font-family: var(--m-font-hacker);
        }
        
        .search-inner {
          background-color: rgba(0, 5, 0, 0.2);
        }
        
        .search-inner:focus-within {
          background-color: rgba(0, 10, 0, 0.3);
        }
        
        /* Clean empty cursor blink */
        .empty-cursor {
          animation: cursor-blink 0.8s step-end infinite;
        }
        
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }
        
        /* Ultra subtle glitch effect */
        .search-glitch {
          animation: search-glitch 0.12s ease-in-out;
        }
        
        @keyframes search-glitch {
          0%, 100% { transform: translateX(0); }
          33% { transform: translateX(-1px); }
          66% { transform: translateX(1px); }
        }
        
        /* Logo styling */
        .logo-text-container {
          position: relative;
          overflow: hidden;
          padding: 0 1px;
        }
        
        .logo-text {
          text-shadow: 0 0 15px var(--m-glow);
          color: var(--m-text-bright);
          position: relative;
          letter-spacing: 1px;
          transform: translateZ(0);
        }
        
        /* Enhanced glitch with displacement */
        .logo-text.glitching {
          text-shadow: 0 0 20px var(--m-glow), 0 0 30px var(--m-glow);
          animation: text-flicker 0.2s ease-in-out;
        }
        
        .logo-text.logo-hovered {
          letter-spacing: 1.5px;
          transition: letter-spacing 0.3s ease-out;
        }
        
        /* Logo scanning effect */
        .logo-scan-line {
          transition: left 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .logo-scan-line.scan-active {
          left: 100%;
          transition: left 1.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        /* Enhanced brackets with data pulse */
        .logo-bracket {
          position: relative;
        }
        
        .logo-bracket.bracket-active {
          color: var(--m-text-bright);
          opacity: 0.95;
          text-shadow: 0 0 10px var(--m-glow);
        }
        
        .data-pulse {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: var(--m-text);
          opacity: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .bracket-active .data-pulse {
          animation: data-pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes data-pulse {
          0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Status indicator enhancements */
        .status-dot-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .status-pulse {
          animation-duration: 2s;
        }
        
        .status-version {
          font-size: 0.65rem;
          white-space: nowrap;
          pointer-events: none;
          z-index: 20;
        }

        /* Menu toggle styling */
        .nav-menu-toggle {
          box-shadow: 0 0 5px rgba(0, 255, 65, 0.1);
          width: 40px;
          height: 42px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 10, 5, 0.8);
        }
        
        .nav-menu-toggle:hover {
          box-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
          border-color: var(--m-text);
        }
        
        .toggle-line {
          transform-origin: center;
          box-shadow: 0 0 2px rgba(0, 255, 65, 0.2);
        }
        
        .toggle-active .toggle-line {
          background-color: var(--m-text-bright);
        }
        
        /* Clean button corners with subtle indicators */
        .nav-menu-toggle::before,
        .nav-menu-toggle::after {
          content: "";
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: var(--m-text);
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        
        .nav-menu-toggle::before {
          top: -1px;
          right: -1px;
        }
        
        .nav-menu-toggle::after {
          bottom: -1px;
          left: -1px;
        }
        
        .nav-menu-toggle:hover::before,
        .nav-menu-toggle:hover::after {
          opacity: 0.9;
          background-color: var(--m-text-bright);
        }
        
        /* Terminal typing animation with width adjustment */
        .terminal-command {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 1.5s steps(20, end);
          width: 100%;
          display: inline-block;
        }
        
        .system-status {
          max-width: 100%;
        }
        
        @media (max-width: 340px) {
          .system-status {
            font-size: 0.7rem;
          }
        }
        
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        
        /* ENHANCED MOBILE MENU STYLES */
        
        /* Digital grid pattern for menu background */
        .menu-container {
          background-image: 
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: 0 0;
        }
        
        /* Enhanced menu animations */
        .menu-glitch-effect {
          animation: menu-glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes menu-glitch {
          0%, 100% { transform: translateX(0); opacity: 1; }
          10% { transform: translateX(-10px); opacity: 0.8; }
          20% { transform: translateX(8px); opacity: 0.9; }
          30% { transform: translateX(-6px); opacity: 1; }
          40% { transform: translateX(4px); opacity: 0.9; }
          50% { transform: translateX(-2px); opacity: 1; }
          60% { transform: translateX(0); opacity: 0.9; }
        }
        
        .menu-entering {
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .menu-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Hover effects */
        .mobile-nav-link:hover {
          background-color: rgba(0, 255, 65, 0.05);
        }
        
        /* Enhanced text flicker animation */
        @keyframes text-flicker {
          0%, 100% { opacity: 1; transform: translateX(0); }
          10% { opacity: 0.9; transform: translateX(1px); }
          20% { opacity: 1; transform: translateX(-1px); }
          30% { opacity: 0.9; transform: translateX(0); }
          40% { opacity: 0.95; transform: translateX(1px); }
          50% { opacity: 1; transform: translateX(-1px); }
          60% { opacity: 0.95; transform: translateX(0); }
          70% { opacity: 1; transform: translateX(1px); }
          80% { opacity: 0.9; transform: translateX(-1px); }
          90% { opacity: 1; transform: translateX(0); }
        }

        /* Glitch line effect */
        .nav-glitch-line::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(0, 255, 65, 0.1), transparent);
          transform: skewX(-20deg);
          animation: glitch-line 5s infinite linear;
          will-change: transform;
        }

        @keyframes glitch-line {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

        /* Scanline effect */
        .nav-scanline::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
          pointer-events: none;
        }

        /* Cursor blink effect */
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        
        /* Nav link styling */
        .nav-link {
          position: relative;
          margin: 0 2px;
          border-radius: 0;
          transition: color 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
          will-change: color, opacity;
        }
        
        /* Stable text elements */
        .link-text, .link-number {
          position: relative;
          z-index: 2;
          transform: translateZ(0);
          will-change: color;
        }
        
        /* Click animation */
        .nav-link-clicked {
          animation: link-click 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        
        @keyframes link-click {
          0%, 100% { opacity: 1; }
          40% { opacity: 0.9; }
          60% { opacity: 1; }
        }
        
        /* Data glitch animation on hover */
        .nav-link:hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(0, 255, 65, 0) 0%,
            rgba(0, 255, 65, 0.05) 30%, 
            rgba(0, 255, 65, 0.05) 70%,
            rgba(0, 255, 65, 0) 100%
          );
          opacity: 0;
          animation: data-glitch 2s ease-in-out infinite;
          pointer-events: none;
          z-index: -1;
          will-change: opacity, transform;
        }
        
        @keyframes data-glitch {
          0% { opacity: 0; transform: translateX(-100%); }
          40% { opacity: 0.8; }
          60% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </>
  );
});

MatrixNavbar.displayName = 'MatrixNavbar';

export default MatrixNavbar;