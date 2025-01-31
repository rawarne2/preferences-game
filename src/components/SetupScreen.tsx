import React, { useId, useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { Category } from '../context/GameProvider';
import { OnlinePlayerList } from './OnlinePlayerList';

export type GameMode = 'ONLINE' | 'SINGLE_DEVICE';
export const gameModes: GameMode[] = ['SINGLE_DEVICE', 'ONLINE'];

export const SetupScreen = () => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameMode, setGameMode] = useState('SINGLE_DEVICE');
  const {
    setTotalRounds,
    totalRounds,
    players,
    setPlayers,
    handleStartGame,
    setCategory,
    category,
  } = useGameContext();
  const handleNewPlayerNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPlayerName(e.target.value);
  };

  const newId = useId();

  const handleAddPlayer = () => {
    if (newPlayerName.trim() !== '') {
      setPlayers([...players, { name: newPlayerName, score: 0, id: newId }]);
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
    <div className='flex flex-col'>
      <h1 className='text-3xl font-bold border-4 border-b-blue-600'>
        Preferences
      </h1>

      {/* Game Mode */}
      <div className='md:mt-6 mt-4 border-2 text-lg border-gray-300 rounded-xl bg-gray-100 lg:p-4 p-2'>
        <div role='tablist' className='block lg:mb-6 mb-4'>
          <span className='mr-1 lg:mr-2 font-semibold'>Game Mode: </span>
          <button
            title='Single Device'
            value={'SINGLE_DEVICE'}
            role='tab'
            onClick={() => setGameMode('SINGLE_DEVICE')}
            className={`md:px-4 px-4 py-2 border text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
              gameMode === 'SINGLE_DEVICE'
                ? 'bg-blue-500 shadow-lg scale-110 focus:ring-blue-500 font-semibold'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            Single Device
          </button>
          <button
            title='Online'
            value={'ONLINE'}
            role='tab'
            onClick={() => {
              return setGameMode('ONLINE');
            }}
            className={`md:px-4 px-4 py-2 border text-white rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
              gameMode === 'ONLINE'
                ? 'bg-blue-500 shadow-lg scale-110  focus:ring-blue-500 font-semibold'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
          >
            Online
          </button>
        </div>

        {/* single device or online */}
        {gameMode === 'SINGLE_DEVICE' ? (
          <div className='flex flex-col items-center'>
            {/* <h2 className='text-xl font-semibold pb-4'>Players:</h2> */}
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
                // autoFocus
              />
              <button
                onClick={handleAddPlayer}
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400'
              >
                Add
              </button>
            </div>
            {players.length > 0 && (
              <div className='lg:mb-4 mb-2'>
                <ul className='space-y-2'>
                  {players.map((player, index) => (
                    <li key={index} className='flex justify-around'>
                      <div className='bg-white px-4 flex-1 py-2 mx-4 border border-gray-300 rounded'>
                        {player.name}
                      </div>
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className='bg-red-500 hover:bg-red-700 rounded px-4 py-2 text-white'
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <OnlinePlayerList />
        )}
      </div>
      <div className='md:mt-4 mt-2 border-2 border-gray-300 rounded-xl bg-gray-100 lg:p-4 p-2 text-lg'>
        {/* Select Category */}
        <label>
          <span className='font-semibold mr-1 lg:mr-2'>Select Category:</span>
          <select
            value={category ?? ''}
            onChange={(e) => handleCategoryChange(e.target.value as Category)}
            className='bg-blue-500 text-white rounded hover:bg-blue-400 p-2'
          >
            {/* <option value='' disabled>
              Select a category
            </option> */}
            <option value='general'>General</option>
            <option value='adult'>Adult</option>
            <option value='pop-culture'>Pop Culture</option>
            <option value='dating'>Dating</option>
          </select>
        </label>
      </div>

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
      <div>
        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className='mt-6 w-40 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400'
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
