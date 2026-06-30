import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const Block = ({ block, isSelected, onPress, disabled, size }) => {
  // Use exact sizing while leaving 1px margin on all sides for the gap
  const blockStyle = { width: size - 2, height: size - 2, margin: 1 };

  if (!block) {
    return <View style={[styles.block, styles.emptyBlock, blockStyle]} />;
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.block, 
        blockStyle,
        { backgroundColor: block.color },
        isSelected && styles.selectedBlock
      ]}
    >
      <Text style={[styles.text, isSelected && styles.selectedText]}>{block.value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  emptyBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedBlock: {
    borderWidth: 3,
    borderColor: '#FFF',
    transform: [{ scale: 0.9 }],
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 22,
    fontWeight: '900',
    color: '#222',
  },
  selectedText: {
    color: '#111',
  }
});

export default React.memo(Block);
