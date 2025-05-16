const db = require("../models/db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables


// ✅ Get All Candidates
const getCandidates = (req, res) => {
  const query = `
    SELECT 
      id, name, email, phone, skills, experience, dob, address, education, resume, applied_requirement_ids 
    FROM candidates`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching candidates:", err);
      return res.status(500).json({ error: "Database error: Unable to fetch candidates" });
    }

    const candidates = results.map(candidate => {
      const dobFormatted = candidate.dob
        ? new Date(candidate.dob).toISOString().split("T")[0]
        : null;

      return {
        ...candidate,
        dob: dobFormatted,
        requirements: candidate.requirements ? candidate.requirements.split(",") : [],
        applied_requirement_ids: candidate.applied_requirement_ids
          ? candidate.applied_requirement_ids.split(",").map(id => id.trim())
          : [],
      };
    });

    console.log("✅ Fetched candidates:", candidates.length);
    res.status(200).json(candidates);
  });
};


// ✅ Delete Candidate
const deleteCandidate = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Candidate ID is required" });

  db.query("DELETE FROM candidates WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error: Unable to delete candidate" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Candidate not found" });
    res.status(200).json({ message: "Candidate deleted successfully" });
  });
};

// ✅ Update Candidate
const updateCandidate = (req, res) => {
  const { id } = req.params;
  let { name, email, phone, skills, experience, dob, address, education, resume } = req.body;

  console.log("Updating candidate ID:", id);
  console.log("Request body:", req.body);

  if (!id) return res.status(400).json({ error: "Candidate ID is required" });

  // ✅ Format dob correctly for MySQL DATE column
  dob = dob ? new Date(dob).toISOString().split('T')[0] : null;

  const query = `
    UPDATE candidates
    SET name = ?, email = ?, phone = ?, skills = ?, experience = ?, dob = ?, address = ?, education = ?, resume = ?
    WHERE id = ?
  `;

  db.query(query, [name, email, phone, skills || null, experience || null, dob, address || null, education || null, resume || null, id], (err, result) => {
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Database error: Unable to update candidate" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate updated successfully" });
  });
};


// ✅ Apply for a Requirement

const applyForRequirement = (req, res) => {
  const { candidateId, requirementId } = req.body;
  
  if (!candidateId || !requirementId) {
    return res.status(400).json({ error: "Candidate ID and Requirement ID are required" });
  }

  // Find the candidate by user_id
  db.query("SELECT id, applied_requirement_ids FROM candidates WHERE user_id = ?", [candidateId], (err, results) => {
    if (err) {
      console.error("❌ Database error while fetching candidate:", err);
      return res.status(500).json({ error: "Database error: Unable to fetch candidate" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const candidate = results[0];
    // Parse existing requirements, ensuring we handle empty strings properly
    let existingRequirements = candidate.applied_requirement_ids 
      ? candidate.applied_requirement_ids.split(",").filter(id => id !== "")
      : [];
    
    // Check if already applied
    const reqIdStr = requirementId.toString();
    if (existingRequirements.includes(reqIdStr)) {
      return res.status(200).json({ 
        message: "Candidate has already applied for this requirement",
        appliedRequirements: existingRequirements
      });
    }

    // Add new requirement ID and create comma-separated string
    existingRequirements.push(reqIdStr);
    const updatedRequirements = existingRequirements.join(",");
    
    // Update the candidate record
    db.query(
      "UPDATE candidates SET applied_requirement_ids = ? WHERE id = ?", 
      [updatedRequirements, candidate.id], 
      (err) => {
        if (err) {
          console.error("❌ Error updating applied requirements:", err);
          return res.status(500).json({ error: "Database error: Unable to update applied requirements" });
        }
        
        res.status(200).json({ 
          message: "Requirement applied successfully", 
          appliedRequirements: existingRequirements 
        });
      }
    );
  });
};

const getCandidateById = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Candidate ID is required" });
  console.log("id ", id);
  const query = "SELECT * FROM candidates WHERE user_id = ?";
  db.query(query, [id], (err, results) => {
    console.log(results);
    if (err) return res.status(500).json({ error: "Database error: Unable to fetch candidate" });
    if (results.length === 0) return res.status(404).json({ error: "Candidate not found" });

    const candidate = results[0];
    if (candidate.dob) {
      candidate.dob = new Date(candidate.dob).toISOString().split('T')[0];
    }
    candidate.requirements = candidate.requirements ? candidate.requirements.split(",") : [];
    res.status(200).json(candidate);
  });
};



module.exports = {  getCandidates, deleteCandidate, updateCandidate, applyForRequirement, getCandidateById };
