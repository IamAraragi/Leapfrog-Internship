import Board from './board.js';
import MoveGen from './move.js';
import BoardInterface from './interface.js';

function init() {
  let board = new Board();
  board.initialize();
  let moveGen = new MoveGen(board);
  // moveGen.generatePseudoLegalMoves();
  // console.log(moveGen.moves);
  // board.printMoveList(0);

  // moveGen.makeMove(board.moveList[0][1]);
  // board.renderBoard();
  // for (let i = 0; i < 10; i++) {
  //   moveGen.generatePseudoLegalMoves();
  //   console.log(moveGen.moves);
  //   board.printMoveList(i);

  //   moveGen.makeMove(board.moveList[i][1]);
  //   board.renderBoard();
  // }
  // moveGen.generatePseudoLegalMoves();
  // console.log(moveGen.moves);
  // board.printMoveList();
  // moveGen.makeMove(board.moveList[1][1]);
  // board.renderBoard();

  // moveGen.generatePseudoLegalMoves();
  // board.printMoveList();

  // moveGen.undoMove();
  // board.renderBoard();

  let boardInterface = new BoardInterface(board, moveGen);
  boardInterface.render();
}

init();
