// Hardcoded list of favourite exercises
const favouriteExercises = [
  {name: 'Bench Press', category: 'Upper'},
  {name: 'Squats', category: 'Lower'},
  {name: 'Deadlift', category: 'Back'},
  {name: 'Shoulder Press', category: 'Upper'},
  {name: 'Pull-ups', category: 'Back'},
  {name: 'Lunges', category: 'Lower'},
  {name: 'Burpees', category: 'Full'},
];

//Workout day tupes by weekly gym frequency
const splitByDays = {
  2: ['Full', 'Full'],
  3: ['Upper', 'Lower', 'Back'],
  4: ['Upper', 'LowerBack', 'Upper', 'LowerBack'],
};

export function generateWeeklyPlan(favouriteExercises, gymDays) {
  const plan = [];
  const split = splitByDays[gymDays];

  if (!split) {
    console.warn('Unsupported number of days: ', gymDays);
    return [];
  }

  split.forEach((dayFocus, i) => {
    const dayExercises = favouriteExercises.filter(ex => {
      if (dayFocus === 'LowerBack')
        return ex.category === 'Lower' || ex.category === 'Back';
      return ex.category === dayFocus;
    });

    //Pick up to 3 exercises for the day
    const selected = dayExercises.slice(0, 3);

    plan.push({
      day: `Day ${i + 1}`,
      focus: dayFocus,
      exercises: selected.map(ex => ex.name),
    });
  });

  return plan;
}
