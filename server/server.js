const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const PORT = process.env.PORT || 3001;
app.use(cors()); // Enable CORS for all routes

const io = socketIo(server, {
  cors: {
    origin: "*", // Replace with your React app's origin
    methods: ["GET", "POST"]
  }
});

const rooms = {};
const calculateWinner = (board) => {
  const markedCount = board.filter((cell) => cell.value !== '').length;
  if (markedCount < 3) {
    return null;
  }

  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a].value && board[a].value === board[b].value && board[a].value === board[c].value) {
      return board[a].value;
    }
  }

  return null;
};

app.get('/', (req, res) => {
  res.send('Hello, World! This is your server responding.');
});

io.on('connection', (socket) => {
  console.log(`A user connected ${socket.id}`);

   socket.on('createRoom', ({ playerName, gameRoomId }) => {
    const room = gameRoomId.trim().toLowerCase();

    if (!rooms[room]) {
      socket.join(room);
      rooms[room] = { players: [{ name: playerName, id: socket.id }], turn: socket.id, board: [
        { position: 0, value: '' },
        { position: 1, value: '' },
        { position: 2, value: '' },
        { position: 3, value: '' },
        { position: 4, value: '' },
        { position: 5, value: '' },
        { position: 6, value: '' },
        { position: 7, value: '' },
        { position: 8, value: '' },
      ], winner: null };
      io.to(room).emit('gameUpdate', rooms[room]);
      console.log(`Room created: ${room} by ${playerName}`);
    } else {
      socket.emit('roomError', 'Room already exists');
    }
  });

  socket.on('joinRoom', ({ playerName, gameRoomId }) => {
    // Logic for joining a room
    const room = gameRoomId.trim().toLowerCase();
    const existingRoom = rooms[room];

    if (existingRoom && existingRoom.players.length < 2 ) {
      socket.join(room);
      existingRoom.players.push({ name: playerName, id: socket.id });

      if (existingRoom.players.length === 2) {
        existingRoom.currentPlayerName = existingRoom.players.find(player => player.id !== socket.id).name;
        io.to(room).emit('playerJoined', existingRoom.currentPlayerName);
      }

      io.to(room).emit('gameUpdate', existingRoom);
      console.log(`${playerName} joined room ${room}`);
    } else {
      // Handle room full or room does not exist
      socket.emit('roomError', 'Room is full or does not exist');
    }
  });

  socket.on('cellClick', ({ position, playerName, gameRoomId }) => {
    const room = gameRoomId.trim().toLowerCase();
    const existingRoom = rooms[room];
    if (existingRoom && existingRoom.players.length === 2 && socket.id === existingRoom.turn) {
      // Check if the clicked cell is empty
      if (existingRoom.board[position].value === '') {
        // Update the board and switch turns
        existingRoom.board[position].value = playerName === existingRoom.players[0].name ? 'X' : 'O';
        existingRoom.turn = existingRoom.players.find(player => player.id !== socket.id).id;

        const winnerSymbol = calculateWinner(existingRoom.board);
        const winner = winnerSymbol === 'X' ? existingRoom.players[0].name : winnerSymbol === 'O' ? existingRoom.players[1].name : null;
        
        const dataToSend = {
          board: existingRoom.board,
          winner: winner,
          turn: existingRoom.turn,
          currentPlayerName: existingRoom.players.find(player => player.id === existingRoom.turn).name,
        };

        io.to(room).emit('gameUpdate', dataToSend);
      } else {
        // Cell is already occupied, handle accordingly
        socket.emit('moveError', 'Cell is already occupied');
      }
    } else {
      // Invalid move or not the player's turn, handle accordingly
      socket.emit('moveError', 'Invalid move');
    }
  });

  socket.on('resetGame', ({ roomId }) => {
    const room = roomId.trim().toLowerCase();
    const existingRoom = rooms[room];

    if (existingRoom) {
      // Reset the board, winner, and turn
      existingRoom.board = [
        { position: 0, value: '' },
        { position: 1, value: '' },
        { position: 2, value: '' },
        { position: 3, value: '' },
        { position: 4, value: '' },
        { position: 5, value: '' },
        { position: 6, value: '' },
        { position: 7, value: '' },
        { position: 8, value: '' },
      ];
      existingRoom.winner = null;
      existingRoom.turn = existingRoom.players[0].id; // Set turn to the first player

      // Broadcast the updated game state to all players in the room
      io.to(room).emit('gameUpdate', existingRoom);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Handle disconnect logic
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
