import CONSTANT from './constants.js';
import { SCORE_BY_POSITION } from './constants.js';
import { square120To64 } from './utils.js';

export default class Engine {
  /**
   * constructor for the game engine
   * @param {*} board : board representation
   * @param {*} moveGen move generation class
   */
  constructor(board, moveGen) {
    this.board = board;
    this.moveGen = moveGen;
    this.bestMove;
  }

  /**
   * method to get positional score for the given piece
   * @param {*} piece : piece for which the position score is to be determined
   * @returns positional score for the piece
   */
  getPositionScore(piece) {
    let positionScore = 0;
    for (let i = 0; i < this.board.pieceNum[piece]; i++) {
      let pieceIndex = piece * 10 + i;
      let square = this.board.pieceList[pieceIndex];
      positionScore += SCORE_BY_POSITION[piece][square120To64(square)];
    }

    return positionScore;
  }

  /**
   * method to get the score for the given board position
   * @returns score
   */
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

  /**
   * method to find the best move using alpha beta
   */
  findBestMove() {
    this.findAlphaBetaMove(
      CONSTANT.DEPTH,
      -CONSTANT.CHECKMATE,
      CONSTANT.CHECKMATE
    );
  }

  /**
   * method to implement the alpha beta algorith
   * @param {*} depth : depth upto which alpha beta algorith searches
   * @param {*} alpha : alpha value
   * @param {*} beta : beta value
   * @returns max score
   */
  findAlphaBetaMove(depth, alpha, beta) {
    this.moveGen.generateLegalMoves();

    if (depth === 0) {
      return this.getScore();
    }

    let maxScore = -CONSTANT.CHECKMATE;

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

    if (this.moveGen.moves.length === 0) {
      if (this.moveGen.checkCheckMate() === true) {
        return -CONSTANT.CHECKMATE;
      } else {
        return 0;
      }
    }

    if (this.moveGen.isThreeFoldRepetition >= 3) {
      return 0;
    }
    return maxScore;
  }
}
