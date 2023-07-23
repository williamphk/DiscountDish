//Loading
const recipeBtn = document.querySelector(".recipe-btn");
const loading = document.querySelector(".loading");
recipeBtn.addEventListener("click", () => {
  loading.style.display = "block";
  recipeBtn.style.display = "none";
});

//AutoComplete
document
  .getElementById("autoCompleteInput")
  .addEventListener("input", function () {
    let query = this.value;
    if (query.length > 2) {
      fetchSuggestions(query);
    }
  });

function fetchSuggestions(query) {
  fetch(`https://api.datamuse.com/sug?s=${query}&topics=food`)
    .then((response) => response.json())
    .then((data) => {
      displaySuggestions(data);
    });
}

function displaySuggestions(suggestions) {
  let resultsDiv = document.getElementById("autoCompleteResults");
  resultsDiv.innerHTML = "";

  suggestions.forEach((suggestion) => {
    let div = document.createElement("div");
    div.innerHTML = suggestion.word;
    div.addEventListener("click", function () {
      document.getElementById("autoCompleteInput").value = suggestion.word;
      resultsDiv.innerHTML = "";
      resultsDiv.style.display = "none";
    });
    resultsDiv.appendChild(div);
    resultsDiv.style.display = "block";
  });
}
