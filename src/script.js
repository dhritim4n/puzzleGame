onload = function(){
    let boardPiecesDrag = document.getElementsByClassName("BoardPiecesDrag");
    let box = document.createDocumentFragment();

    while(boardPiecesDrag.children.length){
        box.appendChild(boardPiecesDrag.children[Math.floor(Math.random() * boardPiecesDrag.children.length)]);
    }
    boardPiecesDrag.appendChild(box);
}