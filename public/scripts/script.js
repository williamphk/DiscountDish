// Loading
const recipeBtn = document.querySelector(".recipe-btn");
const loading = document.querySelector(".loading");
if (recipeBtn) {
  recipeBtn.addEventListener("click", () => {
    loading.style.display = "block";
    recipeBtn.style.display = "none";
  });
}

// AutoComplete
document
  .getElementById("autoCompleteInput")
  .addEventListener("input", function () {
    let query = this.value;
    if (query.length > 0) {
      fetchSuggestions(query);
    } else {
      let resultsDiv = document.getElementById("autoCompleteResults");
      resultsDiv.innerHTML = "";
      resultsDiv.style.display = "none";
    }
  });

function fetchSuggestions(query) {
  fetch(`https://api.datamuse.com/words?sp=${query}*&topics=food&ml=food&max=5`)
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

// Delete button
// const deleteBtn = document.querySelectorAll(".delete-btn");

// for (let i = 0; i < deleteBtn.length; i++) {
//   deleteBtn[i].addEventListener("click", function () {
//     const itemId = this.getAttribute("id");
//     fetch(`/delete-grocery-item/${itemId}`, {
//       method: "DELETE",
//     });
//   });
// }
