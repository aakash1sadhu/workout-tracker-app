import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS } from "../utils/colors";
import {
  saveCustomExercise,
  getCustomExercises,
  removeCustomExercise,
  getDeletedExercises,
  saveDeletedExercise,
  saveTrainingGoal,
  getTrainingGoal,
  removeItem, // for clearing deleted_exercises
} from "../utils/encryptedStorage";

export default function SelectExercisesScreen() {
  const [exerciseName, setExerciseName] = useState("");
  const [category, setCategory] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [trainingGoal, setTrainingGoal] = useState("Both");
  const [isEditing, setIsEditing] = useState(false);
  const [editTargetName, setEditTargetName] = useState(null);

  const handleSave = async () => {
    if (!exerciseName || !category) {
      Alert.alert("Please enter a name and select a category");
      return;
    }

    const cleanedName = exerciseName.trim().toLowerCase();
    const newExercise = { name: cleanedName, category };

    try {
      const existing = await getCustomExercises();

      const isDuplicate = existing.some(
        (ex) => ex.name === cleanedName && ex.name !== editTargetName
      );
      if (isDuplicate) {
        Alert.alert(
          "Duplicate Exercise",
          "Another exercise already exists using this name."
        );
        return;
      }

      if (isEditing && editTargetName) {
        const existing = await getCustomExercises();
        const updated = existing
          .filter((ex) => ex.name !== editTargetName)
          .concat(newExercise);
        await removeCustomExercise(editTargetName);
        updated.forEach((ex) => saveCustomExercise(ex));
      } else {
        await saveCustomExercise(newExercise);
      }

      setExerciseName("");
      setCategory(null);
      setIsEditing(false);
      setEditTargetName(null);

      Alert.alert(isEditing ? "Exercise updated!" : "Exercise saved!");
      await loadScreenData();
    } catch (err) {
      console.error("Error saving/editing exercise:", err);
    }
  };

  const handleDelete = async (name) => {
    const isCustom = await getCustomExercises().then((list) =>
      list.some((ex) => ex.name === name)
    );

    if (isCustom) {
      await removeCustomExercise(name);
    }

    await saveDeletedExercise(name);
    loadScreenData();
  };

  const handleResetAll = async () => {
    try {
      await removeItem("deleted_exercises");
      const saved = await getCustomExercises();

      const unique = saved.filter(
        (ex, index, self) => index === self.findIndex((e) => e.name === ex.name)
      );

      setAllExercises([...unique]);
      Alert.alert("Reset complete", "All exercises have been restored.");
    } catch (err) {
      console.error("Failed to reset deleted exercises", err);
    }
  };

  const loadScreenData = async () => {
    const saved = await getCustomExercises();
    const deleted = await getDeletedExercises();
    const goal = await getTrainingGoal();

    const unique = saved.filter(
      (ex, index, self) =>
        index === self.findIndex((e) => e.name === ex.name) &&
        !deleted.includes(ex.name)
    );

    setAllExercises([...unique]);
    setTrainingGoal(goal);
  };

  useEffect(() => {
    loadScreenData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Add New Exercise</Text>

      <TextInput
        style={styles.input}
        placeholder="Exercise name"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <Text style={styles.label}>Select a category</Text>
      {["Upper", "Lower", "Back", "Full"].map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.categoryButton,
            category === cat && styles.categoryButtonActive,
          ]}
          onPress={() => setCategory(cat)}
        >
          <Text
            style={[
              styles.categoryText,
              category === cat && styles.categoryTextSelected,
            ]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEditing ? "Update Exercise" : "Save Exercise"}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setIsEditing(false);
            setEditTargetName(null);
            setExerciseName("");
            setCategory(null);
          }}
        >
          <Text style={styles.saveButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Your Exercises</Text>
      <View style={styles.exerciseList}>
        {allExercises.map((ex, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseCategory}>{ex.category}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setExerciseName(ex.name);
                  setCategory(ex.category);
                  setIsEditing(true);
                  setEditTargetName(ex.name);
                }}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(ex.name)}
              >
                <Text style={styles.deleteButtonText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleResetAll}>
        <Text style={styles.resetButtonText}>Reset All Exercises</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingBottom: 40,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.card,
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  categoryTextSelected: {
    color: COLORS.buttonText,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.purple,
  },
  categoryText: {
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: COLORS.purple,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.buttonText,
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#888",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  exerciseList: {
    paddingBottom: 40,
  },
  exerciseItem: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  exerciseCategory: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: COLORS.purple,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editButtonText: {
    color: COLORS.buttonText,
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: COLORS.purple,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
});
