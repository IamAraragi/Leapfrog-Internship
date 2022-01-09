import CONSTANT from './constants.js';
import {
  getFileFromSquare,
  getFromSquare,
  getPieceColor,
  getSquareFromFileAndRank,
  getToSquare,
  getRankFromSquare,
} from './utils.js';

export default class BoardInterface {
  constructor(board, moveGen) {
    this.board = board;
    this.moveGen = moveGen;
    this.noOfSquares = 64;
    this.colors = ['white', 'gray'];
    this.squareSize = 60;
    this.fromSquare = -1;
    this.toSquare = -1;
    // this.legalMoves = [];
    // this.render();
    this.intialize();
  }

  intialize() {
    this.canvas = document.getElementById('chessBoard');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = CONSTANT.CANVAS_WIDTH;
    this.canvas.height = CONSTANT.CANVAS_HEIGHT;

    this.canvas.addEventListener('click', (event) => {
      let legalMoves = [];
      let x = event.clientX;
      let y = event.clientY;

      let file = Math.floor(x / this.squareSize);
      let rank = Math.floor(7 - Math.floor(y / this.squareSize));

      let selectedSquare = getSquareFromFileAndRank(file, rank);
      let selectedPiece = this.board.pieces[selectedSquare];

      this.getClickedFromSquare(selectedSquare, selectedPiece);
      this.getClickedToSquare(selectedSquare);

      if (this.fromSquare !== -1) {
        legalMoves = this.getLegalMovesForClickedPiece();
      }

      for (let i = 0; i < legalMoves.length; i++) {
        let to = getToSquare(legalMoves[i]);

        if (to === this.toSquare) {
          this.moveGen.makeMove(legalMoves[i]);
          this.board.renderBoard();
          console.log(this.board.totalMaterialForSide);
          this.fromSquare = -1;
          this.toSquare = -1;
          this.render();
        }
      }

      if (this.moveGen.checkCheckMate() === true) {
        console.log('CHECKMATE');
      }
    });
  }

  getRowAndColumnFromSquare(square) {
    let file = getFileFromSquare(square);
    let rank = getRankFromSquare(square);

    let row = 7 - rank;
    let col = file;

    return [row, col];
  }

  getClickedFromSquare(selectedSquare, selectedPiece) {
    // console.log(this.fromSquare, selectedSquare);
    if (
      selectedPiece !== CONSTANT.PIECES.empty &&
      getPieceColor(selectedPiece) === this.board.side
    ) {
      if (this.fromSquare === -1) {
        this.fromSquare = selectedSquare;
      } else {
        if (this.fromSquare === selectedSquare) {
          this.fromSquare = -1;
        } else {
          this.fromSquare = selectedSquare;
        }
      }
    }
  }

  getClickedToSquare(selectedSquare) {
    if (this.fromSquare !== -1 && this.fromSquare !== selectedSquare) {
      this.toSquare = selectedSquare;
    }
  }

  getLegalMovesForClickedPiece() {
    let legalMoves = [];
    this.moveGen.generateLegalMoves();
    // console.log(this.moveGen.moves);

    for (let i = 0; i < this.moveGen.moves.length; i++) {
      let move = this.moveGen.moves[i];
      let from = getFromSquare(move);

      if (from === this.fromSquare) {
        legalMoves.push(move);
      }
    }

    return legalMoves;
  }

  drawBoard() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let color = this.colors[(row + col) % 2];
        this.ctx.beginPath();
        this.ctx.rect(
          col * this.squareSize,
          row * this.squareSize,
          this.squareSize,
          this.squareSize
        );

        this.ctx.fillStyle = color;
        this.ctx.fill();
      }
    }
  }

  drawPieces() {
    // console.log(this.board.pieces);
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let file = col;
        let rank = 7 - row;

        let square = getSquareFromFileAndRank(file, rank);
        let pieceName = CONSTANT.PIECE_NAMES[this.board.pieces[square]];
        if (pieceName !== '.') {
          let img = new Image();
          img.src = './images/' + pieceName + '.png';
          img.onload = () => {
            this.ctx.drawImage(
              img,
              col * this.squareSize,
              row * this.squareSize,
              this.squareSize,
              this.squareSize
            );
          };
        }
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, CONSTANT.CANVAS_WIDTH, CONSTANT.CANVAS_HEIGHT);
    this.drawBoard();
    this.drawPieces();

    // requestAnimationFrame(this.render.bind(this));
  }
}
