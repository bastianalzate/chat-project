import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import socket from '../utils/socket';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Escuchar mensajes entrantes de Socket.IO
    socket.on('message', message => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const handleSend = e => {
    e.preventDefault();

    // Enviar mensaje al servidor Node.js utilizando Socket.IO
    const newMessage = {
      id: Date.now(),
      text: message
    };
    socket.emit('message', newMessage);
    setMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <form onSubmit={handleSend}>
        <input value={message} onChange={e => setMessage(e.target.value)} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Chat;