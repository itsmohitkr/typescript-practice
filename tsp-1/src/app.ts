import express from "express";
import router from "./router/index";
import routeNotFoundHandler from "./middleware/routeNotFound";
import errorHandler from "./middleware/errorHandler";

const app = express();
app.use(express.json());

app.use("/", router);

app.use(routeNotFoundHandler);

app.use(errorHandler);

export default app;
