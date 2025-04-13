import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/utils/cn';

export interface TerminalProps {
  title?: string;
  prompt?: string;
  commands?: Record<string, (args: string[]) => string>;
  initialCommands?: string[];
  className?: string;
  height?: string;
  width?: string;
  allowUserInput?: boolean;
  readOnly?: boolean;
  showHeader?: boolean;
  autoFocus?: boolean;
  syntaxHighlighting?: boolean;
  typingEffect?: boolean;
  typingSpeed?: number;
  theme?: 'matrix' | 'dark' | 'light';
  fontSize?: string;
  fontFamily?: string;
  initialContent?: string;
  onCommand?: (command: string, output: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({
  title = 'Matrix Terminal',
  prompt = '>',
  commands = {},
  initialCommands = [],
  className,
  height = '400px',
  width = '100%',
  allowUserInput = true,
  readOnly = false,
  showHeader = true,
  autoFocus = false,
  syntaxHighlighting = true,
  typingEffect = false,
  typingSpeed = 50,
  theme = 'matrix',
  fontSize = '14px',
  fontFamily = 'var(--m-font-hacker)',
  initialContent = '',
  onCommand,
}) => {
  const [output, setOutput] = useState<string[]>(initialContent ? [initialContent] : []);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const defaultCommands = {
    help: () =>
      'Available commands: ' +
      Object.keys({
        ...defaultCommands,
        ...commands,
      }).join(', '),
    clear: () => {
      setOutput([]);
      return '';
    },
    echo: (args: string[]) => args.join(' '),
    date: () => new Date().toLocaleString(),
  };

  const allCommands = {
    ...defaultCommands,
    ...commands,
  };

  // Execute initial commands
  useEffect(() => {
    if (initialCommands.length > 0) {
      const executeInitialCommands = async () => {
        for (const cmd of initialCommands) {
          await executeCommand(cmd, true);
        }
      };
      executeInitialCommands();
    }
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Typing effect logic
  useEffect(() => {
    if (isTyping && typingText && typingIndex < typingText.length) {
      const timer = setTimeout(() => {
        setTypingIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timer);
    } else if (isTyping && typingIndex >= typingText.length) {
      setIsTyping(false);
      setOutput(prev => [...prev, typingText]);
      setTypingText('');
      setTypingIndex(0);
    }
  }, [isTyping, typingText, typingIndex, typingSpeed]);

  const typeOutput = async (text: string): Promise<void> => {
    if (typingEffect) {
      return new Promise((resolve) => {
        setTypingText(text);
        setTypingIndex(0);
        setIsTyping(true);
        
        // Set up a timer to resolve the promise after typing is complete
        const checkTypingComplete = setInterval(() => {
          if (!isTyping) {
            clearInterval(checkTypingComplete);
            resolve();
          }
        }, 100);
      });
    } else {
      // No typing effect, just add to output immediately
      setOutput(prev => [...prev, text]);
      return Promise.resolve();
    }
  };

  const executeCommand = async (input: string, isInitial = false): Promise<void> => {
    // Add command to output
    if (!isInitial || (isInitial && !typingEffect)) {
      setOutput(prev => [...prev, `${prompt} ${input}`]);
    } else if (isInitial && typingEffect) {
      await typeOutput(`${prompt} ${input}`);
    }

    // Process command
    const args = input.trim().split(' ');
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);
    
    let result = '';

    if (command === '') {
      // Do nothing for empty command
    } else if (command in allCommands) {
      try {
        result = allCommands[command](commandArgs);
        if (result) {
          if (typingEffect) {
            await typeOutput(result);
          } else {
            setOutput(prev => [...prev, result]);
          }
        }
      } catch (error) {
        const errorMessage = `Error executing command: ${error}`;
        setOutput(prev => [...prev, errorMessage]);
        result = errorMessage;
      }
    } else {
      const notFoundMessage = `Command not found: ${command}. Type 'help' for available commands.`;
      setOutput(prev => [...prev, notFoundMessage]);
      result = notFoundMessage;
    }

    // Add to history if not empty and not an initial command
    if (input.trim() && !isInitial) {
      setHistory(prev => [input, ...prev].slice(0, 50)); // Keep last 50 commands
    }

    // Call onCommand callback if provided
    if (onCommand && !isInitial) {
      onCommand(input, result);
    }

    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      // Navigate command history (older)
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate command history (newer)
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const focusInput = () => {
    if (allowUserInput && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format output with syntax highlighting
  const formatOutput = (text: string): React.ReactNode => {
    if (!syntaxHighlighting) return text;
    
    // Basic syntax highlighting
    if (text.startsWith(prompt)) {
      // Command line
      const commandPart = text.substring(prompt.length).trim();
      return (
        <>
          <span className="text-matrix-text-dim">{prompt}</span>{' '}
          <span className="text-matrix-text-bright">{commandPart}</span>
        </>
      );
    } else if (text.startsWith('Error') || text.includes('not found')) {
      // Error messages
      return <span className="text-matrix-danger">{text}</span>;
    } else if (text.match(/^(Available commands:|Usage:)/)) {
      // Help text
      return <span className="text-matrix-info">{text}</span>;
    } else if (text.match(/^[0-9\-/: ]+$/)) {
      // Date/time
      return <span className="text-matrix-success">{text}</span>;
    } else {
      // Regular output
      return text;
    }
  };

  // Apply theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-black',
          border: 'border-gray-800',
          text: 'text-gray-200',
          header: 'bg-gray-900',
        };
      case 'light':
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-800',
          header: 'bg-gray-200',
        };
      case 'matrix':
      default:
        return {
          bg: 'bg-[rgba(0,10,0,0.95)]',
          border: 'border-matrix-border',
          text: 'text-matrix-text',
          header: 'bg-[rgba(0,20,0,0.7)]',
        };
    }
  };
  
  const themeStyles = getThemeStyles();

  useEffect(() => {
    if (autoFocus) {
      focusInput();
    }
  }, [autoFocus]);

  return (
    <div
      className={cn(
        themeStyles.bg,
        themeStyles.border,
        'rounded overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5),0_0_10px_var(--m-glow)]',
        className
      )}
      onClick={focusInput}
      style={{ height, width, fontFamily }}
    >
      {showHeader && (
        <div className={cn('flex justify-between items-center p-2 border-b', themeStyles.header, themeStyles.border)}>
          <div className={cn('text-sm font-bold tracking-wider', themeStyles.text)}>{title}</div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
          </div>
        </div>
      )}

      <div className="p-4 h-full flex flex-col">
        <div
          ref={outputRef}
          className={cn('flex-1 overflow-y-auto mb-2 whitespace-pre-wrap', themeStyles.text)}
          style={{ fontSize }}
        >
          {output.map((line, i) => (
            <div key={i} className="mb-1 leading-tight">
              {formatOutput(line)}
            </div>
          ))}
          
          {/* Currently typing text with cursor */}
          {isTyping && (
            <div className="mb-1 leading-tight">
              {formatOutput(typingText.substring(0, typingIndex))}
              <span className="animate-[cursor-blink_1s_step-end_infinite] bg-matrix-text inline-block w-2 h-4 align-middle"></span>
            </div>
          )}
        </div>

        {allowUserInput && !readOnly && (
          <div className="flex items-center">
            <span className={cn('mr-2', theme === 'matrix' ? 'text-matrix-text-bright' : '')}>{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className={cn(
                'flex-1 bg-transparent border-none outline-none focus:text-matrix-text-bright caret-matrix-text',
                themeStyles.text
              )}
              style={{ fontSize }}
              aria-label="Terminal input"
            />
            <span className={cn('w-2.5 h-5 bg-matrix-text animate-[cursor-blink_1s_step-end_infinite]', theme !== 'matrix' && 'bg-current')}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;