import CONSTANT from './constants.js';
import {
  captured,
  getFromSquare,
  getPieceColor,
  getToSquare,
  promoted,
} from './utils.js';

export default class MoveGen {
  /**
   * constructor for the movegen class.
   * Move generation class is used to generated legal moves, make a move and undo move
   * @param {*} board : board class
   */
  constructor(board) {
    this.board = board;
    this.moves = [];
    this.nonSlidingWhitePiece = [CONSTANT.PIECES.wN, CONSTANT.PIECES.wK];
    this.nonSlidingBlackPiece = [CONSTANT.PIECES.bN, CONSTANT.PIECES.bK];
    this.nonSlidingAttacks = [CONSTANT.KNIGHT_ATTACKS, CONSTANT.KING_ATTACKS];

    this.slidingWhitePiece = [
      CONSTANT.PIECES.wB,
      CONSTANT.PIECES.wR,
      CONSTANT.PIECES.wQ,
    ];
    this.slidingBlackPiece = [
      CONSTANT.PIECES.bB,
      CONSTANT.PIECES.bR,
      CONSTANT.PIECES.bQ,
    ];
    this.slidingAttacks = [
      CONSTANT.BISHOP_ATTACKS,
      CONSTANT.ROOK_ATTACKS,
      CONSTANT.KING_ATTACKS,
    ];

    this.gameInfo = {};
    this.gameHistory = [];
  }

  /**
   * method to get the move in integer form
   * @param {\} from : square from which the piece is moved
   * @param {*} to : square to which the piece is moved
   * @param {*} captured : captured piece
   * @param {*} promoted promoted piece
   * @param {*} flag : flag for pawn start/enpassant/castle
   * @returns a integer
   */
  getMove(from, to, captured, promoted, flag) {
    return from | (to << 7) | (captured << 14) | (promoted << 20) | flag;
  }

  /**
   * method to get all the white pawn promotion moves
   * @param {*} square : square from which the white pawn is to be moved
   * @param {*} newSquare : square to which the white pawn is to be moved
   * @param {*} captured : captured piece if any
   */
  getWhitePawnPromotionMoves(square, newSquare, captured) {
    let move = 0;
    if (this.board.ranksBoard[square] === CONSTANT.RANKS.RANK_7) {
      move = this.getMove(square, newSquare, captured, CONSTANT.PIECES.wQ, 0);
      this.moves.push(move);
    } else {
      move = this.getMove(
        square,
        newSquare,
        captured,
        CONSTANT.PIECES.empty,
        0
      );
      this.moves.push(move);
    }
  }

  /**
   * method to get all the white pawn forward moves
   * @param {*} square : square where the white pawn is
   */
  getWhitePawnForwardMoves(square) {
    //Check for forward move
    let newSquare = square + 10;
    let move = 0;
    if (this.board.pieces[newSquare] === CONSTANT.PIECES.empty) {
      //Check if it is on promotion square
      this.getWhitePawnPromotionMoves(square, newSquare, CONSTANT.PIECES.empty);

      // Check if it is on rank 2 where th pawn can move two steps forward
      newSquare = square + 20;
      if (
        this.board.ranksBoard[square] === CONSTANT.RANKS.RANK_2 &&
        this.board.pieces[newSquare] === CONSTANT.PIECES.empty
      ) {
        move = this.getMove(
          square,
          newSquare,
          CONSTANT.PIECES.empty,
          CONSTANT.PIECES.empty,
          CONSTANT.FLAG_PAWN_START
        );
        this.moves.push(move);
      }
    }
  }

  /**
   * method to get all the white pawn capture moves
   * @param {*} square : square where the white pawn is
   */
  getWhitePawnCaptureMoves(square) {
    // Check for pawn captures
    let newSquare = square + CONSTANT.PAWN_ATTACKS[0];
    if (
      this.board.filesBoard[newSquare] !== CONSTANT.SQUARES.OFFBOARD &&
      getPieceColor(this.board.pieces[newSquare]) !== this.board.side &&
      this.board.pieces[newSquare] !== CONSTANT.PIECES.empty
    ) {
      this.getWhitePawnPromotionMoves(
        square,
        newSquare,
        this.board.pieces[newSquare]
      );
    }

    newSquare = square + CONSTANT.PAWN_ATTACKS[1];
    if (
      this.board.filesBoard[newSquare] !== CONSTANT.SQUARES.OFFBOARD &&
      getPieceColor(this.board.pieces[newSquare]) !== this.board.side &&
      this.board.pieces[newSquare] !== CONSTANT.PIECES.empty
    ) {
      this.getWhitePawnPromotionMoves(
        square,
        newSquare,
        this.board.pieces[newSquare]
      );
    }
  }

