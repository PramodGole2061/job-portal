import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Candidate from '../models/Candidate.js';

import { body, validationResult } from 'express-validator';

export const register = async (req, res) =>{
    console.log("Register request received for:", req.body.email)
    let success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let candidate = await Candidate.findOne({ email: req.body.email });
        if (candidate) {
            return res.status(400).json({ success, error: "A user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        candidate = await Candidate.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            contactNumber: req.body.contactNumber,
            jobPreference: req.body.jobPreference,
            role: 'candidate'
        });

        // JWT token
        const data = {
            user: {
                id: candidate.id,
                role: 'candidate'
            }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        
        res.json({ success, token, role: 'candidate' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }    
}

export const login = async(req, res)=>{
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).json({ success, error: "Invalid login credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, candidate.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Invalid login credentials" });
        }

        //Token
        const data = {
            user: {
                id: candidate.id,
                role: 'candidate'
            }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, token, role: 'candidate' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }    
}

export const getcandidates = async (req, res) => {
    try {
        // req.user.id comes from the verifyUser middleware
        const candidate = await Candidate.findById(req.user.id).select("-password");
        res.json({ success: true, user: candidate });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const updateCandidate = async (req, res) => {
    if(req.params.userId !== req.user.id){
        return res.status(401).json("You are not authorized to update the user!");
    }
    const { firstName, lastName, email, password, contactNumber, jobPreference } = req.body;
    try {
        const newCandidate = {};
        if (firstName) newCandidate.firstName = firstName;
        if (lastName) newCandidate.lastName = lastName;
        if(password) newCandidate.password = password;
        if (contactNumber) newCandidate.contactNumber = contactNumber;
        if (jobPreference) newCandidate.jobPreference = jobPreference;

        if (email) {
            let existingUser = await Candidate.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.user.id) {
                return res.status(400).json({ success: false, error: "Email is already in use by another account" });
            }
            newCandidate.email = email;
        }

        let candidate = await Candidate.findById(req.user.id);
        if (!candidate) return res.status(404).json({ success: false, error: "User not found" });

        candidate = await Candidate.findByIdAndUpdate(req.user.id, { $set: newCandidate }, { new: true }).select("-password");
        res.json({ success: true, candidate });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteCandidate = async (req, res) => {
    if(req.params.userId !== req.user.id){
        return res.status(401).json("You are not authorized to delete the user!");
    }
    try {
        let candidate = await Candidate.findById(req.user.id);
        if (!candidate) return res.status(404).json({ success: false, error: "User not found" });

        await Candidate.findByIdAndDelete(req.user.id);
        res.json({ success: true, message: "Candidate account has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}