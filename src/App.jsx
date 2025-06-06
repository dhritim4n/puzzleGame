import { useState } from 'react';
import Board from './Board';
import StartGame from './StartGame';
import './App.css';

function App() {
  const [grid, setGrid] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [imgUrl, setImgUrl] = useState("https://picsum.photos/320/320?random=1"); // defaultImageUrl = some default image string or URL


  return (
    <div className="bg">
      {!gameStarted && (
        <StartGame
          grid={grid}
          setGrid={setGrid}
          setGameStarted={setGameStarted}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
        />
      )}

      {/* Only render Board after game starts */}
      {gameStarted && (
        <Board
          grid={grid}
          imgUrl={imgUrl}
          className="board"
        />
      )}
    </div>
  );
}

export default App;
