import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/Theme';

const LeaderboardModal = ({ visible, onClose, currentScore, playerName, saveScore }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (visible) {
      loadScores();
    }
  }, [visible, currentScore]);

  const loadScores = async () => {
    try {
      const storedScores = await AsyncStorage.getItem('@leaderboard');
      let parsed = storedScores ? JSON.parse(storedScores) : [];
      
      if (saveScore && currentScore > 0) {
        // Add new score with player name
        parsed.push({
          name: playerName || 'Oyuncu',
          score: currentScore,
          date: new Date().toISOString()
        });
        
        // Sort by date descending (newest first) to get the most recent ones
        parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Keep only the last 10 games
        parsed = parsed.slice(0, 10);
        
        // Save the last 10 games to AsyncStorage
        await AsyncStorage.setItem('@leaderboard', JSON.stringify(parsed));
      }
      
      // For displaying, sort the 10 games from highest score to lowest score
      const sortedForDisplay = [...parsed].sort((a, b) => b.score - a.score);
      setScores(sortedForDisplay);
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = saveScore && item.score === currentScore && item.name === playerName;
    const d = new Date(item.date);
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const dateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${minutes}`;
    return (
      <View style={[styles.scoreItem, isCurrent && styles.currentScoreItem]}>
        <Text style={styles.rankText}>{index + 1}.</Text>
        <View style={styles.nameDateContainer}>
          <Text style={styles.playerNameText}>{item.name}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
        <Text style={styles.scoreText}>{item.score} Puan</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {saveScore ? 'Oyun Bitti!' : 'Liderlik Tablosu'}
          </Text>
          <Text style={styles.subTitle}>
            {saveScore ? `Skorunuz: ${currentScore}` : 'Son 10 Oyunun En İyileri'}
          </Text>
          
          {saveScore && <Text style={styles.leaderboardTitle}>Liderlik Tablosu</Text>}
          
          {scores.length === 0 ? (
            <Text style={{ color: '#FFF', marginVertical: 20 }}>Henüz skor yok.</Text>
          ) : (
            <FlatList
              data={scores}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {saveScore ? 'Yeniden Başla' : 'Kapat'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: COLORS.boardBg,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#CCC',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  list: {
    width: '100%',
    marginBottom: 20,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  currentScoreItem: {
    backgroundColor: 'rgba(233, 69, 96, 0.3)',
    borderColor: COLORS.textLight,
    borderWidth: 1,
  },
  rankText: {
    color: '#FFF',
    fontWeight: 'bold',
    width: 25,
  },
  nameDateContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  playerNameText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dateText: {
    color: '#AAA',
    fontSize: 11,
    marginTop: 2,
  },
  scoreText: {
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.textLight,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LeaderboardModal;
