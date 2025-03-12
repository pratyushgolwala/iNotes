const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        console.log("Fetching notes for user:", req.user.id); // Debugging
        const notes = await Note.find({ user: req.user.id });

        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: "No notes found" });
        }

        res.json({ success: true, message: "Notes fetched successfully", data: notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
    body('tag', 'Tag must be at least 3 characters').optional().isLength({ min: 3 }) // Optional validation for tag
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation Error:", errors.array()); // Debugging
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        console.log("Adding note for user:", req.user.id); // Debugging
        const note = new Note({
            title, description, tag: tag || "General", user: req.user.id
        });

        const savedNote = await note.save();
        console.log("Note Saved:", savedNote); // Debugging

        res.json({ success: true, message: "Note added successfully", data: savedNote });
    } catch (error) {
        console.error("Error adding note:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        console.log(`Updating note: ${req.params.id} for user: ${req.user.id}`); // Debugging

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note Not Found" });
        }

        // Check if the note belongs to the user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not Allowed" });
        }

        // Create a new note object with updated fields
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Update the note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        console.log("Updated Note:", note); // Debugging
        res.json({ success: true, message: "Note updated successfully", data: note });
    } catch (error) {
        console.error("Error updating note:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note Not Found" });
        }

        // Check if the note belongs to the user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not Allowed" });
        }

        // Delete the note
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Note deleted successfully", data: note });
    } catch (error) {
        console.error("Error deleting note:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;