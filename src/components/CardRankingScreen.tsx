import { DragAndDropRanking } from './DragAndDropRanking';
import { GameModes, useGameContext } from '../context/GameContext';
import { Footer } from './Footer';
import { ResetGameButton } from './ResetGameButton';
import { useState } from 'react';
// TODO: rename onlineUserId to onlinePlayerId
export const CardRankingScreen = () => {
  const { players, targetPlayerIndex, gameState, gameMode, onlineUserId, currentCards, setTargetRankings, setGameState, setGroupPredictions, setPlayers, socket, roomCode } = useGameContext();

  const [availableCards, setAvailableCards] = useState<string[]>(currentCards);
  const [rankedCards, setRankedCards] = useState<(string | null)[]>(
    new Array(5).fill(null)
  );

  const canSubmit = rankedCards.every((card) => card !== null);

  const handleSubmitRankings = () => {
    if (canSubmit) {
      console.log('Final Rankings:', rankedCards);
      if (gameState === 'targetRanking') {
        if (gameMode === GameModes.SINGLE_DEVICE) {
          setTargetRankings(rankedCards);
          setGameState('groupPrediction');
          setAvailableCards(currentCards);
          setRankedCards(new Array(5).fill(null));
        } else if (gameMode === GameModes.ONLINE) {
          // update the ranking of the player with id === onlineUserId
          socket?.emit('submit-rankings', { roomCode, userId: onlineUserId, rankings: rankedCards });
          setGameState('waitingForRankings');
        }
      } else if (gameState === 'groupPrediction') {
        if (gameMode === GameModes.ONLINE) {
          const playerIndex = players.findIndex(player => player.userId === onlineUserId);
          if (playerIndex !== -1) {
            const updatedPlayers = [...players];
            updatedPlayers[playerIndex].rankings = rankedCards;
            setPlayers(updatedPlayers);
          }
        } else {
          setGroupPredictions(rankedCards);
        }
        setGameState('review');
      }
    }
  };

  const targetPlayerName = players[targetPlayerIndex].name;
  const currentPlayer = onlineUserId
    ? players.find((player) => player.userId === onlineUserId)
    : players[targetPlayerIndex];

  console.log('currentPlayer', currentPlayer?.name, gameState);
  console.log('onlineUserId', onlineUserId, players);

  return (
    <div className='flex flex-col lg:text-xl w-full items-center h-[calc(100%-2em)]'>
      <h1 className='lg:text-3xl text-2xl font-bold lg:my-16 md:my-6'>
        {
          gameState === 'targetRanking'
            ? `${targetPlayerName}'s Turn to Rank`
            : gameMode === GameModes.SINGLE_DEVICE
              ? `Group Prediction`
              : `${currentPlayer?.name}'s turn to guess ${targetPlayerName}'s Rank`
        }
      </h1>
      {gameState === 'waitingForRankings' && (
        <div>
          <h3>Waiting for rankings...</h3>
        </div>
      )}
      <div className='p-4 lg:h-4/5'>
        <DragAndDropRanking availableCards={availableCards} rankedCards={rankedCards} setRankedCards={setRankedCards} setAvailableCards={setAvailableCards} />
        <div className='flex flex-row mt-2 md:my-6 lg:my-8 justify-center'>
          <ResetGameButton />
          <button
            onClick={handleSubmitRankings}
            className={`px-10 py-1 max-h-12 ml-6 bg-green-600 text-white font-semibold rounded hover:bg-green-700 border-2 border-green-800`}
          >
            Submit Ranking
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
