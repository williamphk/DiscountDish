var express = require("express");
var router = express.Router();
const axios = require("axios");
const Replicate = require("replicate");

require("dotenv").config();

let groceryItems = [];

const appId = process.env.ID;
const appKey = process.env.KEY;

router.get("/", async (req, res) => {
  res.render("index", { groceryItems });
});

router.post("/lookup", async (req, res) => {
  const upc = req.body.upc;
  try {
    const response = await axios.get(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`
    );
    const item = response.data.items[0];
    res.render("result", { item });
  } catch (error) {
    res.render("error", { error });
  }
});

router.post("/add-grocery-item", (req, res) => {
  groceryItems.push(req.body.title);
  res.render("index", { groceryItems });
});

router.post("/generate-recipe", async (req, res) => {
  const formattedGroceryItems = groceryItems.map((item) => `${item}`).join(",");

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  let recipe = await replicate.run(
    "a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
    {
      input: {
        prompt: `User: give me a recipe for ${formattedGroceryItems} . Assistant:`,
      },
      max_length: "2000",
    }
  );

  recipe = recipe.toString().replace(/, /g, " ");
  console.log(recipe);
  // const response = await axios.get(
  //   `https://api.edamam.com/api/recipes/v2?type=public&q=${formattedGroceryItems}&app_id=${appId}&app_key=${appKey}&diet=balanced&cuisineType=Japanese&mealType=Dinner`
  // );
  // const result = await response.data;
  // const ingredients = result.hits[0].recipe.ingredientLines;
  // const recipeUri = result.hits[0].recipe.uri;

  // response = await axios.get(
  //   `https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${recipeUri}&app_id=${appId}&app_key=${appKey}`
  // );
  res.render("index", { recipe });
});

module.exports = router;
