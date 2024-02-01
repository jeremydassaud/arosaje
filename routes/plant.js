// const
const express = require("express");
const router = express.Router();

// middlewares
const authorized = require("../middleware/auth");

// controllers
const createPlant = require('../controllers/plant/create')
const deletePlant = require('../controllers/plant/delete')
const getPlantsByCoordinates = require("../controllers/plant/getAllFromCoordinates")

//create
router.post("/users/:id/plants/:type", authorized, createPlant.create);

//read
router.get("/by-coordinates/:lat/:lng", getPlantsByCoordinates.getAll);

//delete
router.delete("/:type/:id", authorized, deletePlant.delete);





module.exports = router;
