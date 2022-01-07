import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Knight {
  constructor(board) {
    this.board = board;
    this.knightAttacks = [-8, -19, -21, -12, 8, 19, 21, 12];
  }

  isKnightAttacking(square, side) {
    for (let i = 0; i < this.knightAttacks.length; i++) {
      // console.log(this.board.pieces);
      let piece = this.board.pieces[square + this.knightAttacks[i]];
      if (
        (piece === CONSTANT.PIECES.wN || piece === CONSTANT.PIECES.bN) &&
        piece !== CONSTANT.SQUARES.OFFBOARD &&
        getPieceColor(piece) === side
      ) {
        return true;
      }
    }
    return false;
  }
}
