import CONSTANT from '../constants.js';

export default class Pawn {
  /**
   * constructor of the pawn class
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.pawnAttacks = [9, 11];
  }

  /**
   * method to check if the square is attacked by the pawn from the given side
   * @param {*} square : square on the board to checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked by the pawn from the given side else false
   */
  isPawnAttacking(square, side) {
    if (side === CONSTANT.BLACK) {
      if (
        this.board.pieces[square + this.pawnAttacks[0]] ===
          CONSTANT.PIECES.bP ||
        this.board.pieces[square + this.pawnAttacks[1]] === CONSTANT.PIECES.bP
      ) {
        return true;
      }
    } else {
      if (
        this.board.pieces[square - this.pawnAttacks[0]] ===
          CONSTANT.PIECES.wP ||
        this.board.pieces[square - this.pawnAttacks[1]] === CONSTANT.PIECES.wP
      ) {
        return true;
      }
    }
    return false;
  }
}
