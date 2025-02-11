import { create } from 'zustand';
import { Player, ChatMessage } from '../types';

interface GameState {
  players: Map<string, Player>;
  localPlayer: Player | null;
  messages: ChatMessage[];
  setLocalPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  addMessage: (message: ChatMessage) => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: new Map(),
  localPlayer: null,
  messages: [],
  setLocalPlayer: (player) => set({ localPlayer: player }),
  updatePlayer: (player) =>
    set((state) => ({
      players: new Map(state.players).set(player.id, player),
    })),
  removePlayer: (playerId) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.delete(playerId);
      return { players: newPlayers };
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.slice(-50), message],
    })),
}));