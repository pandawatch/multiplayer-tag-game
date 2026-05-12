const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_RADIUS = 20;
const TAG_DISTANCE = 50;

// Game state
let players = {};
let itPlayerId = null;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Utility functions
function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * (CANVAS_WIDTH - PLAYER_RADIUS * 2)) + PLAYER_RADIUS,
    y: Math.floor(Math.random() * (CANVAS_HEIGHT - PLAYER_RADIUS * 2)) + PLAYER_RADIUS
  };
}

function broadcastGameState() {
  io.emit('gameState', {
    players,
    itPlayerId,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT
  });
}

function checkTagging(movingPlayerId) {
  if (itPlayerId !== movingPlayerId || !players[itPlayerId]) return;

  const currentItId = itPlayerId;
  const itPlayer = players[currentItId];
  const tagDistance = TAG_DISTANCE + PLAYER_RADIUS;

  for (const playerId of Object.keys(players)) {
    if (playerId === currentItId) continue;

    const player = players[playerId];
    const dx = player.x - itPlayer.x;
    const dy = player.y - itPlayer.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < tagDistance) {
      // Tag successful. Only transfer once per move and stop checking further collisions.
      itPlayer.tags = (itPlayer.tags || 0) + 1;
      itPlayerId = playerId;
      console.log(`🏷️  ${players[itPlayerId].name} was tagged by ${itPlayer.name}`);
      broadcastGameState();
      break;
    }
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✅ Player connected: ${socket.id}`);

  // Create new player
  const position = getRandomPosition();
  const playerName = `Player-${socket.id.slice(0, 4)}`;

  players[socket.id] = {
    id: socket.id,
    x: position.x,
    y: position.y,
    name: playerName,
    tags: 0
  };

  // Assign "it" if this is the first player
  if (!itPlayerId) {
    itPlayerId = socket.id;
    console.log(`👑 ${playerName} is now IT!`);
  }

  // Send initial state to new player
  socket.emit('gameState', {
    players,
    itPlayerId,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT
  });

  // Broadcast updated state to all players
  io.emit('gameState', {
    players,
    itPlayerId,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT
  });

  // Handle player name change
  socket.on('setName', (name) => {
    if (players[socket.id]) {
      const oldName = players[socket.id].name;
      players[socket.id].name = name.slice(0, 20); // Limit name length
      console.log(`📝 ${oldName} changed name to ${name}`);
      broadcastGameState();
    }
  });

  // Handle player movement
  socket.on('move', (data) => {
    if (players[socket.id]) {
      // Update position with boundary checking
      players[socket.id].x = Math.max(
        PLAYER_RADIUS,
        Math.min(CANVAS_WIDTH - PLAYER_RADIUS, data.x)
      );
      players[socket.id].y = Math.max(
        PLAYER_RADIUS,
        Math.min(CANVAS_HEIGHT - PLAYER_RADIUS, data.y)
      );

      // Check for tagging
      checkTagging(socket.id);

      // Broadcast updated state
      broadcastGameState();
    }
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    if (players[socket.id]) {
      const playerName = players[socket.id].name;
      delete players[socket.id];
      console.log(`❌ Player disconnected: ${playerName}`);

      // If the IT player disconnected, assign a new one
      if (itPlayerId === socket.id) {
        const remainingPlayers = Object.keys(players);
        if (remainingPlayers.length > 0) {
          itPlayerId = remainingPlayers[0];
          console.log(`👑 ${players[itPlayerId].name} is now IT!`);
        } else {
          itPlayerId = null;
        }
      }

      // Broadcast updated state
      if (Object.keys(players).length > 0) {
        broadcastGameState();
      }
    }
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error from ${socket.id}:`, error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     🎮 Multiplayer Tag Game Server Started!              ║
║                                                           ║
║     🌐 http://localhost:${PORT}                              ║
║                                                           ║
║     Share this URL with friends to play together!        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
