import { useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";

/**
 * LiveKitModal Component
 * 
 * Provides a modal interface for connecting to LiveKit room using 
 * hardcoded token from environment variables.
 * 
 * Features:
 * - Direct connection with single button click
 * - Uses hardcoded token from .env file
 * - Audio-only connection (no video)
 * - Proper error handling and loading states
 * - Automatic cleanup on disconnect
 */
const LiveKitModal = ({ setShowSupport }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Get LiveKit configuration from environment variables
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL;
  const token = import.meta.env.VITE_LIVEKIT_TOKEN;

  /**
   * Handles the connection to LiveKit room
   * Uses hardcoded token from environment variables
   */
  const handleConnect = () => {
    if (!serverUrl) {
      setError("Missing VITE_LIVEKIT_URL in environment variables");
      return;
    }
    
    if (!token) {
      setError("Missing VITE_LIVEKIT_TOKEN in environment variables");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    setIsConnected(true);
  };

  /**
   * Handles disconnection from LiveKit room
   * Resets all states and closes modal
   */
  const handleDisconnected = () => {
    console.log('Disconnected from LiveKit room');
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
    setShowSupport(false);
  };

  /**
   * Handles successful connection to LiveKit room
   * Updates connecting state
   */
  const handleConnected = () => {
    console.log('Successfully connected to LiveKit room');
    setIsConnecting(false);
    setError(null);
  };

  /**
   * Handles connection errors
   */
  const handleConnectionError = (error) => {
    console.error('LiveKit connection error:', error);
    setError(`Connection failed: ${error.message}`);
    setIsConnecting(false);
    setIsConnected(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="support-room">
          {!isConnected ? (
            // Connection form - simplified to just a connect button
            <div className="connect-form">
              <h2>Connect to AI Voice Assistant</h2>
              <p>Click the button below to connect with Krishi, your AI agricultural assistant.</p>
              
              {error && (
                <div className="error-message" style={{
                  background: '#fee',
                  border: '1px solid #fcc',
                  padding: '10px',
                  borderRadius: '5px',
                  margin: '10px 0',
                  color: '#c00'
                }}>
                  <strong>Connection Error:</strong>
                  <br />
                  {error}
                </div>
              )}
              
              <div className="connection-buttons">
                <button 
                  type="button"
                  className="connect-button"
                  onClick={handleConnect}
                  disabled={isConnecting || !serverUrl || !token}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: isConnecting || !serverUrl || !token ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isConnecting || !serverUrl || !token ? 'not-allowed' : 'pointer',
                    marginRight: '10px'
                  }}
                >
                  {isConnecting ? "Connecting..." : 
                   (!serverUrl || !token) ? "Configuration Missing" : 
                   "Connect to Voice Assistant"}
                </button>
                
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowSupport(false)}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
              
              {(!serverUrl || !token) && (
                <div className="config-warning" style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '5px',
                  color: '#856404'
                }}>
                  <p><strong>⚠️ Configuration Required</strong></p>
                  <p>Please configure your LiveKit credentials in the frontend/.env file:</p>
                  <ul style={{ marginLeft: '20px' }}>
                    <li><code>VITE_LIVEKIT_URL=wss://your-livekit-cloud-url</code></li>
                    <li><code>VITE_LIVEKIT_TOKEN=your_hardcoded_jwt_token</code></li>
                  </ul>
                  <p style={{ fontSize: '14px', marginTop: '10px' }}>
                    <strong>Current status:</strong><br/>
                    • Server URL: {serverUrl ? '✓ Configured' : '❌ Missing'}<br/>
                    • Token: {token ? '✓ Configured' : '❌ Missing'}
                  </p>
                </div>
              )}
              
              <div className="connection-info" style={{
                marginTop: '20px',
                padding: '10px',
                background: '#f9f9f9',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#666'
              }}>
                <p><strong>Connection Method:</strong> Hardcoded Token</p>
                <p><strong>Server URL:</strong> {serverUrl || 'Not configured'}</p>
                <p><strong>Token:</strong> {token ? 'Configured ✓' : 'Not configured ❌'}</p>
              </div>
            </div>
          ) : (
            // LiveKit Room - handles the actual voice connection
            <LiveKitRoom
              serverUrl={serverUrl}
              token={token}
              connect={true}
              video={false} // Audio-only connection
              audio={true}
              onConnected={handleConnected}
              onDisconnected={handleDisconnected}
              onError={handleConnectionError}
            >
              <RoomAudioRenderer />
              <SimpleVoiceAssistant />
              
              {isConnecting && (
                <div className="connecting-indicator" style={{
                  textAlign: 'center',
                  padding: '20px',
                  background: '#e3f2fd',
                  borderRadius: '5px',
                  margin: '10px 0'
                }}>
                  <div className="spinner" style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #2196F3',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></div>
                  <p>Connecting to your AI agricultural assistant...</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    This may take a few seconds while we establish the connection.
                  </p>
                </div>
              )}
              
              <div className="connection-status" style={{
                textAlign: 'center',
                marginTop: '10px',
                padding: '10px',
                background: '#d4edda',
                borderRadius: '5px',
                color: '#155724'
              }}>
                <p><strong>🎙️ Connected to Krishi AI Assistant</strong></p>
                <p style={{ fontSize: '14px' }}>Start speaking to interact with your agricultural AI assistant</p>
              </div>
              
              <div className="disconnect-button" style={{
                textAlign: 'center',
                marginTop: '15px'
              }}>
                <button
                  onClick={handleDisconnected}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Disconnect
                </button>
              </div>
            </LiveKitRoom>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveKitModal;