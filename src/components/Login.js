import React, { useState } from 'react'
import { useNavigate } from "react-router";

export default function Login(props) {
  const[userCredentials, setUserCredentials] = useState({email: "",password: ""})
  const history = useNavigate();
  const handleChannge=(e)=>{
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value})
  }

  const handleSubmit= async (e)=>{
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: userCredentials.email, password: userCredentials.password})
        });
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Response From server: ",result);
        // succes is defined on auth.js to indicate success or failure of login credentials
        if(result.success){
          // Save the token and redirect
          localStorage.setItem("token",result.token)
          history("/home")
          props.showAlert("Logged in successfully!", "success")
        }else{
          props.showAlert("Invalid credentials!", "danger")
        }
    } catch (error) {
        console.error(error.message);
    }    
  }
  return (
    <div style={{marginTop: '30px'}} className='container'>
      <h1 className='my-3'>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name='email' onChange={handleChannge} value={userCredentials.email} aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' onChange={handleChannge} value={userCredentials.password}/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
