import { createContext } from "react";

export interface Game {
  id: string;
  playerName: string;
  age: number;
  email: string;
  startFirst: boolean;
  gameArray: (string | null)[];
  playerXTurn: boolean;
  winner: string | null;
  history: (string | null)[][];
  currentMove: number;
  startTime: number;
  endTime: number | null;
  totalTime: number;
  status: "unstarted" | "incomplete" | "complete";
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
}

interface GameContextType {
  games: Game[];
  gameStats: GameStats;
  addGame: (
    playerName: string,
    age: number,
    email: string,
    startFirst: boolean
  ) => void;
  updateGame: (id: string, updatedGame: Partial<Game>) => void;
  handleClick: (id: string, index: number) => void;
  handleUndo: (id: string) => void;
  handleRedo: (id: string) => void;
  handleReset: (id: string) => void;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);
