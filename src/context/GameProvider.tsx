import React, { useCallback, useEffect, useState } from 'react';
import cardDecks from '../data/cardDecks.json';
import { GameContext, GameState, Player } from './GameContext';

export type Category = 'general' | 'adult' | 'dating' | 'pop-culture';

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [category, setCategory] = useState<Category>(() => {
    return (localStorage.getItem('category') as Category) || 'general';
  });
  const [gameState, setGameState] = useState<GameState>(() => {
    return (localStorage.getItem('gameState') as GameState) || 'setup';
  });
  const [players, setPlayers] = useState<Player[]>(() => {
    return JSON.parse(localStorage.getItem('players') || '[]');
  });
  const [currentRound, setCurrentRound] = useState<number>(() => {
    return parseInt(localStorage.getItem('currentRound') || '1', 10);
  });
  const [totalRounds, setTotalRounds] = useState<number>(() => {
    return parseInt(localStorage.getItem('totalRounds') || '5', 10);
  });
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number>(() => {
    return parseInt(localStorage.getItem('targetPlayerIndex') || '0', 10);
  });
  const [currentCards, setCurrentCards] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('currentCards') || '[]');
  });
  const [targetRankings, setTargetRankings] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('targetRankings') || '[]');
  });
  const [groupPredictions, setGroupPredictions] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('groupPredictions') || '[]');
  });
  const [cardDeck, setCardDeck] = useState<string[]>(() => {
    return cardDecks[
      (localStorage.getItem('category') as Category) || 'general'
    ];
  });

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem('category', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('gameState', gameState);
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('currentRound', currentRound.toString());
  }, [currentRound]);

  useEffect(() => {
    localStorage.setItem('totalRounds', totalRounds.toString());
  }, [totalRounds]);

  useEffect(() => {
    localStorage.setItem('targetPlayerIndex', targetPlayerIndex.toString());
  }, [targetPlayerIndex]);

  useEffect(() => {
    localStorage.setItem('currentCards', JSON.stringify(currentCards));
  }, [currentCards]);

  useEffect(() => {
    localStorage.setItem('targetRankings', JSON.stringify(targetRankings));
  }, [targetRankings]);

  useEffect(() => {
    localStorage.setItem('groupPredictions', JSON.stringify(groupPredictions));
  }, [groupPredictions]);

  // Update card deck when category changes
  useEffect(() => {
    setCardDeck(cardDecks[category]);
  }, [category]);

  // Use `useCallback` to optimize updater functions
  const updateCategory = useCallback(
    (newCategory: Category) => setCategory(newCategory),
    []
  );
  const updateGameState = useCallback(
    (newGameState: GameState) => setGameState(newGameState),
    []
  );
  const updatePlayers = useCallback(
    (newPlayers: Player[]) => setPlayers(newPlayers),
    []
  );
  const updateCurrentRound = useCallback(
    (round: number) => setCurrentRound(round),
    []
  );
  const updateTotalRounds = useCallback(
    (rounds: number) => setTotalRounds(rounds),
    []
  );
  const updateTargetPlayerIndex = useCallback(
    (index: number) => setTargetPlayerIndex(index),
    []
  );
  const updateCurrentCards = useCallback(
    (cards: string[]) => setCurrentCards(cards),
    []
  );
  const updateTargetRankings = useCallback(
    (rankings: string[]) => setTargetRankings(rankings),
    []
  );
  const updateGroupPredictions = useCallback(
    (predictions: string[]) => setGroupPredictions(predictions),
    []
  );
  // const [category, setCategory] = useState<Category>('general');
  // const [gameState, setGameState] = useState<GameState>('setup');
  // const [players, setPlayers] = useState<Player[]>([]);
  // const [currentRound, setCurrentRound] = useState(1);
  // const [totalRounds, setTotalRounds] = useState(5);
  // const [targetPlayerIndex, setTargetPlayerIndex] = useState(0);
  // const [currentCards, setCurrentCards] = useState<string[]>([]);
  // const [targetRankings, setTargetRankings] = useState<string[]>([]);
  // const [groupPredictions, setGroupPredictions] = useState<string[]>([]);
  // const [cardDeck, setCardDeck] = useState<string[]>(cardDecks['general']);

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

  const value = {
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
    //
    // category,
    // gameState,
    // players,
    // currentRound,
    // totalRounds,
    // targetPlayerIndex,
    // currentCards,
    // targetRankings,
    // groupPredictions,
    // cardDeck,
    updateCategory,
    updateGameState,
    updatePlayers,
    updateCurrentRound,
    updateTotalRounds,
    updateTargetPlayerIndex,
    updateCurrentCards,
    updateTargetRankings,
    updateGroupPredictions,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
