import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useGameLogic } from './src/hooks/useGameLogic';
import Board from './src/components/Board';
import Header from './src/components/Header';
import LeaderboardModal from './src/screens/LeaderboardModal';
import { COLORS } from './src/constants/Theme';

export default function App() {
  const {
    board,
    targetNumber,
    selectedBlocks,
    score,
    speed,
    wrongAttempts,
    isGameOver,
    gameStarted,
    initializeGame,
    selectBlock,
    confirmSelection,
    cancelSelection
  } = useGameLogic();

  const currentSelectionSum = selectedBlocks.reduce((sum, item) => sum + item.block.value, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {!gameStarted ? (
        <View style={styles.centerContainer}>
          <Text style={styles.title}>SAYI BİRLEŞTİRME</Text>
          <Text style={styles.subtitle}>STRATEJİK OYUN</Text>
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startText}>OYUNA BAŞLA</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <Header 
            targetNumber={targetNumber}
            score={score}
            wrongAttempts={wrongAttempts}
            speed={speed}
          />

          <View style={styles.selectionInfoBox}>
            <Text style={styles.selectionInfoText}>
              Seçilen Toplam: <Text style={styles.selectionSumText}>{currentSelectionSum}</Text>
            </Text>
          </View>
          
          <Board
            board={board}
            selectedBlocks={selectedBlocks}
            onBlockPress={selectBlock}
            disabled={isGameOver}
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.btn, styles.cancelBtn]} 
              onPress={cancelSelection}
              disabled={selectedBlocks.length === 0}
            >
              <Text style={styles.btnText}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.btn, 
                styles.confirmBtn, 
                selectedBlocks.length < 2 && styles.disabledBtn
              ]} 
              onPress={confirmSelection}
              disabled={selectedBlocks.length < 2 || isGameOver}
            >
              <Text style={styles.btnText}>Onayla (Max 4)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Leaderboard Modal for Game Over */}
      <LeaderboardModal 
        visible={isGameOver} 
        onClose={initializeGame}
        currentScore={score}
      />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 50,
  },
  startButton: {
    backgroundColor: COLORS.textLight,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  selectionInfoBox: {
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectionInfoText: {
    color: '#CCC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionSumText: {
    color: COLORS.textLight,
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cancelBtn: {
    backgroundColor: '#3A3A5E',
  },
  confirmBtn: {
    backgroundColor: COLORS.textLight,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
