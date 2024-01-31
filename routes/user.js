// const
const express = require("express");
const router = express.Router();

// middlewares
const authorized = require("../middleware/auth");

// controllers
const userSignup = require('../controllers/user/signup')
const userLogin = require('../controllers/user/login')
const userGetOne = require('../controllers/user/getOne')
const userGetAll = require('../controllers/user/getAll')
const userUpdate = require('../controllers/user/update')
const userDelete = require('../controllers/user/delete')


//signup
router.post("/signup", userSignup.signup);

//login
router.post("/login", userLogin.login);

//read
router.get("/:id", authorized, userGetOne.getOne);
router.get("/", authorized, userGetAll.getAll);

//update
router.put("/:id", authorized, userUpdate.update);

//delete
router.delete("/:id", authorized, userDelete.delete);

module.exports = router;
