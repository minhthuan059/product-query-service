import express from "express";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/products", routes);
app.use(errorHandler);

export default app;
