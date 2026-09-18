const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// Wrap Express in HTTP Server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io with identical CORS policies
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// In-memory store for active rooms
// Using a Map for efficient lookups: Key = Room Code, Value = Room Data
const activeRooms = new Map();

// Helper to generate a random 6-digit code
const generateRoomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Route: Create a new room
app.post('/api/room/create', async (req, res) => {
  try {
    let code;
    let isUnique = false;
    
    // Ensure the generated code is completely unique
    while (!isUnique) {
      code = generateRoomCode();
      if (!activeRooms.has(code)) {
        isUnique = true;
      }
    }

    // Store the room with basic metadata
    const newRoom = {
      code,
      createdAt: new Date().toISOString(),
      hostId: req.body?.hostId || 'anonymous'
    };

    activeRooms.set(code, newRoom);

    console.log(`Room created: ${code}`);
    res.status(201).json({ success: true, code });

  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, message: 'Server error creating room' });
  }
});

// Route: Validate if a room exists
app.get('/api/room/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (activeRooms.has(code)) {
      return res.status(200).json({ 
        success: true, 
        message: 'Room exists',
        room: activeRooms.get(code)
      });
    } else {
      return res.status(404).json({ 
        success: false, 
        message: 'Room not found' 
      });
    }

  } catch (error) {
    console.error('Error validating room:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- SOCKET.IO REAL-TIME TUNNEL ---
io.on('connection', (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  // Listen for join attempts
  socket.on('join_room', ({ roomCode, nickname }) => {
    if (!activeRooms.has(roomCode)) {
      // Invalid code -> fail gracefully
      socket.emit('room_error', { message: 'Invalid or expired room code.' });
      return;
    }

    // Valid code -> Join the socket to this room's channel
    socket.join(roomCode);
    const finalNickname = nickname || `Guest-${socket.id.substring(0, 4)}`;
    
    console.log(`👤 ${finalNickname} joined room ${roomCode}`);
    
    // Notify the client it was successful
    socket.emit('room_joined', { roomCode, nickname: finalNickname });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// Start the server (using server.listen, not app.listen!)
server.listen(PORT, () => {
  console.log(`QuiZ+ Backend Server running on http://localhost:${PORT}`);
});
