// const
const express = require("express");
const router = express.Router();

// middlewares
const authorized = require("../middleware/auth");

// controllers
const createAddress = require('../controllers/address/create')
const deleteAddress = require('../controllers/address/delete')


// create
router.post("/:userId",authorized, createAddress.create);


// delete
router.delete("/:id", authorized, deleteAddress.delete)


module.exports = router;