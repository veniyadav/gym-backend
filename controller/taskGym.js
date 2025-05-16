const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');

const addGymTask = async (req, res) => {
    const {
      memberId,
      dueDate,
      taskTypeId,
      description,
      instruction,
      prospectStage,
      userId
    } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO taskgym 
          (memberId, dueDate, taskTypeId, description, instruction, prospectStage, userId)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          memberId,
          dueDate,
          taskTypeId,
          description,
          instruction,
          prospectStage,
          userId
        ]
      );

      const [insertedGymTask] = await db.query(
        `SELECT * FROM taskgym WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Task added successfully",
        task: insertedGymTask[0]
      });
  
    } catch (error) {
      console.error("Add Task Error:", error);
      res.status(500).json({ status: false, message: "Failed to add task" });
    }
  };


 const getAllGymTask = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.*,
        m.firstName AS memberFirstName,
        m.lastName AS memberLastName,
        tt.name AS taskTypeName,
        CONCAT(u.firstName, ' ', u.lastName) AS staffFullName
      FROM taskgym t
      LEFT JOIN member m ON t.memberId = m.id
      LEFT JOIN taskType tt ON t.taskTypeId = tt.id
      LEFT JOIN user u ON t.staffId = u.id
    `);
    res.status(200).json({ status: true, message: "retrieved all data", taskgym: rows });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};



  const getGymTaskById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await db.query(`SELECT * FROM taskgym WHERE id = ?`, [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ status: false, message: "Task not found" });
      }
  
      res.status(200).json({
        status: true,
        message: "Task retrieved successfully",
        task: rows[0],
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  




  


module.exports = { addGymTask, getAllGymTask, getGymTaskById };
