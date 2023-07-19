const recipeBtn = document.querySelector(".recipe-btn");
const loading = document.querySelector(".loading");
recipeBtn.addEventListener("click", () => {
  loading.style.display = "block";
  recipeBtn.style.display = "none";
});
