import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Queen {
  constructor(board) {
    this.board = board;
    this.queenAttacks = [-1, -9, -10, -11, 1, 9, 10, 11];
  }

  isQueenAttacking(square, side) {
    for (let i = 0; i < this.queenAttacks.length; i++) {
      let targetSquare = square + this.queenAttacks[i];
      let piece = this.board.pieces[targetSquare];
      while (piece !== CONSTANT.SQUARES.OFFBOARD) {
        if (piece !== CONSTANT.PIECES.empty) {
          if (
            (piece === CONSTANT.PIECES.wQ || piece === CONSTANT.PIECES.bQ) &&
            getPieceColor(piece) == side
          ) {
            return true;
          }
          break;
        }
        targetSquare += this.queenAttacks[i];
        piece = this.board.pieces[targetSquare];
      }
    }
  }
}
