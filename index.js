const mealsEle = document.getElementById("meals");
const favoriteContainer = document.getElementById("fav-meals");
const searchTerm = document.getElementById(" search-term");
const searchBtn = document.getElementById("search");
const mealPopUp = document.getElementById("meal-popup");
const closePopupBtn = document.getElementById("close-pop-up");
const mealInfoEle = document.getElementById("meal-info");
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
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = ` <div class="meal-header">
   ${random ? ` <span class="random"> Random Recipe </span>` : ""}
    <img
      src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}"
      class="imgAddMeal"
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

  const img = meal.querySelector(".imgAddMeal");
  img.addEventListener("click", (event) => {
    showMealInfo(mealData);
    console.log(showMealInfo);
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
    class="favMealImagInfo"
  /><span>${mealData.strMeal}</span>
</li>
<button class="clear"><i class="fa-solid fa-xmark"></i></button>
`;
  const btn = favMeal.querySelector(".clear");
  btn.addEventListener("click", () => {
    removeMealFromLs(mealData.idMeal);
    fetchFavMeals();
  });

  const favMealImgInfo = favMeal.querySelector(".favMealImagInfo");

  favMealImgInfo.addEventListener("click", () => {
    showMealInfo(mealData);
    console.log(showMealInfo);
  });
  favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
  mealInfoEle.innerHTML = "";

  const mealEle = document.createElement("div");

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (mealData["strIngredient" + i]) {
      ingredients.push(
        `${mealData["strIngredient" + i]} - ${mealData["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }

  mealEle.innerHTML = `<h1>${mealData.strMeal}</h1>
      <img
        src="${mealData.strMealThumb}"
        alt=""
      />
      <p>
        ${mealData.strInstructions}
      </p>
      <h3>Ingrediets:</h3>
      <ul>
      ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
      `;

  mealInfoEle.appendChild(mealEle);
  console.log(mealInfoEle);
  mealPopUp.classList.remove("hidden");
}

searchBtn.addEventListener("click", async () => {
  //clean container
  mealsEle.innerHTML = "";
  const search = searchTerm.value;
  const meals = await getMealBySearch(search);
  if (meals) {
    meals.forEach((meal) => {
      addMeals(meal);
    });
  }
});

closePopupBtn.addEventListener("click", () => {
  mealPopUp.classList.add("hidden");
});
