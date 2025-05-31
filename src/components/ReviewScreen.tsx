import { useEffect } from 'react';
import { GameModes, useGameContext } from '../context/GameContext';
import { Footer } from './Footer';

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
  }, []);

  const playerName = players[targetPlayerIndex].name;

  const diffsArray: number[] = [];
  groupPredictions.forEach((cardText, index) => {
    const predictionIndex = targetRankings.indexOf(cardText);
    diffsArray.push(Math.abs(predictionIndex - index));
  });


  return (
    <div className='flex flex-col lg:text-xl w-full items-center justify-between fixed h-[calc(100%-2em)] mb-4 px-2'>
      <>
        <h1 className='lg:text-3xl text-2xl font-bold mb-4'>
          Scores for {players[targetPlayerIndex].name}'s Turn
        </h1>
      </>
      <div className='flex flex-col h-full w-full'>
        <div className='flex lg:flex-col items-center justify-center'>
          <div className='lg:mb-4 h-full lg:h-auto px-2'>
            <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 text-center'>
              {playerName}
            </h2>
            <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col justify-evenly pr-2'>
              {targetRankings.map((card, index) => (
                <div
                  className={`group
                      flex
                      relative
                      border-2
                      rounded-lg
                      mb-2
                      text-center
                      cursor-pointer
                      bg-blue-50
                      border-blue-600
                      shadow-blue-800
                      shadow-md
                      transform
                      transition-all
                      hover:scale-105
                      hover:shadow-2xl
                      items-center
                      justify-center
                      min-w-32
                      max-w-60
                      md:text-lg
                      text-base
                      w-[40vw] md:w-[30vw] lg:w-[15vw]  h-[11vh]
                      lg:p-4
                      p-1.5
                      leading-none
                      md:leading-tight
                      lg:leading-normal
                      break-words`}
                  key={index}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>

          <div className='lg:mt-2 h-full lg:h-auto overflow-x-auto lg:overflow-y-auto no-scrollbar px-2'>
            {gameMode === GameModes.SINGLE_DEVICE && (
              <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 text-center'>
                Group
              </h2>
            )}
            {gameMode === GameModes.SINGLE_DEVICE ? (
              <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col justify-evenly'>
                {groupPredictions.map((card, index) => (
                  <div className='flex lg:flex-col justify-center items-center' key={index}>
                    <span
                      className={`inline-flex items-center rounded-md bg-red-50 px-2 py-1 mr-2 lg:mr-0 lg:mb-1 font-medium ring-1 ring-inset ${diffsArray[index] === 0
                        ? 'text-green-600 ring-green-600'
                        : diffsArray[index] < 3
                          ? 'text-yellow-600 ring-yellow-600'
                          : 'text-red-600 ring-red-600'
                        }`}
                    >
                      {4 - diffsArray[index]}
                    </span>
                    <div
                      className={`group
                        flex
                        relative
                        border-2
                        rounded-lg
                        mb-2
                        text-center
                        cursor-pointer
                        ${diffsArray[index] === 0
                          ? 'shadow-green-900 bg-green-50 border-green-600'
                          : diffsArray[index] < 3
                            ? 'shadow-yellow-900 bg-yellow-50 border-yellow-600'
                            : 'shadow-red-900 bg-red-50 border-red-600'
                        }
                        shadow-lg
                        transform
                        transition-all
                        hover:scale-105
                        hover:shadow-2xl
                        items-center
                        justify-center
                        w-[40vw] md:w-[30vw] lg:w-[15vw]  h-[11vh]
                        md:text-xl
                        text-lg
                        p-2
                        lg:p-4
                        leading-none
                        md:leading-tight
                        lg:leading-normal
                        break-words`}
                    >
                      {card}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex lg:max-h-[60vh] pb-2 lg:pb-0 lg:flex-col'>
                {gameRoom?.players?.filter((_, index) => index !== targetPlayerIndex).map((player) => (
                  <div className='flex flex-col min-w-max justify-center items-center mx-2 lg:mx-0 bg-gray-200 rounded-lg border-2 border-gray-300 p-2 lg:mb-4' key={player.userId}>
                    <div className='flex flex-col sm:grid sm:grid-cols-2 justify-center items-center w-full border-b-2 border-gray-300 pb-1 mb-1'>
                      <h3 className='font-medium text-lg lg:text-xl text-center'>
                        {player.name}
                      </h3>
                      {gameMode === GameModes.ONLINE && (
                        <p className=' font-medium text-lg lg:text-xl text-center leading-none'>
                          Score: {player.roundScore || 0}/20
                        </p>
                      )}
                    </div>
                    <div className='lg:grid lg:grid-cols-5 lg:gap-4 flex flex-col justify-evenly'>
                      {targetRankings.map((rankedCard, cardIndex) => {
                        const diff = Math.abs(targetRankings.indexOf(player.rankings?.[cardIndex] || '') - cardIndex);
                        return (
                          <div className='flex lg:flex-col justify-center items-center' key={cardIndex}>
                            <span
                              className={`inline-flex items-center rounded-md bg-red-50 px-2 py-1 mr-2 lg:mr-0 lg:mb-1 font-medium ring-1 ring-inset ${diff === 0
                                ? 'text-green-600 ring-green-600'
                                : diff < 3
                                  ? 'text-yellow-600 ring-yellow-600'
                                  : 'text-red-600 ring-red-600'
                                }`}
                            >
                              {4 - diff}
                            </span>
                            <div
                              className={`group
                              flex
                              relative
                              border-2
                              rounded-lg
                              mb-2
                              lg:mb-5
                              text-center
                              cursor-pointer
                              ${diff === 0
                                  ? 'shadow-green-900 bg-green-50 border-green-600'
                                  : diff < 3
                                    ? 'shadow-yellow-900 bg-yellow-50 border-yellow-600'
                                    : 'shadow-red-900 bg-red-50 border-red-600'
                                }
                              shadow-lg
                              transform
                              transition-all
                              hover:scale-105
                              hover:shadow-2xl
                              items-center
                              justify-center
                              w-[40vw] md:w-[30vw] lg:w-[15vw] h-[11vh]
                              min-w-32
                              max-w-60
                              md:text-lg
                              text-base
                              lg:p-4
                              p-1.5
                              leading-none
                              md:leading-tight
                              lg:leading-normal
                              break-words`}
                            >
                              {player.rankings?.[cardIndex]}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-row md:mt-3 lg:mt-4 justify-center'>
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

