import { createContext, useContext } from 'react';

// Types
export type GameState =
  | 'setup'
  | 'targetRanking'
  | 'groupPrediction'
  | 'review'
  | 'gameOver';

export type Player = {
  name: string;
  score: number;
};

export type GameContextType = {
  currentCards: string[];
  setCurrentCards: React.Dispatch<React.SetStateAction<string[]>>;
  targetPlayerIndex: number;
  setTargetPlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  targetRankings: string[];
  setTargetRankings: React.Dispatch<React.SetStateAction<string[]>>;
  groupPredictions: string[];
  setGroupPredictions: React.Dispatch<React.SetStateAction<string[]>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  gameState: GameState;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  totalRounds: number;
  setTotalRounds: React.Dispatch<React.SetStateAction<number>>;
  currentRound: number;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  cardDeck: string[];
  setCardDeck: React.Dispatch<React.SetStateAction<string[]>>;
  handleResetGame: () => void;
  handleUpdateScore: () => void;
  handleStartGame: () => void;
  roundScore: number;
  isGameOver: boolean;
};

// Context
export const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
