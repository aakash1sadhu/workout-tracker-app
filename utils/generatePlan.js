//Workout day tupes by weekly gym frequency
const splitByDays = {
  2: ['Full', 'Full'],
  3: ['Upper', 'Lower', 'Back'],
  4: ['Upper', 'LowerBack', 'Upper', 'LowerBack'],
};

export function validateExercises(exercises, gymDays) {
  const categoryCounts = exercises.reduce((acc, ex) => {
    acc[ex.category] = (acc[ex.category] || 0) + 1;
    return acc;
  }, {});

  if (gymDays === 2) {
    return (categoryCounts['Full'] || 0) >= 2;
  }

  if (gymDays === 3) {
    return (
      (categoryCounts['Upper'] || 0) >= 1 &&
      (categoryCounts['Lower'] || 0) >= 1 &&
      (categoryCounts['Back'] || 0) >= 1
    );
  }

  if (gymDays === 4) {
    const hasUpper = (categoryCounts['Upper'] || 0) >= 1;
    const hasLowerOrBack =
      (categoryCounts['Lower'] || 0) >= 1 || (categoryCounts['Back'] || 0) >= 1;
    return hasUpper && hasLowerOrBack;
  }

  return false;
}

export function generateWeeklyPlan(favouriteExercises, gymDays) {
  const plan = [];
  const split = splitByDays[gymDays];

  if (!split || !validateExercises(favouriteExercises, gymDays)) {
    console.warn('⚠️ Not enough exercises to generate a valid plan');
    return [];
  }

  split.forEach((dayFocus, i) => {
    const dayExercises = favouriteExercises.filter(ex => {
      if (dayFocus === 'LowerBack') {
        return ex.category === 'Lower' || ex.category === 'Back';
      }
      return ex.category === dayFocus;
    });

    //Pick up to 3 exercises for the day
    const selected = dayExercises.slice(0, 5);

    plan.push({
      day: `Day ${i + 1}`,
      focus: dayFocus,
      exercises: selected.map(ex => ex.name),
    });
  });

  return plan;
}

export function getTodayWorkoutPlan(favouriteExercises, gymDays) {
  const weeklyPlan = generateWeeklyPlan(favouriteExercises, gymDays);

  const dayIndex = new Date().getDay() % weeklyPlan.length;
  const todayPlan = weeklyPlan[dayIndex];

  const todayExercises = todayPlan.exercises;

  //Return full exercise details (not just names)
  return favouriteExercises.filter(ex => todayExercises.includes(ex.name));
}
