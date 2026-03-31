import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AgroMart Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await api.post('/ai/chat', { message: userMsg.text });
      setMessages(prev => [...prev, { id: Date.now() + 1, text: res.data.response, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <h3>🤖 Assistant</h3>
            <button style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }} 
              onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              className="chat-input" 
              placeholder="Ask anything..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button className="chat-send" type="submit" disabled={isTyping}>
              <span style={{ fontSize: '1.1rem' }}>➡️</span>
            </button>
          </form>
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '💬' : '🤖'}
      </button>
    </div>
  );
}
