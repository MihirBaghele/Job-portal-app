const db = require("../models/db");

// ✅ Add Requirement
const addRequirement = (req, res) => {
  try {
    const { title, description, location, work_location_type, experience_required } = req.body;

    if (!title || !description || !location || !work_location_type || experience_required === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
      INSERT INTO requirements (title, description, location, work_location_type, experience_required)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [title, description, location, work_location_type, experience_required];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Database Insertion Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({ id: result.insertId, title, description, location, work_location_type, experience_required });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getRequirements = (req, res) => {
  const query = "SELECT id, title, description, location, work_location_type, experience_required FROM requirements";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching requirements:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};


// ✅ Update Requirement
const updateRequirement = (req, res) => {
  const { id } = req.params;
  const { title, description, location, work_location_type, experience_required } = req.body;

  if (!title || !description || !location || !work_location_type || experience_required === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
    UPDATE requirements
    SET title = ?, description = ?, location = ?, work_location_type = ?, experience_required = ?
    WHERE id = ?
  `;
  const values = [title, description, location, work_location_type, experience_required, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating requirement:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res.status(200).json({ id, title, description, location, work_location_type, experience_required, message: "Requirement updated successfully" });
  });
};


// ✅ Delete Requirement
const deleteRequirement = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM requirements WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting requirement:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    res.status(200).json({ message: "Requirement deleted successfully" });
  });
};

module.exports = { addRequirement, getRequirements, updateRequirement, deleteRequirement };
