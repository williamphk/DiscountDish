var express = require("express");
var router = express.Router();
const axios = require("axios");

require("dotenv").config();

let groceryItems = [];

const apiKey = process.env.SECRET_KEY;

router.get("/", (req, res) => {
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

router.post("/generate-receipt", async (req, res) => {
  const formattedGroceryItems = groceryItems
    .map((item) => `${item}`)
    .join("\n");
  const prompt = `Create a receipt for the following grocery items:\n${formattedGroceryItems}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  const receipt = await response.data;
  console.log(receipt);
  res.render("index", { receipt });
});

module.exports = router;
