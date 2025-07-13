import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SelectExercisesScreen from "./screens/SelectExerciseScreen";
import StartWorkoutScreen from "./screens/StartWorkoutScreen";
import HistoryScreen from "./screens/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Select Exercises"
          component={SelectExercisesScreen}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="StartWorkout" component={StartWorkoutScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
