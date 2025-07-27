import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import "./SimpleVoiceAssistant.css";

const Message = ({ type, text }) => {
  return (
    <div className="message">
      <strong className={`message-${type}`}>
        {type === "agent" ? "🤖 AI Assistant: " : "👤 You: "}
      </strong>
      <span className="message-text">{text}</span>
    </div>
  );
};

const SimpleVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  // Get connection state display
  const getStateDisplay = () => {
    switch (state) {
      case "idle":
        return "Ready to listen";
      case "listening":
        return "Listening...";
      case "thinking":
        return "Processing...";
      case "speaking":
        return "AI is speaking";
      default:
        return "Connecting...";
    }
  };

  return (
    <div className="voice-assistant-container">
      <div className="assistant-header">
        <h2>🎙️ AI Voice Assistant</h2>
        <div className="state-indicator">
          <span className={`state-badge state-${state}`}>
            {getStateDisplay()}
          </span>
        </div>
      </div>

      <div className="visualizer-container">
        <BarVisualizer 
          state={state} 
          barCount={12} 
          trackRef={audioTrack}
          options={{
            barColor: '#00d4ff',
            barWidth: 6,
            barSpacing: 4,
            amplitudeMultiplier: 1.5
          }}
        />
      </div>

      <div className="control-section">
        <VoiceAssistantControlBar />
        
        <div className="conversation">
          <div className="conversation-header">
            <h3>💬 Conversation</h3>
          </div>
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>Start speaking to begin your conversation with the AI assistant!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <Message key={msg.id || index} type={msg.type} text={msg.text} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="instructions">
        <p>💡 <strong>Tip:</strong> Start speaking naturally - the AI will respond automatically!</p>
      </div>
    </div>
  );
};

export default SimpleVoiceAssistant;