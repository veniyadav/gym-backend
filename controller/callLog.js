const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
//const cloudinary = require('cloudinary').v2;


const addCallLog = async (req, res) => {
    const { date, subject, description, caller, answered } = req.body;
  
      
    try {
      const [result] = await db.query(
        `INSERT INTO calllog (date, subject, description, caller, answered)
         VALUES (?, ?, ?, ?, ?)`,
        [date, subject, description, caller, answered]
      );
  
      const [newLog] = await db.query(
        `SELECT * FROM calllog WHERE id = ?`,
        [result.insertId]
      );
  
      res.status(201).json({
        status: true,
        message: "Call log added successfully",
        callLog: newLog[0]
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };



  const getAllCallLogs = async (req, res) => {
    try {
      const [logs] = await db.query(`SELECT * FROM calllog`);
      res.status(200).json({ status: true, callLogs: logs });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
  
  

module.exports = { addCallLog, getAllCallLogs  };
