import React, { useState, useEffect, useRef, useContext } from 'react';
import { db } from '../utils/firebase';
import socket from '../utils/socket';
import { UserContext } from '../context/UserContext';
import { useHistory } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';


function Chat({ userSelect }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user, logout } = useContext(UserContext);
  const navigate = useHistory();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLogout = () => {
    logout();
    navigate.push('/');
  }

  useEffect(() => {
    const getConversation = () => {
      // Crear el par de usuarios en orden alfabético
      const userPair = [user.uid, userSelect.uid].sort().join('-');
  
      const conversationCollection = collection(db, 'conversations');
      const q = query(conversationCollection, where('userPair', '==', userPair));
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          setMessages([]);
        } else {
          const conversation = querySnapshot.docs[0].data();
          setMessages(conversation.messages);
          console.log(conversation.messages)
        }
      });
  
      // La función onSnapshot retorna una función unsubscribe
      // que puedes llamar para cancelar la suscripción.
      return unsubscribe;
    };
  
    // Llama a getConversation y guarda la función unsubscribe
    const unsubscribe = getConversation();
  
    return () => {
      // Cancela la suscripción cuando el componente se desmonte
      unsubscribe();
    };
  }, [user, userSelect]);
  

  useEffect(scrollToBottom, [messages]);

  const handleSend = e => {
    e.preventDefault();
  
    const newMessage = {
      senderId: user.uid,
      receiverId: userSelect.uid,
      timestamp: new Date(),
      message: message
    };
    socket.emit('message', newMessage);
    setMessage('');
  };
  

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-white py-2 px-4 shadow flex items-center justify-between">
        <h1 className="text-xl font-bold">Chat con {userSelect.email}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {messages.map((message, index) => (
          <div key={index} className="bg-white rounded-lg shadow px-4 mb-4">
            <p className="font-bold">{message.senderId === user.uid ? "Yo" : userSelect.email}</p>
            <p className="text-gray-500">{new Date(message.timestamp?.toDate()).toLocaleString()}</p>
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
