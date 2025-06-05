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

          pieces.push(pieceCanvas.toDataURL()); // Push the URL
        }
      }

      resolve(pieces); // Return array of URLs
    };

    img.onerror = reject;
  });
}

async function generateImgDiv(){
  const imgUrlArray  = await splitImageToPieces("https://picsum.photos/320", 3, 3); // 3x3 puzzle
  const div = document.createElement('div');
  document.body.appendChild(div);
  
  
  for(url of imgUrlArray){

      const image = document.createElement('img');
      
      image.src = url;
      div.appendChild(image);
  }

  div.className = "ImgDiv"
  
}




