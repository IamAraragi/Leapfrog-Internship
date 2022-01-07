import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class King {
  constructor(board) {
    this.board = board;
    this.kingAttacks = [-1, -9, -10, -11, 1, 9, 10, 11];
  }

  isKingAttacking(square, side) {
    for (let i = 0; i < this.kingAttacks.length; i++) {
      let piece = this.board.pieces[square + this.kingAttacks[i]];
      if (
        (piece === CONSTANT.PIECES.wK || piece === CONSTANT.PIECES.bK) &&
        piece !== CONSTANT.SQUARES.OFFBOARD &&
        getPieceColor(piece) == side
      ) {
        return true;
      }
    }
    return false;
  }
}
