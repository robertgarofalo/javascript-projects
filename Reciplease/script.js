// https://www.themealdb.com/api.php


const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal'),
    container = document.querySelector('.container');
scrollBtn = document.getElementById('scroll-top');


// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    single_mealEl.innerHTML = '';

    //Get search term
    const term = search.value;

    // Check for empty 
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                container.style.display = "flex";

                resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`

                if (data.meals === null) {
                    resultHeading.innerHTML = '<p>No results found. Please try again</p>';
                    mealsEl.innerHTML = '';
                    container.scrollIntoView();
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `)
                        .join('');
                    container.scrollIntoView();
                }
            })
        //Clear search text
        search.value = '';
    } else {
        alert('Please enter a search term')
    }
}

//Get meal by ID - FETCH
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}
        `).then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
            single_mealEl.scrollIntoView();
        })
}

// Fetch random meal from API
function getRandomMeal() {
    //clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            addMealToDOM(meal);
            container.scrollIntoView();
        });
}

//Add meal to dom
function addMealToDOM(meal) {
    container.style.display = "flex";

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal" id="meal-scroll">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}

        </div>
        <div class="main">
            <ul>
            <h2>Ingredients</h2>
                ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
            <p>${meal.strInstructions.replace(/(\r\n|\r|\n)/g, '<br><br>')}</p>
            
        </div>
        </div>`
}

// Scroll to top button functionality
function scrollToTop() {
    window.scrollTo(0, 0);
}

// Scroll to top button << OPACITY >> functionality
function scrollBtnOpacity() {

    if (document.body.scrollHeight < 800) {
        return;
    }
    if (window.scrollY > 600 && scrollBtn.style.opacity === "") {
        scrollBtn.classList.remove('scroll-btn-remove');
        scrollBtn.classList.add('scroll-btn-appear');
    }

    if (window.scrollY < 600 && scrollBtn.style.opacity === '1') {
        scrollBtn.classList.remove('scroll-btn-appear');
        scrollBtn.classList.add('scroll-btn-remove');

    }

    scrollBtn.addEventListener('animationend', () => {
        if (window.scrollY > 600 && scrollBtn.style.opacity === "") {
            scrollBtn.style.opacity = 1;

        } else if (window.scrollY < 600 && scrollBtn.style.opacity === "1") {
            scrollBtn.style.opacity = "";
        }
    });

}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})

scrollBtn.addEventListener('click', scrollToTop);
document.addEventListener('scroll', scrollBtnOpacity)

