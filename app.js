import React, { useEffect, useState, useRef } from 'react';
import './App.css';

const ws = new WebSocket('ws://localhost:3001'); // Replace with your server WebSocket URL if different

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'history') {
        setMessages(message.data);
      } else if (message.type === 'message') {
        setMessages(prev => [...prev, message]);
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const newMsg = {
      type: 'message',
      sender: 'User',
      text: input,
      time: new Date().toLocaleTimeString()
    };
    ws.send(JSON.stringify(newMsg));
    setInput('');
  };

  return (
    <div className="chat-container">
      <h2>💬 Real-Time Chat</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-msg">
            <b>{msg.sender}:</b> {msg.text} <span className="time">{msg.time}</span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
