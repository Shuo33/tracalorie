class CalorieTracker {
    // constructor runs when app loads 
    constructor() {
        // since 'getCalorieLimit()' is a static method inside the 'storage' class, we can call it only on it's class, we can't call it on an object/instance
        this._calorieLimit = Storage.getCalorieLimit(); 
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

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
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        // after every changes, we need to updated it to the DOM
        this._render();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        //after every changes, we need to updated it to the DOM so to show it
        this._render(); 
    }

    // To identify the meal that got clicked and remove it from the 'this._meals' array
    removeMeal(id) {
        // find the index that we want to remove: when the clicked id = the meal'id, we take that index from the 'this._meals' array and put it into index variable
        // const index = this._meals.findIndex(function (meal) { meal.id === id }) only arrow function work
        const index = this._meals.findIndex((meal) => meal.id === id )
        //if the clicked id has been found in the array
        if (index !== -1) {
            const meal = this._meals[index]; //get the meal with the meal's id from the array
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meals.splice(index, 1); // take the meal out of the array completely, delete it from the array
            Storage.removeMeal(id);
            this._render();
        }
    }

    // To identify the workout that got clicked and remove it from the 'this._workouts' array
    removeWorkout(id) {
        // const index = this._workouts.findIndex(function (workout){workout.id === id}); didn't work, have to use arrow 
        const index = this._workouts.findIndex((workout) => workout.id === id);
        if (index !== -1) {
            const workout = this._workouts[index]; 
            this._workouts.splice(index, 1);
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    // To reset 
    reset() {
        this._totalCalories = 0; 
        this._meals = [];
        this._workouts = [];
        this._render();
    }

    // To set calorieLimit
    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit; 
        Storage.setCalorieLimit(calorieLimit);
        this._displayCaloriesLimit();
        this._render();
    }

    // to load _meals array and _workouts array from the storage to the DOM 
    // note that we can only use arrow function cos normal function didnt work
    loadItems() {
        this._meals.forEach(
            meal => this._displayNewMeal(meal)
        );

        this._workouts.forEach(
            workout => this._displayNewWorkout(workout)
        );
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

    _displayNewMeal(meal) {
    const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name} </h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `;
        mealsEl.appendChild(mealEl);
    }

    _displayNewWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name} </h4>
                 <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                 </div>
                 <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
            </div>
        </div>
        `;

        workoutsEl.appendChild(workoutEl);
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


class Storage {
    // static method can be called only on an object class, but not an object/instance.
    
    // to get the calorie limit
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        // if localStorage has nothing, it's going to be the defaul value 2000
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;  
        } else {
            // if localStorage has a number, we put the number into the variable calorieLimit (transform string to number with +)
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    // to set the calorie limit
    static setCalorieLimit(calorieLimit) {
        // localStorage.setItem(key, value);
        localStorage.setItem('calorieLimit', calorieLimit);
    }
    
    // to get the total calories
    static getTotalCalories(defaultCalories = 0) {
        let totalCalories; 
        if (localStorage.getItem('totalCalories' === null)) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories; 
    }

    // to set the total calories
    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    // to get the meal from the localStorage
    static getMeals() {
        let meals; 
        if (localStorage.getItem('meals') === null) {
            meals = []; 
        } else {
            // parse it into an  normal array from an stringfy array
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    // to save the meal to localStorage
    static saveMeal(meal) {
        // take the meals (the older ones) from the storage to meals array
        const meals = Storage.getMeals();
        // add the new meal(the new one) to meals array
        meals.push(meal);
        // put the meals array into storage 
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    // to remove the meal from localStorage
    static removeMeal(id) {
        // get the meal from local storage
        const meals = Storage.getMeals();
        // find the clicked meal's id, and it's index, and take the meal with the index out 
        meals.forEach((meal, index) => {
            if (meal.id === id) {
                meals.splice(index, 1);
            }
        });

        // get ride of the clicked one and put the rest into the localStorage again
        localStorage.setItem('meals', JSON.stringify(meals)) 
    }

    // to get the workout from the localStorage
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    // to save the workout to localStorage
    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts)); 
    }

    // to remove workout from the localStorage
    static removeWorkout(id) {
        const workouts = Storage.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.id === id) {
                workouts.splice(index, 1); 
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts))
    }


}



// initializer 
class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._tracker.loadItems();
        this._loadEventListeners();
    }

    _loadEventListeners() {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));

        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));

        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));

        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'))

        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));

        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));

        document.getElementById('reset').addEventListener('click', this._reset.bind(this));

        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
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
    
    _newWorkOut(e) {
        e.preventDefault();

        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');

        // Valide input
        if (name.value === '' || calories.value === '') {
            alert('Please fill in all the fields');
            return;
        }

        const workout = new Workout(name.value, +calories.value);

        this._tracker.addWorkout(workout);

        // clean up the lasted data
        name.value = '';
        calories.value = '';

        const collapseWorkOut = document.getElementById('collapse-workout');
         const bsCollapse = new bootstrap.Collapse(collapseWorkOut, {
             toggle: true
         })
    }

    _removeItem(type, e) {
        if (
          e.target.classList.contains('delete') ||
          e.target.classList.contains('fa-xmark')
        ) {
            if (confirm('Are you sure?')) {
              // take the target's nearest class which contains '.card', and gets it's id
            const id = e.target.closest('.card').getAttribute('data-id');
            type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

            // remove the item from the DOM
            const item = e.target.closest('.card');
            item.remove();
          }
        }
    }
    
    _filterItems(type, e) {
        // get the text from the input
        const text = e.target.value.toLowerCase();
        // targeting all the items (meal & workout) with .card, which contain the id of the items
        let items = document.querySelectorAll(`#${type}-items .card`); 
        // loop through all the items, both meal items and workout items
        items.forEach(function(item)
            // get the name inside the .card div, which is the name of the item
            {const name = item.firstElementChild.firstElementChild.textContent;
            //check every item's name to see if it has the text, if yes then match, if not then -1 
            if (name.toLowerCase().indexOf(text) !== -1) {
                // if the name of the item matche the searched item(text), then show the item 
                item.style.display = 'block';
            } else {
                item.style.display = 'none'; 
            }
        });
    }

    _reset() {
        this._tracker.reset();
        // reset the DOM of the APP part to zero, clean them up
        document.getElementById('meal-items').innerHTML = ''; 
        document.getElementById('workout-items').innerHTML = ''; 
        // for the input we use value to clean them up 
        document.getElementById('filter-meals').value = ''; 
        document.getElementById('filter-workouts').value = ''; 
    }

    _setLimit(e) {
        e.preventDefault();

        // get the input of the limit
        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit');
            return;
        }

        // converse the limit.value from string to number
        this._tracker.setLimit(+limit.value);
        limit.value = '';

        // close the modal once the form got submit 
        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}


const app = new App();
// console.log(app);

