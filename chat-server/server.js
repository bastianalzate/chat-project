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

// Agregar middleware de autenticación para Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    admin.auth().verifyIdToken(token)
      .then(decodedToken => {
        socket.uid = decodedToken.uid;
        next();
      })
      .catch(error => {
        console.log('Error de autenticación:', error);
        next(new Error('Error de autenticación'));
      });
  } else {
    console.log('Token de acceso no proporcionado');
    next(new Error('Token de acceso no proporcionado'));
  }
});

io.on('connection', socket => {
  console.log('Usuario conectado');

  socket.on('message', message => {
    console.log('Mensaje recibido:', message);
    // Guardar mensaje en Firestore en nombre del usuario autenticado
    const uid = socket.uid;
    const userRef = db.collection('users').doc(uid);
    const messageRef = userRef.collection('messages').doc();
    messageRef.set({
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
