import { Player } from './PreferencesGame';

export const GameOverScreen = ({
  players,
  handleResetGame,
}: {
  players: Player[];
  handleResetGame: () => void;
}) => {
  const winner = [...players].sort((a, b) => a.score - b.score)[0];
  const isTie = players.filter((p) => p.score === winner.score).length > 1;

  return (
    <div className='flex flex-col items-center p-4'>
      <h2 className='text-3xl font-bold mb-6'>Game Over!</h2>

      {isTie ? (
        <p className='text-xl mb-4'>It's a tie!</p>
      ) : (
        <p className='text-xl mb-4'>Winner: {winner.name}!</p>
      )}

      <div className='w-full max-w-md'>
        <h3 className='text-xl font-semibold mb-2'>Final Scores:</h3>
        <ul className='space-y-2'>
          {[...players]
            .sort((a, b) => a.score - b.score)
            .map((player, index) => (
              <li
                key={index}
                className='flex justify-between items-center p-2 bg-gray-100 rounded'
              >
                <span>{player.name}</span>
                <span>{player.score} points</span>
              </li>
            ))}
        </ul>
      </div>

      <button
        onClick={handleResetGame}
        className='mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Play Again
      </button>
    </div>
  );
};
