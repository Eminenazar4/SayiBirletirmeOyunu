import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, GAME_CONSTANTS } from '../constants/Theme';

const Header = ({ targetNumber, score, wrongAttempts, speed }) => {
  const livesLeft = GAME_CONSTANTS.MAX_WRONG_ATTEMPTS - wrongAttempts;

  return (
    <View style={styles.header}>
      <View style={styles.statBox}>
        <Text style={styles.label}>Puan</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      
      <View style={styles.targetBox}>
        <Text style={styles.targetLabel}>Hedef</Text>
        <Text style={styles.targetValue}>{targetNumber || '?'}</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.label}>Can</Text>
        <Text style={[styles.value, livesLeft <= 1 && styles.danger]}>{livesLeft}</Text>
        <Text style={styles.smallLabel}>{(speed / 1000).toFixed(1)}sn</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  targetBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textLight,
    padding: 15,
    borderRadius: 50,
    width: 90,
    height: 90,
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  label: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  value: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  targetLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  targetValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  danger: {
    color: '#FF6347',
  },
  smallLabel: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  }
});

export default Header;
