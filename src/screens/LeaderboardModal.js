import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/Theme';

const LeaderboardModal = ({ visible, onClose, currentScore }) => {
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
      
      if (currentScore > 0) {
        parsed.push({ score: currentScore, date: new Date().toISOString() });
        // Sort descending
        parsed.sort((a, b) => b.score - a.score);
        // Keep top 10
        parsed = parsed.slice(0, 10);
        await AsyncStorage.setItem('@leaderboard', JSON.stringify(parsed));
      }
      
      setScores(parsed);
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = item.score === currentScore;
    const d = new Date(item.date);
    const dateStr = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return (
      <View style={[styles.scoreItem, isCurrent && styles.currentScoreItem]}>
        <Text style={styles.rankText}>{index + 1}.</Text>
        <Text style={styles.dateText}>{dateStr}</Text>
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
          <Text style={styles.modalTitle}>Oyun Bitti!</Text>
          <Text style={styles.subTitle}>Skorunuz: {currentScore}</Text>
          
          <Text style={styles.leaderboardTitle}>Liderlik Tablosu</Text>
          
          {scores.length === 0 ? (
            <Text style={{ color: '#FFF' }}>Henüz skor yok.</Text>
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
            <Text style={styles.buttonText}>Yeniden Başla</Text>
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
    fontSize: 18,
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
    width: 30,
  },
  dateText: {
    color: '#AAA',
    flex: 1,
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
