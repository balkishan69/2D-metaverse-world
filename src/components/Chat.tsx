import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

interface ChatProps {
  onSendMessage: (message: string) => void;
}

export const Chat: React.FC<ChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const messages = useGameStore((state) => state.messages);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="h-96 p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-2 rounded bg-gray-100"
          >
            <span className="font-bold text-indigo-600">{msg.username}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};