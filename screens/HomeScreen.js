import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useEffect, useState} from 'react';
import {generateWeeklyPlan} from '../utils/generatePlan';
import {COLORS} from '../utils/colors';
import {
  saveCustomExercise,
  getCustomExercises,
  getDeletedExercises,
  saveGymFrequency,
  getGymFrequency,
  getWorkoutHistory,
} from '../utils/encryptedStorage';

export default function HomeScreen({navigation}) {
  const [customExercises, setCustomExercises] = useState([]);
  const [selectedDays, setSelectedDays] = useState(3);
  const [plan, setPlan] = useState([]);

  //Load saved exercises on mount
  useEffect(() => {
    const fetchData = async () => {
      const saved = await getCustomExercises();
      const deleted = await getDeletedExercises();
      const filtered = saved.filter(
        (ex, index, self) =>
          index === self.findIndex(e => e.name === ex.name) &&
          !deleted.includes(ex.name),
      );

      const savedDays = await getGymFrequency();

      setCustomExercises(filtered);
      if (savedDays) {
        setSelectedDays(savedDays);
      }
    };
    fetchData();
  }, []);

  //Rengerate plan when exercises or days change
  useEffect(() => {
    if (customExercises.length > 0) {
      const generated = generateWeeklyPlan(customExercises, selectedDays);
      setPlan(generated);
    }
  }, [customExercises, selectedDays]);

  useEffect(() => {
    const checkLogs = async () => {
      const logs = await getWorkoutHistory();
      console.log('Saved workout logs:', logs);
    };
    checkLogs();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏋️ Home Screen</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Select Exercises')}>
        <Text style={styles.buttonText}>Select Favourite Exercises</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (plan.length === 0) {
            Alert.alert(
              'Insufficient Exercises',
              "You don't have enough exercises save for your selected workout frequency. Please add more.",
            );
          } else {
            navigation.navigate('StartWorkout');
          }
        }}>
        <Text style={styles.buttonText}>Start Today's Workout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('History')}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>

      <Text style={styles.freqLabel}>How many days a week do you train?</Text>
      <View style={styles.buttonGroup}>
        {[2, 3, 4].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.freqButton,
              num === selectedDays && styles.freqButtonActive,
            ]}
            onPress={() => {
              setSelectedDays(num);
              saveGymFrequency(num);
            }}>
            <Text style={styles.freqButtonText}>{num} Days</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.planWrapper}>
        {plan.map((day, index) => (
          <View key={index} style={styles.dayCard}>
            <Text style={styles.dayTitle}>
              {day.day} - {day.focus}
            </Text>
            {day.exercises.map((ex, i) => (
              <Text key={i} style={styles.exerciseText}>
                • {ex}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.buttonBackground,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  freqLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  freqButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  freqButtonActive: {
    backgroundColor: COLORS.purple,
  },
  freqButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  planWrapper: {
    marginTop: 30,
    width: '100%',
  },
  dayCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  exerciseText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});
