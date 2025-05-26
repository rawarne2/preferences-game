// import React, { useState, useEffect } from 'react';
// import { Player, useGameContext } from '../context/GameContext';
// import { Amplify } from 'aws-amplify';
// import { events, EventsChannel } from 'aws-amplify/data';
// import uuid from 'react-uuid';

// // we need an events.post for each game event and a handler for listening to those events in channel.subscribe.next
// Amplify.configure({
//   API: {
//     Events: {
//       endpoint: import.meta.env.VITE_APPSYNC_ENDPOINT,
//       region: import.meta.env.VITE_APPSYNC_REGION,
//       defaultAuthMode: 'apiKey',
//       apiKey: import.meta.env.VITE_APPSYNC_API_KEY,
//     },
//   },
// });

// export const OnlineSetup: React.FC = () => {
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
//   const [roomCode, setRoomCode] = useState<string>('');
//   const [inputCode, setInputCode] = useState<string>('');
//   const [playerName, setPlayerName] = useState<string>('');
//   const [isNameSubmitted, setIsNameSubmitted] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');

//   const { players, setPlayers } = useGameContext();

//   useEffect(() => {
//     let channel: EventsChannel;

//     const connectAndSubscribe = async () => { // TODO: move to new file. 

//       try {
//         console.log('connecting to room: ', roomCode);
//         channel = await events.connect(`/room/${roomCode}`, {
//           //TODO: only do this once a room code is entered or created <<<<<<<<<<<<<<<<<<<<<<
//           authMode: 'apiKey',
//           authToken: import.meta.env.VITE_APPSYNC_API_KEY,
//         });

//         // subscribe to channel
//         channel.subscribe(
//           {
//             next: async (data) => {
//               console.log('data: ', data);
//               // TODO: if players deeply equals data?.event?.players, then don't do anything. otherwise, add data?.event?.players to players without duplicates. IDK if this is right though
//               if (data?.event?.players) {
//                 const newPlayers = data.event.players.filter(
//                   (player: Player) => !players.some((p) => p.id === player.id)
//                 );
//                 // const existingPlayerIds = new Set(players.map((p) => p.id)); // use this instead of above?

//                 // const newPlayers = data.event.players.filter(
//                 //   (player: Player) => !existingPlayerIds.has(player.id)
//                 // );

//                 // if new players have been added to the game room, then set the players in the online context
//                 // and let everyone else know in case they were not in the room yet
//                 if (newPlayers.length > 0) {
//                   const allPlayers = [...players, ...newPlayers];
//                   await events.post(
//                     `/room/${roomCode}`,
//                     { players: allPlayers },
//                     {
//                       authMode: 'apiKey',
//                       authToken: import.meta.env.VITE_APPSYNC_API_KEY,
//                     }
//                   );
//                   setPlayers(allPlayers);
//                 }
//               }
//             },
//             error: (err) => console.error('error>>>', err),
//           },
//           {
//             authMode: 'apiKey',
//             authToken: import.meta.env.VITE_APPSYNC_API_KEY,
//           }
//         );
//         // console.log('channel ')
//         setIsConnecting(false);
//       } catch (error) {
//         console.error('connectAndSUbscribe error: ', error);
//       }
//     };
//     if (roomCode) connectAndSubscribe();

//     return () => {
//       if (channel) {
//         console.log('closing channel', channel)
//         channel.close();
//       }
//     };
//   }, [roomCode, setPlayers, players]);

//   //   async function publishEvent() {
//   //     await events.post('default/channel', { some: 'data' });
//   //   }
//   // console.log('>>>', Client, EventsChannel);

//   const handleCreateRoom = async () => {
//     // make it known who the host is somehow
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
//     let newRoomCode: string = '';
//     for (let i = 0; i < 12; i++) {
//       newRoomCode += characters.charAt(
//         Math.floor(Math.random() * characters.length)
//       );
//     }
//     try {
//       await events.post(
//         `room/${newRoomCode}`,
//         { roomCode: newRoomCode },
//         { authMode: 'apiKey', authToken: import.meta.env.VITE_APPSYNC_API_KEY }
//       );
//       console.log('gameRoom: ', newRoomCode);
//       setRoomCode(newRoomCode);
//       setMode('create');

