import { useState } from "react"
import NoteContext from "./NotesContext"

const url = "http://localhost:5000"

const NoteState = (props)=>{
    const initialNote = []
    const[notes, setNotes] = useState(initialNote);

    //Fetch all notes
    const fetchNotes = async ()=>{
        //api call
        try {
            const response = await fetch(`${url}/api/notes/fetchAllNotes`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem('token')
                }
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }
            // on the backend, addNote function returns a response which return all the notes
            const result = await response.json();
            console.log(result);
            setNotes(result);
        } catch (error) {
            console.error(error.message);
        }
    }

    //Add a note
    const addNote = async ({title, description, tag})=>{
        console.log("Add note function is running at NotesState.js");

        try {
            const response = await fetch(`${url}/api/notes/addNote`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify({title, description, tag})
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            // on the backend, addNote function returns a response which return all the notes
            const note = await response.json();
            console.log(note);

            //to display added noted on the client side with each 'Add Note' btn click
            setNotes(notes.concat(note))
        } catch (error) {
            console.error(error.message);
        }

        // const note = {
        // "_id": "68a45b3b2358791d7980987793bb1c4b",
        // "user": "68a4337a7fe13b4ba26540bf",
        // "title": title,
        // "description": description,
        // "tag": "personal",
        // "date": "2025-08-19T11:08:43.985Z",
        // "__v": 0
        // }
        //push updates
        // setNotes(notes.push(note))
        //concat returns an array
        // setNotes(notes.concat(note))
    }

    //edit a note
    const editNote = async (id, title, description, tag)=>{
        //API call
        try {
            const response = await fetch(`${url}/api/notes/updateNote/${id}`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify({title, description, tag})
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error.message);
        }
        //logic for client side
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index]
            if(element._id === id){
                newNotes[index]._id = id;
                newNotes[index].title = title
                newNotes[index].description = description
                newNotes[index].tag = tag
                break;
            }
        }
        console.log(newNotes);
        setNotes(newNotes);
        
    }

    //delete a note
    const deleteNote = async (id)=>{
        //api call
        try {
            const response = await fetch(`${url}/api/notes/deleteNote/${id}`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem('token')
                }
            });
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
            console.log("Delete note with id: "+id)
            // check if each item meets given test/condition if true return else don't
            const newNote = notes.filter((note)=>{return note._id != id})
            setNotes(newNote)
        } catch (error) {
            console.error(error.message);
        }
    

    }


    return(
    <NoteContext.Provider value={{notes,fetchNotes, addNote, editNote, deleteNote}}>
        {props.children}
    </NoteContext.Provider>
    )
}

export default NoteState;