  /**
   * method to get all the enpassant moves for the white pawn
   * @param {*} square : square where the white pawn is
   */
  getWhitePawnEnPassantMoves(square) {
    //check for en passants
    let newSquare = square + CONSTANT.PAWN_ATTACKS[0];
    if (newSquare === this.board.enPassant) {
      let move = this.getMove(
        square,
        newSquare,
        CONSTANT.PIECES.empty,
        CONSTANT.PIECES.empty,
        CONSTANT.FLAG_ENPASSANT
      );
      this.moves.push(move);
    }

    newSquare = square + CONSTANT.PAWN_ATTACKS[1];
    if (newSquare === this.board.enPassant) {
      let move = this.getMove(
        square,
        newSquare,
        CONSTANT.PIECES.empty,
        CONSTANT.PIECES.empty,
        CONSTANT.FLAG_ENPASSANT
      );
      this.moves.push(move);
    }
  }

  /**
   * method to get all the castle moves for the white side
   */
  getWhiteSideCastleMoves() {
    if (this.board.castle & CONSTANT.CASTLE.WHITE_KING_CASTLE) {
      if (
        this.board.pieces[CONSTANT.SQUARES.G1] === CONSTANT.PIECES.empty &&
        this.board.pieces[CONSTANT.SQUARES.F1] === CONSTANT.PIECES.empty
      ) {
        if (
          this.board.isAttacked(CONSTANT.SQUARES.E1, CONSTANT.BLACK) ===
            false &&
          this.board.isAttacked(CONSTANT.SQUARES.F1, CONSTANT.BLACK) === false
        ) {
          let move = this.getMove(
            CONSTANT.SQUARES.E1,
            CONSTANT.SQUARES.G1,
            CONSTANT.PIECES.empty,
            CONSTANT.PIECES.empty,
            CONSTANT.FLAG_CASTLE
          );
          this.moves.push(move);
        }
      }
    }

    if (this.board.castle & CONSTANT.CASTLE.WHITE_QUEEN_CASTLE) {
      if (
        this.board.pieces[CONSTANT.SQUARES.B1] === CONSTANT.PIECES.empty &&
        this.board.pieces[CONSTANT.SQUARES.C1] === CONSTANT.PIECES.empty &&
        this.board.pieces[CONSTANT.SQUARES.D1] === CONSTANT.PIECES.empty
      ) {
        if (
          this.board.isAttacked(CONSTANT.SQUARES.E1, CONSTANT.BLACK) ===
            false &&
          this.board.isAttacked(CONSTANT.SQUARES.D1, CONSTANT.BLACK) === false
        ) {
          let move = this.getMove(
            CONSTANT.SQUARES.E1,
            CONSTANT.SQUARES.C1,
            CONSTANT.PIECES.empty,
            CONSTANT.PIECES.empty,
            CONSTANT.FLAG_CASTLE
          );
          this.moves.push(move);
        }
      }
    }
  }

  /**
   * method to get all the possible white pawn moves
   */
  getWhitePawnMoves() {
    let piece = CONSTANT.PIECES.wP;

    for (let pieceNum = 0; pieceNum < this.board.pieceNum[piece]; pieceNum++) {
      let pieceIndex = piece * 10 + pieceNum;
      let square = this.board.pieceList[pieceIndex];

      this.getWhitePawnForwardMoves(square);
      this.getWhitePawnCaptureMoves(square);
      this.getWhitePawnEnPassantMoves(square);
    }
  }