//       setError('');
//     } catch (error) {
//       console.error('oh nooo: ', error);
//     }
//   };

//   const handleJoinRoom = () => {
//     setRoomCode(inputCode);
//     setMode('join');
//     setError('');
//   };

//   const handleNameSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (playerName.trim() && playerName.length <= 20) {
//       try {
//         const newPlayer = { id: uuid(), name: playerName, score: 0 };

//         if (players.length === 0) setPlayers([newPlayer]);
//         const allPlayers = [...players, newPlayer];
//         await events.post(
//           `/room/${roomCode}`,
//           { players: allPlayers },
//           {
//             authMode: 'apiKey',
//             authToken: import.meta.env.VITE_APPSYNC_API_KEY,
//           }
//         );
//         setPlayers(allPlayers);
//         console.log('allPlayers including new> ', allPlayers);
//         setIsNameSubmitted(true);
//       } catch (error) {
//         console.error('handleNameSubmit error: ', error);
//       }
//     }
//   };

//   const handleBack = () => {
//     // close connection
//     setMode('select');
//     setRoomCode('');
//     setPlayerName('');
//     setIsNameSubmitted(false);
//     setPlayers([]);
//   };

//   return (
//     <div className='bg-gray-100'>
//       <div className='bg-white rounded-xl shadow-md overflow-hidden'>
//         <div className='lg:p-8 p-4'>
//           <h2 className='text-2xl font-bold text-blue-600 mb-6 text-center'>
//             Game Room Setup
//           </h2>

//           {isConnecting && (
//             <p className='text-blue-500 text-center'>Connecting to server...</p>
//           )}

//           {!isConnecting && mode === 'select' && (
//             <div className='space-y-4'>
//               <button
//                 onClick={handleCreateRoom}
//                 className='w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
//                 disabled={isConnecting}
//               >
//                 Create Game Room
//               </button>
//               <div className='relative'>
//                 <input
//                   type='text'
//                   placeholder='Enter Room Code'
//                   value={inputCode}
//                   onChange={(e) => setInputCode(e.target.value.toUpperCase())}
//                   className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                   maxLength={12}
//                   disabled={isConnecting}
//                 />
//                 <button
//                   onClick={handleJoinRoom}
//                   className='mt-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
//                   disabled={!inputCode.trim() || isConnecting}
//                 >
//                   Join Room
//                 </button>
//               </div>
//               {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
//             </div>
//           )}

//           {!isConnecting && (mode === 'create' || mode === 'join') && (
//             <div className='space-y-4'>
//               {mode === 'create' && (
//                 <button
//                   onClick={handleBack}
//                   className='text-blue-500 hover:text-blue-600 flex items-center gap-2 mb-4'
//                 >
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     className='h-5 w-5'
//                     viewBox='0 0 20 20'
//                     fill='currentColor'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                   Back
//                 </button>
//               )}
//               <div className='bg-gray-50 p-4 rounded-lg'>
//                 <p className='text-sm text-gray-600'>Room Code:</p>
//                 <p className='text-xl font-mono font-bold text-blue-600'>
//                   {roomCode}
//                 </p>
//               </div>

//               {!isNameSubmitted ? (
//                 <form onSubmit={handleNameSubmit} className='space-y-4'>
//                   <div>
//                     <input
//                       type='text'
//                       placeholder='Enter your name'
//                       value={playerName}
//                       onChange={(e) => setPlayerName(e.target.value)}
//                       className='w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
//                       maxLength={20}
//                       disabled={isConnecting}
//                     />
//                     <button
//                       type='submit'
//                       className='mt-2 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
//                       disabled={!playerName.trim() || isConnecting}
//                     >
//                       Join Game
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className='space-y-4'>
//                   <div className='bg-blue-50 p-4 rounded-lg'>
//                     <p className='text-sm text-blue-600'>Your name:</p>
//                     <p className='font-medium'>{playerName}</p>
//                   </div>
//                   <div>
//                     <h3 className='text-lg font-medium text-gray-900 mb-2'>
//                       Players in Room
//                     </h3>
//                     <div className='space-y-2'>
//                       {players.map((player) => (
//                         <div
//                           key={player.id}
//                           className='bg-gray-50 p-3 rounded-lg flex items-center'
//                         >
//                           <span className='text-gray-800'>{player.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
