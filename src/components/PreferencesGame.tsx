import React from 'react';
import { SetupScreen } from './SetupScreen';
import { ReviewScreen } from './ReviewScreen';
import { GameOverScreen } from './GameOverScreen';
import { useGameContext } from '../context/GameContext';
import { CardRankingScreen } from './CardRankingScreen';
import { Footer } from './Footer';

const PreferencesGame: React.FC = () => {
  const { gameState } = useGameContext();

  // Render the appropriate screen based on game state
  return (
    <>
      {gameState === 'setup' && <SetupScreen />}
      {(gameState === 'targetRanking' || gameState === 'groupPrediction') && (
        <CardRankingScreen />
      )}
      {gameState === 'review' && <ReviewScreen />}
      {gameState === 'gameOver' && <GameOverScreen />}
      {gameState !== 'setup' && gameState !== 'gameOver' && <Footer />}
    </>
  );
};

export default PreferencesGame;
