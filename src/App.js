import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NoteState from './context/notes/NotesState';
import Alert from './components/Alert';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const[alert, setAlert]= useState(null)
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(()=>{
      setAlert(null);
    }, 2000)
  }
  return (
    <>
    {/* inside NoteState we can user the states anywhere including descendent components */}
    <NoteState>
    <HashRouter>
      <Navbar showAlert = {showAlert}/>
      <Alert alert = {alert} />
      <div className="container">
        <Routes>
          <Route exact path="/home" element={<ProtectedRoute><Home showAlert = {showAlert} /></ProtectedRoute>} />
          <Route exact path="/about" element={<About/>} />
          <Route exact path="/SignUp" element={<SignUp showAlert={showAlert} />} />
          <Route exact path="/Login" element={<Login showAlert={showAlert}/>} />
        </Routes>
      </div>
    </HashRouter>
    </NoteState>
    </>
  );
}

export default App;
