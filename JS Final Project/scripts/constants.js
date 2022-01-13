const CONSTANT = {
    CANVAS_WIDTH: 560,
    CANVAS_HEIGHT: 560,
    PIECES: {
      empty: 0,
      wP: 1,
      wN: 2,
      wB: 3,
      wR: 4,
      wQ: 5,
      wK: 6,
      bP: 7,
      bN: 8,
      bB: 9,
      bR: 10,
      bQ: 11,
      bK: 12,
    },

    PIECE_NAMES : ['.', 'wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK'],
    
    TOTAL_SQUARES: 120,
    
    FILES: {FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3, FILE_E: 4, FILE_F: 5, FILE_G: 6, FILE_H: 7, FILE_NONE: 8},
    
    RANKS: {RANK_1: 0, RANK_2: 1, RANK_3: 2, RANK_4: 3, RANK_5: 4, RANK_6: 5, RANK_7: 6, RANK_8: 7, RANK_NONE: 8},
    
    WHITE: 0,
    
    BLACK: 1,
    
    SQUARES: {A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28,
                    A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98,
                    NO_SQ: 99, OFFBOARD: 100},
    
    CASTLE: {WHITE_KING_CASTLE: 1, BLACK_KING_CASTLE: 4, WHITE_QUEEN_CASTLE: 2, BLACK_QUEEN_CASTLE: 8},
    
    PIECE_CHARACTER: '.PNBRQKpnbrqk',
    FILE_CHARACTER: 'abcdefgh',
    PIECE_VALUE: [0, 100, 300, 300, 500, 900, 10000, 100, 300, 300, 500, 900, 10000],
  
    PAWN_ATTACKS: [9, 11],
    KNIGHT_ATTACKS: [-8, -19,	-21, -12, 8, 19, 21, 12],
    BISHOP_ATTACKS: [-9, -11, 11, 9],
    ROOK_ATTACKS: [-1, -10,	1, 10],
    KING_ATTACKS: [-1, -9, -10, -11, 1, 9, 10, 11],

    FLAG_PAWN_START: 0x80000,
    FLAG_CASTLE: 0x1000000,
    FLAG_ENPASSANT: 0x40000,

    CASTLE_PERM : [15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 7, 15, 15, 15, 3, 15, 15, 11, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
                    15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
    
    PAWN_ATTACK_SCORES: [
      0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
      10	,	10	,	0	,	-10	,	-10	,	0	,	10	,	10	,
      5	,	0	,	0	,	5	,	5	,	0	,	0	,	5	,
      0	,	0	,	10	,	20	,	20	,	10	,	0	,	0	,
      5	,	5	,	5	,	10	,	10	,	5	,	5	,	5	,
      10	,	10	,	10	,	20	,	20	,	10	,	10	,	10	,
      20	,	20	,	20	,	30	,	30	,	20	,	20	,	20	,
      0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
      ],

    KNIGHT_ATTACK_SCORES : [
      0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
      0	,	0	,	0	,	5	,	5	,	0	,	0	,	0	,
      0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
      0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
      5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
      5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
      ],

    BISHOP_ATTACK_SCORES: [
      0	,	0	,	-10	,	0	,	0	,	-10	,	0	,	0	,
      0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
      0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
      0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
      0	,	10	,	15	,	20	,	20	,	15	,	10	,	0	,
      0	,	0	,	10	,	15	,	15	,	10	,	0	,	0	,
      0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
      0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
      ],

    ROOK_ATTACK_SCORES: [
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
      25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
      0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
      ],

    CHECKMATE: 50000,

    DEPTH: 4
  }

  export const SCORE_BY_POSITION =  {
    1: CONSTANT.PAWN_ATTACK_SCORES,
    2: CONSTANT.KNIGHT_ATTACK_SCORES,
    3: CONSTANT.BISHOP_ATTACK_SCORES,
    4: CONSTANT.ROOK_ATTACK_SCORES,
    5: CONSTANT.ROOK_ATTACK_SCORES,
    7: CONSTANT.PAWN_ATTACK_SCORES.reverse(),
    8: CONSTANT.KNIGHT_ATTACK_SCORES.reverse(),
    9: CONSTANT.BISHOP_ATTACK_SCORES.reverse(),
    10: CONSTANT.ROOK_ATTACK_SCORES.reverse(),
    11: CONSTANT.ROOK_ATTACK_SCORES.reverse(),
  }
  
  export default CONSTANT