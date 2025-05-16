const jwt = require("jsonwebtoken");
const db = require("../models/db");


const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      skills,
      experience,
      dob,
      address,
      education,
      resume,
      user_id,
      password,
      role  // Make sure role is destructured from req.body
    } = req.body;

    if (!name || !email || !user_id || !password || !role) {
      return res.status(400).json({
        message: "Name, email, user_id, password, and role are required",
      });
    }

    // Check if email/user_id already exists in candidates or recruiters
    const checkQuery = `
      SELECT user_id FROM candidates WHERE email = ? OR user_id = ?
      UNION
      SELECT user_id FROM recruiters WHERE user_id = ?;
    `;

    db.query(checkQuery, [email, user_id, user_id], async (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email or user_id already exists" });
      }

      if (role === "candidate") {
        const insertCandidateQuery = `
          INSERT INTO candidates 
          (name, email, phone, skills, experience, dob, address, education, resume, user_id, password)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const values = [
          name,
          email,
          phone || null,
          skills || null,
          experience || null,
          dob || null,
          address || null,
          education || null,
          resume || null,
          user_id,
          password
        ];

        db.query(insertCandidateQuery, values, async (err) => {
          if (err) {
            console.error("❌ Error inserting candidate:", err);
            return res.status(500).json({ error: "Database insertion error" });
          }

          // Send registration email
          const emailService = require('../services/emailService');
          const emailSent = await emailService.sendRegistrationEmail(email, name);

          console.log("✅ Candidate registered successfully with full info");
          return res.status(201).json({ 
            message: "Candidate registered successfully",
            emailSent: emailSent
          });
        });
      } else if (role === "recruiter") {
        const insertRecruiterQuery = `
          INSERT INTO recruiters (name, user_id, password)
    VALUES (?, ?,  ?);
        `;

        db.query(insertRecruiterQuery, [name, user_id, password], async (err) => {
          if (err) {
            console.error("❌ Error inserting recruiter:", err);
            return res.status(500).json({ error: "Database insertion error" });
          }

          // Send registration email
          const emailService = require('../services/emailService');
          const emailSent = await emailService.sendRegistrationEmail(email, name);

          console.log("✅ Recruiter registered successfully");
          return res.status(201).json({ 
            message: "Recruiter registered successfully",
            emailSent: emailSent
          });
        });
      } else {
        return res.status(400).json({ error: "Invalid role" });
      }
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





const loginUser = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res
        .status(400)
        .json({ message: "user_id and password are required" });
    }

    const checkUserQuery = `
  SELECT user_id AS id, user_id AS user_id, password, 'candidate' AS role 
  FROM candidates 
  WHERE user_id = ?
  UNION
  SELECT id, user_id AS user_id, password, 'recruiter' AS role
  FROM recruiters 
  WHERE user_id = ?;
`;


    db.query(checkUserQuery, [user_id, user_id], (err, results) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      console.log("🔍 Login query result:", results);

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // 🔐 Match password (plaintext for now; recommend bcrypt for real-world use)
      if (password !== user.password) {
        console.log("❌ Password mismatch");
        return res
          .status(401)
          .json({ message: "Invalid email or password" });
      }

      // 🪙 Generate token
      const token = jwt.sign(
        { id: user.id, user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "24h" }  // Increased token expiration to 24 hours
      );

      console.log(`✅ ${user.role} logged in:`, user.user_id);

      res.status(200).json({
        message: "Login successful",
        token,
        role: user.role,
        userId: user.id
      });
    });
  } catch (error) {
    console.error("❌ Server Error:", error);  // Fixed console.log to console.error
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { registerUser, loginUser };



