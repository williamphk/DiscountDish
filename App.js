const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const indexRouter = require("./modules/routes/indexRouter");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/", indexRouter);

app.listen(3000, () => console.log("Server started on port 3000"));
