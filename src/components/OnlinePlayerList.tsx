import React, { useState, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';


export const OnlinePlayerList: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);

  const { players, setPlayers, socket, roomCode, setRoomCode, isConnecting, error, setError, mode, setMode, onlineUserId, setOnlineUserId } = useGameContext(); // currentOnlineuserId. 

  const newId = uuidv4();

  // Handle room creation
  const handleCreateRoom = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('create-room');
    }
  }, [socket]);

  // Handle room joining
  const handleJoinRoom = useCallback(() => {
    if (mode === 'select') {
      setMode('join');
      return;
    }

    if (socket && socket.connected && inputCode.length === 10 && name.trim()) {
      socket.emit('join-room', { roomCode: inputCode, userId: newId, name: name.trim() });
      setRoomCode(inputCode);
      setIsNameSubmitted(true);
      setOnlineUserId(newId);
      setMode('ready');
      setError('');
    } else if (!name.trim()) {
      setError('Please enter your name');
    } else if (inputCode.length !== 10) {
      setError('Invalid room code');
    } else {
      setError('Please enter your name and room code');
    }
  }, [socket, inputCode, name, onlineUserId]);

  const handleNameSubmit = useCallback(
    () => {
      if (
        socket &&
        socket.connected &&
        name.trim() &&
        name.length <= 20
      ) {
        socket.emit('join-room', {
          roomCode,
          name: name.trim(),
          userId: newId,
        });

        setIsNameSubmitted(true);
        setOnlineUserId(newId);
      } else if (!name.trim()) {
        setError('Please enter your name');
      }
    },
    [socket, roomCode, name, onlineUserId]
  );

  // Handle leaving room
  const handleBack = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('leave-room', { roomCode, userId: onlineUserId });
    }
    setMode('select');
    setRoomCode('');
    setInputCode('');
    setName('');
    setIsNameSubmitted(false);
    setPlayers([]);
    setError('');
  }, [socket, roomCode, setPlayers]);

  return (
    <div className='bg-white rounded-xl shadow-sm shadow-blue-900 lg:p-8 p-4 my-4 w-full'>
      <h2 className='text-2xl font-bold text-blue-600 mb-6 text-center'>
        Game Room Setup
      </h2>

      {isConnecting && (
        <p className='text-blue-500 text-center'>Connecting to server...</p>
      )}

      {!isConnecting && mode === 'select' && (
        <div className='space-y-4'>
          <button
            onClick={handleCreateRoom}
            className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
          >
            Create New Room
          </button>
          <button
            onClick={handleJoinRoom}
            className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
          >
            Join Room
          </button>
          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </div>
      )}

      {!isConnecting && mode === 'join' && (
        <div className='space-y-4'>
          <button
            onClick={handleBack}
            className='text-blue-500 hover:text-blue-600 flex items-center gap-2 mb-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Back
          </button>
          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Enter Room Code'
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className='w-full py-3 px-4 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              maxLength={10}
            />
            <input
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full py-3 px-4 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              maxLength={20}
            />
            <button
              onClick={handleJoinRoom}
              className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!inputCode || inputCode.length !== 10 || !name.trim()}
            >
              Join Game
            </button>
          </div>
          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </div>
      )}

      {!isConnecting && (mode === 'create' || mode === 'ready') && (
        <div className='space-y-4'>
          <button
            onClick={handleBack}
            className='text-blue-500 hover:text-blue-600 flex items-center gap-2 mb-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Back
          </button>
          <div className='bg-gray-200 p-4 rounded-lg'>
            <p className='text-sm text-gray-600'>Room Code:</p>
            <p className='text-xl font-mono font-bold text-blue-600'>
              {roomCode}
            </p>
          </div>

          {!isNameSubmitted ? (
            <form onSubmit={handleNameSubmit} className='space-y-4'>
              <div>
                <input
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full py-3 px-4 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  maxLength={20}
                />
                <button
                  type="submit"
                  className='mt-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={!name.trim()}
                >
                  Create Game
                </button>
              </div>
              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            </form>
          ) : (
            <div className='space-y-4'>
              <div className='bg-blue-200 p-4 rounded-lg'>
                <p className='text-sm text-blue-600'>Your name:</p>
                <p className='font-medium'>{name}</p>
              </div>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Players in Room
                </h3>
                <div className='space-y-2'>
                  {players?.map((player) => (
                    <div
                      key={player.userId}
                      className='bg-gray-200 p-3 rounded-lg flex items-center'
                    >
                      <span className='text-gray-800'>{player.name}</span>
                    </div>
                  ))}
                  {players?.length === 0 && (
                    <p className='text-gray-500 text-sm'>No players in the room yet.</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleBack}
                className='w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
              >
                Leave Room
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
