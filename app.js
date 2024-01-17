const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const Message = require("./models/messages");
require('dotenv').config();

const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connection to MongoDB successful");
}

async function writeMessage(message) {
  await Message.create(message);
}

const getMessages = async function (req, res, next) {
  try {
    console.log("Starting search of messages...");
    const search = await Message.find().exec();

    res.messages = search;
    console.log(res.messages);
    next();
  } catch (error) {
    console.error("Error searching messages:", error);
    next(error);
  }
};

async function start() {
  try {
    await main();
  } catch (err) {
    console.error(err);
  }
}

start();

const app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(getMessages);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
