import express from "express";
import artistRouter from "./routes/artists.js";

var app = express();

app.use("/artists/", artistRouter);

export default app;