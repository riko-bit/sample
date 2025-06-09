'use client';

import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();

      if (data.candidates && data.candidates.length > 0) {
        const botReply = data.candidates[0].content.parts[0].text;
        const botMessage = { id: Date.now() + 1, text: botReply, sender: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: 'No reply from API', sender: 'bot' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: 'Error contacting Gemini API', sender: 'bot' }]);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>ChatGPT Gemini Clone</h1>
      <div style={{ minHeight: '300px', border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', overflowY: 'auto' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ textAlign: m.sender === 'user' ? 'right' : 'left', margin: '0.5rem 0' }}>
            <b>{m.sender === 'user' ? 'You' : 'Bot'}: </b>{m.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message here"
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>Send</button>
    </div>
  );
}
