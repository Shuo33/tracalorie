class CalorieTracker {
    // constructor runs when app loads 
    constructor() {
        this._calorieLimit = 2000; 
        this._totalCalories = 0; 
        this._meals = [];
        this._workouts = [];

        // the constructor runs immediately when you instantiate the class
        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
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

        const progressEl = document.getElementById('calorie-progress');

        if (remaining <= 0) {
            // change the Calories Remaining background color from green to red 
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            // change the progress bar color from green to red 
            progressEl.classList.remove('bg-success');
            progressEl.classList.add('bg-danger');
        } else {
            // change the Calories Remaining background color back to green 
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            // change the progress bar color back to green
            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bg-success');
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        // to limit the max width to 100% 
        const width = Math.min(percentage, 100);
        progressEl.style.width = `${width}%`;
    }


    // after every changement, we need to rend it so the systeme can update it 
    _render() {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress()
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

// const tracker = new CalorieTracker();

// const breakfast = new Meal('breakfast', 600);
// tracker.addMeal(breakfast);

// const run = new Workout('run', 300);
// tracker.addWorkout(run);

// console.log(tracker._meals);
// console.log(tracker._workouts);
// console.log(tracker._totalCalories);


class App {
    constructor() {
        this._tracker = new CalorieTracker();

        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
    }

     _newItem(type, e) {
        e.preventDefault();
    
        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);
    
        // Validete inputs
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all the fields');
            return;
        }
         
         if (type === 'meal') {
            // + sign helps to make the string to number
            const meal = new Meal(name.value, +calories.value); 
            this._tracker.addMeal(meal);
         } else {
            const workout = new Workout(name.value, +calories.value); 
            this._tracker.addWorkout(workout);
         }
        
         // clean up the lasted data
         name.value = '';
         calories.value = '';

         //close the form window once the form get filled
         const collapseItem = document.getElementById(`collapse-${type}`);
         const bsCollapse = new bootstrap.Collapse(collapseItem, {
             toggle: true
         })
     }
    
    // _newWorkOut(e) {
    //     e.preventDefault(); 

    //     const name = document.getElementById('workout-name');
    //     const calories = document.getElementById('workout-calories');

    //     // Valide input
    //     if (name.value === '' || calories.value === '') {
    //         alert('Please fill in all the fields');
    //         return;
    //     }

    //     const workout = new Workout(name.value, +calories.value); 

    //     this._tracker.addWorkout(workout);

    //     // clean up the lasted data
    //     name.value = '';
    //     calories.value = '';

    //     const collapseWorkOut = document.getElementById('collapse-workout');
    //      const bsCollapse = new bootstrap.Collapse(collapseWorkOut, {
    //          toggle: true
    //      })
    // }
    
}


const app = new App();