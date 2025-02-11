import React, { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

const GRID_SIZE = 32;

interface WorldProps {
  onMove: (x: number, y: number) => void;
}

export const World: React.FC<WorldProps> = ({ onMove }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { players, localPlayer } = useGameStore();

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !localPlayer) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onMove(x, y);
    useGameStore.getState().updatePlayer({
      ...localPlayer,
      x,
      y,
    });
  }, [localPlayer, onMove]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#2c3e50';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw players
      players.forEach((player) => {
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.username, player.x, player.y - 30);
      });
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  }, [players]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-gray-900 rounded-lg shadow-xl cursor-pointer"
      onClick={handleClick}
    />
  );
};