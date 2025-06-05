import { useState } from 'react';
import Board from './Board';
import StartGame from './StartGame';
import './App.css';

function App() {
  const [grid, setGrid] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="bg">
      {!gameStarted && (
        <StartGame
          grid={grid}
          setGrid={setGrid}
          setGameStarted={setGameStarted}
        />
      )}

      {/* Only render Board after game starts */}
      {gameStarted && (
        <Board
          grid={grid}
          className="board"
        />
      )}
    </div>
  );
}

export default App;
