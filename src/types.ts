export interface Player {
  id: string;
  x: number;
  y: number;
  username: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  username: string;
  message: string;
  timestamp: number;
}