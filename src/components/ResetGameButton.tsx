export const ResetGameButton = () => {
  const clearLocalStorage = () => {
    if (window.confirm('Are you sure you want to reset the game?')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  return (
    <button
      className='px-2 h-10 bg-red-500 text-white rounded hover:bg-red-600'
      onClick={clearLocalStorage}
    >
      Reset Game
    </button>
  );
};
