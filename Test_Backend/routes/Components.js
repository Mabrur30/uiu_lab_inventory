const express=require("express");
const pool=require("../database_config/db");

const route=express.Router();


route.post("/",async(req,res)=>{
    try{
       const {
      component_name,
      component_code,
      category,
      description,
      status,
      total_quantity,
      available_quantity,
      damaged_quantity,
      under_maintenance_quantity
    } = req.body;

    const [rows]= await pool.query(
        `INSERT INTO components
       (component_name, component_code, category, description, status,
        total_quantity, available_quantity, damaged_quantity, under_maintenance_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        component_name,
        component_code,
        category,
        description,
        status,
        total_quantity,
        available_quantity,
        damaged_quantity,
        under_maintenance_quantity
      ]

    );
    res.status(201).json({component_id:rows.insertId, message:"component add successful"});

    }catch(err){
        console.log(err);
        res.status(404).json({error:"Error creating component"});

    }

});

route.get("/",async(req,res)=>{{
    try{
        const [rows]=await pool.query("SELECT * FROM components");

        res.status(200).json(rows);
    }catch(err){
        console.log(err);
        res.status(404).json({error:"Error fetching components"});
    }
}});



route.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM components WHERE components_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Component not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching component:", err);
    res.status(500).json({ error: "Error fetching component" });
  }
});



route.put("/:id", async (req, res) => {
  try {
    const {
      component_name,
      component_code,
      category,
      description,
      status,
      total_quantity,
      available_quantity,
      damaged_quantity,
      under_maintenance_quantity
    } = req.body;

    const [result] = await pool.query(
      `UPDATE components
       SET component_name = ?,
           component_code = ?,
           category = ?,
           description = ?,
           status = ?,
           total_quantity = ?,
           available_quantity = ?,
           damaged_quantity = ?,
           under_maintenance_quantity = ?
       WHERE components_id = ?`,
      [
        component_name,
        component_code,
        category,
        description,
        status,
        total_quantity,
        available_quantity,
        damaged_quantity,
        under_maintenance_quantity,
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Component not found" });
    }

    res.json({ message: "component updated" });
  } catch (err) {
    console.error("Error updating component:", err);
    res.status(500).json({ error: "Error updating component" });
  }
});


route.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM components WHERE components_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Component not found" });
    }

    res.json({ message: "component deleted" });
  } catch (err) {
    console.error("Error deleting component:", err);
    res.status(500).json({ error: "Error deleting component" });
  }
});

module.exports=route;