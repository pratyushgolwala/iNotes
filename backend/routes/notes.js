const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        console.log("Fetching notes for user:", req.user.id); // Debugging
        const notes = await Note.find({ user: req.user.id });

        if (notes.length === 0) {
            return res.status(404).json({ message: "No notes found" });
        }

        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation Error:", errors.array()); // Debugging
            return res.status(400).json({ errors: errors.array() });
        }

        console.log("Adding note for user:", req.user.id); // Debugging
        const note = new Note({
            title, description, tag, user: req.user.id
        });

        const savedNote = await note.save();
        console.log("Note Saved:", savedNote); // Debugging

        res.json(savedNote);
    } catch (error) {
        console.error("Error adding note:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        console.log(`Updating note: ${req.params.id} for user: ${req.user.id}`); // Debugging

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note Not Found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        console.log("Updated Note:", note); // Debugging
        res.json({ note });
    } catch (error) {
        console.error("Error updating note:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router