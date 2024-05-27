const express = require("express");
const helmet = require("helmet");
const app = express();
const path = require("path");
const seeder = require('./middleware/seeder')
require("dotenv").config();

const userRoute = require("./routes/user");
const addressRoute = require("./routes/address")
const plantRoute = require("./routes/plant")
const commentRoute = require("./routes/comment")

const { swaggerUi, swaggerSpec } = require('./swagger');



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

const launchSeeder = async () => {
  await seeder.seeder()
  await seeder.testUserSeeder()
  await seeder.HeptestUserSeeder()
}

launchSeeder()

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/user", userRoute);
app.use("/api/address", addressRoute)
app.use("/api/plant", plantRoute)
app.use("/api/comment", commentRoute)

module.exports = app;
