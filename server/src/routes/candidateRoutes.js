const express = require("express");
const db = require("../models/db");
const router = express.Router();
const { getCandidates, addCandidate, deleteCandidate, updateCandidate, getCandidateById,applyForRequirement } = require("../controllers/candidateController");

  
router.get("/all", getCandidates);
router.get("/:id", getCandidateById);         // 👈 Fetch candidate by ID
router.delete("/delete/:id", deleteCandidate);
router.put("/update/:id", updateCandidate);
router.post("/apply", applyForRequirement); // Route to apply for a requirement


module.exports = router;
