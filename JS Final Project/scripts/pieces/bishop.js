import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Bishop {
  /**
   * constructor of the bishop class
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.bishopAttacks = [-9, -11, 11, 9];
  }

  /**
   * method to check if the square is attacked by the bishop from the given side
   * @param {*} square : square on the board to checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked by the bishop from the given side else false
   */
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
    return false;
  }
}
