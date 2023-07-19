const recipeBtn = document.querySelector(".recipe-btn");
const recipe = document.querySelector(".recipe");
recipeBtn.addEventListener("click", () => {
  console.log("clicked");
  recipe.style.display = "block";
  recipeBtn.style.display = "none";
});
