import React, { useState } from 'react';
import { sampleDeck } from '../data/sampleDeck';
import { GameContext, GameContextType, GameState, Player } from './GameContext';

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);

  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState(0);
  const [currentCards, setCurrentCards] = useState<string[]>([]);
  const [targetRankings, setTargetRankings] = useState<string[]>([]);
  const [groupPredictions, setGroupPredictions] = useState<string[]>([]);
  const [cardDeck, setCardDeck] = useState<string[]>(sampleDeck);

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

  const handleUpdateScore = () => {
    // Update scores for non-target players

    const playersWithUpdatedScore = players.map((player, idx) => ({
      ...player,
      score:
        idx === targetPlayerIndex ? player.score : player.score + roundScore,
    }));

    setPlayers(playersWithUpdatedScore);

    if (isGameOver) {
      setGameState('gameOver');
    } else {
      // get next cards
      const nextCards = cardDeck.slice(
        (currentRound + 1) * 5,
        (currentRound + 1) * 5 + 5
      );
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
      const deckCopy = [...cardDeck];
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
