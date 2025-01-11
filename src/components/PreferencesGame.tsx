import React, { useState } from 'react';
import { SetupScreen } from './SetupScreen';
import { TargetRankingScreen } from './TargetRankingScreen';
import { GroupPredictionScreen } from './GroupPredictionScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { sampleDeck } from '../data/sampleDeck';

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

interface GameProps {
  defaultRounds?: number;
}

const PreferencesGame: React.FC<GameProps> = ({ defaultRounds = 5 }) => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(defaultRounds);
  const [targetPlayerIndex, setTargetPlayerIndex] = useState(0);
  const [currentCards, setCurrentCards] = useState<string[]>([]);
  const [targetRankings, setTargetRankings] = useState<number[]>([]);
  const [groupPredictions, setGroupPredictions] = useState<number[]>([]);
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
    return targetRankings.reduce((total, curr, idx) => {
      return total + Math.abs(curr - groupPredictions[idx]);
    }, 0);
  };

  const roundScore = calculateRoundScore();
  const isGameOver =
    currentRound === totalRounds && targetPlayerIndex + 1 === players.length;
  const handleUpdateScore = () => {
    // Update scores for non-target players

    const newPlayers = players.map((player, idx) => ({
      ...player,
      score:
        idx === targetPlayerIndex ? player.score : player.score + roundScore,
    }));

    setPlayers(newPlayers);

    if (isGameOver) {
      // Game over
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
    const shuffled = [...array]; // Clone the array
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
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
    }
  };

  // Render the appropriate screen based on game state
  return (
    <div className='min-h-screen bg-white'>
      {gameState === 'setup' && (
        <SetupScreen
          setPlayers={setPlayers}
          players={players}
          setTotalRounds={setTotalRounds}
          totalRounds={totalRounds}
          handleStartGame={handleStartGame}
        />
      )}
      {gameState === 'targetRanking' && (
        <TargetRankingScreen
          currentCards={currentCards}
          players={players}
          setGameState={setGameState}
          setTargetRankings={setTargetRankings}
          targetPlayerIndex={targetPlayerIndex}
        />
      )}
      {gameState === 'groupPrediction' && (
        <GroupPredictionScreen
          currentCards={currentCards}
          setGameState={setGameState}
          setGroupPredictions={setGroupPredictions}
        />
      )}
      {gameState === 'review' && (
        <ReviewScreen
          targetRankings={targetRankings}
          currentCards={currentCards}
          groupPredictions={groupPredictions}
          roundScore={roundScore}
          handleUpdateScore={handleUpdateScore}
          isGameOver={isGameOver}
        />
      )}
      {gameState === 'gameOver' && (
        <GameOverScreen handleResetGame={handleResetGame} players={players} />
      )}

      {/* Game progress indicator */}
      {gameState !== 'setup' && gameState !== 'gameOver' && (
        <div className='fixed bottom-0 left-0 right-0 bg-gray-100 p-4'>
          <div className='flex justify-between items-center max-w-4xl mx-auto'>
            <p>
              Round: {currentRound}/{totalRounds}
            </p>
            <div className='flex space-x-4'>
              {players.map((player, index) => (
                <p
                  key={index}
                  className={index === targetPlayerIndex ? 'font-bold' : ''}
                >
                  {player.name}: {player.score}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesGame;
