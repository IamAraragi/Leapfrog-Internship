import CONSTANT from './constants.js';
import {
  getFileFromSquare,
  getFromSquare,
  getPieceColor,
  getSquareFromFileAndRank,
  getToSquare,
  getRankFromSquare,
  getMoveString,
} from './utils.js';

export default class BoardInterface {
  constructor(board, moveGen, engine) {
    this.board = board;
    this.moveGen = moveGen;
    this.engine = engine;
    this.noOfSquares = 64;
    this.colors = ['#eeeed2', '#769656'];
    this.squareSize = 70;
    this.fromSquare = -1;
    this.toSquare = -1;
    this.flip = 0;
    this.movesMade = [];
    this.gameState = 0;
    this.playVsHuman = 0;
    this.playVsComputer = 0;

    this.playerSide = CONSTANT.WHITE;
    this.opponentSide = CONSTANT.BLACK;
    this.intialize();
    this.render();
  }

  flipBoard() {
    this.flip = +!this.flip;
  }

  displayTurn() {
    if (this.board.side === CONSTANT.WHITE) {
      this.showTurns.innerHTML = 'WHITE TURN';
    } else {
      this.showTurns.innerHTML = 'BLACK TURN';
    }
  }

  // chooseSide() {}

  intialize() {
    this.canvas = document.getElementById('chessBoard');
    this.ctx = this.canvas.getContext('2d');
    this.startMenu = document.getElementById('startMenu');
    this.sideMenu = document.getElementById('sideMenu');
    this.playHumanButton = document.getElementById('playHumanButton');
    this.playComputerButton = document.getElementById('playComputerButton');
    this.whiteSideButton = document.getElementById('whiteSide');
    this.blackSideButton = document.getElementById('blackSide');
    this.newGameButton = document.getElementById('newGameButton');
    this.undoButton = document.getElementById('undoButton');
    this.flipButton = document.getElementById('flipButton');
    this.movesShown = document.getElementById('moveList');
    this.showTurns = document.getElementById('showTurns');

    this.canvas.width = CONSTANT.CANVAS_WIDTH;
    this.canvas.height = CONSTANT.CANVAS_HEIGHT;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.canvas.addEventListener('click', (event) => {
      if (this.playVsHuman === 1) {
        this.humanPlay();
      }

      if (this.playVsComputer === 1) {
        if (this.board.side === this.playerSide) {
          this.humanPlay();
        }
      }
    });

    this.undoButton.addEventListener('click', () => {
      this.moveGen.undoMove();
    });

    this.newGameButton.addEventListener('click', () => {
      this.board.initialize();
      this.flip = 0;
    });

    this.flipButton.addEventListener('click', () => {
      this.flipBoard();
    });

    this.whiteSideButton.addEventListener('click', () => {
      this.playerSide = CONSTANT.WHITE;
      this.opponentSide = CONSTANT.BLACK;
      this.flip = 0;
      this.whiteSideButton.style.border = '3px solid green';
      this.blackSideButton.style.border = 'none';
    });

    this.blackSideButton.addEventListener('click', () => {
      this.playerSide = CONSTANT.BLACK;
      this.opponentSide = CONSTANT.WHITE;
      this.flip = 1;
      this.blackSideButton.style.border = '3px solid green';
      this.whiteSideButton.style.border = 'none';
    });

    this.playHumanButton.addEventListener('click', () => {
      this.playVsHuman = 1;
      this.playVsComputer = 0;
      this.startMenu.style.display = 'none';
      this.sideMenu.style.display = 'block';
    });

    this.playComputerButton.addEventListener('click', () => {
      this.playVsHuman = 0;
      this.playVsComputer = 1;
      this.startMenu.style.display = 'none';
      this.sideMenu.style.display = 'block';
    });
  }

  humanPlay() {
    this.legalMoves = [];
    let file = 0;
    let rank = 0;
    let x = event.clientX - this.canvas.getBoundingClientRect().x;
    let y = event.clientY - this.canvas.getBoundingClientRect().y;

    if (this.flip === 0) {
      file = Math.floor(x / this.squareSize);
      rank = 7 - Math.floor(y / this.squareSize);
    } else {
      file = 7 - Math.floor(x / this.squareSize);
      rank = Math.floor(y / this.squareSize);
    }

    let selectedSquare = getSquareFromFileAndRank(file, rank);
    let selectedPiece = this.board.pieces[selectedSquare];

    this.getClickedFromSquare(selectedSquare, selectedPiece);
    this.getClickedToSquare(selectedSquare);

    if (this.fromSquare !== -1) {
      this.legalMoves = this.getLegalMovesForClickedPiece();
    }

    for (let i = 0; i < this.legalMoves.length; i++) {
      let to = getToSquare(this.legalMoves[i]);

      if (to === this.toSquare) {
        this.moveGen.makeMove(this.legalMoves[i]);
        this.board.renderBoard();
        this.movesMade.push(this.legalMoves[i]);
        this.addMoveToMoveList();
        this.fromSquare = -1;
        this.toSquare = -1;
      }
    }

    if (this.moveGen.checkCheckMate() === true) {
      console.log('CHECKMATE');
    }
  }

