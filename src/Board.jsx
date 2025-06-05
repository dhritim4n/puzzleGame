import "./Board.css";
import { useEffect, useState, useMemo } from "react";
import 'mobile-drag-drop/default.css';

export default function Board({ grid }) {
  const [moveCount, setMoveCount] = useState(0);
  const correctOrder = generateCorrectOrder(grid);
  const [solved, setSolved] = useState(false);

  return (
    <div>
      <div className="bg"></div>

      <div className="boardTitle">
        <h2>IMAGE PUZZLE GAME</h2>
      </div>

      <div className="Board">
        <BoardPiecesDrop
          grid={grid}
          moveCount={moveCount}
          setMoveCount={setMoveCount}
          correctOrder={correctOrder}
          setSolved={setSolved}
        />

        {solved && <h2 className="solved">🎉 Puzzle Solved!</h2>}

        <h2>Moves: {moveCount}</h2>

        <BoardPiecesDrag grid={grid} imgArray={correctOrder} />

        <a href="index.html">
          <button className="resetButton">Reset</button>
        </a>
      </div>
    </div>
  );
}

function BoardPiecesDrag({ grid }) {
  const puzzleId = useMemo(() => Math.floor(Math.random() * 5) + 1, []);
  
  const shuffledBoxes = useMemo(() => {
    const total = grid * grid;
    const boxes = Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / grid) + 1;
      const col = (index % grid) + 1;
      return { row, col };
    });

    // Shuffle the boxes
    for (let i = boxes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
    }

    return boxes;
  }, [grid]);

  return (
    <div className="BoardPiecesDrag">
      {shuffledBoxes.map(({ row, col }, index) => (
        <div className="box" draggable="true" key={`drag-${index}`} id={`drag-${index}`}>
          <img
            src={`https://raw.githubusercontent.com/dhritim4n/puzzleGame/refs/heads/main/puzzles/${grid}x${grid}/${puzzleId}/row-${row}-column-${col}.jpg`}
            //src={`puzzles/${grid}x${grid}/${puzzleId}/row-${row}-column-${col}.jpg`}
            alt={`Piece ${row}-${col}`}
          />
        </div>
      ))}
    </div>
  );
}

function BoardPiecesDrop({ grid, moveCount, setMoveCount, correctOrder, setSolved }) {
  const boxes = createBoxesArray(grid);

  useEffect(() => {
    initializeDragAndDrop(setMoveCount, correctOrder, setSolved);
  }, []);

  return (
    <div
      className="BoardPiecesDrop"
      style={{ display: "grid", gridTemplateColumns: `repeat(${grid}, 1fr)` }}
    >
      {boxes.map(({ index }) => (
        <div className="box" draggable="true" key={`box-${index}`} id={`box-${index}`}></div>
      ))}
    </div>
  );
}

// Utility Functions
function generateCorrectOrder(grid) {
  const order = [];
  for (let row = 1; row <= grid; row++) {
    for (let col = 1; col <= grid; col++) {
      order.push(`row-${row}-column-${col}`);
    }
  }
  return order;
}

function initializeDragAndDrop(setMoveCount, correctOrder, setSolved) {
  const dragBoxes = document.querySelectorAll(".BoardPiecesDrag .box, .BoardPiecesDrop .box");

  let draggedBox = null;

  dragBoxes.forEach((box) => {
    // Drag Start
    box.addEventListener("dragstart", () => {
      const img = box.querySelector("img");
      if (img) {
        img.classList.add("dragging");
        draggedBox = box;
      }
    });

    // Drag End
    box.addEventListener("dragend", () => {
      const dragging = document.querySelector("img.dragging");
      if (dragging) dragging.classList.remove("dragging");
    });

    // Drag Over
    box.addEventListener("dragover", (e) => {
      e.preventDefault(); // Allow drop for swapping
    });

    // Drop
    box.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedBox || draggedBox === box) return;

      const dragImg = draggedBox.querySelector("img");
      const dropImg = box.querySelector("img");

      // Prevent swapping if both boxes have images
      if (dragImg && dropImg) return;

      if (dragImg) {
        if (dropImg) {
          draggedBox.appendChild(dropImg);
        }
        box.appendChild(dragImg);
        dragImg.classList.remove("dragging");
        setMoveCount((m) => m + 1);
        checkIfSolved(setSolved, correctOrder);
      }
    });

    // Touch Start
    box.addEventListener(
      "touchstart",
      () => {
        const img = box.querySelector("img");
        if (img) {
          img.classList.add("dragging");
          draggedBox = box;
        }
      },
      { passive: true }
    );

    // Touch End
    box.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropBox = target?.closest(".box");

      if (!draggedBox || !dropBox || draggedBox === dropBox) return;

      const dragImg = draggedBox.querySelector("img");
      const dropImg = dropBox.querySelector("img");

      // Prevent swapping if both boxes have images
      if (dragImg && dropImg) return;

      if (dragImg) {
        if (dropImg) {
          draggedBox.appendChild(dropImg);
        }
        dropBox.appendChild(dragImg);
        dragImg.classList.remove("dragging");
        setMoveCount((m) => m + 1);
        checkIfSolved(setSolved, correctOrder);
      }
    });
  });
}

function checkIfSolved(setSolved, correctOrder) {
  const dropBoxes = document.querySelectorAll(".BoardPiecesDrop .box");
  const currentOrder = Array.from(dropBoxes).map((box) => {
    const img = box.querySelector("img");
    if (!img) return "";
    const match = img.src.match(/row-\d-column-\d/);
    return match ? match[0] : "";
  });

  const isSolved = currentOrder.every((val, i) => val === correctOrder[i]);
  if (isSolved) setSolved(true);
}

// ✅ Separated and placed at the end
function createBoxesArray(grid) {
  const arr = [];
  for (let row = 1; row <= grid; row++) {
    for (let col = 1; col <= grid; col++) {
      arr.push({
        row,
        col,
        index: (row - 1) * grid + (col - 1),
      });
    }
  }
  return arr;
}
