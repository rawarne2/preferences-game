import React, { useState } from 'react';
import { Category, GameModes, useGameContext } from '../context/GameContext';
import { OnlinePlayerList } from './OnlinePlayerList';
import { v4 as uuidv4 } from 'uuid';

export const SetupScreen = () => {
  const [newPlayerName, setNewPlayerName] = useState('');
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
    mode
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

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalRounds(parseInt(e.target.value));
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
  };

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col w-fit md:w-3/4 max-w-screen-sm pt-12 mx-2 items-center justify-center'>
      <h1 className='text-3xl font-bold border-4 border-b-blue-600'>
        Preferences
      </h1>

      {/* Game Mode */}
      <div className='md:mt-6 mt-4 border-2 text-lg border-gray-300 rounded-xl bg-gray-100 p-4 lg:p-8'>
        <div role='tablist' className='inline-block lg:mb-6 mb-4'>
          <label className='mr-1 lg:mr-2 font-semibold'>Game Mode: </label>
          <button
            title='Single Device'
            value={GameModes.SINGLE_DEVICE}
            role='tab'
            onClick={() => setGameMode(GameModes.SINGLE_DEVICE)}
            className={`md:px-4 p-2 border text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${gameMode === GameModes.SINGLE_DEVICE
              ? 'bg-blue-500 shadow-lg scale-110 focus:ring-blue-500 font-semibold'
              : 'bg-gray-400 hover:bg-gray-500'
              }`}
          >
            Single Device
          </button>
          <button
            title='Online'
            value={GameModes.ONLINE}
            role='tab'
            onClick={() => setGameMode(GameModes.ONLINE)}
            className={`md:px-4 p-2 border text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${gameMode === GameModes.ONLINE
              ? 'bg-blue-500 shadow-lg scale-110  focus:ring-blue-500 font-semibold'
              : 'bg-gray-400 hover:bg-gray-500'
              }`}
          >
            Online
          </button>
        </div>

        {/* Single Device or Online */}
        {gameMode === GameModes.SINGLE_DEVICE ? (
          <div className='flex flex-col items-center'>
            <div className='flex items-center space-x-2 w-full lg:mb-4 mb-2'>
              <input
                type='text'
                value={newPlayerName}
                onChange={handleNewPlayerNameChange}
                placeholder='Add a player'
                className='p-2 border rounded w-full'
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
              <div className='lg:mb-4 mb-2'>
                <ul className='space-y-2'>
                  {players.map((player, index) => (
                    <li key={index} className='flex justify-around'>
                      <div className='bg-white px-4 flex-1 py-2 ml-4 border border-gray-300 rounded'>
                        {player.name}
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className='bg-red-500 hover:bg-red-700 rounded ml-1 md:ml-2 px-3 p text-white'
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
      </div>
      {(gameMode === GameModes.SINGLE_DEVICE || (mode === 'create' || mode === 'ready')) && (

        <>
          {/* Category */}
          <div className='md:mt-4 mt-2 border-2 border-gray-300 rounded-xl bg-gray-100 lg:p-4 p-2 text-lg'>
            <label>
              <span className='font-semibold mr-1 lg:mr-2'>Select Category:</span>
              <select
                value={category ?? ''}
                onChange={(e) => handleCategoryChange(e.target.value as Category)}
                className='bg-blue-500 text-white rounded hover:bg-blue-400 p-2'
              >
                <option value='general'>General</option>
                <option value='adult'>Adult</option>
                <option value='pop-culture'>Pop Culture</option>
                <option value='dating'>Dating</option>
              </select>
            </label>
          </div>

          {/* Number of Rounds */}
          <div className='md:mt-4 mt-2 border-2 border-gray-300 rounded-xl bg-gray-100 lg:p-4 p-2'>
            <label className='mr-1 lg:mr-2 font-semibold'>
              Number of Rounds:
              <input
                type='number'
                value={totalRounds}
                name='rounds'
                onChange={handleRoundsChange}
                className='ml-2 p-1 border rounded w-20'
              />
            </label>
          </div>

          {/* Start Game Button */}
          <button
            onClick={handleStartGame}
            disabled={players?.length < 2}
            className='my-6 w-40 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400'
          >
            Start Game
          </button>
        </>
      )}
    </div>
  );
};
