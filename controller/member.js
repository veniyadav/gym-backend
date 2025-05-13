const db = require('../config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const addMember = async (req, res) => {
    try {
        const {
            firstName, lastName, dateOfBirth, gender, keyFob, tags, note,
            club, golfSimulator, trainer, joiningDate, salesRepresentative,
            sourcePromotion, referredBy, occupation, organization, involvementType,
            email, cell, workPhone, streetAddress, city, state, zipCode,
            emergencyName, emergencyRelationship, emergencyCell, emergencyEmail,
            medicalInformation
        } = req.body;

        let imageUrl = '';

        if (req.files?.image) {
            try {
                const result = await cloudinary.uploader.upload(
                    req.files.image.tempFilePath,
                    { folder: "member_images" }
                );
                imageUrl = result.secure_url;
            } catch (uploadErr) {
                console.error("Image upload error:", uploadErr);
                return res.status(500).json({ status: "false", message: "Image upload failed." });
            }
        }

        const [insertResult] = await db.query(`
            INSERT INTO member (
                firstName, lastName, dateOfBirth, gender, keyFob, tags, note,
                club, golfSimulator, trainer, joiningDate, salesRepresentative,
                sourcePromotion, referredBy, occupation, organization, involvementType,
                email, cell, workPhone, streetAddress, city, state, zipCode,
                emergencyName, emergencyRelationship, emergencyCell, emergencyEmail,
                medicalInformation, image
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            firstName, lastName, dateOfBirth, gender, keyFob, tags, note,
            club, golfSimulator, trainer, joiningDate, salesRepresentative,
            sourcePromotion, referredBy, occupation, organization, involvementType,
            email, cell, workPhone, streetAddress, city, state, zipCode,
            emergencyName, emergencyRelationship, emergencyCell, emergencyEmail,
            medicalInformation, imageUrl
        ]);

        const memberId = insertResult.insertId;

        const [memberRows] = await db.query(`SELECT * FROM member WHERE id = ?`, [memberId]);

        const memberData = {
            ...memberRows[0],
            image: memberRows[0].image ? [memberRows[0].image] : []
        };

        res.status(201).json({
            status: "true",
            message: "Member added successfully",
            member: memberData
        });

    } catch (error) {
        console.error("Add Member Error:", error);
        res.status(500).json({ status: "false", message: "Server error", error: error.message });
    }
};


const getAllMembers = async (req, res) => {
    try {
        const [members] = await db.query("SELECT * FROM member");

        if (members.length === 0) {
            return res.status(404).json({ status: "false", message: "No members found" });
        }

        // Format the image as an array
        const formattedMembers = members.map(member => ({
            ...member,
            image: member.image ? [member.image] : []
        }));

        res.status(200).json({
            status: "true",
            message: "Members fetched successfully",
            members: formattedMembers
        });

    } catch (error) {
        console.error("Get All Members Error:", error);
        res.status(500).json({ status: "false", message: "Server error", error: error.message });
    }
};


const getMemberById = async (req, res) => {
    const { id } = req.params;

    try {
        const [memberRows] = await db.query("SELECT * FROM member WHERE id = ?", [id]);

        if (memberRows.length === 0) {
            return res.status(404).json({ status: "false", message: "Member not found" });
        }

        const member = memberRows[0];
        // Format the image as an array
        member.image = member.image ? [member.image] : [];

        res.status(200).json({
            status: "true",
            message: "Member fetched successfully",
            member
        });

    } catch (error) {
        console.error("Get Member By ID Error:", error);
        res.status(500).json({ status: "false", message: "Server error", error: error.message });
    }
};


const updateMember = async (req, res) => {
    const { id } = req.params;
    const {
        firstName, lastName, dateOfBirth, gender, keyFob, tags, note,
        club, golfSimulator, trainer, joiningDate, salesRepresentative,
        sourcePromotion, referredBy, occupation, organization, involvementType,
        email, cell, workPhone, streetAddress, city, state, zipCode,
        emergencyName, emergencyRelationship, emergencyCell, emergencyEmail,
        medicalInformation
    } = req.body;

    let imageUrl = '';

    if (req.files?.image) {
        try {
            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                { folder: "member_images" }
            );
            imageUrl = result.secure_url;
        } catch (uploadErr) {
            console.error("Image upload error:", uploadErr);
            return res.status(500).json({ status: "false", message: "Image upload failed." });
        }
    }

    try {
        const [updateResult] = await db.query(`
            UPDATE member SET
                firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, keyFob = ?, tags = ?, note = ?,
                club = ?, golfSimulator = ?, trainer = ?, joiningDate = ?, salesRepresentative = ?, sourcePromotion = ?,
                referredBy = ?, occupation = ?, organization = ?, involvementType = ?, email = ?, cell = ?, workPhone = ?,
                streetAddress = ?, city = ?, state = ?, zipCode = ?, emergencyName = ?, emergencyRelationship = ?, emergencyCell = ?,
                emergencyEmail = ?, medicalInformation = ?, image = ?
            WHERE id = ?
        `, [
            firstName, lastName, dateOfBirth, gender, keyFob, tags, note,
            club, golfSimulator, trainer, joiningDate, salesRepresentative,
            sourcePromotion, referredBy, occupation, organization, involvementType,
            email, cell, workPhone, streetAddress, city, state, zipCode,
            emergencyName, emergencyRelationship, emergencyCell, emergencyEmail,
            medicalInformation, imageUrl, id
        ]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ status: "false", message: "Member not found or no changes made" });
        }

        const [updatedMemberRows] = await db.query("SELECT * FROM member WHERE id = ?", [id]);
        const updatedMember = updatedMemberRows[0];
        updatedMember.image = updatedMember.image ? [updatedMember.image] : [];

        res.status(200).json({
            status: "true",
            message: "Member updated successfully",
            member: updatedMember
        });

    } catch (error) {
        console.error("Update Member Error:", error);
        res.status(500).json({ status: "false", message: "Server error", error: error.message });
    }
};


const deleteMember = async (req, res) => {
    const { id } = req.params;

    try {
        const [deleteResult] = await db.query("DELETE FROM member WHERE id = ?", [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ status: "false", message: "Member not found" });
        }

        res.status(200).json({
            status: "true",
            message: "Member deleted successfully"
        });

    } catch (error) {
        console.error("Delete Member Error:", error);
        res.status(500).json({ status: "false", message: "Server error", error: error.message });
    }
};



module.exports = { addMember, getAllMembers, getMemberById, updateMember, deleteMember };