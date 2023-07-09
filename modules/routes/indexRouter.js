var express = require("express");
var router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
  res.render("index");
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

module.exports = router;
