import CONSTANT from './constants.js';
import {
  getFileFromSquare,
  getFromSquare,
  getPieceColor,
  getSquareFromFileAndRank,
  getToSquare,
  getRankFromSquare,
  getMoveString,
  captured,
  decreaseTimer,
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
    this.gameOver = 0;
    this.gameStart = 0;
    this.playVsHuman = 0;
    this.playVsComputer = 0;
    this.blackCapturedPieces = [];
    this.whiteCapturedPieces = [];
    this.winner = '';
    this.noTimer = true;
    this.playerSelectedTimer = { minutes: 10, seconds: 0 };
    this.opponentSelectedTimer = { minutes: 10, seconds: 0 };
    this.playerTimer = { minutes: 10, seconds: 0 };
    this.opponentTimer = { minutes: 10, seconds: 0 };

    this.playerSide = CONSTANT.WHITE;
    this.opponentSide = CONSTANT.BLACK;
    this.frames = 0;
    this.intialize();
    this.render();
  }

  flipBoard() {
    this.flip = +!this.flip;
    this.changeSide();
  }

  displayTurn() {
    if (this.board.side === CONSTANT.WHITE) {
      this.showTurns.innerHTML = 'WHITE TURN';
    } else {
      this.showTurns.innerHTML = 'BLACK TURN';
    }
  }

  displayGameOver() {
    this.gameOverDiv.style.display = 'block';

    if (this.winner === 'white') {
      this.winnerDiv.innerHTML = 'WHITE WINS';
    } else if (this.winner === 'black') {
      this.winnerDiv.innerHTML = 'BLACK WINS';
    } else {
      this.winnerDiv.innerHTML = 'DRAW';
    }

    this.winnerDiv.style.fontSize = '30px';
    this.winnerDiv.style.color = '#ffffff';
    this.winnerDiv.style.padding = '30px 0';
  }

  changeSide() {
    let player1Info = this.player1.innerHTML;
    let player2Info = this.player2.innerHTML;

    this.player1.innerHTML = player2Info;
    this.player2.innerHTML = player1Info;
  }

  addBlackAndWhiteCapturedPieces(move) {
    if (captured(move) !== CONSTANT.PIECES.empty) {
      if (this.board.side === CONSTANT.WHITE) {
        console.log('a');
        this.whiteCapturedPieces.push(captured(move));
      } else {
        this.blackCapturedPieces.push(captured(move));
      }
    }
  }

  popBlackAndWhiteCapturedPieces(move) {
    if (captured(move) !== CONSTANT.PIECES.empty) {
      if (this.board.side === CONSTANT.WHITE) {
        this.blackCapturedPieces.pop();
      } else {
        this.whiteCapturedPieces.pop();
      }
    }
  }

  getBlackAndWhitePiecesUnicode() {
    this.whiteCapturedPiecesUnicode = [];
    this.blackCapturedPiecesUnicode = [];

    for (let i = 0; i < this.whiteCapturedPieces.length; i++) {
      let piece = this.whiteCapturedPieces[i];
      switch (piece) {
        case 1:
          this.whiteCapturedPiecesUnicode.push('&#9817;');
          break;
        case 2:
          this.whiteCapturedPiecesUnicode.push('&#9816;');
          break;
        case 3:
          this.whiteCapturedPiecesUnicode.push('&#9815;');
          break;
        case 4:
          this.whiteCapturedPiecesUnicode.push('&#9814;');
          break;
        case 5:
          this.whiteCapturedPiecesUnicode.push('&#9813;');
          break;
      }
    }

    for (let i = 0; i < this.blackCapturedPieces.length; i++) {
      let piece = this.blackCapturedPieces[i];
      switch (piece) {
        case 7:
          this.blackCapturedPiecesUnicode.push('&#9823;');
          break;
        case 8:
          this.blackCapturedPiecesUnicode.push('&#9822;');
          break;
        case 9:
          this.blackCapturedPiecesUnicode.push('&#9821;');
          break;
        case 10:
          this.blackCapturedPiecesUnicode.push('&#9820;');
          break;
        case 11:
          this.blackCapturedPiecesUnicode.push('&#9819;');
          break;
      }
    }
  }

  displayWhiteCapturedPieces() {
    this.player1CapturedPiecesString = '';
    this.player2CapturedPiecesString = '';

    this.getBlackAndWhitePiecesUnicode();

    if (this.whiteCapturedPiecesUnicode.length !== 0) {
      if (this.playerSide === CONSTANT.WHITE) {
        console.log('b');
        for (let i = 0; i < this.whiteCapturedPiecesUnicode.length; i++) {
          this.player2CapturedPiecesString +=
            this.whiteCapturedPiecesUnicode[i];
        }
      } else {
        for (let i = 0; i < this.whiteCapturedPiecesUnicode.length; i++) {
          this.player1CapturedPiecesString +=
            this.whiteCapturedPiecesUnicode[i];
        }
      }
    }

    this.player1CapturedPieces.innerHTML = this.player1CapturedPiecesString;
    this.player2CapturedPieces.innerHTML = this.player2CapturedPiecesString;
  }

  displayBlackCapturedPieces() {
    this.getBlackAndWhitePiecesUnicode();

    if (this.blackCapturedPiecesUnicode.length !== 0) {
      if (this.playerSide === CONSTANT.WHITE) {
        for (let i = 0; i < this.blackCapturedPiecesUnicode.length; i++) {
          this.player1CapturedPiecesString +=
            this.blackCapturedPiecesUnicode[i];
        }
      } else {
        for (let i = 0; i < this.blackCapturedPiecesUnicode.length; i++) {
          this.player2CapturedPiecesString +=
            this.blackCapturedPiecesUnicode[i];
        }
      }
    }

    this.player1CapturedPieces.innerHTML = this.player1CapturedPiecesString;
    this.player2CapturedPieces.innerHTML = this.player2CapturedPiecesString;
  }

  intialize() {
    this.canvas = document.getElementById('chessBoard');
    this.ctx = this.canvas.getContext('2d');
    this.player1 = document.getElementById('player1');
    this.player2 = document.getElementById('player2');
    this.player1CapturedPieces = document.getElementById(
      'player1CapturedPieces'
    );
    this.player2CapturedPieces = document.getElementById(
      'player2CapturedPieces'
    );
    this.player1TimerDiv = document.getElementById('player1TimerDiv');
    this.player2TimerDiv = document.getElementById('player2TimerDiv');
    this.gameOverDiv = document.getElementById('gameOverDiv');
    this.gameOverType = document.getElementById('gameOverType');
    this.winnerDiv = document.getElementById('winnerDiv');
    this.startMenu = document.getElementById('startMenu');
    this.sideMenu = document.getElementById('sideMenu');
    this.playHumanButton = document.getElementById('playHumanButton');
    this.playComputerButton = document.getElementById('playComputerButton');
    this.whiteSideButton = document.getElementById('whiteSide');
    this.blackSideButton = document.getElementById('blackSide');
    this.oneMinuteButton = document.getElementById('oneMinuteButton');
    this.fiveMinuteButton = document.getElementById('fiveMinuteButton');
    this.tenMinuteButton = document.getElementById('tenMinuteButton');
    this.noTimerButton = document.getElementById('noTimerButton');
    this.newGameButton = document.getElementById('newGameButton');
    this.undoButton = document.getElementById('undoButton');
    this.flipButton = document.getElementById('flipButton');
    this.resignButton = document.getElementById('resignButton');
    this.movesShown = document.getElementById('moveList');
    this.showTurns = document.getElementById('showTurns');

    this.canvas.width = CONSTANT.CANVAS_WIDTH;
    this.canvas.height = CONSTANT.CANVAS_HEIGHT;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.canvas.addEventListener('click', (event) => {
      if (this.gameOver === 0) {
        if (this.playVsHuman === 1) {
          this.humanPlay(event);
        }

        if (this.playVsComputer === 1) {
          if (this.board.side === this.playerSide) {
            this.humanPlay(event);
          }
        }
      }
    });

    this.undoButton.addEventListener('click', () => {
      let move = this.moveGen.undoMove();
      this.popBlackAndWhiteCapturedPieces(move);
      this.displayWhiteCapturedPieces();
      this.displayBlackCapturedPieces();
      this.movesMade.pop();
      this.movesShown.removeChild(this.movesShown.lastChild);
      this.addMoveToMoveList();
    });

    this.newGameButton.addEventListener('click', () => {
      this.board.initialize();
      this.flip = 0;
      this.gameOver = 0;
      this.gameStart = 1;
      this.gameOverDiv.style.display = 'none';
      this.movesShown.innerHTML = '';
      this.movesMade = [];
      this.playerTimer = this.playerSelectedTimer;
      this.opponentTimer = this.opponentSelectedTimer;
    });

    this.flipButton.addEventListener('click', () => {
      this.flipBoard();
    });

    this.resignButton.addEventListener('click', () => {
      this.gameOverType.innerHTML = 'by Resignation';
      this.gameOver = 1;

      if (this.board.side === CONSTANT.WHITE) {
        this.winner = 'black';
      } else {
        this.winner = 'white';
      }
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
      this.gameStart = 1;
      this.playVsHuman = 1;
      this.playVsComputer = 0;
      this.startMenu.style.display = 'none';
      this.sideMenu.style.display = 'block';
    });

    this.playComputerButton.addEventListener('click', () => {
      this.gameStart = 1;
      this.playVsHuman = 0;
      this.playVsComputer = 1;
      this.startMenu.style.display = 'none';
      this.sideMenu.style.display = 'block';
    });

    this.oneMinuteButton.addEventListener('click', () => {
      this.oneMinuteButton.style.border = '2px solid green';
      this.noTimer = false;
      this.playerSelectedTimer = { minutes: 1, seconds: 0 };
      this.opponentSelectedTimer = { minutes: 1, seconds: 0 };
      this.playerTimer = { minutes: 1, seconds: 0 };
      this.opponentTimer = { minutes: 1, seconds: 0 };
    });

    this.fiveMinuteButton.addEventListener('click', () => {
      this.fiveMinuteButton.style.border = '2px solid green';
      this.noTimer = false;
      this.playerSelectedTimer = { minutes: 5, seconds: 0 };
      this.opponentSelectedTimer = { minutes: 5, seconds: 0 };
      this.playerTimer = { minutes: 5, seconds: 0 };
      this.opponentTimer = { minutes: 5, seconds: 0 };
    });

    this.tenMinuteButton.addEventListener('click', () => {
      this.tenMinuteButton.style.border = '2px solid green';
      this.noTimer = false;
      this.playerSelectedTimer = { minutes: 10, seconds: 0 };
      this.opponentSelectedTimer = { minutes: 10, seconds: 0 };
      this.playerTimer = { minutes: 10, seconds: 0 };
      this.opponentTimer = { minutes: 10, seconds: 0 };
    });

    this.noTimerButton.addEventListener('click', () => {
      this.noTimerButton.style.border = '2px solid green';
      this.noTimer = true;
    });
  }

  humanPlay(event) {
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
        this.addBlackAndWhiteCapturedPieces(this.legalMoves[i]);
        this.displayWhiteCapturedPieces();
        this.displayBlackCapturedPieces();
        this.movesMade.push(this.legalMoves[i]);
        this.addMoveToMoveList();
        this.fromSquare = -1;
        this.toSquare = -1;
      }
    }

    this.checkForCheckMate();
    this.checkThreeFoldRepetition();
    this.checkStaleMate();
  }

  computerPlay() {
    this.engine.findBestMove();
    this.moveGen.makeMove(this.engine.bestMove);
    this.addBlackAndWhiteCapturedPieces(this.engine.bestMove);
    this.displayWhiteCapturedPieces();
    this.displayBlackCapturedPieces();
    this.movesMade.push(this.engine.bestMove);
    this.addMoveToMoveList();

    this.checkForCheckMate();
    this.checkThreeFoldRepetition();
    this.checkStaleMate();
  }

  checkForCheckMate() {
    if (this.moveGen.checkCheckMate() === true) {
      this.gameOverType.innerHTML = 'by CheckMate';
      this.gameOver = 1;

      if (this.board.side === CONSTANT.WHITE) {
        this.winner = 'black';
      } else {
        this.winner = 'white';
      }
    }
  }

  checkStaleMate() {
    if (this.moveGen.isStaleMate() === true) {
      this.gameOver = 1;
      this.gameOverType.innerHTML = 'by StaleMate';
    }
  }

  checkThreeFoldRepetition() {
    if (this.moveGen.isThreeFoldRepetition() >= 3) {
      this.gameOver = 1;
      this.gameOverType.innerHTML = 'by Repitition';
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

  startTimer() {
    this.player1TimerDiv.innerHTML =
      this.playerTimer.minutes + ':' + this.playerTimer.seconds;
    this.player2TimerDiv.innerHTML =
      this.opponentTimer.minutes + ':' + this.opponentTimer.seconds;
    if (this.board.side === this.playerSide) {
      this.playerTimer = decreaseTimer(this.playerTimer);
    } else {
      this.opponentTimer = decreaseTimer(this.opponentTimer);
    }
  }

  checkTimer() {
    if (this.playerTimer.minutes === 0 && this.playerTimer.seconds === 0) {
      this.gameOver = 1;
      this.gameStart = 0;

      this.gameOverType.innerHTML = 'by Time';

      if (this.playerSide === CONSTANT.WHITE) {
        this.winner = 'black';
      } else {
        this.winner = 'white';
      }
    }

    if (this.opponentTimer.minutes === 0 && this.opponentTimer.seconds === 0) {
      console.log('b');
      this.gameOver = 1;
      this.gameStart = 0;

      this.gameOverType.innerHTML = 'by Time';

      if (this.opponentSide === CONSTANT.WHITE) {
        this.winner = 'black';
      } else {
        this.winner = 'white';
      }
    }
  }

  render() {
    this.frames++;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.drawBoard();
    this.drawPieces();

    if (this.frames >= 60) {
      this.frames = 0;
      if (this.gameStart === 1 && this.gameOver === 0) {
        if (this.noTimer === false) {
          this.startTimer();
        }
      }
    }

    this.displayTurn();

    if (this.fromSquare !== -1) {
      this.highlightSquare(this.fromSquare);
    }

    if (this.playVsComputer === 1) {
      if (this.board.side === this.opponentSide) {
        this.computerPlay();
      }
    }

    if (this.noTimer === false) {
      this.checkTimer();
    }

    if (this.gameOver === 1) {
      this.displayGameOver();
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
