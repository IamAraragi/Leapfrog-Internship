import CONSTANT from './constants.js';

/**
 * fucntion to get square from the given file and rank
 * @param {*} file
 * @param {*} rank
 * @returns square
 */
function getSquareFromFileAndRank(file, rank) {
  let squareIndex = (rank + 2) * 10 + (file + 1);
  return squareIndex;
}

/**
 * function to get file value from the given square value
 * @param {*} square
 * @returns file
 */
function getFileFromSquare(square) {
  return (square % 10) - 1;
}

/**
 * function to get rank value from the given square value
 * @param {*} square
 * @returns rank
 */
function getRankFromSquare(square) {
  return Math.floor(square / 10) - 2;
}

/**
 * function to get the move string
 * @param {*} move : move in integer form
 * @returns move in string form(eg a2a3)
 */
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

/**
 * function to get the move string for the move list
 * @param {*} moveList : moves as an array
 * @returns moves string as an array
 */
function getMoveStringList(moveList) {
  let moveStringList = [];
  for (let i = 0; i < moveList.length; i++) {
    moveStringList.push(getMoveString(moveList[i]));
  }

  return moveStringList;
}

/**
 * function to convert square in 64 array board representation to 120 array representation
 * @param {*} sq64 : square in 64 array board representaion
 * @returns square in 120 array board representation
 */
function square64To120(sq64) {
  let rank = Math.floor(sq64 / 8);
  let file = sq64 % 8;
  let sq120 = getSquareFromFileAndRank(file, rank);
  return sq120;
}

/**
 * function to convert square in 120 array board representation to 64 array representation
 * @param {*} sq64 : square in 120 array board representaion
 * @returns square in 64 array board representation
 */
function square120To64(sq120) {
  let rank = Math.floor(sq120 / 10);
  let file = sq120 % 10;
  let sq64 = (rank - 2) * 8 + (file - 1);
  return sq64;
}

/**
 * function to get the color for the chess piece
 * @param {*} piece
 * @returns 0 from white and 1 for black
 */
function getPieceColor(piece) {
  if ((piece > 0) & (piece < 7)) {
    return CONSTANT.WHITE;
  }

  if ((piece > 6) & (piece < 13)) {
    return CONSTANT.BLACK;
  }
}

/**
 * function to get the square from which piece is moved from the given move
 * @param {*} move : move in integer form
 * @returns from square
 */
function getFromSquare(move) {
  return move & 0x7f;
}

/**
 * function to get the square to which piece is moved from the given move
 * @param {*} move : move in integer form
 * @returns to square
 */
function getToSquare(move) {
  return (move >> 7) & 0x7f;
}

/**
 * function to get the captured piece from the given move
 * @param {*} move : move in integer form
 * @returns captured piece
 */
function captured(move) {
  return (move >> 14) & 0xf;
}

/**
 * function to get the promoted piece from the given move
 * @param {*} move : move in integer form
 * @returns promoted piece
 */
function promoted(move) {
  return (move >> 20) & 0xf;
}

/**
 * function to decrease the timer by a second
 * @param {*} timer
 * @returns
 */
function decreaseTimer(timer) {
  timer.seconds--;
  if (timer.seconds < 0) {
    timer.minutes--;
    timer.seconds = 59;
  }

  return timer;
}

/**
 * function to get a random 32 bit integer
 * @returns 32 bit integer
 */
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
