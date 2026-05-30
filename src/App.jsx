import React, { useState, useEffect } from 'react';
import './App.css';
import './relay-login.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [relayName, setRelayName] = useState('MyTestRelay');
  const [relayPubkey, setRelayPubkey] = useState('');
  const [hexValue, setHexValue] = useState('');
  const [showHexHint, setShowHexHint] = useState(false);
  const [checklistItems, setChecklistItems] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Load saved checklist state
    const savedChecklist = localStorage.getItem('checklistState');
    if (savedChecklist) {
      setChecklistItems(JSON.parse(savedChecklist));
    }

    // Load the Nostr login widget script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/relay-login/relay-login.js';
    document.body.appendChild(script);

    // Set up global handler for pubkey updates from the widget
    window.onNostrLogin = (pubkey) => {
      if (pubkey) {
        setRelayPubkey(pubkey);
        // If it's an npub, convert to hex
        if (pubkey.startsWith('npub1')) {
          try {
            const { decode } = window.nostr;
            const decoded = decode(pubkey);
            const hex = Buffer.from(decoded).toString('hex');
            setHexValue(hex);
            setShowHexHint(true);
          } catch (e) {
            console.error('Failed to decode npub:', e);
          }
        } else {
          setHexValue(pubkey);
          setShowHexHint(true);
        }
      }
    };

    return () => {
      document.body.removeChild(script);
      window.onNostrLogin = null;
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const updateCodeBlock = () => {
    // Code block updates automatically through state
  };

  const copyDeployCode = () => {
    const code = `Deploy this repository https://github.com/HiveTalk/swarm and please use the zeabur-dashboard branch. 

Name it ${relayName}. Automatically assign a zeabur domain to the ${relayName} service. 

Set the following environment variables.

RELAY_NAME="${relayName}"
RELAY_PUBKEY="${hexValue || relayPubkey}"`;
    
    navigator.clipboard.writeText(code);
    alert('Deployment prompt copied to clipboard!');
  };

  const toggleChecklistItem = (itemId) => {
    setChecklistItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCollapsible = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  useEffect(() => {
    // Save checklist state
    localStorage.setItem('checklistState', JSON.stringify(checklistItems));
  }, [checklistItems]);

  // Always use hexValue for the deploy code, ensure it's set
const getHexPubkey = () => {
  if (hexValue) return hexValue;
  if (relayPubkey.startsWith('npub1')) {
    try {
      const { decode } = window.nostr;
      const decoded = decode(relayPubkey);
      return Buffer.from(decoded).toString('hex');
    } catch (e) {
      console.error('Failed to decode npub:', e);
      return relayPubkey;
    }
  }
  return relayPubkey;
};

const deployCode = `Deploy this repository https://github.com/HiveTalk/swarm and please use the zeabur-dashboard branch. 

Name it ${relayName}. Automatically assign a zeabur domain to the ${relayName} service. 

Set the following environment variables.

RELAY_NAME="${relayName}"
RELAY_PUBKEY="${getHexPubkey()}"`;

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
          <h1>🚀 Deploy FREE Nostr Blossom Relay to Zeabur</h1>
          <p>One-Click Deployment Checklist & Configuration Guide</p>
        </header>

        <div className="content">
          <div className="section">
            <h2>📡 What is Swarm?</h2>
            <p style={{ marginBottom: '20px' }}>
              <strong>Swarm</strong> is a private Nostr relay with integrated Blossom media server for teams. 
              Control access via your domain's <code>.well-known/nostr.json</code>, configure user access or custom permissions,
              and sync media between relays via an embedded bouquet client. Works with any Nostr client. Includes a link to the 
              Curator client to help quickly check relay content and post notes. Default is badger db and filesystem for media, 
              but you can easily switch to a postgreSQL database and S3 storage for media.
            </p>
          </div>

          <div className="section">
            <h2>One-shot AI Deploy</h2>
            
            <div className="content">
              <p style={{ backgroundColor: '#312e81', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', borderRadius: '6px' }}>  
                <span style={{ color: 'white' }}><b>First, Sign up to the AI Dev ops platform here:</b></span>                     
                <a href="https://zeabur.com/referral?referralCode=bitkarrot&utm_source=bitkarrot&utm_campaign=oss">
                  <img src="/zeabur-img.png" width="150" alt="Deployed on Zeabur" style={{ display: 'block' }}/>
                </a>
              </p>
            </div>

            <div className="content">                
              <div className="input-group">
                <label htmlFor="relayName">Next, Pick a Relay Name, preferably one word:</label>
                <input 
                  type="text" 
                  id="relayName" 
                  className="input-field" 
                  placeholder="MyTestRelay" 
                  value={relayName}
                  onChange={(e) => setRelayName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="relayPubkey">Then, set a Relay Public Key (npub or HEX):</label>
                <div id="nostr-login-root"></div>
                <input 
                  type="text" 
                  id="relayPubkey" 
                  className="input-field" 
                  placeholder="Use the Nostr login widget above or enter npub1... or 64-character hex" 
                  value={relayPubkey}
                  onChange={(e) => {
                    setRelayPubkey(e.target.value);
                    if (e.target.value.startsWith('npub1')) {
                      try {
                        const { decode } = window.nostr;
                        const decoded = decode(e.target.value);
                        const hex = Buffer.from(decoded).toString('hex');
                        setHexValue(hex);
                        setShowHexHint(true);
                      } catch (e) {
                        console.error('Failed to decode npub:', e);
                      }
                    } else if (e.target.value.length === 64) {
                      setHexValue(e.target.value);
                      setShowHexHint(true);
                    } else {
                      setShowHexHint(false);
                    }
                  }}
                />
                {showHexHint && (
                  <div className="hex-hint">
                    Converted HEX: <span style={{ color: '#4ade80', fontFamily: 'monospace' }}>{hexValue}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="code-block">
              <pre><code>{deployCode}</code></pre>
            </div>
            
            <button className="copy-button" onClick={copyDeployCode}>
              <span>📋</span> Copy Deployment Prompt
            </button>

            <div className="content">
              <p style={{ marginTop: '20px' }}>Paste into Zebur.com's AI for deploy</p>
              <div className="video-wrapper">
                <iframe 
                  src="https://www.youtube-nocookie.com/embed/LULtcoJ5Uy4?si=oB21F060jMrXf9S6&start=63" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <ol style={{ marginTop: '30px' }}>
                <li>Wait until Deployed. Might take a while...Once the zeabur domain name is set, make sure the **BLOSSOM_URL** environment variable is set to the zeabur domain name provisioned.</li>
                <p style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <img src="/blossom.png" style={{ width: '100%', border: '1px solid #ccc' }} alt="blossom" />
                </p>
                <li>If you want to keep using the default settings please mount these volumes, so that the data is not wiped out every time you redeploy.</li>
                <p style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <img src="/volumes.png" style={{ width: '100%', border: '1px solid #ccc' }} alt="Volumes" />
                </p>
                <li>Verify your relay - <a href="#step-3">Jump to Step 3 below</a>.</li>
              </ol>
            </div>
          </div>

          <div className="section">
            <div className="collapsible-header" onClick={() => toggleCollapsible('zero-cost')}>
              <h2>💰 Zero Cost Relay</h2>
              <span className="collapsible-toggle">{expandedSections['zero-cost'] ? '▲' : '▼'}</span>
            </div>
            {expandedSections['zero-cost'] && (
              <div className="collapsible-content">
                <p>Running a Nostr relay doesn't have to be expensive. By leveraging the free tiers of several modern cloud platforms, you can host a fully functional Swarm relay for $0/month. This is made possible by the generous free usage limits provided by Zeabur and Tigris.</p>

                <div className="info">
                  <strong>Zeabur (Deployment & Hosting)</strong>
                  <p>Zeabur provides a free tier that is perfect for small relays. It includes enough resources to run the Swarm container and handle initial traffic without any cost.</p>
                  <img src="/pricing/zeabur free tier.png" style={{ width: '100%', borderRadius: '8px', margin: '10px 0' }} alt="Zeabur Pricing" />
                  <p><a href="https://zeabur.com/pricing" target="_blank" rel="noopener noreferrer">View Zeabur Pricing</a></p>
                </div>

                <div className="info">
                  <strong>Tigris (S3-Compatible Storage)</strong>
                  <p>For Blossom media storage, Tigris offers an S3-compatible API with a free tier including 5GB of storage and generous transfer limits.</p>
                  <img src="/pricing/tigris free tier.png" style={{ width: '100%', borderRadius: '8px', margin: '10px 0' }} alt="Tigris Pricing" />
                  <p><a href="https://www.tigrisdata.com/docs/pricing/" target="_blank" rel="noopener noreferrer">View Tigris Pricing</a></p>
                </div>

                <div className="warning">
                  <strong>Note:</strong> I am not associated with any of these companies. I simply wanted to share how it's possible to easily deploy a zero-cost relay for starters and show how easy the process can be.
                </div>
              </div>
            )}
          </div>

          <div className="content">
            <div className="section">
              <h2 style={{ marginBottom: '50px' }}>Manual Deployment Guide</h2>

              <div className="collapsible-header" onClick={() => toggleCollapsible('step1')}>
                <h2>🎯 Step 1: Initial Deployment</h2>
                <span className="collapsible-toggle">{expandedSections['step1'] ? '▲' : '▼'}</span>
              </div>
              {expandedSections['step1'] && (
                <div className="collapsible-content">
                  <div className="video-wrapper">
                    <iframe 
                      src="/setup-project.mp4"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  <ul className="checklist">
                    {[
                      'Go to your Zeabur.com dashboard',
                      'Click "Create New Project"',
                      'Select "Deploy from GitHub"',
                      'Enter repository URL: https://github.com/HiveTalk/swarm.git',
                      'Click "Deploy" with default settings',
                      'Wait for initial deployment to complete'
                    ].map((item, index) => (
                      <li 
                        key={index}
                        className={checklistItems[`step1-${index}`] ? 'checked' : ''}
                        onClick={() => toggleChecklistItem(`step1-${index}`)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="info">
                    <strong>ℹ️ Note:</strong> The initial deployment uses Badger DB and filesystem for Blossom media storage. This is fine for testing but should be configured for production use.
                  </div>
                </div>
              )}
            </div>

            <div className="section">
              <div className="collapsible-header" onClick={() => toggleCollapsible('step2')}>
                <h2>⚙️ Step 2: Configure Essential Environment Variables</h2>
                <span className="collapsible-toggle">{expandedSections['step2'] ? '▲' : '▼'}</span>
              </div>
              {expandedSections['step2'] && (
                <div className="collapsible-content">
                  <video width="100%" height="500" controls>
                    <source src="/variables.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <ul className="checklist">
                    {[
                      'Navigate to your Zeabur Project dashboard',
                      'Click on your deployed service',
                      'Go to "Variables" tab',
                      'Add/update the following required variables:'
                    ].map((item, index) => (
                      <li 
                        key={index}
                        className={checklistItems[`step2-${index}`] ? 'checked' : ''}
                        onClick={() => toggleChecklistItem(`step2-${index}`)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="env-vars">
                    <h3>Required Variables:</h3>
                    <div className="code-block">
                      <code>RELAY_NAME="Your Relay Name"
RELAY_PUBKEY="your_relay_public_key_here"
NPUB_DOMAIN="yourdomain.com" # optional if you have it, if not leave blank.
</code>
                    </div>
                  </div>
                  
                  <div className="warning">
                    <strong>⚠️ Important:</strong> The <code>NPUB_DOMAIN</code> should match your domain and reference the <code>/.well-known/nostr.json</code> file to indicate which users have access.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer>
          <p>© 2024 Nostr Relay Deployment Guide. Built with ❤️ for the Nostr community.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