  /**
   * method to get all the black pawn promotion moves
   * @param {*} square : square from which the black pawn is to be moved
   * @param {*} newSquare : square to which the black pawn is to be moved
   * @param {*} captured : captured piece if any
   */
  getBlackPawnPromotionMoves(square, newSquare, captured) {
    let move = 0;
    if (this.board.ranksBoard[square] === CONSTANT.RANKS.RANK_2) {
      move = this.getMove(square, newSquare, captured, CONSTANT.PIECES.bQ, 0);
      this.moves.push(move);
    } else {
      move = this.getMove(
        square,
        newSquare,
        captured,
        CONSTANT.PIECES.empty,
        0
      );
      this.moves.push(move);
    }
  }

  /**
   * method to get all the black pawn forward moves
   * @param {*} square : square where the black pawn is
   */
  getBlackPawnForwardMoves(square) {
    //Check for forward move
    let newSquare = square - 10;
    if (this.board.pieces[newSquare] === CONSTANT.PIECES.empty) {
      //Check if it is on promotion square
      this.getBlackPawnPromotionMoves(square, newSquare, CONSTANT.PIECES.empty);

      // Check if it is on rank 2 where th pawn can move two steps forward
      newSquare = square - 20;
      if (
        this.board.ranksBoard[square] === CONSTANT.RANKS.RANK_7 &&
        this.board.pieces[newSquare] === CONSTANT.PIECES.empty
      ) {
        let move = this.getMove(
          square,
          newSquare,
          CONSTANT.PIECES.empty,
          CONSTANT.PIECES.empty,
          CONSTANT.FLAG_PAWN_START
        );
        this.moves.push(move);
      }
    }
  }

  /**
   * method to get all the black pawn capture moves
   * @param {*} square : square where the black pawn is
   */
  getBlackPawnCaptureMoves(square) {
    // Check for pawn captures
    let newSquare = square - CONSTANT.PAWN_ATTACKS[0];
    if (
      this.board.filesBoard[newSquare] !== CONSTANT.SQUARES.OFFBOARD &&
      getPieceColor(this.board.pieces[newSquare]) !== this.board.side &&
      this.board.pieces[newSquare] !== CONSTANT.PIECES.empty
    ) {
      this.getBlackPawnPromotionMoves(
        square,
        newSquare,
        this.board.pieces[newSquare]
      );
    }

    newSquare = square - CONSTANT.PAWN_ATTACKS[1];
    if (
      this.board.filesBoard[newSquare] !== CONSTANT.SQUARES.OFFBOARD &&
      getPieceColor(this.board.pieces[newSquare]) !== this.board.side &&
      this.board.pieces[newSquare] !== CONSTANT.PIECES.empty
    ) {
      this.getBlackPawnPromotionMoves(
        square,
        newSquare,
        this.board.pieces[newSquare]
      );
    }
  }

  /**
   * method to get all the enpassant moves for the black pawn
   * @param {*} square : square where the black pawn is
   */
  getBlackPawnEnPassantMoves(square) {
    //check for en passants
    let newSquare = square - CONSTANT.PAWN_ATTACKS[0];
    if (newSquare === this.board.enPassant) {
      let move = this.getMove(
        square,
        newSquare,
        CONSTANT.PIECES.empty,
        CONSTANT.PIECES.empty,
        CONSTANT.FLAG_ENPASSANT
      );
      this.moves.push(move);
    }

    newSquare = square - CONSTANT.PAWN_ATTACKS[1];
    if (newSquare === this.board.enPassant) {
      let move = this.getMove(
        square,
        newSquare,
        CONSTANT.PIECES.empty,
        CONSTANT.PIECES.empty,
        CONSTANT.FLAG_ENPASSANT
      );
      this.moves.push(move);
    }
  }

