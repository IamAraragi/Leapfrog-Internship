import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class King {
  /**
   * constructor of the king class
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.kingAttacks = [-1, -9, -10, -11, 1, 9, 10, 11];
  }

  /**
   * method to check if the square is attacked by the king from the given side
   * @param {*} square : square on the board to checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked by the king from the given side else false
   */
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
