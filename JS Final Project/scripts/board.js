import CONSTANT from './constants.js';
import {
  getSquareFromFileAndRank,
  square64To120,
  getPieceColor,
  getFromSquare,
  getToSquare,
  hashRand,
} from './utils.js';

import Pawn from './pieces/pawn.js';
import Knight from './pieces/knight.js';
import Bishop from './pieces/bishop.js';
import Rook from './pieces/rook.js';
import Queen from './pieces/queen.js';
import King from './pieces/king.js';

export default class Board {
  /**
   * constructor for the board class
   * Board class is used for the board representation. Here the chessboard is represented using mailbox mehod.
   * The chess board is reprsented as the array of size 120 consisting of 10 columns and 12 rows.
   */
  constructor() {
    this.pieces = [];
    this.side = CONSTANT.WHITE;
    this.enPassant = 0;
    this.castle = 0;
    this.pieceNum = [];
    this.pieceList = [];
    this.filesBoard = [];
    this.ranksBoard = [];
    this.maximunSinglePiece = 14;
    this.totalMaterialForSide = [];
    this.moveList = [];
    this.ply = 0;
    this.gamePly = 0;
    this.fiftyMoves = 0;
    this.hashPiece = [];
    this.hashEp = [];
    this.hash = 0;
  }

  /**
   * method to initialize the board class
   */
  initialize() {
    this.initializeFilesAndRanksBoard();
    // this.parseFEN('8/8/6QQ/8/8/k7/8/8 w - - 3 2');
    this.parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    this.getPieceList();
    this.initHash();
    this.setHash();
  }

  /**
   * method to reset the board class
   */
  reset() {
    for (let i = 0; i < CONSTANT.TOTAL_SQUARES; i++) {
      this.pieces[i] = CONSTANT.SQUARES.OFFBOARD;
    }

    for (let i = 0; i < 64; i++) {
      this.pieces[square64To120] = CONSTANT.PIECES.empty;
    }

    this.enPassant = CONSTANT.SQUARES.NO_SQ;
    this.ply = 0;
    this.castle = 0;
    this.gamePly = 0;
    this.fiftyMoves = 0;
  }

  /**
   * method to intialize the random hash for each chess piece, side and enpassant square
   */
  initHash() {
    for (let i = 0; i < 64; i++) {
      this.hashPiece[i] = hashRand();
      this.hashEp[i] = hashRand();
    }
    this.hashSide = hashRand();
  }

  /**
   * method to set the hash value for the given chess position
   */
  setHash() {
    for (let i = 0; i < 64; i++) {
      let square = square64To120(i);
      if (this.pieces[square] != CONSTANT.PIECES.empty) {
        this.hash ^= this.hashPiece[i];
      }
      if (this.side === CONSTANT.BLACK) {
        this.hash ^= this.hashSide;
      }

      if (this.enPassant !== 0 && this.enPassant !== CONSTANT.SQUARES.NO_SQ) {
        this.hash ^= this.hashEp[i];
      }
    }
  }

  /**
   * method to intialize the files and rank board array
   */
  initializeFilesAndRanksBoard() {
    this.filesBoard = Array(CONSTANT.TOTAL_SQUARES).fill(
      CONSTANT.SQUARES.OFFBOARD
    );
    this.ranksBoard = Array(CONSTANT.TOTAL_SQUARES).fill(
      CONSTANT.SQUARES.OFFBOARD
    );

    for (
      let rank = CONSTANT.RANKS.RANK_1;
      rank <= CONSTANT.RANKS.RANK_8;
      rank++
    ) {
      for (
        let file = CONSTANT.FILES.FILE_A;
        file <= CONSTANT.FILES.FILE_H;
        file++
      ) {
        let square = getSquareFromFileAndRank(file, rank);
        this.filesBoard[square] = file;
        this.ranksBoard[square] = rank;
      }
    }
  }

