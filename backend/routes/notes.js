const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// Route: 1  Get all the notes of a User using: GET "api/auth/fetchAllNotes". Login required
router.get('/fetchAllNotes',fetchUser,async (req, res)=>{
   try {
        const notes = await Notes.find({user: req.user.id})
        res.json(notes);
   } catch (error) {
        return res.status(500).json({"Internal server error": error.message});
   } 
})

// Route: 2  Add notes of a User using: POST "api/auth/addNote". Login required
router.post('/addNote',fetchUser,[body('title','Enter valid title').isLength({min: 3}),body('description','Description must at least 5 characters long').isLength({min: 5})], async (req, res)=>{
    try {
        // if there are errors, return bad request and return errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //destructuring 
        const{title, description, tag} = req.body;

        //creating new note
        const note = new Notes({title,description,tag,user: req.user.id});
        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        return res.status(500).json({"Internal server error": error.message});
    }
})

// Route: 3  Update notes of a User using: PUT "api/auth/updateNote". Login required
router.put('/updateNote/:id',fetchUser, async (req, res)=>{
    try {
        //destructuring 
        const{title, description, tag} = req.body; //req.body is the json object input from user
        //updated note object
        const newNote = {}
        if(title){
            newNote.title = title
        }
        if(description){
            newNote.description = description
        }
        if(tag){
            newNote.tag = tag
        }

        // find the note to be updated and update it
        let note = await Notes.findById(req.params.id); // req.params.id is the id from the url
        if(!note){
            return res.status(404).send("Note not found.");
        }

        // note.user.toString() is user's id of the user who created the note
        //req.user.id is the id of the user who logged in and wants to update
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not authorized.");
        }

        note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote},{new: true})
        return res.json(note);        
    } catch (error) {
        return res.status(500).json({"Internal server error": error.message});
    }

    
})


// Route: 4  Delete note of a User using: DELETE "api/auth/deleteNote". Login required
router.delete('/deleteNote/:id',fetchUser, async (req, res)=>{
    try {
        // find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id); // req.params.id is the id from the url i.e. notes id
        if(!note){
            return res.status(404).send("Note not found.");
        }

        // note.user.toString() is user's id of the user who created the note
        //req.user.id is the id of the user who logged in and wants to update
        if(note.user.toString() != req.user.id){
            return res.status(401).send("Not authorized.");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        return res.json(note);        
    } catch (error) {
        return res.status(500).json({"Internal server error": error.message});
    }
})

module.exports = router;