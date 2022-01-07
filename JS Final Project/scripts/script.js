import Board from './board.js';
import MoveGen from './move.js';
import Rook from './pieces/rook.js';

function init() {
  let board = new Board();
  board.initialize();
  let moveGen = new MoveGen(board);
  moveGen.generatePseudoLegalMoves();
  console.log(moveGen.moves);
  board.printMoveList();
}

init();
