import React from 'react';
import { SetupScreen } from './SetupScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { useGameContext } from '../context/GameContext';
import { CardRankingScreen } from './CardRankingScreen';

const PreferencesGame: React.FC = () => {
  const { gameState, currentRound, totalRounds, players, targetPlayerIndex } =
    useGameContext();

  // Render the appropriate screen based on game state
  return (
    <div className='min-h-screen bg-white'>
      {gameState === 'setup' && <SetupScreen />}
      {(gameState === 'targetRanking' || gameState === 'groupPrediction') && (
        <CardRankingScreen />
      )}
      {gameState === 'review' && <ReviewScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}

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
