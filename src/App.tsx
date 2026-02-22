import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ text: string; sender: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const updatedChat = [...chat, { text: message, sender: "user" }];
    setChat(updatedChat);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/chat",
        { message }
      );

      const reply = response.data.choices[0].message.content;

      setChat([...updatedChat, { text: reply, sender: "ai" }]);
      setMessage("");
    } catch (error) {
      setChat([...updatedChat, { text: "⚠️ Error connecting to AI", sender: "ai" }]);
    }

    setLoading(false);
  };

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <h2 style={styles.title}>🤖 AI Assistant</h2>

        <div style={styles.chatBox}>
          {chat.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                      : "#1f2937",
                  color: msg.sender === "user" ? "white" : "#e5e7eb",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.messageWrapper}>
              <div style={{ ...styles.messageBubble, background: "#1f2937" }}>
                <span className="typing">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything..."
          />
          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>

      <style>
        {`
          .typing span {
            animation: blink 1.4s infinite both;
          }
          .typing span:nth-child(2) {
            animation-delay: 0.2s;
          }
          .typing span:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes blink {
            0% { opacity: .2 }
            20% { opacity: 1 }
            100% { opacity: .2 }
          }
        `}
      </style>
    </div>
  );
}

const styles: any = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "700px",
    height: "90vh",
    background: "#111827",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: "15px",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageWrapper: {
    display: "flex",
  },
  messageBubble: {
    padding: "12px 16px",
    borderRadius: "16px",
    maxWidth: "75%",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;