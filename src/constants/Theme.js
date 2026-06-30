export const COLORS = {
  background: '#1A1A2E',
  boardBg: '#16213E',
  textLight: '#E94560',
  textSecondary: '#0F3460',
  gridLine: '#0F3460',
  
  // Bloklar için renkler
  block1: '#FFCCCB', // Açık kırmızı
  block2: '#ADD8E6', // Açık mavi
  block3: '#90EE90', // Açık yeşil
  block4: '#FFFFE0', // Açık sarı
  block5: '#FFA07A', // Somon
  block6: '#20B2AA', // Deniz yeşili
  block7: '#9370DB', // Orta mor
  block8: '#FFD700', // Altın
  block9: '#FF6347', // Domates
};

export const BLOCK_MAPPING = {
  1: { color: COLORS.block1, points: 1 },
  2: { color: COLORS.block2, points: 2 },
  3: { color: COLORS.block3, points: 3 },
  4: { color: COLORS.block4, points: 5 },
  5: { color: COLORS.block5, points: 7 },
  6: { color: COLORS.block6, points: 9 },
  7: { color: COLORS.block7, points: 12 },
  8: { color: COLORS.block8, points: 15 },
  9: { color: COLORS.block9, points: 20 },
};

export const GAME_CONSTANTS = {
  ROWS: 10,
  COLS: 8,
  INITIAL_SPEED_MS: 5000,
  MIN_SPEED_MS: 1000,
  MAX_WRONG_ATTEMPTS: 3,
};
