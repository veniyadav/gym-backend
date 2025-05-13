const express = require('express');
const { addGymTask, getAllGymTask, getGymTaskById } = require('../controller/taskGym');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');



const router = express.Router();

router.post('/addGymTask', addGymTask);
router.get('/getAllGymTask', getAllGymTask);
router.get('/getGymTaskById/:id', getGymTaskById);
// router.patch('/updateMember/:id', updateMember);
// router.delete('/deleteMember/:id', deleteMember);



module.exports = router;    
