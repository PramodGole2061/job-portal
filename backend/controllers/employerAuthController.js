import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employer from '../models/Employer.js';

import { body, validationResult } from 'express-validator';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    let success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let employer = await Employer.findOne({ email: req.body.email });
        if (employer) {
            return res.status(400).json({ success, error: "A company with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        employer = await Employer.create({
            email: req.body.email,
            password: hashedPassword,
            companyName: req.body.companyName,
            primaryPhone: req.body.primaryPhone,
            industry: req.body.industry,
            city: req.body.city,
            location: req.body.location,
            contactPersonName: req.body.contactPersonName,
            contactPersonMobile: req.body.contactPersonMobile,
            contactPersonEmail: req.body.contactPersonEmail,
            role: 'employer'
        });

        const data = {
            user: {
                id: employer.id,
                role: 'employer'
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        success = true;
        
        res.json({ success, token, role: 'employer' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
}

export const login = async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(400).json({ success, error: "Invalid login credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, employer.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Invalid login credentials" });
        }

        const data = {
            user: {
                id: employer.id,
                role: 'employer'
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, token, role: 'employer' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
}

export const getuser = async (req, res) => {
    try {
        const employer = await Employer.findById(req.user.id).select("-password");
        res.json({ success: true, user: employer });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const updateUser =  async (req, res) => {
    console.log("PUT /employer/update hit for user:", req.user.id);
    
    const { 
        companyName, email, primaryPhone, industry, city, location, 
        contactPersonName, contactPersonMobile, contactPersonEmail 
    } = req.body;

    try {
        const newEmployer = {};
        if (companyName) newEmployer.companyName = companyName;
        if (primaryPhone) newEmployer.primaryPhone = primaryPhone;
        if (industry) newEmployer.industry = industry;
        if (city) newEmployer.city = city;
        if (location) newEmployer.location = location;
        if (contactPersonName) newEmployer.contactPersonName = contactPersonName;
        if (contactPersonMobile) newEmployer.contactPersonMobile = contactPersonMobile;
        if (contactPersonEmail) newEmployer.contactPersonEmail = contactPersonEmail;

        if (email) {
            let existingEmployer = await Employer.findOne({ email });
            if (existingEmployer && existingEmployer._id.toString() !== req.user.id) {
                return res.status(400).json({ success: false, error: "Email is already taken by another company" });
            }
            newEmployer.email = email;
        }

        let employer = await Employer.findById(req.user.id);
        if (!employer) return res.status(404).json({ success: false, error: "Company not found" });

        employer = await Employer.findByIdAndUpdate(req.user.id, { $set: newEmployer }, { new: true }).select("-password");
        res.json({ success: true, employer });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

export const deleteUser = async (req, res) => {
    try {
        let employer = await Employer.findById(req.user.id);
        if (!employer) return res.status(404).json({ success: false, error: "Company not found" });

        await Employer.findByIdAndDelete(req.user.id);
        res.json({ success: true, message: "Company account deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}

