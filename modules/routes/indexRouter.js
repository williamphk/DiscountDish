var express = require("express");
var router = express.Router();
const axios = require("axios");
const { body, validationResult } = require("express-validator");

require("dotenv").config();

let groceryItems = [];

router.get("/", async (req, res) => {
  res.render("index", { groceryItems });
});

router.get("/how-to-use", async (req, res) => {
  res.render("how-to-use");
});

const validateIngredient = [
  body("ingredient")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Cannot be empty.")
    .isLength({ max: 25 })
    .withMessage("Cannot be longer than 25 characters.")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("Must only contain letters and spaces."),
];

router.post("/add-grocery-item", validateIngredient, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.render("error", { errors: errors.array() });
  }

  groceryItems.unshift(req.body.ingredient);
  res.render("index", {
    groceryItems,
    message: "The item is add successfully",
  });
});

router.post("/delete-grocery-item", (req, res) => {
  if (groceryItems[req.body.itemId]) {
    groceryItems.splice(req.body.itemId, 1);
    res.render("index", {
      groceryItems,
      message: "The item is removed successfully",
    });
  } else {
    res.render("error", {
      errors: [{ msg: "Invalid item / the grocery list is empty." }],
    });
  }
});

router.post("/generate-recipe", async (req, res) => {
  if (groceryItems.length === 0) {
    return res.render("error", {
      errors: [{ msg: "Please add at least one grocery item." }],
    });
  }

  const formattedGroceryItems = groceryItems.map((item) => `${item}`).join(",");
  groceryItems = [];
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
    res.render("recipe", { recipe });
  } catch (error) {
    res.render("error", {
      errors: [{ msg: "You have inputted an incorrect item." }],
    });
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

  const html = `
      <h2>${
        beforeIngredients.trim().slice(6).charAt(0).toUpperCase() +
        beforeIngredients.trim().slice(6).slice(1)
      }</h2>
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
