import CONSTANT from './constants.js';

function getSquareFromFileAndRank(file, rank) {
  let squareIndex = (rank + 2) * 10 + (file + 1);
  return squareIndex;
}

function square64To120(sq64) {
  let rank = Math.floor(sq64 / 8);
  let file = sq64 % 8;
  let sq120 = getSquareFromFileAndRank(file, rank);
  return sq120;
}

function square120To64(sq120) {
  let rank = Math.floor(sq120 / 10);
  let file = sq120 % 10;
  let sq64 = (rank - 2) * 8 + (file - 1);
  return sq64;
}

function getPieceColor(piece) {
  if ((piece > 0) & (piece < 7)) {
    return CONSTANT.WHITE;
  }

  if ((piece > 6) & (piece < 13)) {
    return CONSTANT.BLACK;
  }
}

function getRandom32() {
  return (
    (Math.floor(Math.random() * 255 + 1) << 23) |
    (Math.floor(Math.random() * 255 + 1) << 16) |
    (Math.floor(Math.random() * 255 + 1) << 8) |
    Math.floor(Math.random() * 255 + 1)
  );
}

export {
  getSquareFromFileAndRank,
  getRandom32,
  square64To120,
  square120To64,
  getPieceColor,
};
