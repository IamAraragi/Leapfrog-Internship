import Board from './board.js';
import MoveGen from './move.js';
import Engine from './engine.js';
import BoardInterface from './interface.js';

function init() {
  let board = new Board();
  board.initialize();
  let moveGen = new MoveGen(board);
  let engine = new Engine(board, moveGen);
  new BoardInterface(board, moveGen, engine);
}

init();
