import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Rook {
  /**
   * constructor of the rook class
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.rookAttacks = [-1, -10, 1, 10];
  }

  /**
   * method to check if the square is attacked by the rook from the given side
   * @param {*} square : square on the board to checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked by the rook from the given side else false
   */
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
