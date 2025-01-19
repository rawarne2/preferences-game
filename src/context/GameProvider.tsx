import React, { useState } from 'react';
import cardDecks from '../data/cardDecks.json';
import { GameContext, GameContextType, GameState, Player } from './GameContext';

export type Category = 'general' | 'adult' | 'dating' | 'pop-culture';

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [category, setCategory] = useState<Category>('general');
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState(0);
  const [currentCards, setCurrentCards] = useState<string[]>([]);
  const [targetRankings, setTargetRankings] = useState<string[]>([]);
  const [groupPredictions, setGroupPredictions] = useState<string[]>([]);
  const [cardDeck, setCardDeck] = useState<string[]>(cardDecks['general']);

  const handleResetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentRound(1);
    setTargetPlayerIndex(0);
    setCurrentCards([]);
    setTargetRankings([]);
    setGroupPredictions([]);
  };

  const calculateRoundScore = () => {
    let total = 0;
    targetRankings.forEach((cardText, index) => {
      const predictionIndex = groupPredictions.indexOf(cardText);
      total += Math.abs(predictionIndex - index);
    });
    return total;
  };

  const roundScore = calculateRoundScore();
  const isGameOver =
    currentRound === totalRounds && targetPlayerIndex + 1 === players.length;

  const getNextCards = () => {
    const turnsFromPreviousRounds = (currentRound - 1) * players.length;
    const turnsInCurrentRound = targetPlayerIndex;
    const currentTurns = turnsFromPreviousRounds + turnsInCurrentRound + 1;
    return cardDeck.slice(currentTurns * 5, currentTurns * 5 + 5);
  };

  const handleUpdateScore = () => {
    // Update scores for non-target players after reviewing the group prediction results

    const playersWithUpdatedScore = players.map((player, idx) => ({
      ...player,
      score:
        idx === targetPlayerIndex ? player.score : player.score + roundScore,
    }));
    setPlayers(playersWithUpdatedScore);

    if (isGameOver) {
      setGameState('gameOver');
    } else {
      const nextCards = getNextCards();
      setCurrentCards(nextCards);
      setTargetRankings([]);
      setGroupPredictions([]);
      setGameState('targetRanking');
      // go to next round
      if (targetPlayerIndex + 1 === players.length) {
        setCurrentRound(currentRound + 1);
        setTargetPlayerIndex(0);
      } else {
        setTargetPlayerIndex(targetPlayerIndex + 1);
      }
    }
  };
  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleStartGame = () => {
    if (players.length >= 2) {
      const deck = cardDecks[category];
      const deckCopy = [...deck];
      const shuffledDeck = shuffleArray(deckCopy);
      setCardDeck(shuffledDeck);
      setCurrentCards(shuffledDeck.slice(0, 5));
      setGameState('targetRanking');
    } else {
      alert('Please add at least 2 players');
    }
  };

  const value: GameContextType = {
    currentCards,
    setCurrentCards,
    targetPlayerIndex,
    setTargetPlayerIndex,
    targetRankings,
    setTargetRankings,
    groupPredictions,
    setGroupPredictions,
    setGameState,
    setCategory,
    category,
    gameState,
    players,
    setPlayers,
    totalRounds,
    setTotalRounds,
    currentRound,
    setCurrentRound,
    cardDeck,
    setCardDeck,
    handleResetGame,
    handleUpdateScore,
    handleStartGame,
    roundScore,
    isGameOver,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