  /**
   * method to intialize the piece list. Piece list keeps the square for the given piece
   * Piece list is indexed through the given piece and the piece number for that piece
   */
  getPieceList() {
    this.pieceList = Array(
      this.maximunSinglePiece * CONSTANT.TOTAL_SQUARES
    ).fill(0);
    this.pieceNum = Array(this.maximunSinglePiece).fill(0);
    this.totalMaterialForSide = Array(2).fill(0);

    for (let i = 0; i < 64; i++) {
      let square = square64To120(i);
      let piece = this.pieces[square];

      if (piece !== CONSTANT.PIECES.empty) {
        let color = getPieceColor(piece);

        this.totalMaterialForSide[color] += CONSTANT.PIECE_VALUE[piece];
        let pieceIndex = piece * 10 + this.pieceNum[piece];
        this.pieceList[pieceIndex] = square;
        this.pieceNum[piece]++;
      }
    }
  }

  /**
   * method to get the string value for given square. Uded for debugging
   * @param {*} sq : square to be shown to console
   * @returns square value in string form(eg a3)
   */
  printSquare(sq) {
    return (
      CONSTANT.FILE_CHARACTER[this.filesBoard[sq]] + (this.ranksBoard[sq] + 1)
    );
  }

  /**
   * method to print the piece list to the console. Used for debugging
   */
  printPieceLists() {
    let piece, pceNum;

    for (piece = CONSTANT.PIECES.wP; piece <= CONSTANT.PIECES.bK; piece++) {
      for (pceNum = 0; pceNum < this.pieceNum[piece]; pceNum++) {
        let pieceIndex = piece * 10 + pceNum;
        console.log(
          'Piece ' +
            CONSTANT.PIECE_CHARACTER[piece] +
            ' on ' +
            this.printSquare(this.pieceList[pieceIndex])
        );
      }
    }
  }

  /**
   * method to render board to the console
   */
  renderBoard() {
    let line = '';
    for (
      let rank = CONSTANT.RANKS.RANK_8;
      rank >= CONSTANT.RANKS.RANK_1;
      rank--
    ) {
      line += rank + 1 + ' ';
      for (
        let file = CONSTANT.FILES.FILE_A;
        file <= CONSTANT.FILES.FILE_H;
        file++
      ) {
        let square = getSquareFromFileAndRank(file, rank);
        line += CONSTANT.PIECE_CHARACTER[this.pieces[square]] + ' ';
      }
      line += '\n';
    }
    line += ' ';
    for (
      let file = CONSTANT.FILES.FILE_A;
      file <= CONSTANT.FILES.FILE_H;
      file++
    ) {
      line += ' ' + CONSTANT.FILE_CHARACTER[file];
    }
    console.log(line);
  }

  /**
   * method to parse the fen string
   * @param {*} fen : fen string (eg:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' )
   */
  parseFEN(fen) {
    this.reset();
    let piece = 0;
    let count = 0;
    let rank = CONSTANT.RANKS.RANK_8;
    let file = CONSTANT.FILES.FILE_A;
    let square = 0;

    let fenString = fen.split(' '); //splits the fen string by space

    // parses all the chess pieces from the fen string
    for (let i = 0; i < fenString[0].length; i++) {
      count = 1;
      switch (fenString[0][i]) {
        case 'p':
          piece = CONSTANT.PIECES.bP;
          break;
        case 'r':
          piece = CONSTANT.PIECES.bR;
          break;
        case 'n':
          piece = CONSTANT.PIECES.bN;
          break;
        case 'b':
          piece = CONSTANT.PIECES.bB;
          break;
        case 'k':
          piece = CONSTANT.PIECES.bK;
          break;
        case 'q':
          piece = CONSTANT.PIECES.bQ;
          break;
        case 'P':
          piece = CONSTANT.PIECES.wP;
          break;
        case 'R':
          piece = CONSTANT.PIECES.wR;
          break;
        case 'N':
          piece = CONSTANT.PIECES.wN;
          break;
        case 'B':
          piece = CONSTANT.PIECES.wB;
          break;
        case 'K':
          piece = CONSTANT.PIECES.wK;
          break;
        case 'Q':
          piece = CONSTANT.PIECES.wQ;
          break;

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
          piece = CONSTANT.PIECES.empty;
          count = parseInt(fenString[0][i]);
          break;

        case '/':
          rank--;
          file = CONSTANT.FILES.FILE_A;
          continue;

        default:
          console.log('fen error');
          return;
      }

      for (let i = 0; i < count; i++) {
        square = getSquareFromFileAndRank(file, rank);
        this.pieces[square] = piece;
        file++;
      }
    }

    // parses the side to play from the fen string
    if (fenString[1] === 'w') {
      this.side = CONSTANT.WHITE;
    } else {
      this.side = CONSTANT.BLACK;
    }

    // parses the castling rights from the fen string
    for (let i = 0; i < fenString[2].length; i++) {
      switch (fenString[2][i]) {
        case 'K':
          this.castle |= CONSTANT.CASTLE.WHITE_KING_CASTLE;
          break;
        case 'Q':
          this.castle |= CONSTANT.CASTLE.WHITE_QUEEN_CASTLE;
          break;
        case 'k':
          this.castle |= CONSTANT.CASTLE.BLACK_KING_CASTLE;
          break;
        case 'q':
          this.castle |= CONSTANT.CASTLE.BLACK_QUEEN_CASTLE;
          break;
        case '-':
          continue;
      }
    }

    //gets the enpassant square from the fen string
    if (fenString[3] !== '-') {
      file = fenString[3][0].charCodeAt() - 'a'.charCodeAt();
      rank = parseInt(fenString[3][1]) - 1;
      console.log(file, rank);
      this.enPassant = getSquareFromFileAndRank(file, rank);
    }
  }

