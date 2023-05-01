import React, { useState, useEffect, useRef } from 'react';
import { db, messagesQuery } from '../utils/firebase';
import { onSnapshot } from 'firebase/firestore';
import socket from '../utils/socket';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(messagesQuery, snapshot => {
      const loadedMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          senderId: data.senderId,
          timestamp: data.timestamp.toDate(),
        };
      });

      setMessages(loadedMessages);
    });

    return unsubscribe;
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSend = e => {
    e.preventDefault();

    const newMessage = {
      senderId: "c81o7aghbVaZLBIDFjL2",
      timestamp: "",
      message: message
    };
    socket.emit('message', newMessage);
    setMessage('');
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-white py-2 px-4 shadow">
        <h1 className="text-xl font-bold">Chat con Juan Pérez</h1>
      </div>
      <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {messages.map(message => (
          <div key={message.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <p className="font-bold">{message.senderId}</p>
            <p className="text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
            <p className="mt-2">{message.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="bg-white py-5 px-4 shadow">
        <div className="flex items-center">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-grow border-gray-400 border-2 py-2 px-4 rounded-lg mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;

