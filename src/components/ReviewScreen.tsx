import { useEffect } from 'react';
import { GameModes, useGameContext } from '../context/GameContext';
import { Footer } from './Footer';
import { ResultCard } from './ResultCard';

export const ReviewScreen = () => {
  const {
    targetRankings,
    groupPredictions,
    roundScore,
    handleUpdateScore,
    isGameOver,
    players,
    targetPlayerIndex,
    gameMode,
    gameRoom,
    setTargetRankings,
    currentRound
  } = useGameContext();

  useEffect(() => {
    if (gameRoom?.game?.targetRankings) {
      setTargetRankings(gameRoom?.game?.targetRankings)
    }
  }, [gameRoom?.game?.targetRankings, setTargetRankings]);

  const playerName = players[targetPlayerIndex].name;

  const diffsArray: number[] = [];
  groupPredictions.forEach((cardText, index) => {
    const predictionIndex = targetRankings.indexOf(cardText);
    diffsArray.push(Math.abs(predictionIndex - index));
  });


  return (
    <div className='flex flex-col lg:text-xl w-full items-center justify-between lg:justify-start lg:mb-16 md:px-2 lg:px-0 box-border h-[80vh]'>
      <h1 className='lg:text-3xl text-2xl font-bold mb-4 lg:mt-4'>
        Scores for {players[targetPlayerIndex].name}'s Turn
      </h1>
      <div className='flex flex-col w-full justify-start h-full'>
        <div className='flex lg:flex-col items-center justify-center mx-auto'>
          <div className='px-1 md:px-2'>
            <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 text-center'>
              {playerName}
            </h2>
            <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col justify-evenly'>
              {targetRankings.map((card, index) => (
                <ResultCard
                  key={index}
                  text={card}
                  rank={index + 1}
                  showRank={true}
                  variant="default"
                  size="medium"
                />
              ))}
            </div>
          </div>

          <div className='lg:mt-4 p-1 md:p-2 h-full lg:h-auto overflow-x-auto lg:overflow-y-auto no-scrollbar'>
            {gameMode === GameModes.SINGLE_DEVICE && (
              <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 text-center'>
                Group
              </h2>
            )}
            {gameMode === GameModes.SINGLE_DEVICE ? (
              <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col justify-evenly'>
                {groupPredictions.map((card, index) => {
                  const score = 4 - diffsArray[index];
                  const variant = diffsArray[index] === 0
                    ? 'success'
                    : diffsArray[index] < 3
                      ? 'warning'
                      : 'error';

                  return (
                    <ResultCard
                      key={index}
                      text={card}
                      score={score}
                      showScore={true}
                      variant={variant}
                      size="medium"
                    />
                  );
                })}
              </div>
            ) : (
              <div className='flex lg:max-h-[60vh] pb-2 lg:pb-0 lg:flex-col'>
                {gameRoom?.players?.filter((_, index) => index !== targetPlayerIndex).map((player) => (
                  <div className='flex flex-col min-w-max justify-center items-center ml-1 lg:mx-0 bg-gray-200 rounded-lg border-2 border-gray-300 px-1 lg:mb-4' key={player.userId}>
                    <div className='flex flex-col sm:grid sm:grid-cols-2 justify-center items-center w-full border-b-2 border-gray-300 pb-1 mb-1'>
                      <h3 className='font-medium text-lg lg:text-xl text-center'>
                        {player.name}
                      </h3>
                      {gameMode === GameModes.ONLINE && (
                        <p className='font-medium text-lg lg:text-xl text-center leading-none'>
                          Score: {player.roundScore || 0}/20
                        </p>
                      )}
                    </div>
                    <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col justify-evenly'>
                      {targetRankings.map((_, cardIndex) => {
                        const diff = Math.abs(targetRankings.indexOf(player.rankings?.[cardIndex] || '') - cardIndex);
                        const score = 4 - diff;
                        const variant = diff === 0
                          ? 'success'
                          : diff < 3
                            ? 'warning'
                            : 'error';

                        return (
                          <ResultCard
                            key={cardIndex}
                            text={player.rankings?.[cardIndex] || ''}
                            score={score}
                            showScore={true}
                            variant={variant}
                            size="medium"
                          />
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-row md:mt-3 lg:mb-16 pb-2 md:pb-4 justify-evenly bottom-8 lg:bottom-0 fixed w-full'>
          {gameMode === GameModes.SINGLE_DEVICE && (
            <p className='text-2xl font-semibold underline underline-offset-4 flex items-center'>
              Score: {roundScore}/20
            </p>
          )}
          <button
            onClick={handleUpdateScore}
            className='px-10 py-1 max-h-12 bg-green-600 text-white font-semibold rounded hover:bg-green-700 border-2 border-green-800'
          >
            {isGameOver ? 'End Game' : currentRound < players.length ? 'Next Player' : 'Next Round'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

