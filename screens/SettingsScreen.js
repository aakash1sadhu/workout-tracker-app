import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {COLORS} from '../utils/colors';
import {
  saveTrainingGoal,
  getTrainingGoal,
  saveGymFrequency,
  getGymFrequency,
} from '../utils/encryptedStorage';

export default function SettingsScreen() {
  const [goal, setGoal] = useState('Both');
  const [frequency, setFrequency] = useState(3);

  useEffect(() => {
    const loadSettings = async () => {
      const savedGoal = await getTrainingGoal();
      const savedFrequency = await getGymFrequency();
      setGoal(savedGoal);
      setFrequency(savedFrequency);
    };
    loadSettings();
  }, []);

  const handleGoalSelect = async newGoal => {
    setGoal(newGoal);
    await saveTrainingGoal(newGoal);
  };

  const handleFrequencySelect = async days => {
    setFrequency(days);
    await saveGymFrequency(days);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <Text style={styles.label}>Training Goal</Text>
      <View style={styles.optionRow}>
        {['Strength', 'Both', 'Hypertrophy'].map(opt => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.optionButton,
              goal === opt && styles.optionButtonSelected,
            ]}
            onPress={() => handleGoalSelect(opt)}>
            <Text
              style={[
                styles.optionText,
                goal === opt && styles.optionTextSelected,
              ]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Gym Frequency</Text>
      <View style={styles.optionRow}>
        {[2, 3, 4].map(days => (
          <TouchableOpacity
            key={days}
            style={[
              styles.optionButton,
              frequency === days && styles.optionButtonSelected,
            ]}
            onPress={() => handleFrequencySelect(days)}>
            <Text
              style={[
                styles.optionText,
                frequency === days && styles.optionTextSelected,
              ]}>
              {days} Days
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.purple,
  },
  optionText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  optionTextSelected: {
    color: COLORS.buttonText,
  },
});
