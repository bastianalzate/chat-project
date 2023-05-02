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

  socket.on('message', async message => {
    console.log('Mensaje recibido:', message);

    // Verificar que las propiedades necesarias no estén undefined
    if (!message || !message.senderId || !message.receiverId || !message.message) {
      console.log('El mensaje no es válido');
      return;
    }

    // Obtener los documentos de conversación relevantes
    const querySnapshot = await db
      .collection('conversations')
      .where('users', 'array-contains', [message.senderId, message.receiverId])
      .get();

    // Crear un nuevo documento de conversación si no existe uno
    let conversationDoc;
    if (querySnapshot.empty) {
      conversationDoc = db.collection('conversations').doc();
      await conversationDoc.set({
        users: [message.senderId, message.receiverId],
        messages: [],
      });
      // Get the document snapshot after set
      conversationDoc = await conversationDoc.get();
    } else {
      conversationDoc = querySnapshot.docs[0];
    }

    // Verificar que el conversationDoc exista antes de llamar a data() en él
    if (conversationDoc) {
      // Actualizar el array de "messages" del documento de conversación
      const conversationData = conversationDoc.data();
      const conversationMessages = conversationData.messages || [];

      // conversationMessages.push({
      //   senderId: message.senderId,
      //   message: message.message,
      //   timestamp: admin.firestore.FieldValue.serverTimestamp(),
      // });
      // await conversationDoc.ref.update({ messages: conversationMessages });

      await conversationDoc.ref.update({
        messages: admin.firestore.FieldValue.arrayUnion({
          senderId: message.senderId,
          receiverId: message.receiverId,
          message: message.message,
          timestamp: new Date(), // Use JavaScript timestamp instead of Firestore serverTimestamp
        }),
      });
      

      // Emitir mensaje a todos los clientes conectados
      io.emit('message', message);
    } else {
      console.error('El documento de la conversación no existe');
    }
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
