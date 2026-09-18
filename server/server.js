const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1); // Required for rate limiting behind reverse proxies (nginx, load balancers, etc)
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

// Rate limiter to prevent spam room creation
const roomCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 rooms per window
  message: { success: false, message: 'Too many rooms created. Please wait 15 minutes.' }
});

// Route: Create a new room
app.post('/api/room/create', roomCreateLimiter, async (req, res) => {
  try {
    // Input validation
    let hostId = req.body?.hostId;
    if (hostId && (typeof hostId !== 'string' || hostId.length > 50)) {
      return res.status(400).json({ success: false, message: 'Invalid hostId format.' });
    }

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
      hostId: req.body?.hostId || 'anonymous',
      players: []
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

// --- ROOM CLEANUP GARBAGE COLLECTION ---
// Rooms live for a maximum of 24 hours to prevent memory leaks and free up 6-digit codes
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Run every 1 hour

setInterval(async () => {
  const now = Date.now();
  let deletedCount = 0;

  for (const [code, room] of activeRooms.entries()) {
    const roomAge = now - new Date(room.createdAt).getTime();
    if (roomAge > ROOM_TTL_MS) {
      // Notify clients
      io.to(code).emit('room_error', { message: 'This room has expired and was closed by the server.' });

      // Fetch all sockets in this room and clear their stale data before kicking them out
      const socketsInRoom = await io.in(code).fetchSockets();
      for (const s of socketsInRoom) {
        s.data = {};
      }

      // Kick them out of the channel
      io.in(code).socketsLeave(code);

      // Delete from memory
      activeRooms.delete(code);
      deletedCount++;
      console.log(`🧹 Garbage Collection: Deleted expired room ${code}`);
    }
  }

  if (deletedCount > 0) {
    console.log(`🧹 Garbage Collection Cycle Complete: Freed ${deletedCount} rooms. Active Rooms: ${activeRooms.size}`);
  }
}, CLEANUP_INTERVAL_MS);

// --- SOCKET.IO REAL-TIME TUNNEL ---
// NOTE: We are currently using an in-memory Map (`activeRooms`). 
// This is perfect for MVP/dev, but will not survive server restarts or scale horizontally 
// across multiple processes. A transition to Redis is required for production scaling.
io.on('connection', (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  // Listen for join attempts
  socket.on('join_room', ({ roomCode, nickname, hostId, avatar }) => {
    // 1. Strict Input Validation
    if (!roomCode || typeof roomCode !== 'string' || !/^\d{6}$/.test(roomCode)) {
      socket.emit('room_error', { message: 'Invalid room code format. Must be 6 digits.' });
      return;
    }

    if (nickname && (typeof nickname !== 'string' || nickname.length > 20)) {
      socket.emit('room_error', { message: 'Nickname is invalid or too long (max 20 chars).' });
      return;
    }

    if (!activeRooms.has(roomCode)) {
      socket.emit('room_error', { message: 'Invalid or expired room code.' });
      return;
    }

    const roomData = activeRooms.get(roomCode);

    // 2. Validate if this socket is the Host
    // (In Phase 4, the Dashboard will pass its hostId token here)
    const isHost = (hostId !== undefined && hostId === roomData.hostId);

    // Join the socket to this room's channel
    socket.join(roomCode);
    const finalNickname = nickname || (isHost ? 'Teacher' : `Guest-${socket.id.substring(0, 4)}`);

    // Attach metadata to the socket object so we can reference it on disconnect
    socket.data = { roomCode, nickname: finalNickname, isHost, socketId: socket.id };

    console.log(`👤 ${finalNickname} ${isHost ? '(Host) ' : ''}joined room ${roomCode}`);

    if (!isHost) {
      roomData.players.push({ nickname: finalNickname, socketId: socket.id, avatar: avatar || '👤' });
    }

    // 1. Notify the client it was successful
    socket.emit('room_joined', { roomCode, nickname: finalNickname, isHost });

    // 2. Broadcast the full lobby state to everyone in the room
    io.to(roomCode).emit('lobby_update', { players: roomData.players });
  });

  // Explicitly leave a room
  socket.on('leave_room', () => {
    if (socket.data?.roomCode) {
      const { roomCode, nickname, isHost, socketId } = socket.data;
      socket.leave(roomCode);
      
      const roomData = activeRooms.get(roomCode);
      if (roomData && !isHost) {
        roomData.players = roomData.players.filter(p => p.socketId !== socketId);
        io.to(roomCode).emit('lobby_update', { players: roomData.players });
      }

      console.log(`🏃 ${nickname} manually left room ${roomCode}`);
      socket.data = {}; // Clear context
    }
  });

  // Handle unexpected disconnects (network drop, closed tab, etc.)
  socket.on('disconnect', () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);

    // If they were in a room, notify the other participants
    if (socket.data?.roomCode) {
      const { roomCode, nickname, isHost, socketId } = socket.data;
      
      const roomData = activeRooms.get(roomCode);
      if (roomData) {
        if (isHost) {
          io.to(roomCode).emit('host_disconnected');
        } else {
          roomData.players = roomData.players.filter(p => p.socketId !== socketId);
          io.to(roomCode).emit('lobby_update', { players: roomData.players });
        }
      }
    }
  });
});

// Start the server (using server.listen, not app.listen!)
server.listen(PORT, () => {
  console.log(`QuiZ+ Backend Server running on http://localhost:${PORT}`);
});
