require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

//connect to monggose
const connectDB = require("./db/connect");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.use(express.static("./public"));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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
