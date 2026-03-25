const express = require("express");
const cors = require("cors");
const authRoutes =require("./src/routes/auth.routes")
const userRoutes=require("./src/routes/user.route")
const msgRouter=require("./src/routes/message.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes)
app.use("/api/msg",msgRouter);

app.get("/", (req, res) => {
  res.send("API Running...");
});

module.exports = app;