  /**
   * method to check if the square on the board is attacked by the given side
   * @param {4} square : square on the board to be checked if it is attacked
   * @param {*} side : side which attacks the square
   * @returns true if the square is attacked or false
   */
  isAttacked(square, side) {
    let pawn = new Pawn(this);
    let knight = new Knight(this);
    let bishop = new Bishop(this);
    let rook = new Rook(this);
    let queen = new Queen(this);
    let king = new King(this);

    return (
      pawn.isPawnAttacking(square, side) ||
      knight.isKnightAttacking(square, side) ||
      bishop.isBishopAttacking(square, side) ||
      rook.isRookAttacking(square, side) ||
      queen.isQueenAttacking(square, side) ||
      king.isKingAttacking(square, side)
    );
  }

  /**
   * renders the board in the console with all the squares attacked marked by X(cross)
   * Mainly used for debugging
   */
  renderAttackedBoard() {
    let line = '';
    let piece = '-';
    for (
      let rank = CONSTANT.RANKS.RANK_8;
      rank >= CONSTANT.RANKS.RANK_1;
      rank--
    ) {
      line += rank + 1 + ' ';
      for (
        let file = CONSTANT.FILES.FILE_A;
        file <= CONSTANT.FILES.FILE_H;
        file++
      ) {
        let square = getSquareFromFileAndRank(file, rank);
        if (this.isAttacked(square, this.side) === true) piece = 'X';
        else piece = '-';
        line += piece + ' ';
      }
      line += '\n';
    }
    line += ' ';
    for (
      let file = CONSTANT.FILES.FILE_A;
      file <= CONSTANT.FILES.FILE_H;
      file++
    ) {
      line += ' ' + CONSTANT.FILE_CHARACTER[file];
    }
    console.log(line);
  }

  /**prints the possible move list in the console */
  printMoveList(x) {
    let moveNum = 1;
    for (let i = x; i < this.moveList.length; i++) {
      for (let j = 0; j < this.moveList[i].length; j++) {
        let move = this.moveList[i][j];
        let fromSquareFile = this.filesBoard[getFromSquare(move)];
        let toSquareFile = this.filesBoard[getToSquare(move)];
        let fromSquareRank = this.ranksBoard[getFromSquare(move)];
        let toSquareRank = this.ranksBoard[getToSquare(move)];

        let moveStr =
          CONSTANT.FILE_CHARACTER[fromSquareFile] +
          (fromSquareRank + 1) +
          CONSTANT.FILE_CHARACTER[toSquareFile] +
          (toSquareRank + 1);

        console.log('Move ' + moveNum + ': ' + moveStr);
        moveNum++;
      }
    }
  }
}
