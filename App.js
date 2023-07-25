const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const indexRouter = require("./modules/routes/indexRouter");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.listen(80, () => console.log("Server started on port 80"));
