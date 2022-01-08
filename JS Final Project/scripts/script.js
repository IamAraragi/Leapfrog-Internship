import Board from './board.js';
import MoveGen from './move.js';

function init() {
  let board = new Board();
  board.initialize();
  let moveGen = new MoveGen(board);
  moveGen.generatePseudoLegalMoves();
  console.log(moveGen.moves);
  board.printMoveList();

  moveGen.makeMove(board.moveList[0][18]);
  board.renderBoard();

  moveGen.generatePseudoLegalMoves();
  // console.log(moveGen.moves);
  // board.printMoveList();
  moveGen.makeMove(board.moveList[1][1]);
  board.renderBoard();

  moveGen.undoMove();
  board.renderBoard();
}

init();
