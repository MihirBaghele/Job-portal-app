const express = require("express");
const { addRequirement, getRequirements, updateRequirement, deleteRequirement } = require("../controllers/requirementController");

const router = express.Router();

router.post("/add", addRequirement);
router.get("/all", getRequirements);
router.put("/update/:id", updateRequirement);
router.delete("/delete/:id", deleteRequirement);

module.exports = router;
