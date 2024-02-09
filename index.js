const mealsEle = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById(" search-term");
const searchBtn = document.getElementById("search");
getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const resData = await res.json();
  const randomMeal = resData.meals[0];
  console.log(randomMeal);
  addMeals(randomMeal, true);
}

async function getMealById(id) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const resData = await res.json();
  const meal = resData.meals[0];
  console.log(meal);
  return meal;
}

async function getMealBySearch(term) {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const resData = await res.json();
  const meals = resData.meals;

  return meals;
}

function addMeals(mealData, random = false) {
  // console.log(mealData);
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = ` <div class="meal-header">
   ${random ? ` <span class="random"> Random Recipe </span>` : ""}
    <img
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"
    />
  </div>
  <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
      <i class="fa-solid fa-heart"></i>
    </button>
  </div>`;
  mealsEle.appendChild(meal);

  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealFromLs(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLs(mealData.idMeal);

      btn.classList.add("active");
    }

    fetchFavMeals();
  });
}

function addMealToLs(mealId) {
  const mealIds = getMealFromLS();
  localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealFromLs(mealId) {
  const mealIds = getMealFromLS();
  localStorage.setItem(
    "mealIds",
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  );
}

function getMealFromLS() {
  const mealIds = JSON.parse(localStorage.getItem("mealIds"));
  console.log(mealIds);

  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  favoriteContainer.innerHTML = "";

  const mealIds = getMealFromLS();
  const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);
    addmealToFav(meal);
  }
}

function addmealToFav(mealData) {
  // console.log(mealData);
  const favMeal = document.createElement("li");

  favMeal.innerHTML = ` 
  <li>
  <img
    src="${mealData.strMealThumb}
  "
    alt="${mealData.strMeal}"
  /><span>${mealData.strMeal}</span>
</li>
<button class="clear"><i class="fa-solid fa-xmark"></i></button>
`;
  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealFromLs(mealData.idMeal);
    fetchFavMeals();
  });
  favoriteContainer.appendChild(favMeal);
}

searchBtn.addEventListener("click", async () => {
  mealsEle.innerHTML = "";
  const search = searchTerm.value;
  const meals = await getMealBySearch(search);
  if (meals) {
    meals.forEach((meal) => {
      addMeals(meal);
    });
  }
});
