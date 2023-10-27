const express = require("express");
const { mockAuthMiddleware } = require("./middleware/mockAuth");
const { default: mongoose } = require("mongoose");
const { fieldsRouter, usersRouter } = require("./routers");

const app = express();
const port = 3000;
const apiBase = "/api/v1";
const connectionString =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(connectionString);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(apiBase, usersRouter);
app.use(mockAuthMiddleware);

app.use(apiBase, fieldsRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
