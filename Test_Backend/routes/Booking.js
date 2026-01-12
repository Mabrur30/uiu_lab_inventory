const express = require("express");
const pool = require("../database_config/db");

const route = express.Router();



route.post("/", async (req, res) => {
  try {
    const {
      user_id,
      components_id,
      quantity,
      status,
      reason,
      requested_date,
      expected_return_date,
      is_overdue,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO booking
       (user_id, components_id, quantity, status, reason,
        requested_date, expected_return_date, is_overdue)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        components_id,
        quantity,
        status,
        reason,
        requested_date,
        expected_return_date,
        is_overdue ?? 0,
      ]
    );

    res.status(201).json({
      booking_id: result.insertId,
      message: "booking successful",
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Error creating booking" });
  }
});


route.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM booking");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Error fetching bookings" });
  }
});


route.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM booking WHERE booking_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Error fetching booking" });
  }
});

route.put("/:id", async (req, res) => {
  try {
    const {
      user_id,
      components_id,
      quantity,
      status,
      reason,
      requested_date,
      expected_return_date,
      is_overdue,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE booking
       SET user_id = ?,
           components_id = ?,
           quantity = ?,
           status = ?,
           reason = ?,
           requested_date = ?,
           expected_return_date = ?,
           is_overdue = ?
       WHERE booking_id = ?`,
      [
        user_id,
        components_id,
        quantity,
        status,
        reason,
        requested_date,
        expected_return_date,
        is_overdue,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "booking updated" });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Error updating booking" });
  }
});


route.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM booking WHERE booking_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "booking deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Error deleting booking" });
  }
});



module.exports = route;

