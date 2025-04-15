import React, { useState } from 'react';
import './ComponentTestPage.css';

// Import our Matrix components
// Uncomment the components you've implemented
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
        
              <ComponentSection title="Card with Terminal Effect">
                <div className="matrix-card card-terminal-effect" style={{ 
                  background: 'black', 
                  borderColor: 'var(--m-text)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-100%',
                    left: '0',
                    width: '100%',
                    height: '5px',
                    background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 65, 0.2), transparent)',
                    opacity: '0.6',
                    animation: 'scanline 3s linear infinite'
                  }}></div>
                  <div className="card-header" style={{ 
                    borderColor: 'var(--m-text)',
                    fontFamily: 'var(--m-font-hacker)'
                  }}>
                    TERMINAL ACCESS
                  </div>
                  <div className="card-body">
                    <div style={{ 
                      fontFamily: 'var(--m-font-hacker)', 
                      color: 'var(--m-text-bright)'
                    }}>
                      <div>> SYSTEM INITIALIZATION</div>
                      <div>> SECURITY PROTOCOLS ACTIVE</div>
                      <div>> AWAITING COMMAND INPUT...</div>
                      <div style={{ 
                        display: 'inline-block',
                        width: '0.5em',
                        height: '1em',
                        backgroundColor: 'var(--m-text)',
                        animation: 'cursor-blink 1s step-end infinite',
                        marginLeft: '2px',
                        verticalAlign: 'text-bottom'
                      }}></div>
                    </div>
                  </div>
                </div>
              </ComponentSection>
        
              <ComponentSection title="Card with Hexagonal Grid Pattern">
                <div className="matrix-card card-hex-grid" style={{
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 2.5l12.5 7.5v15L15 32.5 2.5 25V10L15 2.5z' stroke='rgba(0, 255, 65, 0.1)' fill='none' stroke-width='0.5' transform='translate(15, 15)'/%3E%3C/svg%3E\")",
                    opacity: '0.15',
                    zIndex: '-1'
                  }}></div>
                  <div className="card-header">Network Topology</div>
                  <div className="card-body">
                    <p>Security grid with hexagonal mapping protocol.</p>
                    <p>All nodes connected and operational.</p>
                  </div>
                </div>
              </ComponentSection>
            </div>
          );
      case 'inputs':
        return (
          <div className="tab-content">
            <ComponentSection title="Text Inputs">
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="default-input">Default Input</label>
                  <input 
                    type="text" 
                    id="default-input" 
                    className="matrix-input"
                    placeholder="Enter text here" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="disabled-input">Disabled Input</label>
                  <input 
                    type="text" 
                    id="disabled-input" 
                    className="matrix-input"
                    placeholder="Disabled" 
                    disabled
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="with-icon">Input with Icon</label>
                  <div className="input-with-icon">
                    <span className="input-icon">⌕</span>
                    <input 
                      type="text" 
                      id="with-icon" 
                      className="matrix-input"
                      placeholder="Search..." 
                    />
                  </div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Input Variants">
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="password-input">Password Input</label>
                  <input 
                    type="password" 
                    id="password-input" 
                    className="matrix-input"
                    placeholder="Enter password" 
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="number-input">Number Input</label>
                  <input 
                    type="number" 
                    id="number-input" 
                    className="matrix-input"
                    placeholder="0" 
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="textarea">Textarea</label>
                  <textarea 
                    id="textarea" 
                    className="matrix-input"
                    placeholder="Enter multiple lines of text" 
                    rows="3"
                  ></textarea>
                </div>
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

      case 'radios':
        return (
          <div className="tab-content">
            <ComponentSection title="Radio Button Variants">
              <div className="control-grid">
                <div className="control-group">
                  <label className="matrix-radio">
                    <input 
                      type="radio" 
                      name="demo" 
                      value="option1"
                      checked={radioValue === 'option1'}
                      onChange={() => setRadioValue('option1')}
                    />
                    <span className="radio-label">Option 1</span>
                  </label>
                  <div className="description">Standard radio button</div>
                </div>

                <div className="control-group">
                  <label className="matrix-radio">
                    <input 
                      type="radio" 
                      name="demo" 
                      value="option2"
                      checked={radioValue === 'option2'}
                      onChange={() => setRadioValue('option2')}
                    />
                    <span className="radio-label">Option 2</span>
                  </label>
                  <div className="description">Alternative selection</div>
                </div>

                <div className="control-group">
                  <label className="matrix-radio disabled">
                    <input 
                      type="radio" 
                      name="demo" 
                      value="option3"
                      disabled
                    />
                    <span className="radio-label">Option 3</span>
                  </label>
                  <div className="description">Disabled state</div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Radio Group">
              <div className="control-grid vertical">
                <div className="control-group">
                  <h4 className="group-label">Select Security Level:</h4>
                  <label className="matrix-radio">
                    <input type="radio" name="security" value="low" />
                    <span className="radio-label">Low - Basic Protection</span>
                  </label>
                  <label className="matrix-radio">
                    <input type="radio" name="security" value="medium" defaultChecked />
                    <span className="radio-label">Medium - Enhanced Security</span>
                  </label>
                  <label className="matrix-radio">
                    <input type="radio" name="security" value="high" />
                    <span className="radio-label">High - Maximum Protection</span>
                  </label>
                </div>
              </div>
            </ComponentSection>
          </div>
        );
      
      case 'selects':
        return (
          <div className="tab-content">
            <ComponentSection title="Select Dropdowns">
              <div className="input-grid">
                <div className="input-group">
                  <label htmlFor="default-select">Default Select</label>
                  <select 
                    id="default-select" 
                    className="matrix-select"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                  >
                    <option value="default">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="disabled-select">Disabled Select</label>
                  <select 
                    id="disabled-select" 
                    className="matrix-select"
                    disabled
                  >
                    <option>Disabled select</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="grouped-select">Grouped Options</label>
                  <select 
                    id="grouped-select" 
                    className="matrix-select"
                  >
                    <option value="">Select a protocol</option>
                    <optgroup label="Secure Protocols">
                      <option value="https">HTTPS</option>
                      <option value="ssh">SSH</option>
                      <option value="sftp">SFTP</option>
                    </optgroup>
                    <optgroup label="Legacy Protocols">
                      <option value="http">HTTP</option>
                      <option value="ftp">FTP</option>
                      <option value="telnet">Telnet</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </ComponentSection>
          </div>
        );

      case 'switches':
        return (
          <div className="tab-content">
            <ComponentSection title="Toggle Switches">
              <div className="control-grid">
                <div className="control-group">
                  <label className="matrix-switch">
                    <input 
                      type="checkbox" 
                      checked={switchOn}
                      onChange={() => setSwitchOn(!switchOn)}
                    />
                    <span className="switch-slider"></span>
                    <span className="switch-label">System Status</span>
                  </label>
                  <div className="description">Current state: {switchOn ? 'Online' : 'Offline'}</div>
                </div>

                <div className="control-group">
                  <label className="matrix-switch">
                    <input 
                      type="checkbox" 
                      defaultChecked
                    />
                    <span className="switch-slider"></span>
                    <span className="switch-label">Notifications</span>
                  </label>
                  <div className="description">Enabled by default</div>
                </div>

                <div className="control-group">
                  <label className="matrix-switch disabled">
                    <input 
                      type="checkbox" 
                      disabled
                    />
                    <span className="switch-slider"></span>
                    <span className="switch-label">Admin Mode</span>
                  </label>
                  <div className="description">Disabled state</div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Switch Sizes">
              <div className="control-grid">
                <div className="control-group">
                  <label className="matrix-switch sm">
                    <input type="checkbox" />
                    <span className="switch-slider"></span>
                    <span className="switch-label">Small Switch</span>
                  </label>
                </div>

                <div className="control-group">
                  <label className="matrix-switch md">
                    <input type="checkbox" />
                    <span className="switch-slider"></span>
                    <span className="switch-label">Medium Switch</span>
                  </label>
                </div>

                <div className="control-group">
                  <label className="matrix-switch lg">
                    <input type="checkbox" />
                    <span className="switch-slider"></span>
                    <span className="switch-label">Large Switch</span>
                  </label>
                </div>
              </div>
            </ComponentSection>
          </div>
        );

      case 'progress':
        return (
          <div className="tab-content">
            <ComponentSection title="Progress Bars">
              <div className="control-grid vertical">
                <div className="control-group">
                  <label>Default Progress ({progress}%)</label>
                  <div className="matrix-progress">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Success Progress</label>
                  <div className="matrix-progress">
                    <div className="progress-bar success" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Warning Progress</label>
                  <div className="matrix-progress">
                    <div className="progress-bar warning" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Danger Progress</label>
                  <div className="matrix-progress">
                    <div className="progress-bar danger" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Striped Progress</label>
                  <div className="matrix-progress">
                    <div className="progress-bar striped" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div className="control-group">
                  <label>Animated Progress</label>
                  <div className="matrix-progress">
                    <div className="progress-bar animated" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <MatrixButton variant="primary" onClick={toggleProgress}>
                  Update Progress
                </MatrixButton>
              </div>
            </ComponentSection>
          </div>
        );

      case 'alerts':
        return (
          <div className="tab-content">
            <ComponentSection title="Alert Variants">
              <div className="control-grid vertical">
                <div className="matrix-alert info">
                  <div className="alert-icon">ℹ</div>
                  <div className="alert-content">
                    <div className="alert-title">Information Alert</div>
                    <div className="alert-message">This is an informational message for the user.</div>
                  </div>
                </div>

                <div className="matrix-alert success">
                  <div className="alert-icon">✓</div>
                  <div className="alert-content">
                    <div className="alert-title">Success Alert</div>
                    <div className="alert-message">The operation completed successfully.</div>
                  </div>
                </div>

                <div className="matrix-alert warning">
                  <div className="alert-icon">⚠</div>
                  <div className="alert-content">
                    <div className="alert-title">Warning Alert</div>
                    <div className="alert-message">Please be cautious about this action.</div>
                  </div>
                </div>

                <div className="matrix-alert danger">
                  <div className="alert-icon">✕</div>
                  <div className="alert-content">
                    <div className="alert-title">Danger Alert</div>
                    <div className="alert-message">A critical error has occurred in the system.</div>
                  </div>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Dismissible Alert">
              <div className="control-grid vertical">
                {showAlert && (
                  <div className="matrix-alert info dismissible">
                    <div className="alert-icon">ℹ</div>
                    <div className="alert-content">
                      <div className="alert-title">Dismissible Alert</div>
                      <div className="alert-message">You can close this alert by clicking the X button.</div>
                    </div>
                    <button className="alert-close" onClick={() => setShowAlert(false)}>✕</button>
                  </div>
                )}

                {!showAlert && (
                  <MatrixButton variant="glitch" onClick={() => setShowAlert(true)}>
                    Show Alert
                  </MatrixButton>
                )}
              </div>
            </ComponentSection>
          </div>
        );

      case 'modals':
        return (
          <div className="tab-content">
            <ComponentSection title="Modal Dialog">
              <div className="control-grid vertical">
                <MatrixButton variant="neon" onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </MatrixButton>

                {isModalOpen && (
                  <div className="matrix-modal-backdrop">
                    <div className="matrix-modal">
                      <div className="modal-header">
                        <div className="modal-title">Matrix Modal</div>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
                      </div>
                      <div className="modal-body">
                        <p>This is a modal dialog box styled with the Matrix CSS theme.</p>
                        <p>You can use it to display important information or gather user input.</p>
                      </div>
                      <div className="modal-footer">
                        <MatrixButton variant="ghost" onClick={() => setIsModalOpen(false)}>
                          Cancel
                        </MatrixButton>
                        <MatrixButton variant="primary" onClick={() => setIsModalOpen(false)}>
                          Confirm
                        </MatrixButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ComponentSection>
          </div>
        );

      case 'badges':
        return (
          <div className="tab-content">
            <ComponentSection title="Badge Variants">
              <div className="flex-grid">
                <span className="matrix-badge">Default</span>
                <span className="matrix-badge primary">Primary</span>
                <span className="matrix-badge success">Success</span>
                <span className="matrix-badge warning">Warning</span>
                <span className="matrix-badge danger">Danger</span>
                <span className="matrix-badge info">Info</span>
              </div>
            </ComponentSection>

            <ComponentSection title="Badge Sizes">
              <div className="flex-grid">
                <span className="matrix-badge sm">Small</span>
                <span className="matrix-badge">Medium</span>
                <span className="matrix-badge lg">Large</span>
              </div>
            </ComponentSection>

            <ComponentSection title="Pill Badges">
              <div className="flex-grid">
                <span className="matrix-badge pill">Default</span>
                <span className="matrix-badge pill primary">Primary</span>
                <span className="matrix-badge pill success">Success</span>
                <span className="matrix-badge pill warning">Warning</span>
              </div>
            </ComponentSection>

            <ComponentSection title="Badge with Icons">
              <div className="flex-grid">
                <span className="matrix-badge">
                  <span className="badge-icon">✓</span> Verified
                </span>
                <span className="matrix-badge warning">
                  <span className="badge-icon">⚠</span> Attention
                </span>
                <span className="matrix-badge info">
                  <span className="badge-icon">ℹ</span> Info
                </span>
              </div>
            </ComponentSection>
          </div>
        );

      case 'tooltips':
        return (
          <div className="tab-content">
            <ComponentSection title="Tooltip Positions">
              <div className="tooltip-grid">
                <div className="tooltip-container">
                  <button className="matrix-button tooltip-trigger">
                    Tooltip Top
                  </button>
                  <div className="matrix-tooltip top">
                    This tooltip appears above the element
                  </div>
                </div>

                <div className="tooltip-container">
                  <button className="matrix-button tooltip-trigger">
                    Tooltip Right
                  </button>
                  <div className="matrix-tooltip right">
                    This tooltip appears to the right
                  </div>
                </div>

                <div className="tooltip-container">
                  <button className="matrix-button tooltip-trigger">
                    Tooltip Bottom
                  </button>
                  <div className="matrix-tooltip bottom">
                    This tooltip appears below the element
                  </div>
                </div>

                <div className="tooltip-container">
                  <button className="matrix-button tooltip-trigger">
                    Tooltip Left
                  </button>
                  <div className="matrix-tooltip left">
                    This tooltip appears to the left
                  </div>
                </div>
              </div>
            </ComponentSection>
          </div>
        );

      case 'tabs':
        return (
          <div className="tab-content">
            <ComponentSection title="Horizontal Tabs">
              <div className="matrix-tabs">
                <div className="tab-list">
                  <button className="tab-item active">Dashboard</button>
                  <button className="tab-item">Profile</button>
                  <button className="tab-item">Settings</button>
                  <button className="tab-item">Help</button>
                </div>
                <div className="tab-panel">
                  <h4>Dashboard Tab Content</h4>
                  <p>This is the content for the Dashboard tab panel.</p>
                  <p>You would typically display important metrics and information here.</p>
                </div>
              </div>
            </ComponentSection>

            <ComponentSection title="Vertical Tabs">
              <div className="matrix-tabs vertical">
                <div className="tab-list">
                  <button className="tab-item active">System</button>
                  <button className="tab-item">Network</button>
                  <button className="tab-item">Security</button>
                  <button className="tab-item">Updates</button>
                </div>
                <div className="tab-panel">
                  <h4>System Information</h4>
                  <p>This panel shows the System tab content in a vertical tab layout.</p>
                  <p>Vertical tabs are useful for forms with many sections or when horizontal space is limited.</p>
                </div>
              </div>
            </ComponentSection>
          </div>
        );

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