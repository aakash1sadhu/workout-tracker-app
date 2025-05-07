import {View, Text, StyleSheet} from 'react-native';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 Workout History</Text>
      <Text style={styles.info}>
        You'll be able to see a list of completed workouts with stats and dates.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
