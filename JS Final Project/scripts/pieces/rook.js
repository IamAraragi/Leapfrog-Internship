import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Rook {
  constructor(board) {
    this.board = board;
    this.rookAttacks = [-1, -10, 1, 10];
  }

  isRookAttacking(square, side) {
    for (let i = 0; i < this.rookAttacks.length; i++) {
      let targetSquare = square + this.rookAttacks[i];
      let piece = this.board.pieces[targetSquare];
      while (piece !== CONSTANT.SQUARES.OFFBOARD) {
        if (piece !== CONSTANT.PIECES.empty) {
          if (
            (piece === CONSTANT.PIECES.wR || piece === CONSTANT.PIECES.bR) &&
            getPieceColor(piece) == side
          ) {
            return true;
          }
          break;
        }
        targetSquare += this.rookAttacks[i];
        piece = this.board.pieces[targetSquare];
      }
    }
    return false;
  }
}