  computerPlay() {
    this.engine.findBestMove();
    this.moveGen.makeMove(this.engine.bestMove);

    if (this.moveGen.checkCheckMate() === true) {
      console.log('CHECKMATE');
    }
  }

  addMoveToMoveList() {
    let movesDiv;
    let moveString = '';
    let movesNumber = Math.ceil(this.movesMade.length / 2);
    if (this.movesMade.length % 2 !== 0) {
      moveString =
        '<pre>' +
        movesNumber +
        '. ' +
        getMoveString(this.movesMade[this.movesMade.length - 1]) +
        '</pre>';
    } else {
      moveString =
        '<pre>' +
        movesNumber +
        '. ' +
        getMoveString(this.movesMade[this.movesMade.length - 2]) +
        '       ' +
        getMoveString(this.movesMade[this.movesMade.length - 1]) +
        '</pre>';
    }
    console.log(moveString);

    if (this.board.side === CONSTANT.BLACK) {
      movesDiv = document.createElement('div');
      movesDiv.innerHTML = moveString;
      movesDiv.style.color = '#ffffff';
      movesDiv.style.fontSize = '20px';
      movesDiv.style.padding = '0 0 10px 20px';
      this.movesShown.appendChild(movesDiv);
    } else {
      let childs = this.movesShown.childNodes;
      childs[childs.length - 1].innerHTML = moveString;
    }
  }

  getRowAndColumnFromSquare(square) {
    let row = 0;
    let col = 0;
    let file = getFileFromSquare(square);
    let rank = getRankFromSquare(square);

    if (this.flip === 0) {
      row = 7 - rank;
      col = file;
    } else {
      col = 7 - file;
      row = rank;
    }

    return [row, col];
  }

  getClickedFromSquare(selectedSquare, selectedPiece) {
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

    for (let i = 0; i < this.moveGen.moves.length; i++) {
      let move = this.moveGen.moves[i];
      let from = getFromSquare(move);

      if (from === this.fromSquare) {
        legalMoves.push(move);
      }
    }

    return legalMoves;
  }

  highlightSquare(square) {
    let col = this.getRowAndColumnFromSquare(square)[1];
    let row = this.getRowAndColumnFromSquare(square)[0];

    this.ctx.globalAlpha = 0.4;
    this.ctx.beginPath();
    this.ctx.rect(
      col * this.squareSize,
      row * this.squareSize,
      this.squareSize,
      this.squareSize
    );

    this.ctx.fillStyle = 'blue';
    this.ctx.fill();

    for (let i = 0; i < this.legalMoves.length; i++) {
      let toSquare = getToSquare(this.legalMoves[i]);
      let possibleMovesCol = this.getRowAndColumnFromSquare(toSquare)[1];
      let possibleMovesRow = this.getRowAndColumnFromSquare(toSquare)[0];

      if (this.board.pieces[toSquare] === CONSTANT.PIECES.empty) {
        this.ctx.beginPath();
        this.ctx.arc(
          possibleMovesCol * this.squareSize + 35,
          possibleMovesRow * this.squareSize + 35,
          10,
          0,
          2 * Math.PI
        );
        this.ctx.fillStyle = '#272522';
        this.ctx.fill();
      } else {
        this.ctx.beginPath();
        this.ctx.rect(
          possibleMovesCol * this.squareSize,
          possibleMovesRow * this.squareSize,
          this.squareSize,
          this.squareSize
        );

        this.ctx.fillStyle = 'red';
        this.ctx.fill();
      }
    }
  }

  drawBoard() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
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
    let file = 0;
    let rank = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.flip === 0) {
          file = col;
          rank = 7 - row;
        } else {
          file = 7 - col;
          rank = row;
        }

        let square = getSquareFromFileAndRank(file, rank);
        let pieceName = CONSTANT.PIECE_NAMES[this.board.pieces[square]];
        if (pieceName !== '.') {
          let img = new Image();
          img.src = './images/' + pieceName + '.png';
          this.ctx.drawImage(
            img,
            col * this.squareSize,
            row * this.squareSize,
            this.squareSize,
            this.squareSize
          );
        }
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.drawBoard();
    this.drawPieces();

    this.displayTurn();

    if (this.fromSquare !== -1) {
      this.highlightSquare(this.fromSquare);
    }

    if (this.playVsComputer === 1) {
      if (this.board.side === this.opponentSide) {
        this.computerPlay();
      }
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
