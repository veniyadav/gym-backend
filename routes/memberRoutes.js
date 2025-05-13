const express = require('express');
const { addMember, getAllMembers, getMemberById, updateMember, deleteMember } = require('../controller/member');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');



const router = express.Router();

router.post('/addMember', addMember);
router.get('/getAllMembers', getAllMembers);
router.get('/getMemberById/:id', getMemberById);
router.patch('/updateMember/:id', updateMember);
router.delete('/deleteMember/:id', deleteMember);



module.exports = router;    
