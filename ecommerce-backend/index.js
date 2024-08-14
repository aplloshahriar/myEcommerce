const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const mongoose = require("mongoose");

const userRoutes = require("./src/routes/user.route");

const app = express();
env.config();

// database
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@ecommerce-databse.figbt.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("databse connected");
  })
  .catch((error) => {
    console.log("database connection error:", error);
  });

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
