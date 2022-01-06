import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Bishop {
  constructor(board) {
    this.board = board;
    this.bishopAttacks = [-9, -11, 11, 9];
  }

  isBishopAttacking(square, side) {
    for (let i = 0; i < this.bishopAttacks.length; i++) {
      let targetSquare = square + this.bishopAttacks[i];
      let piece = this.board.pieces[targetSquare];
      while (piece !== CONSTANT.SQUARES.OFFBOARD) {
        if (piece !== CONSTANT.PIECES.empty) {
          if (
            (piece === CONSTANT.PIECES.wB || piece === CONSTANT.PIECES.bB) &&
            getPieceColor(piece) == side
          ) {
            return true;
          }
          break;
        }
        targetSquare += this.bishopAttacks[i];
        piece = this.board.pieces[targetSquare];
      }
    }
  }
}
