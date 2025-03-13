import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';

const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;

  const [note, setNote] = useState({ id: '', etitle: '', edescription: '', etag: '' });
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const ref = useRef(null);
  const refClose = useRef(null);

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        await getNotes();
        setLoading(false); // Set loading to false after fetching notes
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to fetch notes. Please try again later.'); // Set error message
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchNotes();
    // eslint-disable-next-line
  }, []);

  // Function to update a note
  const updateNote = (currentNote) => {
    ref.current.click(); // Open the modal
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  // Function to handle the update button click
  const handleClick = (e) => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click(); // Close the modal
  };

  // Function to handle input changes in the modal form
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote />

      {/* Modal for editing notes */}
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                disabled={note.etitle.length < 5 || note.edescription.length < 5}
                onClick={handleClick}
                type="button"
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display notes */}
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container mx-2">
          {loading && <p>Loading notes...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && !error && notes.length === 0 && <p>No notes to display</p>}
        </div>
        {!loading &&
          !error &&
          Array.isArray(notes) &&
          notes.map((note) => (
            <Noteitem key={note._id} updateNote={updateNote} note={note} />
          ))}
      </div>
    </>
  );
};

export default Notes;