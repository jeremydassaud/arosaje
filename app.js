const express = require("express");
const helmet = require("helmet");
const app = express();
const path = require("path");
const seeder = require('./middleware/seeder')
require("dotenv").config();

const userRoute = require("./routes/user");


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());

app.use("/api", userRoute);
// app.use('/images', express.static(path.join(__dirname, 'images')))
// app.use('/api/post', postRoutes)
// app.use('/api/auth', userRoutes)
// app.use('/api/like', likeRoutes)

module.exports = app;
