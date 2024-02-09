const meals = document.getElementById("meals");
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
  return meal;
}

async function getMealBySearch(term) {
  const meals = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata" + term
  );
  console.log(meals);
}

function addMeals(mealData, random = false) {
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
  meals.appendChild(meal);

  const btn = meal.querySelector(".meal-body .fav-btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeMealFromLs(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addMealToLs(mealData.idMeal);

      btn.classList.add("active");
    }
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
