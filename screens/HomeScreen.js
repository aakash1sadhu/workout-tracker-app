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
  const [analytics, setAnalytics] = useState(null);

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

      if (logs.length === 0) {
        setAnalytics(null);
        return;
      }

      const totalWorkouts = logs.length;
      const totalSets = logs.reduce((sum, log) => {
        return sum + log.exercises.reduce((s, ex) => s + ex.sets, 0);
      }, 0);

      const last = logs[0];
      const lastDate = new Date(last.date).toDateString();
      const lastDuration = last.duration;
      const lastSetCount = last.exercises.reduce((s, ex) => s + ex.sets, 0);

      setAnalytics({
        totalWorkouts,
        totalSets,
        last: {
          date: lastDate,
          duration: lastDuration,
          sets: lastSetCount,
        },
      });
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>

      {analytics && (
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>📊 Your Progress</Text>
          <Text style={styles.analyticsText}>
            Total Workouts: {analytics.totalWorkouts}
          </Text>
          <Text style={styles.analyticsText}>
            Total Sets Completed: {analytics.totalSets}
          </Text>
          <Text style={styles.analyticsText}>
            Last Workout: {analytics.last.date} • {analytics.last.duration} min
            • {analytics.last.sets} sets
          </Text>
        </View>
      )}
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
  planWrapper: {
    marginTop: 30,
    width: '100%',
  },
  analyticsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderColor: COLORS.purple,
    borderWidth: 1,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.purple,
    marginBottom: 8,
  },
  analyticsText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
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
