import "./Board.css";
import { useEffect, useState } from "react";
import 'mobile-drag-drop/default.css';

export default function Board({ grid = 3, imgUrl }) {
  const [moveCount, setMoveCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [correctImages, setCorrectImages] = useState([]);
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    splitImageToPieces(imgUrl, grid, grid).then((pieces) => {
      setCorrectImages(pieces);
      setShuffledImages(shuffle([...pieces]));
    });
  }, [imgUrl, grid]);

  return (
    <div>
      <div className="bg"></div>
      <div className="boardTitle">
        <h2>IMAGE PUZZLE GAME</h2>
      </div>

      <div className="Board">
        <BoardPiecesDrop
          grid={grid}
          correctOrder={correctImages}
          setSolved={setSolved}
          setMoveCount={setMoveCount}
        />

        {solved && <h2 className="solved">🎉 Puzzle Solved!</h2>}
        <h2>Moves: {moveCount}</h2>

        <BoardPiecesDrag imgArray={shuffledImages} />

        <a href="index.html">
          <button className="resetButton">Reset</button>
        </a>
      </div>
    </div>
  );
}

function BoardPiecesDrag({ imgArray }) {
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    // Reset loading state when imgArray changes
    setAllLoaded(false);
    setLoadedCount(0);
  }, [imgArray]);

  const handleImageLoad = () => {
    setLoadedCount((count) => {
      const newCount = count + 1;
      if (newCount === imgArray.length) setAllLoaded(true);
      return newCount;
    });
  };

  return (
    <div className="BoardPiecesDrag" style={{ position: "relative" }}>
      {!allLoaded && (
        <div className="loading-overlay">
          Loading Images...
        </div>
      )}
      {imgArray.map((piece, index) => (
        <div className="box" draggable="true" key={`drag-${index}`} id={`drag-${index}`}>
          <img src={piece.src} data-id={piece.id} alt={`piece-${index}`} onLoad={handleImageLoad} />
        </div>
      ))}
    </div>
  );
}



function BoardPiecesDrop({ grid, correctOrder, setMoveCount, setSolved }) {
  const boxes = Array.from({ length: grid * grid });

  useEffect(() => {
    initializeDragAndDrop(setMoveCount, correctOrder, setSolved);
  }, [correctOrder]);

  return (
    <div
      className="BoardPiecesDrop"
      style={{ display: "grid", gridTemplateColumns: `repeat(${grid}, 1fr)` }}
    >
      {boxes.map((_, index) => (
        <div className="box" draggable="true" key={`box-${index}`} id={`box-${index}`}></div>
      ))}
    </div>
  );
}

// Utility to shuffle an array
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function initializeDragAndDrop(setMoveCount, correctOrder, setSolved) {
  const dragBoxes = document.querySelectorAll(".BoardPiecesDrag .box, .BoardPiecesDrop .box");

  let draggedBox = null;

  dragBoxes.forEach((box) => {
    // Desktop drag start
    box.addEventListener("dragstart", () => {
      const img = box.querySelector("img");
      if (img) {
        draggedBox = box;
        img.classList.add("dragging");
      }
    });

    box.addEventListener("dragend", () => {
      const dragging = document.querySelector("img.dragging");
      if (dragging) dragging.classList.remove("dragging");
    });

    box.addEventListener("dragover", (e) => {
      e.preventDefault(); // Required to allow drop
    });

    box.addEventListener("drop", (e) => {
      e.preventDefault();
      if (!draggedBox || draggedBox === box) return;

      const dragImg = draggedBox.querySelector("img");
      const dropImg = box.querySelector("img");

      // Prevent swapping if both have images
      if (dragImg && dropImg) return;

      if (dragImg) {
        if (dropImg) draggedBox.appendChild(dropImg);
        box.appendChild(dragImg);
        dragImg.classList.remove("dragging");
        setMoveCount((m) => m + 1);
        checkIfSolved(setSolved, correctOrder);
      }
    });

    // --- Touch support ---
    box.addEventListener(
      "touchstart",
      (e) => {
        const img = box.querySelector("img");
        if (img) {
          draggedBox = box;
          img.classList.add("dragging");
        }
      },
      { passive: true }
    );

    box.addEventListener("touchend", (e) => {
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const dropBox = target?.closest(".box");

      if (!draggedBox || !dropBox || draggedBox === dropBox) return;

      const dragImg = draggedBox.querySelector("img");
      const dropImg = dropBox.querySelector("img");

      // Prevent swapping if both have images
      if (dragImg && dropImg) return;

      if (dragImg) {
        if (dropImg) draggedBox.appendChild(dropImg);
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
    return img ? parseInt(img.dataset.id) : null;
  });

  const correctIds = correctOrder.map((p) => p.id);

  const isSolved =
    currentOrder.length === correctIds.length &&
    correctIds.every((id, i) => id === currentOrder[i]);

  if (isSolved) setSolved(true);
}

function splitImageToPieces(imageUrl, rows, cols) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const pieceWidth = width / cols;
      const pieceHeight = height / rows;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const pieces = [];
      let id = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const pieceCanvas = document.createElement("canvas");
          pieceCanvas.width = pieceWidth;
          pieceCanvas.height = pieceHeight;
          const pctx = pieceCanvas.getContext("2d");

          pctx.drawImage(
            canvas,
            x * pieceWidth,
            y * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          const dataUrl = pieceCanvas.toDataURL();
          pieces.push({ id: id++, src: dataUrl });
        }
      }

      resolve(pieces);
    };

    img.onerror = reject;
  });
}