  /**
   * method to get all the castle moves for the black side
   */
  getBlackSideCastleMoves() {
    if (this.board.castle & CONSTANT.CASTLE.BLACK_KING_CASTLE) {
      if (
        this.board.pieces[CONSTANT.SQUARES.G8] === CONSTANT.PIECES.empty &&
        this.board.pieces[CONSTANT.SQUARES.F8] === CONSTANT.PIECES.empty
      ) {
        if (
          this.board.isAttacked(CONSTANT.SQUARES.E8, CONSTANT.WHITE) ===
            false &&
          this.board.isAttacked(CONSTANT.SQUARES.F8, CONSTANT.WHITE) === false
        ) {
          let move = this.getMove(
            CONSTANT.SQUARES.E8,
            CONSTANT.SQUARES.G8,
            CONSTANT.PIECES.empty,
            CONSTANT.PIECES.empty,
            CONSTANT.FLAG_CASTLE
          );
          this.moves.push(move);
        }
      }
    }

    if (this.board.castle & CONSTANT.CASTLE.BLACK_QUEEN_CASTLE) {
      if (
        this.board.pieces[CONSTANT.SQUARES.B8] === CONSTANT.PIECES.empty &&
        this.board.pieces[CONSTANT.SQUARES.C8] === CONSTANT.PIECES.empty &&
        this.board.pieces[CONSTANT.SQUARES.D8] === CONSTANT.PIECES.empty
      ) {
        if (
          this.board.isAttacked(CONSTANT.SQUARES.E8, CONSTANT.WHITE) ===
            false &&
          this.board.isAttacked(CONSTANT.SQUARES.D8, CONSTANT.WHITE) === false
        ) {
          let move = this.getMove(
            CONSTANT.SQUARES.E8,
            CONSTANT.SQUARES.C8,
            CONSTANT.PIECES.empty,
            CONSTANT.PIECES.empty,
            CONSTANT.FLAG_CASTLE
          );
          this.moves.push(move);
        }
      }
    }
  }

  /**
   * method to get all the possible black pawn moves
   */
  getBlackPawnMoves() {
    let piece = CONSTANT.PIECES.bP;

    for (let i = 0; i < this.board.pieceNum[piece]; i++) {
      let pieceIndex = piece * 10 + i;
      let square = this.board.pieceList[pieceIndex];

      this.getBlackPawnForwardMoves(square);
      this.getBlackPawnCaptureMoves(square);
      this.getBlackPawnEnPassantMoves(square);
    }
  }

  /**
   * method to get the possible moves for the non sliding piece of both sides
   * Non Sliding pieces are knight and king
   */
  getNonSlidingPieceMoves() {
    let nonSlidingPiece = [];
    if (this.board.side === CONSTANT.WHITE) {
      nonSlidingPiece = this.nonSlidingWhitePiece;
    } else {
      nonSlidingPiece = this.nonSlidingBlackPiece;
    }

    for (let i = 0; i < nonSlidingPiece.length; i++) {
      let piece = nonSlidingPiece[i];

      for (
        let pieceNum = 0;
        pieceNum < this.board.pieceNum[piece];
        pieceNum++
      ) {
        let pieceIndex = piece * 10 + pieceNum;
        let square = this.board.pieceList[pieceIndex];

        for (let j = 0; j < this.nonSlidingAttacks[i].length; j++) {
          let newSquare = square + this.nonSlidingAttacks[i][j];

          if (this.board.filesBoard[newSquare] === CONSTANT.SQUARES.OFFBOARD)
            continue;

          if (this.board.pieces[newSquare] === CONSTANT.PIECES.empty) {
            let move = this.getMove(
              square,
              newSquare,
              CONSTANT.PIECES.empty,
              CONSTANT.PIECES.empty,
              0
            );
            this.moves.push(move);
          } else {
            if (
              getPieceColor(this.board.pieces[newSquare]) != this.board.side
            ) {
              let move = this.getMove(
                square,
                newSquare,
                this.board.pieces[newSquare],
                CONSTANT.PIECES.empty,
                0
              );
              this.moves.push(move);
            }
          }
        }
      }
    }
  }

  /**
   * method to get all the possible moves for the sliding piece for both side.
   * Sliding pieces are bishop, rook and queen
   */
  getSlidingPieceMoves() {
    let slidingPiece = [];
    if (this.board.side === CONSTANT.WHITE) {
      slidingPiece = this.slidingWhitePiece;
    } else {
      slidingPiece = this.slidingBlackPiece;
    }

    for (let i = 0; i < slidingPiece.length; i++) {
      let piece = slidingPiece[i];

      for (
        let pieceNum = 0;
        pieceNum < this.board.pieceNum[piece];
        pieceNum++
      ) {
        let pieceIndex = piece * 10 + pieceNum;
        let square = this.board.pieceList[pieceIndex];

        for (let j = 0; j < this.slidingAttacks[i].length; j++) {
          let newSquare = square + this.slidingAttacks[i][j];

          while (
            this.board.filesBoard[newSquare] !== CONSTANT.SQUARES.OFFBOARD
          ) {
            if (this.board.pieces[newSquare] !== CONSTANT.PIECES.empty) {
              if (
                getPieceColor(this.board.pieces[newSquare]) !== this.board.side
              ) {
                let move = this.getMove(
                  square,
                  newSquare,
                  this.board.pieces[newSquare],
                  CONSTANT.PIECES.empty,
                  0
                );
                this.moves.push(move);
              }

              break;
            }

            let move = this.getMove(
              square,
              newSquare,
              CONSTANT.PIECES.empty,
              CONSTANT.PIECES.empty,
              0
            );
            this.moves.push(move);

            newSquare += this.slidingAttacks[i][j];
          }
        }
      }
    }
  }

