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
  /**
   * constructor for the chess interface
   * @param {*} board : board representation
   * @param {*} moveGen : move generation class
   * @param {*} engine : chess engine class
   */
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

  /**
   * method to intialize the chess interface
   */
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
    // this.loadImage();

    setInterval(() => {
      if (this.playVsComputer === 1 && this.gameOver === 0) {
        if (this.board.side === this.opponentSide) {
          this.computerPlay();
        }
      }
    }, 2500);
  }

  /**
   * method to intialize all the event listeners for the chess interface
   */
  initializeEventListeners() {
    // event listener that triggers when the canvas is clicked
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

    // event listener that triggers when undo button is clicked
    this.undoButton.addEventListener('click', () => {
      let move = this.moveGen.undoMove();
      this.popBlackAndWhiteCapturedPieces(move);
      this.displayWhiteCapturedPieces();
      this.displayBlackCapturedPieces();
      this.movesMade.pop();
      this.movesShown.removeChild(this.movesShown.lastChild);
      this.addMoveToMoveList();
    });

    // event listener that triggers when new game button is clicked
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
      this.whiteCapturedPieces = [];
      this.blackCapturedPieces = [];
      this.whiteCapturedPiecesUnicode = [];
      this.blackCapturedPiecesUnicode = [];
      this.displayWhiteCapturedPieces();
      this.displayBlackCapturedPieces();
    });

    // event listener that triggers when flip button is clicked
    this.flipButton.addEventListener('click', () => {
      this.flipBoard();
    });

    // event listener that triggers when resign button is clicked
    this.resignButton.addEventListener('click', () => {
      this.gameOverType.innerHTML = 'by Resignation';
      this.gameOver = 1;

      if (this.board.side === CONSTANT.WHITE) {
        this.winner = 'black';
      } else {
        this.winner = 'white';
      }
    });

    // event listener that triggers when white side button is clicked
    this.whiteSideButton.addEventListener('click', () => {
      this.playerSide = CONSTANT.WHITE;
      this.opponentSide = CONSTANT.BLACK;
      this.flip = 0;
      this.whiteSideButton.style.border = '3px solid green';
      this.blackSideButton.style.border = 'none';
    });

    // event listener that triggers when black side button is clicked
    this.blackSideButton.addEventListener('click', () => {
      this.playerSide = CONSTANT.BLACK;
      this.opponentSide = CONSTANT.WHITE;
      this.flip = 1;
      this.blackSideButton.style.border = '3px solid green';
      this.whiteSideButton.style.border = 'none';
    });

    // event listener that triggers when Play Human button is clicked
    this.playHumanButton.addEventListener('click', () => {
      this.gameStart = 1;
      this.playVsHuman = 1;
      this.playVsComputer = 0;
      this.startMenu.style.display = 'none';
      this.sideMenu.style.display = 'block';
    });

    // event listener that triggers when Play Computer button is clicked
    this.playComputerButton.addEventListener('click', () => {
      this.gameStart = 1;
      this.playVsHuman = 0;
      this.playVsComputer = 1;
      this.startMenu.style.display = 'none';
      this.sideMenu.style.display = 'block';
    });

    // event listener that triggers when 1 min button is clicked
    this.oneMinuteButton.addEventListener('click', () => {
      this.oneMinuteButton.style.border = '2px solid green';
      this.fiveMinuteButton.style.border = 'none';
      this.tenMinuteButton.style.border = 'none';
      this.noTimerButton.style.border = 'none';
      this.noTimer = false;
      this.playerSelectedTimer = { minutes: 1, seconds: 0 };
      this.opponentSelectedTimer = { minutes: 1, seconds: 0 };
      this.playerTimer = { minutes: 1, seconds: 0 };
      this.opponentTimer = { minutes: 1, seconds: 0 };
    });

    // event listener that triggers when 5 min button is clicked
    this.fiveMinuteButton.addEventListener('click', () => {
      this.fiveMinuteButton.style.border = '2px solid green';
      this.oneMinuteButton.style.border = 'none';
      this.tenMinuteButton.style.border = 'none';
      this.noTimerButton.style.border = 'none';
      this.noTimer = false;
      this.playerSelectedTimer = { minutes: 5, seconds: 0 };
      this.opponentSelectedTimer = { minutes: 5, seconds: 0 };
      this.playerTimer = { minutes: 5, seconds: 0 };
      this.opponentTimer = { minutes: 5, seconds: 0 };
    });

    // event listener that triggers when 10 min button is clicked
    this.tenMinuteButton.addEventListener('click', () => {
      this.tenMinuteButton.style.border = '2px solid green';
      this.fiveMinuteButton.style.border = 'none';
      this.oneMinuteButton.style.border = 'none';
      this.noTimerButton.style.border = 'none';
      this.noTimer = false;
      this.playerSelectedTimer = { minutes: 10, seconds: 0 };
      this.opponentSelectedTimer = { minutes: 10, seconds: 0 };
      this.playerTimer = { minutes: 10, seconds: 0 };
      this.opponentTimer = { minutes: 10, seconds: 0 };
    });

    // event listener that triggers when no timer button is clicked
    this.noTimerButton.addEventListener('click', () => {
      this.noTimerButton.style.border = '2px solid green';
      this.fiveMinuteButton.style.border = 'none';
      this.tenMinuteButton.style.border = 'none';
      this.oneMinuteButton.style.border = 'none';
      this.noTimer = true;
    });
  }

  /**
   * method to flip the board
   */
  flipBoard() {
    this.flip = +!this.flip;
    this.changeSide();
  }

  /**
   * method to display which side turn is it to play
   */
  displayTurn() {
    if (this.board.side === CONSTANT.WHITE) {
      this.showTurns.innerHTML = 'WHITE TURN';
    } else {
      this.showTurns.innerHTML = 'BLACK TURN';
    }
  }

  /**
   * method to display game over screen
   */
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

  /**
   * method to change the player info
   */
  changeSide() {
    let player1Info = this.player1.innerHTML;
    let player2Info = this.player2.innerHTML;

    this.player1.innerHTML = player2Info;
    this.player2.innerHTML = player1Info;
  }

  /**
   * method to add the captured black and white pieces to their respective array
   * @param {*} move : move in integer form
   */
  addBlackAndWhiteCapturedPieces(move) {
    if (captured(move) === CONSTANT.PIECES.empty) return;
    if (this.board.side === CONSTANT.WHITE) {
      this.whiteCapturedPieces.push(captured(move));
    } else {
      this.blackCapturedPieces.push(captured(move));
    }
  }

  /**
   * method to remove the captured black and white pieces from their respective array
   * @param {*} move : move in integer form
   */
  popBlackAndWhiteCapturedPieces(move) {
    if (captured(move) === CONSTANT.PIECES.empty) return;
    if (this.board.side === CONSTANT.WHITE) {
      this.blackCapturedPieces.pop();
    } else {
      this.whiteCapturedPieces.pop();
    }
  }

  /**
   * method to get the unicode value for the captured pieces
   */
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

  /**
   * method to display the white captured pieces
   */
  displayWhiteCapturedPieces() {
    this.player1CapturedPiecesString = '';
    this.player2CapturedPiecesString = '';

    this.getBlackAndWhitePiecesUnicode();

    if (this.whiteCapturedPiecesUnicode.length !== 0) {
      if (this.playerSide === CONSTANT.WHITE) {
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

  /**
   * method to display the black captured pieces
   */
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

  /**
   * method to make the human move on the chess board
   * @param {*} event : event from the canvas event listener
   */
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
    this.checkFiftyMoveRule();
  }

  /**
   * method to make the move made by the computer on the chess inteface
   */
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
    this.checkFiftyMoveRule();
  }

  /**
   * method to display the game over screen if there is checkmate
   */
  checkForCheckMate() {
    if (this.moveGen.checkCheckMate() === false) return;
    this.gameOverType.innerHTML = 'by CheckMate';
    this.gameOver = 1;

    if (this.board.side === CONSTANT.WHITE) {
      this.winner = 'black';
    } else {
      this.winner = 'white';
    }
  }

  /**
   * method to display the game over screen if there is stalemate
   */
  checkStaleMate() {
    if (this.moveGen.isStaleMate() === true) {
      this.gameOver = 1;
      this.gameOverType.innerHTML = 'by StaleMate';
    }
  }

  /**
   * method to display the game over screen if there is three fold repetition
   */
  checkThreeFoldRepetition() {
    if (this.moveGen.isThreeFoldRepetition() >= 3) {
      this.gameOver = 1;
      this.gameOverType.innerHTML = 'by Repitition';
    }
  }

  checkFiftyMoveRule() {
    if (this.board.fiftyMoves >= 100) {
      this.gameOver = 1;
      this.gameOverType.innerHTML = 'by 50 move rule';
    }
  }

  /**
   * method to display the moves made on the interface
   */
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
      if (childs[childs.length - 1] !== undefined) {
        childs[childs.length - 1].innerHTML = moveString;
      }
    }
  }

  /**
   * method to get the row and column for the given square
   * @param {*} square : square for which row and column is to be determined
   * @returns row and column as an array
   */
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

  /**
   * method to get the square from which the piece is to be moved
   * @param {*} selectedSquare : square selected by the user
   * @param {*} selectedPiece : piece on the selected square
   */
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

  /**
   * method to get square to which the piece is to be moved
   * @param {*} selectedSquare : square selected by the user
   */
  getClickedToSquare(selectedSquare) {
    if (this.fromSquare !== -1 && this.fromSquare !== selectedSquare) {
      this.toSquare = selectedSquare;
    }
  }

  /**
   * method to get all the legal moves of the clicked chess piece
   * @returns legal moves as an array
   */
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

  /**
   * highlights the square given and the possible moves for the piece in that square
   * @param {*} square : square to be highlighted
   */
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

  /**
   * method to draw the chess board
   */
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

  /**
   * method to load the chess piece images
   */
  loadPieces() {
    let file = 0;
    let rank = 0;
    this.imageList = [];
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
          this.imageList.push(img);
        } else {
          this.imageList.push('.');
        }
      }
    }
  }

  /**
   * method to draw chess pieces
   */
  drawPieces() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.imageList[row * 8 + col] !== '.') {
          this.ctx.drawImage(
            this.imageList[row * 8 + col],
            col * this.squareSize,
            row * this.squareSize,
            this.squareSize,
            this.squareSize
          );
        }
      }
    }
  }

  /**
   * method to start the timer
   */
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

  /**
   * method to check if the timer has ended
   */
  checkTimer() {
    if (this.playerTimer.minutes < 0) {
      this.gameOver = 1;
      this.gameStart = 0;

      this.gameOverType.innerHTML = 'by Time';

      if (this.playerSide === CONSTANT.WHITE) {
        this.winner = 'black';
      } else {
        this.winner = 'white';
      }
    }

    if (this.opponentTimer.minutes < 0) {
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

  /**
   * method to render the chess interface
   */
  render() {
    this.frames++;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.drawBoard();
    this.loadPieces();
    this.drawPieces();

    // checks if there is timer and starts the timer
    if (this.frames >= 60) {
      this.frames = 0;
      if (
        this.gameStart === 1 &&
        this.gameOver === 0 &&
        this.noTimer === false
      ) {
        this.startTimer();
      }
    }

    this.displayTurn();

    // calls highlight square method if the fromSquare variable is not emplty
    if (this.fromSquare !== -1) {
      this.highlightSquare(this.fromSquare);
    }

    // checks if timer has ended if it a timed chess game
    if (this.noTimer === false) {
      this.checkTimer();
    }

    // check if the game is over or not
    if (this.gameOver === 1) {
      this.displayGameOver();
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
