import CONSTANT from '../constants.js';
import { getPieceColor } from '../utils.js';

export default class Knight {
  /**
   * constructor of the knight class
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.knightAttacks = [-8, -19, -21, -12, 8, 19, 21, 12];
  }

  /**
   * method to check if the square is attacked by the knight from the given side
   * @param {*} square : square on the board to checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked by the knight from the given side else false
   */
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
