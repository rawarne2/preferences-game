import { DragAndDropRanking } from './DragAndDropRanking';
import { GameModes, useGameContext } from '../context/GameContext';
import { Footer } from './Footer';
import { ResetGameButton } from './ResetGameButton';
import { useState } from 'react';
// TODO: rename onlineUserId to onlinePlayerId
export const CardRankingScreen = () => {
  const { players, targetPlayerIndex, gameState, gameMode, gameRoom, onlineUserId, currentCards, setTargetRankings, setGameState, setGroupPredictions, setPlayers, socket, roomCode } = useGameContext();

  const [availableCards, setAvailableCards] = useState<string[]>(currentCards);
  const [rankedCards, setRankedCards] = useState<(string | null)[]>(
    new Array(5).fill(null)
  );

  const canSubmit = rankedCards.every((card) => card !== null);

  const handleSubmitRankings = () => {
    if (canSubmit) {
      if (gameState === 'targetRanking') {
        if (gameMode === GameModes.SINGLE_DEVICE) {
          setGameState('groupPrediction');
          setTargetRankings(rankedCards);
          setAvailableCards(currentCards);
          setRankedCards(new Array(5).fill(null));
        } else if (gameMode === GameModes.ONLINE) {
          console.log('submit-rankings', { roomCode: roomCode, userId: onlineUserId, rankings: rankedCards });
          socket?.emit('submit-rankings', { roomCode: gameRoom?.code, userId: onlineUserId, rankings: rankedCards });
          setGameState('waitingForRankings');
        }
      } else if (gameState === 'groupPrediction') {
        if (gameMode === GameModes.ONLINE) {
          // update the rankings AND the score in the backend
          const playerIndex = players.findIndex(player => player.userId === onlineUserId);
          if (playerIndex !== -1) {
            const updatedPlayers = [...players];
            updatedPlayers[playerIndex].rankings = rankedCards;
            setPlayers(updatedPlayers);
            console.log('submit-rankings', { roomCode: gameRoom?.code, userId: onlineUserId, rankings: rankedCards });
            socket?.emit('submit-rankings', { roomCode: gameRoom?.code, userId: onlineUserId, rankings: rankedCards });
            setGameState('waitingForRankings');
          }
        } else {
          setGroupPredictions(rankedCards);
          setGameState('review');
        }
      }
    }
  };

  const targetPlayerName = players[targetPlayerIndex].name;

  return (
    <div className='flex flex-col lg:text-xl w-full items-center h-[calc(100%-2em)] md:h-full'>
      <h1 className='lg:text-3xl text-2xl font-bold lg:my-12 md:my-4 mb-4'>
        {
          gameState === 'targetRanking'
            ? (gameMode === GameModes.SINGLE_DEVICE ? `${targetPlayerName}'s Turn to Rank` : <><div>Your turn {targetPlayerName}!</div><p className='text-sm leading-none'>Rank these cards based on your preferences!</p></>)
            : gameMode === GameModes.SINGLE_DEVICE
              ? `Group Prediction`
              : `Guess ${targetPlayerName}'s Rankings`
        }
      </h1>
      <div className='lg:h-4/5'>
        <DragAndDropRanking availableCards={availableCards} rankedCards={rankedCards} setRankedCards={setRankedCards} setAvailableCards={setAvailableCards} />
        <div className='flex flex-row mt-2 lg:my-8 justify-center'>
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
