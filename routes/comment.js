// Routes pour les commentaires
const express = require("express");
const router = express.Router();

// middlewares
const authorized = require("../middleware/auth");

//controllers
const createComment = require("../controllers/comment/create");
const updateComment = require("../controllers/comment/update")
const deleteComment = require("../controllers/comment/delete") 

// Create
router.post("/users/:id/plants/:plantId/comments", authorized, createComment.create);

// Update
router.put("/users/:id/plants/:type/:plantId/comments/:commentId",authorized, updateComment.update);

// Delete
router.delete("/users/:id/plants/:type/:plantId/comments/:commentId", authorized, deleteComment.delete);

module.exports = router;