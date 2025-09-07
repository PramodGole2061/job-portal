import React, { useContext,useRef } from 'react'
import NoteContext  from '../context/notes/NotesContext';


export default function NoteItem(props) {
    const context = useContext(NoteContext);
    const{deleteNote} = context;
    const {note,updateNote} = props;

  return (
      <div className="col-md-3 card my-3 mx-2">
          <div className="card-body">
              <h5 className="card-title">{note.title}</h5>
              <p className="card-text">{note.description}</p>
              <i className="material-icons" onClick={()=>{deleteNote(note._id); props.showAlert("Note deleted successfully!", "success")}}>&#xe92b;</i>
              <i className="material-icons mx-3" onClick={()=>{updateNote(note);}}>&#xe3c9;</i>
          </div>
      </div>      
  )
}
