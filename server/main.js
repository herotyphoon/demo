require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const Message = require('./models/Message');
const User = require('./models/User');
const authMiddleware = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userController = require('./controllers/userController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', authRoutes);
app.use('/', messageRoutes);

app.get('/profile', authMiddleware, userController.getProfile);

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('user_connected', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log('Online Users:', [...onlineUsers.entries()]);
  });

  socket.on('private_message', async ({ from, to, content }) => {
    try {
      const newMessage = new Message({ sender: from, receiver: to, content });
      await newMessage.save();

      const toSocketId = onlineUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit('private_message', { from, content });
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
