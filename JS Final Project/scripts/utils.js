import CONSTANT from './constants.js';

function getSquareFromFileAndRank(file, rank) {
  let squareIndex = (rank + 2) * 10 + (file + 1);
  return squareIndex;
}

function getFileFromSquare(square) {
  return (square % 10) - 1;
}

function getRankFromSquare(square) {
  return Math.floor(square / 10) - 2;
}

function getMoveString(move) {
  let fromSquare = getFromSquare(move);
  let toSquare = getToSquare(move);

  let fromSquareFile = getFileFromSquare(fromSquare);
  let toSquareFile = getFileFromSquare(toSquare);
  let fromSquareRank = getRankFromSquare(fromSquare);
  let toSquareRank = getRankFromSquare(toSquare);

  return (
    CONSTANT.FILE_CHARACTER[fromSquareFile] +
    (fromSquareRank + 1) +
    CONSTANT.FILE_CHARACTER[toSquareFile] +
    (toSquareRank + 1)
  );
}

function getMoveStringList(moveList) {
  let moveStringList = [];
  for (let i = 0; i < moveList.length; i++) {
    moveStringList.push(getMoveString(moveList[i]));
  }

  return moveStringList;
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

function getFromSquare(move) {
  return move & 0x7f;
}

function getToSquare(move) {
  return (move >> 7) & 0x7f;
}

function captured(move) {
  return (move >> 14) & 0xf;
}

function promoted(move) {
  return (move >> 20) & 0xf;
}

function decreaseTimer(timer) {
  timer.seconds--;
  if (timer.seconds < 0) {
    timer.minutes--;
    timer.seconds = 59;
  }

  return timer;
}

function hashRand() {
  return (
    (Math.floor(Math.random() * 255 + 1) << 23) |
    (Math.floor(Math.random() * 255 + 1) << 16) |
    (Math.floor(Math.random() * 255 + 1) << 8) |
    Math.floor(Math.random() * 255 + 1)
  );
}

export {
  getSquareFromFileAndRank,
  square64To120,
  square120To64,
  getPieceColor,
  getFromSquare,
  getToSquare,
  captured,
  promoted,
  getFileFromSquare,
  getRankFromSquare,
  getMoveString,
  getMoveStringList,
  decreaseTimer,
  hashRand,
};
