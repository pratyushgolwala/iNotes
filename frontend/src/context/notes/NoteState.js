import NoteContext from "./noteContext";
import { useState } from "react";




const NoteState = (props) => {
  const host = process.env.REACT_APP_API_URL
  const token = process.env.REACT_APP_AUTH_TOKEN; // Load token from .env

  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all Notes
  const getNotes = async () => {
    if (!token) {
      console.error("Auth token is missing. Check your .env file.");
      return;
    }

    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Use token from .env
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notes");

      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Auth token is missing. Check your .env file.");
      return;
    }

    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Use token from .env
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (!response.ok) throw new Error("Failed to add note");

      const note = await response.json();
      setNotes([...notes, note]); // Append new note
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    if (!token) {
      console.error("Auth token is missing. Check your .env file.");
      return;
    }

    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Use token from .env
        },
      });

      if (!response.ok) throw new Error("Failed to delete note");

      setNotes(notes.filter((note) => note._id !== id)); // Remove from state
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    if (!token) {
      console.error("Auth token is missing. Check your .env file.");
      return;
    }

    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Use token from .env
        },
        body: JSON.stringify({ title, description, tag }),
      });

      if (!response.ok) throw new Error("Failed to update note");

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, title, description, tag } : note
        )
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
