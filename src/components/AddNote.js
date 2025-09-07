import React, { useContext, useState } from 'react'
import NoteContext from '../context/notes/NotesContext';


export default function AddNote(props) {
    const context = useContext(NoteContext);
    const {addNote} = context;

    const[note,setNote] = useState({title: '', description: "",tag: ''});

    const handleAddNote = (e)=>{
        //prevent page reload
        e.preventDefault();
        // if input field is not updated then default title, description and tag of the note
        // if input filed is updated then their value will be reflected on title,descrition so note changes from default
        addNote(note)
        props.showAlert("Note added successfully!", "success")
        setNote({title: '', description: "",tag: ''})
    }

    const onChange = (e)=>{
        //it means if there is no value or change in value of the inputs then default values of title and description will be from note state otherwise if input field is changed then the changed value will be reflected on the title and descrption
        setNote({...note,[e.target.name]: e.target.value});
    }

  return (
    <div className='container'>
      <h1>Add your note</h1>
      <form className='my-3'>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name='title' value={note.title} minLength={5} aria-describedby="emailHelp" onChange={onChange} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name='description' value={note.description} minLength={5} onChange={onChange} required/>
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange} required/>
        </div>        
        <button disabled={note.title.length < 5 || note.description.length <5} type="submit" className="btn btn-primary" onClick={handleAddNote}>Add Note</button>
      </form>      
    </div>
  )
}
