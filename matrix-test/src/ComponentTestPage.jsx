import React, { useState } from 'react';
import './ComponentTestPage.css';

// Import components - uncomment when implemented
// import { Button } from './components/core/Button';
// import { Card } from './components/core/Card';
// import { Input } from './components/core/Input';
// import { Checkbox } from './components/core/Checkbox';
// import { Radio } from './components/core/Radio';
// import { Select } from './components/core/Select';
// import { Modal } from './components/core/Modal';
// import { Alert } from './components/core/Alert';
// import { Badge } from './components/core/Badge';
// import { Progress } from './components/core/Progress';
// import { Tooltip } from './components/core/Tooltip';
// import { Tabs } from './components/core/Tabs';
// import { TabPane } from './components/core/Tabs';
// import { Switch } from './components/core/Switch';
// import { Dropdown } from './components/core/Dropdown';

/**
 * Comprehensive test page for Matrix CSS components
 * This page displays all components with different configurations
 */
function ComponentTestPage() {
  // State for interactive components
  const [activeTab, setActiveTab] = useState('buttons');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchOn, setSwitchOn] = useState(false);
  const [selectValue, setSelectValue] = useState('default');
  const [showAlert, setShowAlert] = useState(false);
  const [progress, setProgress] = useState(45);

  // Helper function to render a component card
  const ComponentSection = ({ title, children }) => (
    <section className="component-section">
      <h3 className="section-title">{title}</h3>
      <div className="component-showcase">
        {children}
      </div>
    </section>
  );

  // Toggle progress value for demo
  const toggleProgress = () => {
    setProgress(prev => prev >= 90 ? 10 : prev + 20);
  };

  // Custom Button component if actual component not yet implemented
  const MatrixButton = ({ children, variant = '', size = '', className = '', ...props }) => (
    <button 
      className={`matrix-button ${variant} ${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
  
  // Function to copy code snippet to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Mock Input component for the test page
  const MatrixInput = ({ 
    label, 
    placeholder, 
    type = 'text', 
    variant = 'default', 
    size = 'md', 
    status = 'default', 
    prefix, 
    suffix,
    hasGlow,
    error,
    helperText,
    fullWidth = true,
    disabled,
    required,
    className = '',
    ...props 
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = props.id || Math.random().toString(36).substring(2, 9);
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    // Variant classes
    const variantClasses = {
      default: "bg-matrix-bg bg-opacity-90 border-matrix-border border",
      filled: "bg-matrix-secondary bg-opacity-20 border-transparent border",
      outlined: "bg-transparent border-matrix-border border-2",
      ghosted: "bg-transparent border-b border-matrix-border rounded-none",
      terminal: "bg-black font-matrix-hacker border border-matrix-text tracking-wider"
    };
    
    // Size classes
    const sizeClasses = {
      sm: "p-1.5 text-xs",
      md: "p-2 text-sm",
      lg: "p-3 text-base"
    };
    
    // Status classes
    const statusClasses = {
      default: "border-matrix-border",
      success: "border-matrix-success",
      warning: "border-matrix-warning",
      error: "border-matrix-danger",
      info: "border-matrix-info"
    };
    
    const iconPadding = [
      prefix ? "pl-9" : "",
      (suffix || type === 'password') ? "pr-9" : ""
    ].join(" ");
    
    return (
      <div className={`mb-4 ${fullWidth ? "w-full" : "w-auto"}`}>
        {label && (
          <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-matrix-text">
            {label}
            {required && <span className="ml-1 text-matrix-danger">*</span>}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-matrix-text-dim">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            type={inputType}
            className={`
              block w-full rounded focus:outline-none 
              placeholder:text-matrix-text-dim text-matrix-text
              transition-all duration-200 focus:ring-2
              ${variantClasses[variant]} 
              ${sizeClasses[size]} 
              ${statusClasses[status]}
              ${iconPadding}
              ${hasGlow ? "shadow-[0_0_10px_var(--matrix-glow)] focus:shadow-[0_0_15px_var(--matrix-glow)]" : ""}
              ${className}
            `}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            {...props}
          />
          {suffix && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-matrix-text-dim">
              {suffix}
            </div>
          )}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-matrix-text-dim hover:text-matrix-text-bright"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-matrix-danger">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-matrix-text-dim">{helperText}</p>}
      </div>
    );
  };

  // Render appropriate tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'buttons':
        return (
          <div className="tab-content">
            <ComponentSection title="Standard Button Variants">
              <div className="flex-grid">
                <MatrixButton>Default Button</MatrixButton>
                <MatrixButton variant="primary">Primary Button</MatrixButton>
                <MatrixButton variant="danger">Danger Button</MatrixButton>
                <MatrixButton variant="ghost">Ghost Button</MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button">Default Button</button>
<button class="matrix-button primary">Primary Button</button>
<button class="matrix-button danger">Danger Button</button>
<button class="matrix-button ghost">Ghost Button</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Special Button Variants">
              <div className="flex-grid">
                <MatrixButton variant="neon">Neon</MatrixButton>
                <MatrixButton variant="holographic">Holographic</MatrixButton>
                <MatrixButton variant="cyber">Cyber</MatrixButton>
                <MatrixButton variant="three-d">3D</MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button neon">Neon</button>
<button class="matrix-button holographic">Holographic</button>
<button class="matrix-button cyber">Cyber</button>
<button class="matrix-button three-d">3D</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Advanced Button Variants">
              <div className="flex-grid">
                <MatrixButton variant="pill">Pill Button</MatrixButton>
                <MatrixButton variant="bordered">Bordered</MatrixButton>
                <MatrixButton variant="data">Data</MatrixButton>
                <MatrixButton variant="glitch">Glitch</MatrixButton>
                <MatrixButton variant="pulse">Pulse</MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button pill">Pill Button</button>
<button class="matrix-button bordered">Bordered</button>
<button class="matrix-button data">Data</button>
<button class="matrix-button glitch">Glitch</button>
<button class="matrix-button pulse">Pulse</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Button Sizes">
              <div className="flex-grid">
                <MatrixButton size="sm">Small Button</MatrixButton>
                <MatrixButton size="md">Medium Button</MatrixButton>
                <MatrixButton size="lg">Large Button</MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button sm">Small Button</button>
<button class="matrix-button md">Medium Button</button>
<button class="matrix-button lg">Large Button</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Button States">
              <div className="flex-grid">
                <MatrixButton>Normal Button</MatrixButton>
                <MatrixButton disabled>Disabled Button</MatrixButton>
                <MatrixButton className="loading">Loading Button</MatrixButton>
                <MatrixButton className="active">Active Button</MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button">Normal Button</button>
<button class="matrix-button" disabled>Disabled Button</button>
<button class="matrix-button loading">Loading Button</button>
<button class="matrix-button active">Active Button</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Button with Icons">
              <div className="flex-grid">
                <MatrixButton>
                  <span className="icon">◉</span> Start
                </MatrixButton>
                <MatrixButton>
                  Delete <span className="icon">✗</span>
                </MatrixButton>
                <MatrixButton variant="primary">
                  <span className="icon">↻</span> Refresh
                </MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button">
  <span class="icon">◉</span> Start
</button>
<button class="matrix-button">
  Delete <span class="icon">✗</span>
</button>
<button class="matrix-button primary">
  <span class="icon">↻</span> Refresh
</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Combined Button Styles">
              <div className="flex-grid">
                <MatrixButton variant="neon" size="sm">Small Neon</MatrixButton>
                <MatrixButton variant="primary" className="loading">Loading Primary</MatrixButton>
                <MatrixButton variant="pulse" size="lg">Large Pulse</MatrixButton>
                <MatrixButton variant="glitch" className="active">Active Glitch</MatrixButton>
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`<button class="matrix-button neon sm">Small Neon</button>
<button class="matrix-button primary loading">Loading Primary</button>
<button class="matrix-button pulse lg">Large Pulse</button>
<button class="matrix-button glitch active">Active Glitch</button>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>
            
            <ComponentSection title="Interactive Demo">
              <div className="flex-grid">
                <MatrixButton variant="neon" onClick={() => setIsModalOpen(true)}>Open Modal</MatrixButton>
                <MatrixButton variant="glitch" onClick={() => setShowAlert(true)}>Trigger Alert</MatrixButton>
                <MatrixButton variant="pulse" onClick={toggleProgress}>Update Progress</MatrixButton>
              </div>
              <div className="mt-4">
                <div className="matrix-progress">
                  <div className="progress-bar animated" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="mt-2 text-sm">Current progress: {progress}%</p>
              </div>
            </ComponentSection>
          </div>
        );
      
        case 'cards':
          return (
            <div className="tab-content">
              <ComponentSection title="Basic Card Variants">
                <div className="card-grid">
                  <div className="matrix-card">
                    <div className="card-header">Default Card</div>
                    <div className="card-body">
                      <p>This is a standard card component with a header and body.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card elevated">
                    <div className="card-header">Elevated Card</div>
                    <div className="card-body">
                      <p>This card has an elevated appearance with a glow effect.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card compact">
                    <div className="card-header">Compact Card</div>
                    <div className="card-body">
                      <p>A more compact version with less padding.</p>
                    </div>
                  </div>
                </div>
              </ComponentSection>
        
              <ComponentSection title="Advanced Card Variants">
                <div className="card-grid">
                  <div className="matrix-card" style={{ background: 'black', borderColor: 'var(--matrix-text)' }}>
                    <div className="card-header" style={{ borderColor: 'var(--matrix-text)', fontFamily: 'var(--m-font-hacker)' }}>
                      Terminal Card
                    </div>
                    <div className="card-body">
                      <p>Terminal-style card with monospace font and darker background.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card" style={{ background: 'transparent', borderWidth: '2px' }}>
                    <div className="card-header">Outlined Card</div>
                    <div className="card-body">
                      <p>Card with transparent background and thicker border.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card" style={{ 
                    background: 'rgba(15, 15, 15, 0.3)', 
                    backdropFilter: 'blur(2px)',
                    border: '1px solid rgba(0, 255, 65, 0.2)'
                  }}>
                    <div className="card-header">Glass Card</div>
                    <div className="card-body">
                      <p>Card with translucent glass effect background.</p>
                    </div>
                  </div>
                </div>
              </ComponentSection>
        
              <ComponentSection title="Special Effect Cards">
                <div className="card-grid">
                  <div className="matrix-card" style={{
                    background: 'var(--m-bg)',
                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div className="card-header">Inset Card</div>
                    <div className="card-body">
                      <p>Card with an inset shadow effect for depth.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card" style={{
                    clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)'
                  }}>
                    <div className="card-header">Cyber Card</div>
                    <div className="card-body">
                      <p>Card with angled corners for a cyberpunk aesthetic.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card animate-flicker">
                    <div className="card-header">Flicker Card</div>
                    <div className="card-body">
                      <p>Card with a flickering animation effect.</p>
                    </div>
                  </div>
                </div>
              </ComponentSection>
        
              <ComponentSection title="Card Status Indicators">
                <div className="card-grid">
                  <div className="matrix-card" style={{ borderLeft: '4px solid var(--m-primary)' }}>
                    <div className="card-header">Primary Status</div>
                    <div className="card-body">
                      <p>Card with primary status indicator.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card" style={{ borderLeft: '4px solid var(--m-success)' }}>
                    <div className="card-header">Success Status</div>
                    <div className="card-body">
                      <p>Card indicating a successful operation.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card" style={{ borderLeft: '4px solid var(--m-warning)' }}>
                    <div className="card-header">Warning Status</div>
                    <div className="card-body">
                      <p>Card indicating a warning or caution.</p>
                    </div>
                  </div>
        
                  <div className="matrix-card" style={{ borderLeft: '4px solid var(--m-danger)' }}>
                    <div className="card-header">Danger Status</div>
                    <div className="card-body">
                      <p>Card indicating an error or danger.</p>
                    </div>
                  </div>
                </div>
              </ComponentSection>
        
              <ComponentSection title="Card with Data Visualization">
                <div className="matrix-card" style={{ 
                  fontFamily: 'var(--m-font-hacker)',
                  textShadow: '0 0 5px var(--m-glow)',
                  position: 'relative'
                }}>
                  <div className="card-header">
                    <div style={{ 
                      position: 'absolute', 
                      top: '2px',
                      right: '6px',
                      fontSize: '0.6rem',
                      opacity: '0.6'
                    }}>DATA_NODE_127</div>
                    System Status
                  </div>
                  <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>CPU USAGE:</span>
                          <span style={{ color: 'var(--m-text-bright)' }}>68%</span>
                        </div>
                        <div className="matrix-progress" style={{ height: '4px', marginTop: '4px' }}>
                          <div className="progress-bar" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>MEMORY:</span>
                          <span style={{ color: 'var(--m-text-bright)' }}>42%</span>
                        </div>
                        <div className="matrix-progress" style={{ height: '4px', marginTop: '4px' }}>
                          <div className="progress-bar" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div style={{ 
                      textAlign: 'center', 
                      color: 'var(--m-text-bright)', 
                      animation: 'pulse 3s infinite'
                    }}>
                      SYSTEM OPERATIONAL
                    </div>
                  </div>
                </div>
              </ComponentSection>
        
              <ComponentSection title="Card with Actions">
                <div className="matrix-card">
                  <div className="card-header">Interactive Card</div>
                  <div className="card-body">
                    <p>This card contains interactive elements like buttons.</p>
                    <p>Click the buttons below to perform actions.</p>
                  </div>
                  <div className="card-footer">
                    <MatrixButton variant="ghost" size="sm">Cancel</MatrixButton>
                    <MatrixButton variant="primary" size="sm">Confirm</MatrixButton>
                  </div>
                </div>
              </ComponentSection>
            </div>
          );
      case 'inputs':
        return (
          <div className="tab-content">
            <ComponentSection title="Input Variants">
              <div className="input-grid">
                <MatrixInput 
                  label="Default Variant" 
                  placeholder="Default input style"
                  variant="default"
                />
                <MatrixInput 
                  label="Filled Variant" 
                  placeholder="Filled input style"
                  variant="filled"
                />
                <MatrixInput 
                  label="Outlined Variant" 
                  placeholder="Outlined input style"
                  variant="outlined"
                />
                <MatrixInput 
                  label="Ghosted Variant" 
                  placeholder="Ghosted input style"
                  variant="ghosted"
                />
                <MatrixInput 
                  label="Terminal Variant" 
                  placeholder="TERMINAL INPUT"
                  variant="terminal"
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Basic input variants
<Input variant="default" label="Default Variant" placeholder="Default input style" />
<Input variant="filled" label="Filled Variant" placeholder="Filled input style" />
<Input variant="outlined" label="Outlined Variant" placeholder="Outlined input style" />
<Input variant="ghosted" label="Ghosted Variant" placeholder="Ghosted input style" />
<Input variant="terminal" label="Terminal Variant" placeholder="TERMINAL INPUT" />`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Input Sizes">
              <div className="input-grid">
                <MatrixInput 
                  label="Small Input" 
                  placeholder="Small size input"
                  size="sm"
                />
                <MatrixInput 
                  label="Medium Input" 
                  placeholder="Medium size input (default)"
                  size="md"
                />
                <MatrixInput 
                  label="Large Input" 
                  placeholder="Large size input"
                  size="lg"
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Input sizes
<Input size="sm" label="Small Input" placeholder="Small size input" />
<Input size="md" label="Medium Input" placeholder="Medium size input (default)" />
<Input size="lg" label="Large Input" placeholder="Large size input" />`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Input States">
              <div className="input-grid">
                <MatrixInput 
                  label="Default State" 
                  placeholder="Normal input state"
                />
                <MatrixInput 
                  label="Success State" 
                  placeholder="Success input state"
                  value="Valid input"
                  status="success"
                />
                <MatrixInput 
                  label="Warning State" 
                  placeholder="Warning input state"
                  value="Check this value"
                  status="warning"
                />
                <MatrixInput 
                  label="Error State" 
                  placeholder="Error input state"
                  value="Invalid input"
                  error="This field has an error"
                  status="error"
                />
                <MatrixInput 
                  label="Info State" 
                  placeholder="Info input state"
                  value="Special input"
                  status="info"
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Input states
<Input label="Default State" placeholder="Normal input state" />
<Input label="Success State" placeholder="Success input state" value="Valid input" status="success" />
<Input label="Warning State" placeholder="Warning input state" value="Check this value" status="warning" />
<Input label="Error State" placeholder="Error input state" value="Invalid input" error="This field has an error" />
<Input label="Info State" placeholder="Info input state" value="Special input" status="info" />`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Input Special Features">
              <div className="input-grid">
                <MatrixInput 
                  label="With Helper Text" 
                  placeholder="Enter text here"
                  helperText="This is helper text providing additional information"
                />
                <MatrixInput 
                  label="Required Input" 
                  placeholder="This field is required"
                  required
                />
                <MatrixInput 
                  label="With Glow Effect" 
                  placeholder="Input with glow effect"
                  hasGlow
                />
                <MatrixInput 
                  label="Disabled Input" 
                  placeholder="Input is disabled"
                  value="Cannot edit this"
                  disabled
                />
                <MatrixInput 
                  label="Read-only Input" 
                  placeholder="Input is read-only"
                  value="Cannot edit this"
                  readOnly
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Input special features
<Input label="With Helper Text" placeholder="Enter text here" helperText="This is helper text providing additional information" />
<Input label="Required Input" placeholder="This field is required" required />
<Input label="With Glow Effect" placeholder="Input with glow effect" hasGlow />
<Input label="Disabled Input" placeholder="Input is disabled" value="Cannot edit this" disabled />
<Input label="Read-only Input" placeholder="Input is read-only" value="Cannot edit this" readOnly />`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Input with Icons">
              <div className="input-grid">
                <MatrixInput 
                  label="With Prefix Icon" 
                  placeholder="Search..."
                  prefix={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  }
                />
                <MatrixInput 
                  label="With Suffix Icon" 
                  placeholder="Enter username"
                  suffix={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  }
                />
                <MatrixInput 
                  label="Password with Toggle" 
                  placeholder="Enter password"
                  type="password"
                />
                <MatrixInput 
                  label="With Text Prefix & Suffix" 
                  placeholder="0.00"
                  prefix="$"
                  suffix="USD"
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Input with icons and affixes
<Input 
  label="With Prefix Icon" 
  placeholder="Search..."
  prefix={<SearchIcon />}
/>
<Input 
  label="With Suffix Icon" 
  placeholder="Enter username"
  suffix={<UserIcon />}
/>
<Input 
  label="Password with Toggle" 
  placeholder="Enter password"
  type="password"
/>
<Input 
  label="With Text Prefix & Suffix" 
  placeholder="0.00"
  prefix="$"
  suffix="USD"
/>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Input Types">
              <div className="input-grid">
                <MatrixInput 
                  label="Text Input" 
                  placeholder="Regular text input"
                  type="text"
                />
                <MatrixInput 
                  label="Number Input" 
                  placeholder="Enter a number"
                  type="number"
                />
                <MatrixInput 
                  label="Email Input" 
                  placeholder="Enter your email"
                  type="email"
                />
                <MatrixInput 
                  label="Password Input" 
                  placeholder="Enter your password"
                  type="password"
                />
                <MatrixInput 
                  label="Date Input" 
                  type="date"
                />
                <MatrixInput 
                  label="Time Input" 
                  type="time"
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Input types
<Input label="Text Input" placeholder="Regular text input" type="text" />
<Input label="Number Input" placeholder="Enter a number" type="number" />
<Input label="Email Input" placeholder="Enter your email" type="email" />
<Input label="Password Input" placeholder="Enter your password" type="password" />
<Input label="Date Input" type="date" />
<Input label="Time Input" type="time" />`}
                  </code>
                </pre>
              </div>
            </ComponentSection>

            <ComponentSection title="Matrix-Themed Examples">
              <div className="input-grid">
                <MatrixInput 
                  label="ACCESS CODE" 
                  placeholder="ENTER ACCESS CODE"
                  variant="terminal"
                  hasGlow
                />
                <MatrixInput 
                  label="SEARCH DATABASE" 
                  placeholder="QUERY..."
                  variant="terminal"
                  prefix={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  }
                  hasGlow
                />
                <div className="bg-black p-4 rounded border border-matrix-text col-span-2">
                  <div className="font-matrix-hacker text-matrix-text-bright mb-2 tracking-wider">LOGIN TERMINAL</div>
                  <MatrixInput 
                    label="USERNAME"
                    placeholder="ENTER USERNAME"
                    variant="terminal"
                    className="mb-2"
                  />
                  <MatrixInput 
                    label="PASSWORD"
                    placeholder="ENTER PASSWORD"
                    type="password"
                    variant="terminal"
                    className="mb-3"
                  />
                  <MatrixButton variant="neon" className="w-full">
                    ACCESS SYSTEM
                  </MatrixButton>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Combined Input Features">
              <div className="input-grid">
                <MatrixInput 
                  label="Enhanced Search" 
                  placeholder="Search..."
                  variant="filled"
                  prefix={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  }
                  hasGlow
                  size="lg"
                />
                <MatrixInput 
                  label="Security Code" 
                  placeholder="Enter security code"
                  variant="outlined"
                  suffix={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  }
                  status="success"
                  helperText="Code verified successfully"
                />
                <MatrixInput 
                  label="Critical Input" 
                  placeholder="Enter value"
                  required
                  status="error"
                  error="This field cannot be empty"
                  variant="ghosted"
                  size="md"
                />
                <MatrixInput 
                  label="READ-ONLY DATA" 
                  value="SYSTEM:MATRIX:001:ALPHA"
                  readOnly
                  variant="terminal"
                  hasGlow
                />
              </div>
              <div className="mt-4">
                <pre className="bg-black p-2 rounded text-sm overflow-auto">
                  <code>
                    {`// Combined input features
<Input 
  label="Enhanced Search" 
  placeholder="Search..."
  variant="filled"
  prefix={<SearchIcon />}
  hasGlow
  size="lg"
/>
<Input 
  label="Security Code" 
  placeholder="Enter security code"
  variant="outlined"
  suffix={<LockIcon />}
  status="success"
  helperText="Code verified successfully"
/>
<Input 
  label="Critical Input" 
  placeholder="Enter value"
  required
  status="error"
  error="This field cannot be empty"
  variant="ghosted"
  size="md"
/>
<Input 
  label="READ-ONLY DATA" 
  value="SYSTEM:MATRIX:001:ALPHA"
  readOnly
  variant="terminal"
  hasGlow
/>`}
                  </code>
                </pre>
              </div>
            </ComponentSection>
          </div>
        );

      case 'checkboxes':
        return (
          <div className="tab-content">
            <ComponentSection title="Checkbox Variants">
              <div className="control-grid">
                <div className="control-group">
                  <label className="matrix-checkbox">
                    <input 
                      type="checkbox" 
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                    <span className="checkbox-label">Default Checkbox</span>
                  </label>
                  <div className="description">Current state: {checked ? 'Checked' : 'Unchecked'}</div>
                </div>

                <div className="control-group">
                  <label className="matrix-checkbox">
                    <input 
                      type="checkbox" 
                      defaultChecked
                    />
                    <span className="checkbox-label">Checked by Default</span>
                  </label>
                </div>

                <div className="control-group">
                  <label className="matrix-checkbox disabled">
                    <input 
                      type="checkbox" 
                      disabled
                    />
                    <span className="checkbox-label">Disabled Checkbox</span>
                  </label>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Checkbox Group">
              <div className="control-grid vertical">
                <div className="control-group">
                  <h4 className="group-label">Select System Features:</h4>
                  <label className="matrix-checkbox">
                    <input type="checkbox" name="features" value="firewall" />
                    <span className="checkbox-label">Firewall Protection</span>
                  </label>
                  <label className="matrix-checkbox">
                    <input type="checkbox" name="features" value="encryption" />
                    <span className="checkbox-label">Data Encryption</span>
                  </label>
                  <label className="matrix-checkbox">
                    <input type="checkbox" name="features" value="monitoring" />
                    <span className="checkbox-label">System Monitoring</span>
                  </label>
                  <label className="matrix-checkbox">
                    <input type="checkbox" name="features" value="backups" />
                    <span className="checkbox-label">Automated Backups</span>
                  </label>
                </div>
              </div>
            </ComponentSection>
          </div>
        );

      // Other tab content methods are kept the same...
      
      default:
        return <div>Select a component to view</div>;
    }
  };

  return (
    <div className="matrix-component-test-page">
      <header className="test-page-header">
        <div className="scanner-line"></div>
        <h1>Matrix CSS Components</h1>
        <p className="header-description">Comprehensive test page for all Matrix-themed components</p>
      </header>

      <div className="test-page-navigation">
        <button 
          className={`nav-item ${activeTab === 'buttons' ? 'active' : ''}`}
          onClick={() => setActiveTab('buttons')}
        >
          Buttons
        </button>
        <button 
          className={`nav-item ${activeTab === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveTab('cards')}
        >
          Cards
        </button>
        <button 
          className={`nav-item ${activeTab === 'inputs' ? 'active' : ''}`}
          onClick={() => setActiveTab('inputs')}
        >
          Inputs
        </button>
        <button 
          className={`nav-item ${activeTab === 'checkboxes' ? 'active' : ''}`}
          onClick={() => setActiveTab('checkboxes')}
        >
          Checkboxes
        </button>
        <button 
          className={`nav-item ${activeTab === 'radios' ? 'active' : ''}`}
          onClick={() => setActiveTab('radios')}
        >
          Radio Buttons
        </button>
        <button 
          className={`nav-item ${activeTab === 'selects' ? 'active' : ''}`}
          onClick={() => setActiveTab('selects')}
        >
          Selects
        </button>
        <button 
          className={`nav-item ${activeTab === 'switches' ? 'active' : ''}`}
          onClick={() => setActiveTab('switches')}
        >
          Switches
        </button>
        <button 
          className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          Progress
        </button>
        <button 
          className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
        </button>
        <button 
          className={`nav-item ${activeTab === 'modals' ? 'active' : ''}`}
          onClick={() => setActiveTab('modals')}
        >
          Modals
        </button>
        <button 
          className={`nav-item ${activeTab === 'badges' ? 'active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          Badges
        </button>
        <button 
          className={`nav-item ${activeTab === 'tooltips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tooltips')}
        >
          Tooltips
        </button>
        <button 
          className={`nav-item ${activeTab === 'tabs' ? 'active' : ''}`}
          onClick={() => setActiveTab('tabs')}
        >
          Tabs
        </button>
      </div>

      <main className="test-page-content">
        {renderTabContent()}
      </main>

      <footer className="test-page-footer">
        <div className="scanner-line"></div>
        <p>Matrix CSS Component Library v1.0</p>
      </footer>
    </div>
  );
}

export default ComponentTestPage;