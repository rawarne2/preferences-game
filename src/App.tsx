import './App.css';
import PreferencesGame from './components/PreferencesGame';
import { GameProvider } from './context/GameProvider';

function App() {
  return (
    <>
      <GameProvider>
        <PreferencesGame />
      </GameProvider>
    </>
  );
}

export default App;
