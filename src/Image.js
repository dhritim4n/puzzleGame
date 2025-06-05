function splitImage(grid, url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; // to handle cross-origin images
  
      image.onload = () => {
        const pieceWidth = image.width / grid;
        const pieceHeight = image.height / grid;
  
        const imagePieces = [];
        for (let x = 0; x < grid; x++) {
          for (let y = 0; y < grid; y++) {
            const canvas = document.createElement('canvas');
            canvas.width = pieceWidth;
            canvas.height = pieceHeight;
            const context = canvas.getContext('2d');
            context.drawImage(
              image,
              x * pieceWidth,
              y * pieceHeight,
              pieceWidth,
              pieceHeight,
              0,
              0,
              pieceWidth,
              pieceHeight
            );
            imagePieces.push(canvas.toDataURL());
          }
        }
        resolve(imagePieces);
      };
  
      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };
  
      image.src = url;
    });
  }
  


