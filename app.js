const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const newsRouter = require("./routes/news");
const configurePassport = require("./passport/passport.js");
const authenticationRouter = require("./routes/authentication");
const preguntasRouter=require("./routes/preguntas");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./front/build")));

configurePassport(app);

app.use("/", indexRouter);
app.use("/news", newsRouter);
app.use("/", authenticationRouter);
app.use("/preguntas" , preguntasRouter);

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

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);

  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, content-Type, Accept, credentials, cache"
  );

  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

module.exports = app;
