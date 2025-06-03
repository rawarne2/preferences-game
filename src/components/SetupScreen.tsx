import React, { useState } from 'react';
import { Category, GameModes, useGameContext } from '../context/GameContext';
import { OnlinePlayerList } from './OnlinePlayerList';
import { v4 as uuidv4 } from 'uuid';

export const SetupScreen = () => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showGameModeInfo, setShowGameModeInfo] = useState(false);
  const {
    setTotalRounds,
    totalRounds,
    players,
    setPlayers,
    handleStartGame,
    setCategory,
    category,
    gameMode,
    setGameMode,
    mode,
    gameRoom,
    onlineUserId
    // setOnlineUserId,
  } = useGameContext();
  const handleNewPlayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPlayerName(e.target.value);
  };

  const newId = uuidv4();

  const handleAddPlayer = () => {
    if (newPlayerName.trim() !== '') {
      setPlayers([...players, { name: newPlayerName, score: 0, userId: newId }]);
      setNewPlayerName('');
    }
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTotalRounds(parseInt(e.target.value));
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleSetGameMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    setGameMode(e.currentTarget.value as GameModes);
  };

  const isHost = gameRoom?.players?.find(player => player.userId === onlineUserId)?.isHost;

  return (
    <div className='flex flex-col w-full md:w-3/4 max-w-screen-sm pt-4 items-center justify-center overflow-y-scroll no-scrollbar'>
      <h1 className='text-3xl font-bold border-b-4 border-b-blue-600'>
        Preferences
      </h1>

      {/* Game Mode */}
      <div className='text-lg w-[96%] md:w-auto md:m-4 rounded-xl bg-gray-200 p-3 md:p-4 lg:p-8 overflow-auto no-scrollbar '>
        <div className="bg-white rounded-xl shadow-sm shadow-blue-900 p-4 w-full">
          <div role='tablist' className='inline-block'>
            <div className='flex items-center mb-2'>
              <button
                onClick={() => setShowGameModeInfo(!showGameModeInfo)}
                className='mr-1 w-5 h-5 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 flex items-center justify-center font-bold'
                title='Game Mode Information'
              >
                ?
              </button>
              <label className='mr-1 lg:mr-2 font-medium'>Game Mode: </label>
              <button
                title='Single Device'
                value={GameModes.SINGLE_DEVICE}
                role='tab'
                onClick={handleSetGameMode}
                className={`py-2 px-2 md:px-8 border text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${gameMode === GameModes.SINGLE_DEVICE
                  ? 'bg-blue-500 shadow-lg scale-110 focus:ring-blue-500 font-semibold'
                  : 'bg-gray-400 hover:bg-gray-1000'
                  }`}
              >
                Offline
              </button>
              <button
                title='Online'
                value={GameModes.ONLINE}
                role='tab'
                onClick={handleSetGameMode}
                className={`py-2 px-2 md:px-8 border text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${gameMode === GameModes.ONLINE
                  ? 'bg-blue-500 shadow-lg scale-110  focus:ring-blue-500 font-semibold'
                  : 'bg-gray-400 hover:bg-gray-1000'
                  }`}
              >
                Online
              </button>
            </div>
            {showGameModeInfo && (
              <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm'>
                <div className='space-y-2'>
                  <div>
                    <span className='font-semibold text-blue-700'>Offline:</span> Play on a single device with friends taking turns
                  </div>
                  <div>
                    <span className='font-semibold text-blue-700'>Online:</span> Create or join a room to play with friends on different devices
                  </div>
                </div>
              </div>
            )}
          </div>
          {(gameMode === GameModes.SINGLE_DEVICE || (mode === 'create' || mode === 'ready')) && isHost && (
            <div className='pt-2 flex justify-evenly'>
              {/* Category */}
              <span>
                <label htmlFor='category' className='font-medium mr-1 lg:mr-2'>Category:</label>
                <select
                  name='category'
                  value={category ?? ''}
                  onChange={(e) => handleCategoryChange(e.target.value as Category)}
                  className='bg-blue-500 text-white rounded hover:bg-blue-400 p-2'
                >
                  <option value='general'>General</option>
                  <option value='adult'>Adult</option>
                  <option value='culture'>Culture</option>
                  <option value='dating'>Dating</option>
                </select>
              </span>

              {/* Number of Rounds */}
              <span>
                <label htmlFor='rounds' className='mr-1 lg:mr-2 font-medium'>Rounds:</label>
                <select
                  value={totalRounds}
                  name='rounds'
                  onChange={handleRoundsChange}
                  className='bg-blue-500 text-white text-center rounded hover:bg-blue-400 p-2'
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </span>
            </div>
          )}
        </div>

        {gameMode === GameModes.SINGLE_DEVICE ? (
          <div className='flex flex-col items-center bg-white rounded-xl shadow-sm shadow-blue-900 lg:p-8 p-4 my-4 w-full'>
            <div className='flex justify-center items-center space-x-2 lg:mb-4 mb-2 w-full'>
              <input
                type='text'
                value={newPlayerName}
                onChange={handleNewPlayerNameChange}
                placeholder='Add a player'
                className='p-2 border rounded w-full border-gray-400'
                name='newPlayerName'
                id='newPlayerName'
                maxLength={20}
              />
              <button
                onClick={handleAddPlayer}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400'
              >
                Add
              </button>
            </div>
            {players?.length > 0 && (
              <div className='lg:mb-4 mb-2 w-full'>
                <ul className='space-y-2'>
                  {players.map((player, index) => (
                    <li key={index} className='flex justify-center items-center'>
                      <div className='bg-gray-200 px-4 flex-1 py-2 rounded-lg'>
                        {player.name}
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className='bg-red-500 hover:bg-red-700 rounded ml-1 md:ml-2 px-3 text-white text-center h-8'
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <OnlinePlayerList />
          // <OnlineSetup />
        )}
        {(gameMode === GameModes.SINGLE_DEVICE || (mode === 'create' || mode === 'ready')) && (
          <button
            onClick={handleStartGame}
            disabled={players?.length < 2}
            className='mb-4 w-40 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400'
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
};
