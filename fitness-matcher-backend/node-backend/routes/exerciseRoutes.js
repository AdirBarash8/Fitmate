const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/exercises", verifyToken, exerciseController.addExercise);
router.get("/exercises/:user_id", verifyToken, exerciseController.getExercisesByUser);

module.exports = router;
