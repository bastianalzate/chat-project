const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const admin = require('firebase-admin');
const cors = require('cors');

// Configurar Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://db-chat-b5f88.firebaseio.com'
});
const db = admin.firestore();

// Configurar servidor HTTP con Express
const app = express();
const server = http.createServer(app);

// Configurar Socket.IO para comunicación en tiempo real
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log('Usuario conectado');

  socket.on('message', message => {
    console.log('Mensaje recibido:', message);
    // Guardar mensaje en Firestore
    const messageRef = db.collection('messages').doc();
    messageRef.set({
      senderId: message.senderId,
      message: message.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        console.log('Mensaje guardado en Firestore');
        // Emitir mensaje a todos los clientes conectados
        io.emit('message', message);
      })
      .catch(error => {
        console.log('Error al guardar el mensaje en Firestore:', error);
      });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Permitir solicitudes CORS desde el cliente React
app.use(cors({ origin: 'http://localhost:3000' }));

// Iniciar servidor HTTP
const port = 5000;
server.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});