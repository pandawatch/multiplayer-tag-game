# 🎮 Multiplayer Tag Game

A real-time multiplayer tag game built with **Node.js**, **Express**, **Socket.io**, and **HTML5 Canvas**.

## 🎯 Features

✨ **Real-time Multiplayer Gameplay**
- Connect multiple players instantly
- One player is "IT" (red) trying to catch others (blue)
- Tag someone to pass the "IT" status
- Beautiful gradient UI with smooth animations

📊 **Leaderboard & Scoring**
- Live tag counter for each player
- Real-time leaderboard updates
- See who's IT and who's safe

🎮 **Smooth Controls**
- Arrow Keys or WASD to move
- Responsive movement system
- Boundary collision detection

📱 **Cross-Platform**
- Play on desktop or mobile
- Local network multiplayer
- Real-time WebSocket communication

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/detectthefruit/multiplayer-tag-game.git
cd multiplayer-tag-game

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000`

### Playing

1. Open your browser and go to `http://localhost:3000`
2. Enter your player name
3. Click "Join Game"
4. Use **Arrow Keys** or **WASD** to move around
5. If you're **RED (IT)**, chase and catch other players
6. If you're **BLUE (SAFE)**, avoid being caught!

### Playing with Friends

1. Start the server on one computer
2. Find your computer's IP address:
   - **Windows**: `ipconfig` in Command Prompt
   - **Mac/Linux**: `ifconfig` in Terminal
3. Share the URL: `http://YOUR_IP:3000`
4. Friends can join from other computers on the same network

## 🎮 Game Rules

- **One player is "IT"** (shown in red with an "IT" label)
- **Goal if you're IT**: Catch someone by getting within 50px of them
- **Goal if you're SAFE**: Avoid being caught!
- **When caught**: You become "IT" and the tagger becomes safe
- **Tags counter**: Tracks how many times each player has been caught

## 📁 Project Structure

```
multiplayer-tag-game/
├── server.js              # Node.js backend server
├── package.json          # Dependencies
├── public/
│   └── index.html       # Frontend HTML, CSS, and JavaScript
└── README.md            # This file
```

## 🛠️ Technologies Used

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: HTML5, CSS3, JavaScript Canvas API
- **Communication**: WebSockets (Socket.io)

## 📊 Game Constants

| Property | Value |
|----------|-------|
| Canvas Size | 800x600px |
| Player Radius | 20px |
| Tag Distance | 50px |
| Player Speed | 5px per frame |

## 🎨 Customization

### Change Game Size
Edit in `server.js`:
```javascript
const CANVAS_WIDTH = 800;  // Change width
const CANVAS_HEIGHT = 600; // Change height
```

### Adjust Game Speed
```javascript
const PLAYER_SPEED = 5; // Increase for faster movement
const TAG_DISTANCE = 50; // Increase to make it easier to tag
```

### Change Colors
Edit in `public/index.html`:
```javascript
ctx.fillStyle = '#e74c3c'; // IT player color (red)
ctx.fillStyle = '#3498db'; // Safe player color (blue)
```

## 🐛 Troubleshooting

**Q: Port 3000 is already in use?**
- Kill the process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Or use a different port: `PORT=3001 npm start`

**Q: Can't connect from another computer?**
- Make sure firewall allows port 3000
- Use your actual IP address, not `localhost`
- Both computers should be on the same network

**Q: Game feels laggy?**
- Check your internet connection
- Reduce number of players
- Try restarting the server

## 📝 Future Enhancements

- [ ] Multiple game modes (free for all, teams, etc.)
- [ ] Power-ups and special abilities
- [ ] Different game maps
- [ ] Sound effects and music
- [ ] Player customization (colors, avatars)
- [ ] Chat system
- [ ] Mobile-optimized controls

## 📄 License

MIT License - Feel free to use this project for anything!

## 👾 Have Fun!

Enjoy the game and feel free to customize it with your own features! If you create something cool, let me know! 🎉
