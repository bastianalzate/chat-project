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
      senderId: "c81o7aghbVaZLBIDFjL2",
      timestamp: Date.now(),
      text: message
    };
    socket.emit('message', newMessage);
    setMessage('');
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white py-2 px-4 shadow">
        <h1 className="text-xl font-bold">Chat con Juan Pérez</h1>
      </div>
      <div className="p-4">
        {messages.map(message => (
          <div key={message.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <p className="font-bold">{message.senderId}</p>
            <p className="text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
            <p className="mt-2">{message.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="bg-white py-4 px-4 shadow">
        <div className="flex items-center">
          <input value={message} onChange={e => setMessage(e.target.value)} className="flex-grow border-gray-400 border-2 py-2 px-4 rounded-lg mr-2" />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
