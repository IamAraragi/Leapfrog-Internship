import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Queen {
  /**
   * constructor of the queen class
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.queenAttacks = [-1, -9, -10, -11, 1, 9, 10, 11];
  }

  /**
   * method to check if the square is attacked by the queen from the given side
   * @param {*} square : square on the board to checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked by the queen from the given side else false
   */
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
    return false;
  }
}
