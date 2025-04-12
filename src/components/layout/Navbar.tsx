import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import CodeRain from '@/components/effects/CodeRain';
import GlitchText from '@/components/effects/GlitchText';

interface MatrixNavbarProps {
  className?: string;
  containerFluid?: boolean;
  logoText?: string;
  statusText?: string;
  links?: Array<{
    number: string;
    text: string;
    href: string;
    isActive?: boolean;
  }>;
  disableRainEffect?: boolean;
  activeLink?: string;
}

export const MatrixNavbar: React.FC<MatrixNavbarProps> = ({
  className,
  containerFluid = false,
  logoText = 'MATRIX.CSS',
  statusText = 'SYSTEM ONLINE',
  links = [
    { number: '01', text: 'GETTING_STARTED', href: '#getting-started' },
    { number: '02', text: 'COMPONENTS', href: '#components' },
    { number: '03', text: 'UTILITIES', href: '#utilities' },
    { number: '04', text: 'EXAMPLES', href: '#examples' },
    { number: '05', text: 'GITHUB', href: 'https://github.com/elmackico93/matrix-css' },
  ],
  disableRainEffect = false,
  activeLink: propActiveLink,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchStatus, setSearchStatus] = useState('IDLE');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [logoGlitching, setLogoGlitching] = useState(false);
  const [activeLink, setActiveLink] = useState(propActiveLink || '');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
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
        setActiveLink(matchingLink.text);
      }
    }
  }, [links]);

  // Setup Matrix rain effect
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
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - mix of Latin and Japanese katakana
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    // Column settings
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    // Animation loop
    const draw = () => {
      // Semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set green text color
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      
      // Loop over each drop
      for (let i = 0; i < drops.length; i++) {
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
      
      requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [disableRainEffect]);

  // Handle search input
  const handleSearchFocus = () => {
    setSearchStatus('READY');
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 0) {
      setSearchStatus('SEARCHING');
    } else {
      setSearchStatus('READY');
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchStatus('IDLE');
    }, 200);
  };

  // Random glitch effect for logo
  useEffect(() => {
    const triggerRandomGlitch = () => {
      if (Math.random() > 0.85) {
        setLogoGlitching(true);
        
        setTimeout(() => {
          setLogoGlitching(false);
        }, Math.random() * 150 + 50);
      }
      
      // Schedule next glitch
      setTimeout(triggerRandomGlitch, Math.random() * 5000 + 3000);
    };
    
    triggerRandomGlitch();
  }, []);

  // Handle link click
  const handleLinkClick = (linkText: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    setActiveLink(linkText);
    
    // Add click effect to the link
    const target = e.currentTarget;
    target.classList.add('nav-link-clicked');
    
    // Random terminal key sound
    playHackerSound(0.05);
    
    // Remove the class after animation completes
    setTimeout(() => {
      target.classList.remove('nav-link-clicked');
    }, 300);
  };
  
  // Play hacker-style sound
  const playHackerSound = (volume = 0.03) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'square';
      oscillator.frequency.value = 100 + Math.random() * 600;
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 10 + Math.random() * 20);
    } catch (e) {
      // Audio context might not be available
    }
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 h-[70px] bg-[rgba(0,10,2,0.92)] border-b border-matrix-border backdrop-filter backdrop-blur-[10px] overflow-hidden transition-all duration-300 z-[1000]',
        isScrolled && 'shadow-[0_0_20px_rgba(0,0,0,0.7)]',
        className
      )}
    >
      {/* Digital Rain Background Effect */}
      {!disableRainEffect && (
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-70" />
      )}
      
      {/* Scanline Effect */}
      <div className="nav-scanline absolute inset-0 pointer-events-none z-[1]"></div>
      
      {/* Glitch Line Effect */}
      <div className="nav-glitch-line absolute inset-0 overflow-hidden pointer-events-none z-[4]"></div>
      
      {/* Bottom glowing line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--m-text-bright)] to-transparent opacity-60 z-[2]"></div>
      
      {/* Background panel for better contrast */}
      <div className="absolute inset-0 bg-[rgba(0,10,2,0.85)] z-[1]"></div>
      
      <div className={`nav-container max-w-[1400px] h-full mx-auto px-5 flex justify-between items-center relative z-[5] ${containerFluid ? 'w-full' : ''}`}>
        {/* Logo Section with Digital Animation */}
        <div className="nav-logo-container flex flex-col gap-1 relative">
          <a href="#" className="nav-logo flex items-center text-[1.5rem] font-bold text-[var(--m-text-bright)] no-underline tracking-[2px] relative">
            <span className="logo-bracket text-[1.6rem] opacity-70 relative top-[-2px]">[</span>
            <span className={`logo-text relative overflow-hidden font-matrix-hacker ${logoGlitching ? 'glitching' : ''}`}>
              {logoText}
            </span>
            <span className="logo-bracket text-[1.6rem] opacity-70 relative top-[-2px]">]</span>
            <span className="logo-cursor ml-[5px] animate-[cursor-blink_1s_step-end_infinite] text-[var(--m-text)]">_</span>
          </a>
          <div className="nav-status flex items-center text-[0.7rem] py-[2px] px-[6px] ml-[10px] rounded-[3px] bg-[rgba(0,255,65,0.05)] text-[var(--m-text-bright)]">
            <span className="status-dot w-[6px] h-[6px] bg-[var(--m-text-bright)] rounded-full opacity-90 mr-[5px]"></span>
            <span className="status-text text-shadow-[0_0_2px_rgba(0,255,65,0.4)]">{statusText}</span>
          </div>
        </div>
        
        {/* Menu Toggle for Mobile */}
        <div 
          className="nav-menu-toggle flex cursor-pointer border border-[var(--m-border)] p-[6px] rounded-[var(--m-radius)] bg-transparent transition-all duration-300 z-[1001] md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="toggle-icon flex flex-col justify-between w-[24px] h-[16px]">
            <span className={`w-full h-[2px] bg-[var(--m-text)] transition-all duration-300 ${isOpen ? 'transform rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`w-full h-[2px] bg-[var(--m-text)] transition-all duration-200 ${isOpen ? 'opacity-0 w-0' : 'opacity-100'}`}></span>
            <span className={`w-full h-[2px] bg-[var(--m-text)] transition-all duration-300 ${isOpen ? 'transform -rotate-45 -translate-y-[7px]' : ''}`}></span>
          </div>
          <div className="toggle-label text-[0.6rem] text-[var(--m-text-dim)] tracking-[1px] mt-[2px]">MENU</div>
        </div>
        
        {/* Nav Links Container - Removed the nav-decoration (green vertical line) div */}
        <div className={`nav-links-container flex items-center h-full gap-[30px] relative md:static backdrop-blur-[2px] ${isOpen ? 'fixed top-[70px] left-0 right-0 h-[calc(100vh-70px)] flex-col items-start gap-[15px] py-0 px-5 bg-[rgba(0,10,2,0.95)] border-b border-matrix-border z-[999] overflow-y-auto' : 'hidden md:flex'}`}>
          {/* Enhanced links container */}
          <div className="nav-links flex md:flex-row flex-col items-start md:items-center gap-[15px] md:gap-[24px] h-full w-full md:w-auto py-[20px] md:py-0">
            {links.map((link, index) => {
              const isLinkActive = link.isActive || activeLink === link.text;
              const isHovered = hoverIndex === index;
              
              return (
                <a 
                  key={index}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link.text, e)}
                  onMouseEnter={() => {
                    setHoverIndex(index);
                    playHackerSound(0.02);
                  }}
                  onMouseLeave={() => setHoverIndex(null)}
                  className={`nav-link flex items-center justify-center no-underline text-[0.9rem] tracking-wider relative h-full py-1 px-[12px] overflow-hidden transition-all duration-250 w-full md:w-auto md:border-none ${isOpen ? 'pb-[12px]' : 'pb-0'}`}
                  data-active={isLinkActive}
                >
                  {/* Changed the vertical indicator to a bottom glow for active link */}
                  {isLinkActive && (
                    <span className="absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-[var(--m-text-bright)] to-transparent opacity-90"></span>
                  )}
                  
                  {/* Improved hover highlight with gradient */}
                  <span className={`absolute bottom-0 left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-[var(--m-text)] to-transparent opacity-70 transform origin-center transition-all duration-500 ease-out ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}></span>
                  
                  {/* Content container */}
                  <div className={`flex items-center justify-center relative z-10 transition-all duration-300 ease-out ${isHovered ? 'transform translate-y-[-2px] text-shadow-[0_0_8px_var(--m-glow)]' : ''}`}>
                    <span className={`link-number text-[0.7rem] ${isLinkActive ? 'text-[var(--m-text-bright)]' : 'text-[var(--m-text-dim)]'} mr-[6px] transition-colors duration-300`}>
                      {link.number}
                    </span>
                    <span className={`link-text transition-all duration-300 ${isLinkActive 
                      ? 'text-[var(--m-text-bright)] font-medium text-shadow-[0_0_8px_var(--m-glow)]' 
                      : isHovered 
                        ? 'text-[var(--m-text-bright)]' 
                        : 'text-[var(--m-text)]'}`}>
                      {link.text}
                      {(isHovered || isLinkActive) && (
                        <span className="link-cursor ml-[2px] opacity-70 animate-[cursor-blink_0.7s_step-end_infinite]">_</span>
                      )}
                    </span>
                    
                    {/* GitHub icon */}
                    {link.text === 'GITHUB' && (
                      <svg className={`github-icon ml-[5px] transition-all duration-300 ${isLinkActive || isHovered ? 'stroke-[var(--m-text-bright)]' : 'stroke-[var(--m-text)]'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
          
          {/* Search Component */}
          <div className="nav-search ml-0 mb-[20px] md:ml-[15px] md:mb-0 w-full md:w-auto">
            <div className="search-container flex items-center relative w-full md:w-[200px] h-[40px] md:h-[30px] py-0 px-[10px] border border-[var(--m-border)] rounded-[var(--m-radius)] bg-[rgba(0,20,0,0.6)] overflow-hidden transition-all duration-200 focus-within:border-[var(--m-text)] focus-within:shadow-[0_0_15px_var(--m-glow)]">
              <span className="search-icon text-[1rem] text-[var(--m-text-dim)] mr-[8px] focus-within:text-[var(--m-text)]">⌕</span>
              <input 
                type="text" 
                className="search-input w-full bg-transparent border-none outline-none text-[var(--m-text)] font-[var(--m-font-main)] text-[0.8rem] p-0 caret-[var(--m-text)] placeholder:text-[var(--m-text-dim)] placeholder:opacity-70 placeholder:italic"
                placeholder="SEARCH SYSTEM..."
                value={searchValue}
                onChange={handleSearchInput}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <div className={`search-status absolute right-[10px] text-[0.65rem] text-[var(--m-text-dim)] transition-opacity duration-200 ${searchStatus !== 'IDLE' ? 'opacity-100' : 'opacity-0'}`}>
                {searchStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .logo-text {
          text-shadow: 0 0 15px var(--m-glow);
          color: var(--m-text-bright);
          position: relative;
          letter-spacing: 1px;
        }
        
        .logo-text.glitching {
          text-shadow: 0 0 20px var(--m-glow);
          animation: text-flicker 0.2s ease-in-out;
        }
        
        @keyframes text-flicker {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.9; }
          20% { opacity: 1; }
          30% { opacity: 0.9; }
          40% { opacity: 0.95; }
          50% { opacity: 1; }
          60% { opacity: 0.95; }
          70% { opacity: 1; }
          80% { opacity: 0.9; }
          90% { opacity: 1; }
        }

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
        }

        @keyframes glitch-line {
          0%   { left: -100%; }
          100% { left: 200%; }
        }

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

        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50%      { opacity: 1; }
        }
        
        /* Improved nav effects with more fluid animations */
        .nav-link {
          position: relative;
          margin: 0 2px;
          border-radius: 0;
          transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        /* Smoother click animation */
        .nav-link-clicked {
          animation: link-click 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        
        @keyframes link-click {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(0.97); }
          60% { transform: scale(1.03); }
          80% { transform: scale(1); }
        }
        
        /* Enhanced data glitch animation on hover */
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
          z-index: -1;
        }
        
        @keyframes data-glitch {
          0% { opacity: 0; transform: translateX(-100%); }
          40% { opacity: 0.8; }
          60% { opacity: 0.8; }
          100% { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </nav>
  );
};

export default MatrixNavbar;