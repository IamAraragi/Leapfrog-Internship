import CONSTANT from '../constants.js';

export default class Pawn {
  constructor(board) {
    this.board = board;
    this.pawnAttacks = [9, 11];
  }

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
