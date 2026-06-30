import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Block from './Block';
import { COLORS, GAME_CONSTANTS } from '../constants/Theme';

const { width } = Dimensions.get('window');
const SPACING = 2; // Outer padding of the board
// Kapsayıcı genişliği: Oyuna yatayda 10'ar padding verildiğini varsayarsak
const boardWidth = width - 20; 
const blockSize = (boardWidth - (SPACING * 2)) / GAME_CONSTANTS.COLS;

const Board = ({ board, selectedBlocks, onBlockPress, disabled }) => {
  const isSelected = (r, c) => {
    return selectedBlocks.some(pos => pos.row === r && pos.col === c);
  };

  return (
    <View style={styles.boardContainer}>
      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((block, colIndex) => (
            <Block
              key={`block-${rowIndex}-${colIndex}`}
              block={block}
              isSelected={isSelected(rowIndex, colIndex)}
              onPress={() => onBlockPress(rowIndex, colIndex)}
              disabled={disabled || !block}
              size={blockSize}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    backgroundColor: COLORS.boardBg,
    padding: SPACING,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3A3A5E',
    width: boardWidth,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    height: blockSize,
  }
});

export default React.memo(Board);
