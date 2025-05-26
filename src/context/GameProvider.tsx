import React, { useCallback, useEffect, useState, useRef } from 'react';
import cardDecks from '../data/cardDecks.json'; // TODO: needs optimization
import { Category, GameContext, GameModes, GameRoom, GameState, Player, RoomData } from './GameContext';
import { io, Socket } from 'socket.io-client';

// TODO: use all callbacks instead of useState functions directly. useState functions shouldn't even be exported.

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [category, setCategory] = useState<Category>(() => {
    return (localStorage.getItem('category') as Category) || 'general';
  });
  const [gameState, setGameState] = useState<GameState>(() => {
    return (localStorage.getItem('gameState') as GameState) || 'setup';
  });
  const [gameMode, setGameMode] = useState<GameModes>(() => {
    return (localStorage.getItem('gameMode') as GameModes) || 'SINGLE_DEVICE';
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
  const [onlineUserId, setOnlineUserId] = useState<string>(() => {  // set to '' when resetting game?
    return localStorage.getItem('onlineUserId') || '';
  });

  // Create a ref to track the current onlineUserId
  const onlineUserIdRef = useRef<string>(onlineUserId);

  // Update the ref whenever onlineUserId changes
  useEffect(() => {
    onlineUserIdRef.current = onlineUserId;
  }, [onlineUserId]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomCode, setRoomCode] = useState<string>(''); // move to context and change to gameRoom
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<'select' | 'create' | 'join' | 'ready'>('select');

  const serverUrl = import.meta.env.VITE_WEBSOCKET_SERVER_URL || 'http://localhost:3000';
  const isProduction = import.meta.env.VITE_IS_PRODUCTION || false;
  const port = import.meta.env.VITE_PORT || 3000;

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem('category', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('gameState', gameState);
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('gameMode', gameMode);
  }, [gameMode]);

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

  useEffect(() => {
    localStorage.setItem('onlineUserId', onlineUserId || '');
  }, [onlineUserId]);

  useEffect(() => {
    // Create socket connection
    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 3,
      withCredentials: isProduction,
      secure: isProduction,
      rejectUnauthorized: isProduction,
      transports: ['websocket'],
      port: port,
    });

    // Set up socket listeners
    const handleConnect = () => {
      // console.log('connected to server!', newSocket);
      setIsConnecting(false);
    };
    setSocket(newSocket);

    const handleDisconnect = () => {
      console.log('disconnected from server');
      setIsConnecting(true);
      setError('Disconnected from server');
    };

    const handleRoomCreated = ({ roomCode }: { roomCode: string }) => {
      console.log('room created', roomCode);
      setRoomCode(roomCode);
      setMode('create');
      setError('');
    };

    const handleRoomJoined = (roomData: RoomData) => {
      console.log('room joined', roomData);
      if (roomData.code !== roomCode) setRoomCode(roomData.code);
      if (roomData.players.length !== players.length) setPlayers(roomData.players);
      setMode('ready');
    };

    const handlePlayerJoined = (updatedPlayers: Player[]) => {
      console.log('player joined', updatedPlayers);
      setPlayers(updatedPlayers);
    };

    const handlePlayerLeft = (updatedPlayers: Player[]) => {
      console.log('player left', updatedPlayers);
      setPlayers(updatedPlayers);
    };

    const handleError = (errorMessage: Error) => {
      console.log('error', errorMessage);
      setError(String(errorMessage));
    };
    console.log('gameState', gameState);
    const handleOnlineGameStarted = (gameRoom: GameRoom) => {
      // Use the ref to access the current onlineUserId value
      const currentOnlineUserId = onlineUserIdRef.current;

      if (!currentOnlineUserId) {
        console.error('onlineUserId not found');
        return;
      }
      if (!gameRoom) {
        console.error('gameRoom not found');
        return;
      }
      console.log('game started>>>>', gameRoom, currentOnlineUserId);

      if (gameRoom.game?.targetPlayerIndex !== undefined &&
        gameRoom.players?.[gameRoom.game.targetPlayerIndex]?.userId === currentOnlineUserId) {
        setGameState('targetRanking');
      } else {
        setGameState('groupPrediction');
      }

      setCurrentCards(gameRoom?.game?.currentCards || []);
      setCurrentRound(gameRoom?.game?.currentRound || 1);
      setTargetPlayerIndex(gameRoom?.game?.targetPlayerIndex || 0);
      setTotalRounds(gameRoom?.game?.totalRounds || 5);
    };

    const handleRankingsSubmitted = (gameRoom: GameRoom) => {
      console.log('online rankings submitted', gameRoom);
      // if the current user submitted target rankings, set the gameState to 'waitingForRankings'
      if (gameState === 'waitingForRankings') {
        // const playerIndex = players.findIndex(player => player.userId === onlineUserIdRef.current);
        // if (playerIndex !== -1) {
        //   const updatedPlayers = [...players];
        //   updatedPlayers[playerIndex].rankings = gameRoom.game?.targetRankings || [];
        //   setPlayers(updatedPlayers);
        // }
        if (gameState === 'waitingForRankings') {
          if (gameRoom.game?.targetRankings?.length === 5 && gameRoom.game?.groupPredictions?.length === players.length) {
            setGameState('review');
            setTargetRankings(gameRoom.game?.targetRankings);
            setPlayers(gameRoom?.players || []);
          }
        }
      }
    };

    const handleScoreUpdated = (score: number) => {
      console.log('score updated', score);
    };

    const handleRoomDeleted = () => {
      console.log('room deleted');
    };

    const handleGameOver = () => {
      console.log('game over');
    };

    // Attach listeners
    newSocket.on('connect_error', (err) => {
      console.log('Connection error: ', err);
    });
    newSocket.on('error', handleError);
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('room-created', handleRoomCreated);
    newSocket.on('room-joined', handleRoomJoined);
    newSocket.on('player-joined', handlePlayerJoined);
    newSocket.on('player-left', handlePlayerLeft);
    newSocket.on('game-started', handleOnlineGameStarted);
    newSocket.on('connect_error', handleError);
    newSocket.on('rankings-submitted', handleRankingsSubmitted);
    newSocket.on('score-updated', handleScoreUpdated);
    newSocket.on('room-deleted', handleRoomDeleted);
    newSocket.on('game-over', handleGameOver);

    // Cleanup function
    return () => {
      newSocket.removeAllListeners();
      // Disconnect socket
      if (roomCode && newSocket.connected) {
        newSocket.emit('leave-room', { roomCode, userId: onlineUserIdRef.current }); // probably don't need to pass data bc using socket.io
        if (players.find(player => player.userId === onlineUserIdRef.current)?.isHost) {
          newSocket.emit('delete-room', { roomCode });
        }
      }

      // Disconnect socket
      newSocket.disconnect();
    };
  }, [serverUrl, setPlayers]);

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
    // TODO: use instead of setPlayers or remove this
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

  // add callbacks for setGameMode and setOnlineUserId. callback takes in a function duh

  const handleResetGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentRound(1);
    setTargetPlayerIndex(0);
    setCurrentCards([]);
    setTargetRankings([]);
    setGroupPredictions([]);
    setOnlineUserId('');
    setGameMode(GameModes.SINGLE_DEVICE);
  };

  const calculateRoundScore = () => {
    let total = 20;
    targetRankings.forEach((cardText, index) => {
      const predictionIndex = groupPredictions.indexOf(cardText);
      // or do for currentOnlinePlayer and post the score to appsync
      total -= Math.abs(predictionIndex - index);
    });
    return total;
  };

  const roundScore = calculateRoundScore();
  const isGameOver =
    currentRound === totalRounds && targetPlayerIndex + 1 === players.length; // not necessary

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

  // Fisher-Yates (Knuth) Shuffle
  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomNum = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomNum]] = [shuffled[randomNum], shuffled[i]];
    }
    return shuffled;
  };

  // TODO: when a player presses "start game", that player becomes the host(if necessary) and the rest of the players are notified
  // post event when gameState changes
  const handleStartGame = () => {
    // 2 players or more are required to play the game.
    // TODO: figure out the best max player limit
    if (players.length >= 2) {
      // shuffle the card deck and grab enough for the game
      const deck = cardDecks[category];
      const deckCopy = [...deck];
      const shuffledDeck = shuffleArray(deckCopy);
      const shuffledDeckSlice = shuffledDeck.slice(0, players.length * 5);
      setCardDeck(shuffledDeckSlice);
      const currentCards = shuffledDeckSlice.slice(0, 5)
      setCurrentCards(currentCards);

      // starts the game

      // emit start-game to the room
      console.log('gameState', gameState, gameMode);
      if (gameMode === GameModes.ONLINE) {
        socket?.emit('start-game', roomCode, totalRounds, currentCards);
      } else {
        setGameState('targetRanking');
      }

      // post some event to setGameState to 'targetRanking'
    } else {
      alert('Please add at least 2 players');
    }
  };


  // Provides the game context with organized state and handler functions
  const value = {
    // Game state properties
    gameState,
    setGameState,
    gameMode,
    setGameMode,
    category,
    setCategory,

    // Player-related properties
    players,
    setPlayers,
    onlineUserId,
    setOnlineUserId,

    // Round-related properties
    currentRound,
    setCurrentRound,
    totalRounds,
    setTotalRounds,

    // Card-related properties
    cardDeck,
    setCardDeck,
    currentCards,
    setCurrentCards,

    // Ranking and prediction properties
    targetPlayerIndex,
    setTargetPlayerIndex,
    targetRankings,
    setTargetRankings,
    groupPredictions,
    setGroupPredictions,

    // Score and game status properties
    roundScore,
    isGameOver,

    // Handler functions
    handleResetGame,
    handleUpdateScore,
    handleStartGame,

    // Update functions
    updateGameState,
    updateCategory,
    updatePlayers,
    updateCurrentRound,
    updateTotalRounds,
    updateTargetPlayerIndex,
    updateCurrentCards,
    updateTargetRankings,
    updateGroupPredictions,

    // Online player list properties
    socket,
    setSocket,
    roomCode,
    setRoomCode,
    isConnecting,
    setIsConnecting,
    error,
    setError,
    mode,
    setMode,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
