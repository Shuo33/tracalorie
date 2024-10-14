class CalorieTracker {
    // constructor runs when app loads 
    constructor() {
        this._calorieLimit = 2500; 
        this._totalCalories = 0; 
        this._meals = [];
        this._workouts = [];

        // the constructor runs immediately when you instantiate the class
        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
    }

    // Public Methods / API
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories; 
        // after every changes, we need to updated it to the DOM
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        //after every changes, we need to updated it to the DOM so to show it
        this._render(); 
    }

    // Private Methods
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories; 
    }

    _displayCaloriesLimit() {
        const caloriesLimitEl = document.getElementById('calories-limit');
        caloriesLimitEl.innerHTML = this._calorieLimit; 
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const consumed = this._meals.reduce(function (total, meal) {
            return total + meal.calories;
        }, 0);

        caloriesConsumedEl.innerHTML = consumed; 
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burned = this._workouts.reduce(function (total, workout) {
            return total + workout.calories;
        }, 0);
        
        caloriesBurnedEl.innerHTML = burned; 
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;
    }


    // after every changement, we need to rend it so the systeme can update it 
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
    }
}

class Meal {
    constructor(name, calories) {
        //Math.random().toString(16) generate a random hexadecimal string
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

const tracker = new CalorieTracker();

const breakfast = new Meal('breakfast', 400);
tracker.addMeal(breakfast);

const run = new Workout('run', 300);
tracker.addWorkout(run);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
