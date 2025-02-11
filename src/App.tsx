import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { World } from './components/World';
import { Chat } from './components/Chat';
import { useGameStore } from './store/useGameStore';
import { Users } from 'lucide-react';

// Use environment-based WebSocket URL
const WEBSOCKET_URL = import.meta.env.PROD 
  ? 'YOUR_DEPLOYED_WEBSOCKET_SERVER_URL' // Replace this with your deployed WebSocket server URL
  : 'http://localhost:3000';

function App() {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const { setLocalPlayer, updatePlayer, removePlayer, addMessage } = useGameStore();

  useEffect(() => {
    const storedUsername = localStorage.getItem('metaverse-username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('metaverse-username', username);
      setIsConnected(true);

      const newSocket = io(WEBSOCKET_URL);
      setSocket(newSocket);
      
      newSocket.on('connect', () => {
        const player = {
          id: newSocket.id,
          x: Math.random() * 700 + 50,
          y: Math.random() * 500 + 50,
          username,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        };
        setLocalPlayer(player);
        newSocket.emit('join', player);
      });

      newSocket.on('playerJoined', (player) => {
        updatePlayer(player);
      });

      newSocket.on('playerMoved', (player) => {
        updatePlayer(player);
      });

      newSocket.on('playerLeft', (playerId) => {
        removePlayer(playerId);
      });

      newSocket.on('chatMessage', (message) => {
        addMessage(message);
      });

      // Add error handling
      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        alert('Failed to connect to the server. Please make sure the server is running.');
      });
    }
  };

  const handleMove = useCallback((x, y) => {
    if (socket) {
      socket.emit('move', { x, y });
    }
  }, [socket]);

  const handleSendMessage = useCallback((message) => {
    if (socket) {
      socket.emit('chat', message);
    }
  }, [socket]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
          <div className="flex items-center justify-center mb-6">
            <Users size={40} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">
            Join the Metaverse
          </h1>
          <form onSubmit={handleJoin}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Enter World
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          <World onMove={handleMove} />
          <Chat onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;