  /**
   * method to generate the pseudo leagal moves
   * pseudo legal moves doesn't check if the king is in check because of that move
   */
  generatePseudoLegalMoves() {
    this.moves = [];
    if (this.board.side === CONSTANT.WHITE) {
      this.getWhitePawnMoves();
      this.getWhiteSideCastleMoves();
    } else {
      this.getBlackPawnMoves();
      this.getBlackSideCastleMoves();
    }

    this.getNonSlidingPieceMoves();
    this.getSlidingPieceMoves();
  }

  /**
   * method to move piece from one square to another
   * @param {*} fromSquare : square from which piece is moved
   * @param {*} toSquare : square to which piece is moved
   */
  movePiece(fromSquare, toSquare) {
    let movedPiece = this.board.pieces[fromSquare];
    this.board.pieces[fromSquare] = CONSTANT.PIECES.empty;
    this.board.pieces[toSquare] = movedPiece;

    for (
      let pieceNum = 0;
      pieceNum < this.board.pieceNum[movedPiece];
      pieceNum++
    ) {
      let pieceIndex = movedPiece * 10 + pieceNum;

      if (this.board.pieceList[pieceIndex] === fromSquare) {
        this.board.pieceList[pieceIndex] = toSquare;
      }
    }
  }

  /**
   * method to add piece to the given square
   * @param {*} piece : piece to be added
   * @param {*} square : square to which the piece is added
   */
  addPiece(piece, square) {
    if (this.board.pieces[square] === CONSTANT.PIECES.empty) {
      this.board.pieces[square] = piece;
      this.board.totalMaterialForSide[getPieceColor(piece)] +=
        CONSTANT.PIECE_VALUE[piece];

      let pieceIndex = piece * 10 + this.board.pieceNum[piece];
      this.board.pieceList[pieceIndex] = square;
      this.board.pieceNum[piece]++;
    }
  }

  /**
   * method to remove the piece from the given square
   * @param {*} square : square from which the piece is to removed
   */
  clearPiece(square) {
    let piece = this.board.pieces[square];
    if (piece !== CONSTANT.PIECES.empty) {
      this.board.pieces[square] = CONSTANT.PIECES.empty;
      this.board.totalMaterialForSide[getPieceColor(piece)] -=
        CONSTANT.PIECE_VALUE[piece];
      for (let i = 0; i < this.board.pieceNum[piece]; i++) {
        let pieceIndex = piece * 10 + i;
        if (this.board.pieceList[pieceIndex] === square) {
          let newPieceIndex = piece * 10 + (this.board.pieceNum[piece] - 1);
          this.board.pieceList[pieceIndex] =
            this.board.pieceList[newPieceIndex];
          this.board.pieceNum[piece]--;
        }
      }

      this.board.fiftyMoves = 0;
    }
  }

  /**
   * method to make the enpassant move
   * @param {*} move : move in the integer form
   */
  makeEnPassantMove(move) {
    let toSquare = getToSquare(move);
    if (move & CONSTANT.FLAG_ENPASSANT) {
      let enPassantPawnSquare = toSquare - 10;
      if (this.board.side === CONSTANT.WHITE) {
        this.clearPiece(enPassantPawnSquare);
      } else {
        enPassantPawnSquare = toSquare + 10;
        this.clearPiece(enPassantPawnSquare);
      }
    }
  }

