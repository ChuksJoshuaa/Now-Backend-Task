import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import SwaggerUI from "swagger-ui-express";
import YAML from "yamljs";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";
const app = express();

//Swagger
const swaggerDocument = YAML.load("./swagger.yaml");

//Extra packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(helmet());

//Homepage

app.get("/", (req, res) => {
  res.send(
    '<h2>Now&Me Task</h2><h5>Click on the documentation and test all Api endpoints.</h5><a href="/api-docs">Documentation</a>'
  );
});

app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

// Routes
app.use("/post", postRoutes);
app.use("/user", userRoutes);

//Error routes
app.use(notFound);
app.use(errorHandlerMiddleware);

//Port
const PORT = process.env.PORT || 5000;

//Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`))
  )
  .catch((error) => console.log(error));
