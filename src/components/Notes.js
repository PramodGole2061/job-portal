import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../context/notes/NotesContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';


export default function Notes(props) {
    const navigate = useNavigate();
    const context = useContext(NoteContext);
    //desctructuring so that value of context will be inside note and setNote
    const{notes, fetchNotes, editNote} = context;
    const[note,setNote] = useState({id: "",etitle: "",edescription: "",etag: ""})

    useEffect(()=>{
      fetchNotes()
    },[])

    //using useRef hook
    const editButtonRef = useRef();
    const closeRef = useRef();

    const updateNote = (currentNote)=>{
      editButtonRef.current.click();
      setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
      
    }

    const onChange=(e)=>{
      setNote({...note,[e.target.name]: e.target.value});
    }

    const handleClick = (e)=>{
      e.preventDefault();
      //don't use + because it will always show [object: object] for note because it is being concatinated to a string
      console.log("Updating note: ",note)
      editNote(note.id, note.etitle, note.edescription, note.etag)
      props.showAlert("Note updated successfully!", "success")
      closeRef.current.click();
    }
  return (
    <>
    <AddNote showAlert = {props.showAlert}/>
    {/* Button trigger modal */}
    {/* d-none means display: none in the styles. i.e. don't display */}
    <button ref={editButtonRef} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>

    {/* Modal  */}
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
              <form className='my-3'>
              <div className="mb-3">
                <label htmlFor="etitle" className="form-label">Title</label>
                <input type="text" className="form-control" id="etitle" name='etitle' required minLength={5} value={note.etitle} aria-describedby="emailHelp" onChange={onChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="edescription" className="form-label">Description</label>
                <input type="text" className="form-control" id="edescription" name='edescription' required minLength={5} value={note.edescription} onChange={onChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="etag" className="form-label">Tag</label>
                <input type="text" className="form-control" id="etag" name='etag' required value={note.etag} onChange={onChange}/>
              </div>        
            </form>
          </div>
          <div className="modal-footer">
            <button ref={closeRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button disabled={note.etitle.length<6 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
          </div>
        </div>
      </div>
    </div>    
    <div className='container-fluid my-3'>
      <h1>Your notes</h1>
      <div className='container my-2'>
        {notes.length === 0 && "No notes to display."}
      </div>
      <div className='row container-fluid'>
        {notes.map((note)=>{
          return <NoteItem key={note._id} ref={editButtonRef} updateNote = {updateNote} note={note} showAlert = {props.showAlert}/>
        })}
      </div>      
    </div>
    </>
  )
}
