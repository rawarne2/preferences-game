import { isMobile } from 'react-device-detect';
import { useGameContext } from '../context/GameContext';

export const ReviewScreen = () => {
  const {
    targetRankings,
    groupPredictions,
    roundScore,
    handleUpdateScore,
    isGameOver,
    players,
    targetPlayerIndex,
  } = useGameContext();

  const playerName = players[targetPlayerIndex].name;

  const diffsArray: number[] = [];
  groupPredictions.forEach((cardText, index) => {
    const predictionIndex = targetRankings.indexOf(cardText);
    diffsArray.push(Math.abs(predictionIndex - index));
  });

  return (
    <div className='flex flex-col place-items-center lg:mt-2 lg:w-4/5 md:w-4/5 w-full top-0 fixed md:relative'>
      <h1 className='lg:text-3xl text-2xl font-bold'>Round Review</h1>
      <div className='flex md:flex-col flex-row '>
        <div className='md:mb-6 flex flex-col px-2'>
          <h2 className='font-semibold mb-2 text-xl underline underline-offset-4'>
            {playerName}
          </h2>
          <div className='md:grid grid-cols-5 lg:gap-4 md:gap-2 flex flex-col h-full'>
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
                  lg:min-w-36
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
        <div className='flex flex-col pr-2'>
          <h2 className='font-semibold mb-2 text-xl underline underline-offset-4 pl-6'>
            Group
          </h2>
          <div className='md:grid grid-cols-5 lg:gap-4 gap-1 flex flex-col h-full'>
            {/* TODO: make cards component since it is being used here, target ranking, and group ranking */}
            {groupPredictions.map((card, index) => (
              <div className='flex md:flex-col items-center' key={index}>
                {isMobile && (
                  <span
                    className={`inline-flex items-center rounded-md bg-red-50 px-2 py-1 mr-2 font-medium ring-1 ring-inset ${
                      diffsArray[index] === 0
                        ? 'text-green-600 ring-green-600'
                        : diffsArray[index] < 3
                        ? 'text-yellow-600 ring-yellow-600'
                        : 'text-red-600 ring-red-600'
                    }`}
                  >
                    {4 - diffsArray[index]}
                  </span>
                )}
                <div
                  className={`group
                  flex
                  relative
                  border-2
                  rounded-lg
                  mb-2
                  text-center
                  cursor-pointer
                  ${
                    diffsArray[index] === 0
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
                  lg:min-w-36
                  min-h-20
                  md:text-xl
                  text-lg
                  p-2
                  lg:p-4
                  break-words`}
                >
                  {card}
                </div>
                {!isMobile && (
                  <p className='text-xl font-semibold pt-2'>
                    {diffsArray[index] > 0 ? '-' : ''}
                    {diffsArray[index]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex md:flex-col items-center pt-4'>
        <p className='text-2xl md:my-4 font-semibold pr-12 md:pr-0 underline underline-offset-4'>
          Round Score: {roundScore}/20
        </p>
        <button
          onClick={handleUpdateScore}
          className='px-4 py-2 md:px-6 md:py-4 bg-green-500 text-white rounded hover:bg-green-600 md:mb-12 lg:text-xl'
        >
          {isGameOver ? 'End Game' : 'Next Round'}
        </button>
      </div>
    </div>
  );
};
// TODO: button should be 'End Game', 'Next Round', or 'Next Player'
