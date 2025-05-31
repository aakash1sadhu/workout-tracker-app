import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ExerciseSelectScreen from './screens/ExerciseSelectScreen';
import StartWorkoutScreen from './screens/StartWorkoutScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen
          name="Select Exercises"
          component={ExerciseSelectScreen}
        />
        <Stack.Screen
          name="StartWorkout"
          component={StartWorkoutScreen}
          options={{title: 'Start Workout'}}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