  /**
   * method to make the castle move
   * @param {*} move : move in the integer form
   */
  makeCastleMove(move) {
    let toSquare = getToSquare(move);
    if (move & CONSTANT.FLAG_CASTLE) {
      if (this.board.side === CONSTANT.WHITE) {
        if (toSquare === CONSTANT.SQUARES.G1) {
          this.movePiece(CONSTANT.SQUARES.H1, CONSTANT.SQUARES.F1);
        } else {
          this.movePiece(CONSTANT.SQUARES.A1, CONSTANT.SQUARES.D1);
        }
      } else {
        if (toSquare === CONSTANT.SQUARES.G8) {
          this.movePiece(CONSTANT.SQUARES.H8, CONSTANT.SQUARES.F8);
        } else {
          this.movePiece(CONSTANT.SQUARES.A8, CONSTANT.SQUARES.D8);
        }
      }
    }
  }

  /**
   * method to make the capture move
   * @param {*} move : move in the integer form
   */
  makeCaptureMove(move) {
    let toSquare = getToSquare(move);
    this.clearPiece(toSquare);
  }

  /**
   * method to make the pawn start move
   * Pawn can move 2 squre if it is in starting position
   * @param {*} move : move in the integer form
   */
  makePawnStartMove(move) {
    let fromSquare = getFromSquare(move);

    if (
      this.board.pieces[fromSquare] === CONSTANT.PIECES.wP ||
      this.board.pieces[fromSquare] === CONSTANT.PIECES.bP
    ) {
      this.board.fiftyMoves = 0;
      if (move & CONSTANT.FLAG_PAWN_START) {
        if (this.board.side === CONSTANT.WHITE) {
          this.board.enPassant = fromSquare + 10;
        } else {
          this.board.enPassant = fromSquare - 10;
        }
      }
    }
  }

  /**
   * method to make the promotion move
   * @param {*} move : move in the integer form
   */
  makePromotionMove(move) {
    let toSquare = getToSquare(move);
    let promotedPiece = promoted(move);

    if (promotedPiece !== CONSTANT.PIECES.empty) {
      this.clearPiece(toSquare);
      this.addPiece(promotedPiece, toSquare);
    }
  }

  /**
   * method to make the given move
   * @param {*} move : move in integer form
   */
  makeMove(move) {
    this.gameInfo = [];
    let fromSquare = getFromSquare(move);
    let toSquare = getToSquare(move);

    this.makeEnPassantMove(move);
    this.makeCastleMove(move);

    this.gameInfo.move = move;
    this.gameInfo.castle = this.board.castle;
    this.gameInfo.enPassant = this.board.enPassant;
    this.gameInfo.fiftyMoves = this.board.fiftyMoves;
    this.gameInfo.hash = this.board.hash;

    this.board.castle &= CONSTANT.CASTLE_PERM[fromSquare];
    this.board.castle &= CONSTANT.CASTLE_PERM[toSquare];
    this.board.enPassant = 0;
    this.board.fiftyMoves++;

    this.makeCaptureMove(move);
    this.makePawnStartMove(move);

    this.movePiece(fromSquare, toSquare);

    this.makePromotionMove(move);

    this.board.side = +!this.board.side;

    this.gameHistory[this.board.gamePly] = this.gameInfo;

    this.board.gamePly++;
    this.board.ply++;

    this.board.setHash();
  }

  /**
   * method to generate all the legal moves
   * legal moves checks if the king is in check from the given move
   */
  generateLegalMoves() {
    let piece = 0;
    this.generatePseudoLegalMoves();
    for (let i = this.moves.length - 1; i >= 0; --i) {
      let move = this.moves[i];
      this.makeMove(move);
      if (this.board.side === CONSTANT.WHITE) {
        piece = CONSTANT.PIECES.bK;
      } else {
        piece = CONSTANT.PIECES.wK;
      }
      let pieceIndex = piece * 10 + 0;
      if (
        this.board.isAttacked(
          this.board.pieceList[pieceIndex],
          this.board.side
        ) === true
      ) {
        this.moves.splice(i, 1);
      }
      this.undoMove();
    }
    this.board.moveList[this.board.ply] = this.moves;
  }

