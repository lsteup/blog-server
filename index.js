require("dotenv").config();

const express = require("express");
const app = express();

const connectDB = require("./db/connect");

app.get("/", (req, res) => {
  res.send('<h1>Blog API</h1><a href="/api-docs">Documentation</a>');
});

const port = 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_CODE);
    app.listen(port, () => {
      console.log("server is lening on port ", port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
