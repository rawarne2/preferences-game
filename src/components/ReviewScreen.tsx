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
  } = useGameContext();

  const playerName = players[targetPlayerIndex].name;

  const diffsArray: number[] = [];
  groupPredictions.forEach((cardText, index) => {
    const predictionIndex = targetRankings.indexOf(cardText);
    diffsArray.push(Math.abs(predictionIndex - index));
  });

  return (
    <div className='flex flex-col lg:text-xl w-full h-full items-center justify-center'>
      <h1 className='lg:text-3xl text-2xl font-bold md:my-6 my-4 fixed top-0'>
        Round Review
      </h1>
      <div className='fixed bottom-auto pb-12 m-4 overflow-y-visible'>
        <div className='lg:p-4 w-full'>
          <div className='flex lg:flex-col items-center justify-center'>
            <div className='lg:mb-4'>
              <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 text-center'>
                {playerName}
              </h2>
              <div className='lg:grid grid-cols-5 lg:gap-4 flex flex-col pr-2'>
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
                      shadow-lg
                      transform
                      transition-all
                      hover:scale-105
                      hover:shadow-2xl
                      items-center
                      justify-center
                      h-full
                      w-full
                      lg:min-h-28
                      min-w-40
                      min-h-20
                      md:text-xl
                      text-lg
                      md:p-2
                      lg:p-4
                      p-2
                      break-words`}
                    key={index}
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>

            <div className='lg:mt-2'>
              <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 text-center'>
                Group
              </h2>
              <div className='lg:grid grid-cols-5 lg:gap-4 flex flex-col pl-2'>
                {gameMode === GameModes.SINGLE_DEVICE && groupPredictions.map((card, index) => (
                  <div className='flex lg:flex-col justify-center items-center' key={index}>
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
                      h-full
                      w-full
                      lg:min-h-28
                      min-w-36
                      min-h-20
                      md:text-xl
                      text-lg
                      p-2
                      lg:p-4
                      break-words`}
                    >
                      {card}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-md bg-red-50 px-2 py-1 ml-2 font-medium ring-1 ring-inset ${diffsArray[index] === 0
                        ? 'text-green-600 ring-green-600'
                        : diffsArray[index] < 3
                          ? 'text-yellow-600 ring-yellow-600'
                          : 'text-red-600 ring-red-600'
                        }`}
                    >
                      {4 - diffsArray[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-row my-2 md:mt-3 lg:mt-4 justify-center'>
          <p className='text-2xl font-semibold mr-4 underline underline-offset-4 flex items-center'>
            Score: {roundScore}/20
          </p>
          <button
            onClick={handleUpdateScore}
            className='px-12 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600'
          >
            {isGameOver ? 'End Game' : 'Next Round'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};
// TODO: button should be 'End Game', 'Next Round', or 'Next Player'