  /**
   * method to undo the enpassant move
   * @param {*} move : move in integer form
   */
  undoEnpassantMove(move) {
    let toSquare = getToSquare(move);
    if (move & CONSTANT.FLAG_ENPASSANT) {
      if (this.board.side === CONSTANT.WHITE) {
        this.addPiece(CONSTANT.PIECES.bP, toSquare - 10);
      } else {
        this.addPiece(CONSTANT.PIECES.wP, toSquare + 10);
      }
    }
  }

  /**
   * method to undo the castle move
   * @param {*} move : move in integer form
   */
  undoCastleMove(move) {
    let toSquare = getToSquare(move);
    if (move & CONSTANT.FLAG_CASTLE) {
      if (this.board.side === CONSTANT.WHITE) {
        if (toSquare === CONSTANT.SQUARES.G1) {
          this.movePiece(CONSTANT.SQUARES.F1, CONSTANT.SQUARES.H1);
        } else {
          this.movePiece(CONSTANT.SQUARES.D1, CONSTANT.SQUARES.A1);
        }
      } else {
        if (toSquare === CONSTANT.SQUARES.G8) {
          this.movePiece(CONSTANT.SQUARES.F8, CONSTANT.SQUARES.H8);
        } else {
          this.movePiece(CONSTANT.SQUARES.D8, CONSTANT.SQUARES.A8);
        }
      }
    }
  }

  /**
   * method to undo the capture move
   * @param {*} move : move in integer form
   */
  undoCaptureMove(move) {
    let toSquare = getToSquare(move);
    let capturedPiece = captured(move);
    if (capturedPiece !== CONSTANT.PIECES.empty) {
      this.addPiece(capturedPiece, toSquare);
    }
  }

  /**
   * method to undo the promoted move
   * @param {*} move : move in integer form
   */
  undoPromotedMove(move) {
    let fromSquare = getFromSquare(move);
    let promotedPiece = promoted(move);

    if (promotedPiece !== CONSTANT.PIECES.empty) {
      this.clearPiece(fromSquare);
      if (this.board.side === CONSTANT.WHITE) {
        this.addPiece(CONSTANT.PIECES.wP, fromSquare);
      } else {
        this.addPiece(CONSTANT.PIECES.bP, fromSquare);
      }
    }
  }

  /**
   * method to undo the move
   * @returns the moved to be undone
   */
  undoMove() {
    this.board.gamePly--;
    this.board.ply--;

    let move = this.gameHistory[this.board.gamePly].move;
    this.board.castle = this.gameHistory[this.board.gamePly].castle;
    this.board.enPassant = this.gameHistory[this.board.gamePly].enPassant;
    this.board.fiftyMoves = this.gameHistory[this.board.gamePly].fiftyMoves;
    this.board.hash = this.gameHistory[this.board.gamePly].hash;

    this.gameHistory.splice(-1);

    let fromSquare = getFromSquare(move);
    let toSquare = getToSquare(move);

    this.board.side = +!this.board.side;
    this.undoEnpassantMove(move);
    this.undoCastleMove(move);

    this.movePiece(toSquare, fromSquare);
    this.undoCaptureMove(move);
    this.undoPromotedMove(move);

    return move;
  }

  /**
   * method to check for checkmate
   * @returns true if it is checkmate else return false
   */
  checkCheckMate() {
    let piece = 0;
    this.generateLegalMoves();

    if (this.board.side === CONSTANT.WHITE) {
      piece = CONSTANT.PIECES.wK;
    } else {
      piece = CONSTANT.PIECES.bK;
    }
    let pieceIndex = piece * 10 + 0;

    if (
      this.board.isAttacked(
        this.board.pieceList[pieceIndex],
        +!this.board.side
      ) === true &&
      this.moves.length === 0
    ) {
      return true;
    }

    return false;
  }

  /**
   * method to check for stalemate
   * @returns true if it is stalemate else return false
   */
  isStaleMate() {
    if (this.moves.length === 0 && this.checkCheckMate() === false) {
      return true;
    }

    return false;
  }

  /**
   * method to check if there is three fold repetition
   * @returns the number of the repititions
   */
  isThreeFoldRepetition() {
    let threeFoldCount = 0;
    for (
      let i = this.board.gamePly - this.board.fiftyMoves;
      i < this.board.gamePly;
      i++
    ) {
      if (this.gameHistory[i].hash === this.board.hash) {
        threeFoldCount++;
      }
    }
    return threeFoldCount;
  }
}
