import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import LogWorkoutScreen from './screens/LogWorkoutScreen';
import HistoryScreen from './screens/HistoryScreen';
import ExerciseSelectScreen from './screens/ExerciseSelectScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Log Workout" component={LogWorkoutScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="Select Exercises"
          component={ExerciseSelectScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
