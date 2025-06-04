import "./Board.css";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import 'mobile-drag-drop/default.css';


export default function Board(){

    const [moveCount, setMoveCount] = useState(0);
    const correctOrder = [
        'row-1-column-1', 'row-1-column-2', 'row-1-column-3',
        'row-2-column-1', 'row-2-column-2', 'row-2-column-3',
        'row-3-column-1', 'row-3-column-2', 'row-3-column-3',
      ];
    const [solved, setSolved] = useState(false);

    return(
        <div>
            <div className="bg"></div>

            <div className="boardTitle">
            <h2>IMAGE PUZZLE GAME</h2>
            </div>
            

            <div className="Board">
                
                <BoardPiecesDrop   moveCount={moveCount}
                setMoveCount={setMoveCount}
                correctOrder={correctOrder}
                setSolved={setSolved}/>

                {solved && <h2 className="solved">🎉 Puzzle Solved!</h2>}

                <h2>Moves: {moveCount}</h2>

                <BoardPiecesDrag/>

                <a href="index.html"><button className="resetButton" >Reset</button></a>
                


            </div>

        </div>
    )
}

function BoardPiecesDrag() {
  const puzzleId = useMemo(() => Math.floor(Math.random() * 5) + 1, []);

  useEffect(() => {
    const container = document.querySelector('.BoardPiecesDrag');
    if (!container) return;

    const children = Array.from(container.children);
    const shuffled = children.sort(() => Math.random() - 0.5);
    shuffled.forEach((child, i) => {
      if (!child.id) child.id = `drag-${i}`;
      container.appendChild(child);
    });
  }, []);

  return (
    <div className="BoardPiecesDrag">
      {[1, 2, 3].map((row) =>
        [1, 2, 3].map((col) => (
          <div className="box" draggable="true" key={`r${row}c${col}`}>
            <img
              src={`puzzleGame/puzzles/${puzzleId}/row-${row}-column-${col}.jpg`}
              alt={`Piece ${row}-${col}`}
            />
          </div>
        ))
      )}
    </div>
  );
}


function BoardPiecesDrop({ moveCount, setMoveCount, correctOrder, setSolved }) {
  useEffect(() => {
    const dragBoxes = document.querySelectorAll('.BoardPiecesDrag .box, .BoardPiecesDrop .box');
    let draggedBox = null;

    dragBoxes.forEach((box, index) => {
      if (!box.id) box.id = `box-${index}`;

      // Desktop drag
      box.addEventListener('dragstart', (e) => {
        if (!box.querySelector('img')) return;
        draggedBox = box;
        e.dataTransfer.setData('text/plain', box.id);
      });

      // Touch drag (start)
      box.addEventListener('touchstart', (e) => {
        draggedBox = box;
      }, { passive: true });

      // Prevent default to allow drop
      box.addEventListener('dragover', (e) => {
        if (!box.querySelector('img')) e.preventDefault();
      });

      // Touch drop (simulate)
      box.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (
          target?.classList.contains('box') &&
          !target.querySelector('img') &&
          draggedBox?.querySelector('img')
        ) {
          target.innerHTML = draggedBox.innerHTML;
          draggedBox.innerHTML = '';
          setMoveCount((m) => m + 1);
          checkIfSolved();
        }
      });

      // Mouse drop
      box.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const sourceBox = document.getElementById(id);
        if (!box.querySelector('img') && sourceBox?.querySelector('img')) {
          box.innerHTML = sourceBox.innerHTML;
          sourceBox.innerHTML = '';
          setMoveCount((m) => m + 1);
          checkIfSolved();
        }
      });
    });
  }, []);

  function checkIfSolved() {
    const dropBoxes = document.querySelectorAll('.BoardPiecesDrop .box');
    const currentOrder = Array.from(dropBoxes).map((box) => {
      const img = box.querySelector('img');
      if (!img) return '';
      const match = img.src.match(/row-\d-column-\d/);
      return match ? match[0] : '';
    });

    const isSolved = currentOrder.every((val, i) => val === correctOrder[i]);
    if (isSolved) setSolved(true);
  }

  return (
    <div className="BoardPiecesDrop">
      {[1, 2, 3].map((row) =>
        [1, 2, 3].map((col) => (
          <div className="box" draggable="true" key={`drop-${row}-${col}`}></div>
        ))
      )}
    </div>
  );
}





