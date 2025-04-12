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
  
  // State for enhanced search experience
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchGlitching, setSearchGlitching] = useState(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef<HTMLElement>(null);

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

  // Enhanced search handlers with glitch effects
  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
    setSearchStatus('READY');
    
    // Trigger quick glitch effect on focus
    setSearchGlitching(true);
    setTimeout(() => setSearchGlitching(false), 150);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setSearchFocused(false);
    
    // Delay setting status to IDLE for visual effect
    setTimeout(() => {
      if (!searchValue) {
        setSearchStatus('IDLE');
        setSearchActive(false);
      }
    }, 300);
  }, [searchValue]);

  const handleSearchInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Set active state for animations
    setSearchActive(!!value);
    
    // Update search status with slight randomized delay for terminal effect
    if (value.length > 0) {
      setTimeout(() => {
        setSearchStatus('SEARCHING');
      }, Math.random() * 200 + 100);
      
      // Occasionally trigger glitch effect during typing
      if (Math.random() > 0.7) {
        setSearchGlitching(true);
        setTimeout(() => setSearchGlitching(false), 100);
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
  }, []);

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

  // Toggle mobile menu
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <nav
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
            
            {/* Enhanced cursor with glow */}
            <span className="logo-cursor-container relative ml-[5px]" aria-hidden="true">
              <span className="logo-cursor animate-[cursor-blink_1s_step-end_infinite] text-[var(--m-text)]">_</span>
              <span className="cursor-glow absolute inset-0 filter blur-[4px] opacity-30 text-[var(--m-text)] animate-pulse"></span>
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
        
        {/* Menu Toggle for Mobile */}
        <button 
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="navLinksContainer"
          className="nav-menu-toggle flex cursor-pointer border border-[var(--m-border)] p-[6px] rounded-[var(--m-radius)] bg-transparent transition-colors duration-300 z-[1001] md:hidden"
          onClick={toggleMenu}
        >
          <div className="toggle-icon flex flex-col justify-between w-[24px] h-[16px]">
            <span className={cn('w-full h-[2px] bg-[var(--m-text)] transition-all duration-300', isOpen && 'transform rotate-45 translate-y-[7px]')}></span>
            <span className={cn('w-full h-[2px] bg-[var(--m-text)] transition-all duration-200', isOpen ? 'opacity-0 w-0' : 'opacity-100')}></span>
            <span className={cn('w-full h-[2px] bg-[var(--m-text)] transition-all duration-300', isOpen && 'transform -rotate-45 -translate-y-[7px]')}></span>
          </div>
          <div className="toggle-label text-[0.6rem] text-[var(--m-text-dim)] tracking-[1px] mt-[2px]">MENU</div>
        </button>
        
        {/* Nav Links Container */}
        <div 
          id="navLinksContainer"
          className={cn(
            'nav-links-container flex items-center h-full gap-[30px] relative md:static backdrop-blur-[2px]',
            isOpen ? 'fixed top-[70px] left-0 right-0 h-[calc(100vh-70px)] flex-col items-start gap-[15px] py-0 px-5 bg-[rgba(0,10,2,0.95)] border-b border-matrix-border z-[999] overflow-y-auto' : 'hidden md:flex'
          )}
        >
          
          {/* Enhanced links container */}
          <div className="nav-links flex md:flex-row flex-col items-start md:items-center gap-[15px] md:gap-[24px] h-full w-full md:w-auto py-[20px] md:py-0">
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
                    'nav-link flex items-center justify-center no-underline text-[0.9rem] tracking-wider relative h-full py-1 px-[12px] overflow-hidden transition-colors duration-250 w-full md:w-auto md:border-none',
                    isOpen && 'pb-[12px]'
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
          
          {/* Enhanced Matrix Search Component */}
          <div className="nav-search ml-0 mb-[20px] md:ml-[15px] md:mb-0 w-full md:w-auto">
            <div className={cn(
              'search-container relative w-full md:w-[240px] h-[40px] md:h-[34px] border-2 border-matrix-border bg-[rgba(0,10,0,0.75)] overflow-hidden transition-all duration-300',
              searchFocused ? 'search-container-active shadow-[0_0_15px_rgba(0,255,65,0.3)]' : '',
              searchGlitching ? 'search-glitching' : '',
              searchActive ? 'search-active' : ''
            )}>
              {/* Matrix Scanline Effect */}
              <div className="search-scanline absolute inset-0 pointer-events-none z-0 opacity-20" aria-hidden="true"></div>
              
              {/* Animated Corner Accents */}
              <div className="search-corner-tl absolute top-0 left-0 w-[8px] h-[8px] border-t-2 border-l-2 border-[var(--m-text-bright)] opacity-80" aria-hidden="true"></div>
              <div className="search-corner-tr absolute top-0 right-0 w-[8px] h-[8px] border-t-2 border-r-2 border-[var(--m-text-bright)] opacity-80" aria-hidden="true"></div>
              <div className="search-corner-bl absolute bottom-0 left-0 w-[8px] h-[8px] border-b-2 border-l-2 border-[var(--m-text-bright)] opacity-80" aria-hidden="true"></div>
              <div className="search-corner-br absolute bottom-0 right-0 w-[8px] h-[8px] border-b-2 border-r-2 border-[var(--m-text-bright)] opacity-80" aria-hidden="true"></div>
              
              {/* Terminal Prefix */}
              <div className="search-terminal-prefix absolute left-[10px] top-0 bottom-0 flex items-center text-[var(--m-text-dim)] font-matrix-hacker text-[0.7rem] tracking-wider" aria-hidden="true">
                <span className="prefix-text">SYS://</span>
                <span className={cn(
                  'prefix-path ml-[2px] text-[var(--m-text)]',
                  searchStatus === 'SEARCHING' ? 'text-[var(--m-text-bright)]' : ''
                )}>
                  <span className="path-segment">matrix</span>
                  <span className="path-separator text-[var(--m-text-dim)]">&gt;</span>
                  <span className="path-segment">query</span>
                  <span className="path-separator text-[var(--m-text-dim)]">&gt;</span>
                </span>
              </div>
              
              {/* Search Input */}
              <div className="search-input-wrapper flex items-center h-full pl-[120px] pr-[60px] relative z-10">
                <input 
                  type="text" 
                  className="search-input w-full bg-transparent border-none outline-none text-[var(--m-text-bright)] font-matrix-hacker text-[0.9rem] tracking-wider p-0 caret-[var(--m-text-bright)] placeholder:text-[var(--m-text-dim)] placeholder:opacity-70"
                  placeholder={searchFocused ? "_" : "EXECUTE QUERY"}
                  value={searchValue}
                  onChange={handleSearchInput}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  aria-label="Search the Matrix"
                />
                
                {/* Blinking Cursor for Empty State */}
                {searchFocused && !searchValue && (
                  <span 
                    className="empty-cursor absolute left-[120px] h-[16px] w-[8px] bg-[var(--m-text)] opacity-70 animate-[cursor-blink_0.7s_step-end_infinite]" 
                    aria-hidden="true"
                  ></span>
                )}
              </div>
              
              {/* Enhanced Status Display */}
              <div className={cn(
                'search-status absolute right-[10px] top-0 bottom-0 flex items-center',
                'text-[0.7rem] font-matrix-hacker tracking-wider transition-all duration-300',
                searchStatus !== 'IDLE' ? 'opacity-100 text-[var(--m-text)]' : 'opacity-0'
              )} aria-live="polite">
                {searchStatus === 'READY' && (
                  <span className="status-ready flex items-center gap-[4px]">
                    <span className="status-indicator w-[6px] h-[6px] rounded-full bg-[var(--m-text-bright)] opacity-70 animate-pulse"></span>
                    <span>READY</span>
                  </span>
                )}
                
                {searchStatus === 'SEARCHING' && (
                  <span className="status-searching flex items-center gap-[4px]">
                    <span className="status-indicator w-[6px] h-[6px] rounded-full bg-[var(--m-text-bright)] opacity-70 animate-[search-pulse_0.5s_alternate_infinite]"></span>
                    <span className="status-text">{`SCANNING${'.'.repeat(Math.floor(Date.now() / 500) % 4)}`}</span>
                  </span>
                )}
              </div>
              
              {/* Data Pulse Effect */}
              <div className={cn(
                'data-pulse absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--m-text-dim)] transform origin-left scale-x-0 transition-transform duration-300',
                searchActive ? 'scale-x-100' : ''
              )} aria-hidden="true"></div>
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
        
        /* Enhanced Search Styles */
        .search-container {
          display: flex;
          align-items: center;
          position: relative;
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% calc(100% - 6px), 
            calc(100% - 6px) 100%, 
            0 100%
          );
          background-origin: border-box;
          background-clip: content-box, border-box;
          backdrop-filter: blur(1px);
          transform: translateZ(0); /* Force GPU acceleration */
        }
        
        .search-container-active {
          border-color: var(--m-text);
          background-color: rgba(0, 20, 5, 0.85);
        }
        
        .search-active .search-corner-tl,
        .search-active .search-corner-tr,
        .search-active .search-corner-bl,
        .search-active .search-corner-br {
          border-color: var(--m-text-bright);
          opacity: 1;
        }
        
        .search-glitching {
          animation: search-glitch 0.15s ease;
        }
        
        @keyframes search-glitch {
          0%, 100% { transform: translateX(0); filter: brightness(1); }
          20% { transform: translateX(-1px); filter: brightness(1.2); }
          40% { transform: translateX(1px); filter: brightness(0.9); }
          60% { transform: translateX(-1px); filter: brightness(1.2); }
          80% { transform: translateX(1px); filter: brightness(1); }
        }
        
        .search-corner-tl, 
        .search-corner-tr,
        .search-corner-bl,
        .search-corner-br {
          transition: all 0.3s ease;
          opacity: 0.5;
        }
        
        .search-container-active .search-corner-tl {
          animation: corner-tl 0.5s ease forwards;
        }
        
        .search-container-active .search-corner-tr {
          animation: corner-tr 0.5s ease forwards;
        }
        
        .search-container-active .search-corner-bl {
          animation: corner-bl 0.5s ease forwards;
        }
        
        .search-container-active .search-corner-br {
          animation: corner-br 0.5s ease forwards;
        }
        
        @keyframes corner-tl {
          0% { width: 8px; height: 8px; opacity: 0.5; }
          100% { width: 10px; height: 10px; opacity: 1; }
        }
        
        @keyframes corner-tr {
          0% { width: 8px; height: 8px; opacity: 0.5; }
          100% { width: 10px; height: 10px; opacity: 1; }
        }
        
        @keyframes corner-bl {
          0% { width: 8px; height: 8px; opacity: 0.5; }
          100% { width: 10px; height: 10px; opacity: 1; }
        }
        
        @keyframes corner-br {
          0% { width: 8px; height: 8px; opacity: 0.5; }
          100% { width: 10px; height: 10px; opacity: 1; }
        }
        
        .search-scanline {
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.05) 2px,
            rgba(0, 255, 65, 0.05) 4px
          );
          opacity: 0.2;
        }
        
        .search-container-active .search-scanline {
          opacity: 0.3;
          animation: scan-flicker 2s infinite ease-in-out;
        }
        
        @keyframes scan-flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.4; }
        }
        
        .data-pulse {
          height: 2px;
          transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .search-active .data-pulse {
          animation: data-flow 1.5s infinite linear;
          background: linear-gradient(
            90deg,
            var(--m-text-dim),
            var(--m-text-bright),
            var(--m-text-dim)
          );
          background-size: 200% 100%;
        }
        
        @keyframes data-flow {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        
        @keyframes search-pulse {
          0% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.1); }
        }
        
        /* Enhanced logo styling */
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
          transform: translateZ(0); /* Force GPU acceleration */
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
        
        /* Enhanced cursor */
        .logo-cursor-container {
          position: relative;
          display: inline-block;
        }
        
        .cursor-glow {
          pointer-events: none;
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
          will-change: transform; /* Optimize animation performance */
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
          will-change: color, opacity; /* Optimize hover transitions */
        }
        
        /* Stable text elements */
        .link-text, .link-number {
          position: relative;
          z-index: 2;
          transform: translateZ(0); /* Force GPU acceleration */
          will-change: color; /* Optimize color transitions */
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
          will-change: opacity, transform; /* Optimize animation performance */
        }
        
        @keyframes data-glitch {
          0% { opacity: 0; transform: translateX(-100%); }
          40% { opacity: 0.8; }
          60% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(100%); }
        }
        
        /* Empty cursor */
        .empty-cursor {
          animation: cursor-blink 0.8s step-end infinite;
        }
      `}</style>
    </nav>
  );
});

// Display name for debugging purposes
MatrixNavbar.displayName = 'MatrixNavbar';

export default MatrixNavbar;