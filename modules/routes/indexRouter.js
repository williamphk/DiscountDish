var express = require("express");
var router = express.Router();
const axios = require("axios");

require("dotenv").config();

let groceryItems = [];

router.get("/", async (req, res) => {
  res.render("index", { groceryItems });
});

router.post("/add-grocery-item", (req, res) => {
  groceryItems.push(req.body.title);
  res.render("index", { groceryItems });
});

router.post("/generate-recipe", async (req, res) => {
  const formattedGroceryItems = groceryItems.map((item) => `${item}`).join(",");

  try {
    let result = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/palm-2-chat-bison",
        messages: [
          {
            role: "system",
            content: "You are a helpful recipe search API bot.",
          },
          {
            role: "user",
            content: `can you write me a recipe for ${formattedGroceryItems}?`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          "HTTP-Referer": "https://github.com/williamphk/DiscountDish",

          "X-Title": "DiscountDish",
        },
      }
    );

    let recipe = result.data.choices[0].message.content;
    recipe = convertToHtml(recipe);
    res.render("index", { groceryItems, recipe });
  } catch (error) {
    res.render("error", { error });
  }
});

module.exports = router;

function convertToHtml(recipeText) {
  const [beforeIngredients, ingredientsAndAfter] =
    recipeText.split("Ingredients:");
  const [ingredientsText, instructionsText] =
    ingredientsAndAfter.split("Instructions:");

  const ingredientsList = ingredientsText
    .trim()
    .split("*")
    .filter((item) => item !== "")
    .map((item) => `<li>${item.trim()}</li>`)
    .join("");
  const instructionsList = instructionsText
    .trim()
    .split(/[0-9]+\./)
    .filter((item) => item.trim() !== "")
    .map((item) => `<li>${item.trim()}</li>`)
    .join("");

  // Construct the final HTML.
  const html = `
      <h1>${beforeIngredients.trim()}</h1>
      <p><strong>Ingredients:</strong></p>
      <ul>
          ${ingredientsList}
      </ul>
      <p><strong>Instructions:</strong></p>
      <ol>
          ${instructionsList}
      </ol>
  `;

  return html;
}
