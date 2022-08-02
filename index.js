const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const login = require("./routes/login");
const profile = require("./routes/profile");
const register = require("./routes/register");

const cards = require("./routes/cards");

const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/profile", profile);
app.use("/api/cards", cards);
// app.use("/api/users", users);

//connect to mongodb
mongoose
  .connect(process.env.dbString, { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb..."))
  .catch(() => console.log("error connecting to mongodb..."));

app.listen(PORT, () => console.log("Server started on port " + PORT));
