require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//connect to monggose
const connectDB = require("./db/connect");

app.get("/", (req, res) => {
  res.send('<h1>Blog API</h1><a href="/api-docs">Documentation</a>');
});

//routers
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const draftsRouter = require("./routes/drafts");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/drafts", draftsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
