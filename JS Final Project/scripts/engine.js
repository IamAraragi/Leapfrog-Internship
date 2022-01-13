import CONSTANT from './constants.js';
import { SCORE_BY_POSITION } from './constants.js';
import { getMoveString, square120To64 } from './utils.js';

export default class Engine {
  constructor(board, moveGen) {
    this.board = board;
    this.moveGen = moveGen;
    this.bestMove;
    this.nodes = 0;
  }

  getPositionScore(piece) {
    let positionScore = 0;
    for (let i = 0; i < this.board.pieceNum[piece]; i++) {
      let pieceIndex = piece * 10 + i;
      let square = this.board.pieceList[pieceIndex];
      positionScore += SCORE_BY_POSITION[piece][square120To64(square)];
    }

    return positionScore;
  }

  getScore() {
    let score =
      this.board.totalMaterialForSide[CONSTANT.WHITE] -
      this.board.totalMaterialForSide[CONSTANT.BLACK];

    for (let piece = CONSTANT.PIECES.wP; piece < CONSTANT.PIECES.wK; piece++) {
      score += this.getPositionScore(piece);
    }

    for (let piece = CONSTANT.PIECES.bP; piece < CONSTANT.PIECES.bK; piece++) {
      score -= this.getPositionScore(piece);
    }

    if (this.board.side === CONSTANT.WHITE) {
      return score;
    } else {
      return -score;
    }
  }

  sortMoves(moves) {
    let movesWithScore = {};
    let sortedMoves = [];
    for (let i = 0; i < moves.length; i++) {
      this.moveGen.makeMove(moves[i]);
      let score = this.getScore();
      this.moveGen.undoMove();
      movesWithScore[score] = moves[i];
    }

    const keysSorted = Object.keys(movesWithScore).sort(function (a, b) {
      return b - a;
    });

    for (let i = 0; i < keysSorted.length; i++) {
      sortedMoves.push(movesWithScore[keysSorted[i]]);
    }
    return sortedMoves;
  }

  findBestMove() {
    // for (let i = 1; i <= 4; i++) {
    //   let bestScore = this.findAlphaBetaMove(
    //     i,
    //     -CONSTANT.CHECKMATE,
    //     CONSTANT.CHECKMATE
    //   );

    //   let line =
    //     'D:' +
    //     i +
    //     ' Best:' +
    //     getMoveString(this.bestMove) +
    //     ' Score:' +
    //     bestScore +
    //     ' nodes:' +
    //     this.nodes;

    //   console.log(line);
    // }

    this.findAlphaBetaMove(
      CONSTANT.DEPTH,
      -CONSTANT.CHECKMATE,
      CONSTANT.CHECKMATE
    );
  }

  findAlphaBetaMove(depth, alpha, beta) {
    this.moveGen.generateLegalMoves();

    if (depth === 0 || this.moveGen.moves.length === 0) {
      return this.getScore();
    }
    this.nodes++;

    let maxScore = -CONSTANT.CHECKMATE;

    // let moves = this.sortMoves(this.board.moveList[this.board.ply]);
    let moves = this.board.moveList[this.board.ply];

    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      this.moveGen.makeMove(move);
      let score = -this.findAlphaBetaMove(depth - 1, -beta, -alpha);

      if (score > maxScore) {
        maxScore = score;
        if (depth === CONSTANT.DEPTH) {
          this.bestMove = move;
        }
      }
      this.moveGen.undoMove();

      if (maxScore > alpha) {
        alpha = maxScore;
      }

      if (alpha >= beta) {
        break;
      }
    }
    return maxScore;
  }
}
