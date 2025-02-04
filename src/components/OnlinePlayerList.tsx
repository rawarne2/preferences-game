import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, useGameContext } from '../context/GameContext';

export const OnlinePlayerList: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { players, setPlayers } = useGameContext();
  const serverUrl = import.meta.env.VITE_WEBSOCKET_SERVER_URL;
  // Socket connection setup
  useEffect(() => {
    // Create socket connection
    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
      secure: true,
      extraHeaders: {
        'my-custom-header': 'abcd',
      },
      transports: ['websocket'],
      rejectUnauthorized: false,
    });

    if (newSocket.active) {
      console.log('active socket! ', newSocket);
    }

    // Set up socket listeners
    const handleConnect = () => {
      console.log('connected to server!', newSocket);
      setIsConnecting(false);
    };
    setSocket(newSocket);

    const handleDisconnect = () => {
      setIsConnecting(true);
      setError('Disconnected from server');
    };

    const handleRoomCreated = (code: string) => {
      setRoomCode(code);
      setMode('create');
      setError('');
    };

    const handleRoomJoined = (roomData: {
      code: string;
      players: Player[];
    }) => {
      setRoomCode(roomData.code);
      setPlayers(roomData.players);
      setMode('join');
      setError('');
    };

    const handlePlayerJoined = (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    };

    const handlePlayerLeft = (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    };

    const handleError = (errorMessage: Error) => {
      setError(String(errorMessage));
    };

    // Attach listeners
    newSocket.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('roomCreated', handleRoomCreated);
    newSocket.on('roomJoined', handleRoomJoined);
    newSocket.on('playerJoined', handlePlayerJoined);
    newSocket.on('playerLeft', handlePlayerLeft);
    newSocket.on('connect_error', handleError);

    // Cleanup function
    return () => {
      // Remove all listeners
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('roomCreated', handleRoomCreated);
      newSocket.off('roomJoined', handleRoomJoined);
      newSocket.off('playerJoined', handlePlayerJoined);
      newSocket.off('playerLeft', handlePlayerLeft);
      newSocket.off('connect_error', handleError);

      // Disconnect socket
      newSocket.disconnect();
    };
  }, [serverUrl]);

  // Handle room creation
  const handleCreateRoom = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('createRoom');
    }
  }, [socket]);

  // Handle room joining
  const handleJoinRoom = useCallback(() => {
    if (socket && socket.connected && inputCode.length === 10) {
      socket.emit('joinRoom', inputCode);
    } else {
      setError('Invalid room code');
    }
  }, [socket, inputCode]);

  // Handle name submission
  const handleNameSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (
        socket &&
        socket.connected &&
        playerName.trim() &&
        playerName.length <= 20
      ) {
        socket.emit('submitName', {
          roomCode,
          playerName: playerName.trim(),
          playerId: socket.id,
        });
        setIsNameSubmitted(true);
      }
    },
    [socket, roomCode, playerName]
  );

  // Handle leaving room
  const handleBack = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit('leaveRoom', roomCode);
    }
    setMode('select');
    setRoomCode('');
    setPlayerName('');
    setIsNameSubmitted(false);
    setPlayers([]);
  }, [socket, roomCode]);

  return (
    <div className='bg-gray-100'>
      <div className='bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='lg:p-8 p-4'>
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
                disabled={!socket?.connected}
                className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
              >
                Create New Room
              </button>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Enter Room Code'
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  maxLength={10}
                />
                <button
                  onClick={handleJoinRoom}
                  disabled={!socket?.connected}
                  className='mt-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
                >
                  Join Room
                </button>
              </div>
              {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
            </div>
          )}

          {!isConnecting && (mode === 'create' || mode === 'join') && (
            <div className='space-y-4'>
              {mode === 'create' && (
                <button
                  onClick={handleBack}
                  className='text-blue-500 hover:text-blue-600 flex items-center gap-2 mb-4'
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
              )}
              <div className='bg-gray-50 p-4 rounded-lg'>
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
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      maxLength={20}
                    />
                    <button
                      type='submit'
                      disabled={!socket?.connected}
                      className='mt-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
                    >
                      Join Game
                    </button>
                  </div>
                </form>
              ) : (
                <div className='space-y-4'>
                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <p className='text-sm text-blue-600'>Your name:</p>
                    <p className='font-medium'>{playerName}</p>
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                      Players in Room
                    </h3>
                    <div className='space-y-2'>
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className='bg-gray-50 p-3 rounded-lg flex items-center'
                        >
                          <span className='text-gray-800'>{player.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
