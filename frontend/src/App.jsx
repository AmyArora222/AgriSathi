import { useState, useCallback, useEffect } from "react";
import './App.css';
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import SimpleVoiceAssistant from './components/SimpleVoiceAssistant';
import DiseaseDetection from './components/DiseaseDetection';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDiseaseDetection, setShowDiseaseDetection] = useState(false);

  // Get LiveKit configuration from environment variables
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
  const token = import.meta.env.VITE_LIVEKIT_TOKEN;

    // Particles background functions
    const createParticle = useCallback((container) => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 150 + 75;
    
    const directionX = Math.cos(angle) * distance;
    const directionY = Math.sin(angle) * distance;
    
    const duration = Math.random() * 8 + 10;
    
    particle.style.animationDuration = duration + 's';
    particle.style.setProperty('--directionX', directionX + 'px');
    particle.style.setProperty('--directionY', directionY + 'px');
    
    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, duration * 1000);
  }, []);

  const initializeParticles = useCallback(() => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const interval = setInterval(() => {
      const container = document.getElementById('particles');
      if (container) {
        const particleCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < particleCount; i++) {
          setTimeout(() => createParticle(container), i * 100);
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [createParticle]);


  // Initialize particles when component mounts
  useEffect(() => {
    const cleanup = initializeParticles();
    return cleanup;
  }, [initializeParticles]);

  // Handler for connecting to LiveKit
  const handleConnect = useCallback(() => {
    if (loading || isConnected) return;

    if (!serverUrl) {
      setError("Missing VITE_LIVEKIT_URL in environment variables");
      return;
    }

    if (!token) {
      setError("Missing VITE_LIVEKIT_TOKEN in environment variables");
      return;
    }

    setLoading(true);
    setError(null);
    setIsConnected(true);
  }, [loading, isConnected, serverUrl, token]);

  // Handler for disconnection
  const handleDisconnected = useCallback(() => {
    console.log('Disconnected from LiveKit room');
    setIsConnected(false);
    setLoading(false);
    setError(null);
  }, []);

  // Handler for successful connection
  const handleConnected = useCallback(() => {
    console.log('Successfully connected to LiveKit room');
    setLoading(false);
    setError(null);
  }, []);

  // Handler for connection errors
  const handleConnectionError = useCallback((error) => {
    console.error('LiveKit connection error:', error);
    setError(`Connection failed: ${error.message}`);
    setLoading(false);
    setIsConnected(false);
  }, []);

  // Handler for navigating to disease detection
  const handleShowDiseaseDetection = useCallback(() => {
    setShowDiseaseDetection(true);
  }, []);

  // Handler for returning to home from disease detection
  const handleBackToHome = useCallback(() => {
    setShowDiseaseDetection(false);
  }, []);

  // Get appropriate CSS classes for orb state
  const getOrbClasses = () => {
    let classes = "voice-orb";
    if (loading) classes += " loading";
    if (isConnected) classes += " active";
    return classes;
  };

  // Get status text based on current state
  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isConnected) return "Connected - Speaking with AI Assistant";
    if (loading) return "Connecting...";
    return "Click the orb to connect";
  };

  // Show disease detection page
  if (showDiseaseDetection) {
    return <DiseaseDetection onBackToHome={handleBackToHome} />;
  }

  // Render the main landing page
  if (!isConnected) {
    return (
      <div className="container">
        <div className="particles-container" id="particles"></div>
        <div className="main-content">
          <div className="voice-interface">
            <div
              className="voice-orb-container"
              onClick={handleConnect}
              style={{ cursor: (!isConnected && !loading) ? "pointer" : "default" }}
            >
              <div className={getOrbClasses()} id="voiceOrb">
                <div className="orb-inner"></div>
                <div className="orb-glow"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring pulse-ring-2"></div>
              </div>
            </div>

            <div className="status-text" id="statusText">
              {getStatusText()}
            </div>

            {error && (
              <div className="error-message" style={{
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                padding: '10px',
                borderRadius: '5px',
                margin: '10px 0',
                color: '#ff4757',
                textAlign: 'center',
                maxWidth: '400px'
              }}>
                {error}
              </div>
            )}
          </div>

          <div className="talk-button-container">
            <button
              className="talk-button"
              id="talkButton"
              onClick={handleConnect}
              disabled={loading || isConnected || !serverUrl || !token}
            >
              <svg className="mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              <span className="button-text">
                {loading ? "CONNECTING..." :
                  (!serverUrl || !token) ? "CONFIG MISSING" :
                    "CLICK TO TALK"}
              </span>
            </button>

            <button
              className="talk-button"
              id="talkButton"
              onClick={handleShowDiseaseDetection}
            >
              <span className="button-text">
                DISEASE DETECTION
              </span>
            </button>

          </div>
        </div>

        <div className="connection-status" id="connectionStatus">
          <div className={`status-dot ${isConnected ? "connected" : "disconnected"}`}></div>
          <span className="status-label">{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>
    );
  }

  // Render the LiveKit room when connected
  return (
    <div className="container">
      <div className="main-content">
        <LiveKitRoom
          serverUrl={serverUrl}
          token={token}
          connect={true}
          video={false}
          audio={true}
          onConnected={handleConnected}
          onDisconnected={handleDisconnected}
          onError={handleConnectionError}
        >
          <RoomAudioRenderer />
          <SimpleVoiceAssistant />

          <div className="disconnect-controls" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
          }}>
            <button
              onClick={handleDisconnected}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ff4757',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Disconnect
            </button>
          </div>
        </LiveKitRoom>

        <div className="connection-status" id="connectionStatus">
          <div className={`status-dot ${isConnected ? "connected" : "disconnected"}`}></div>
          <span className="status-label">Connected</span>
        </div>
      </div>
    </div>
  );
}

export default App;
