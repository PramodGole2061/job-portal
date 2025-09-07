import React, { useState } from 'react'
import { useNavigate } from "react-router";

export default function SignUp(props) {
  const [registerCredentials, setRegisterCredentials] = useState({name: '',email: '',password: ''})
  let navigate = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:5000/api/auth/createUser",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: registerCredentials.name, email: registerCredentials.email, password: registerCredentials.password})
        });
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Response From server: ",result);
        // succes is defined on auth.js to indicate success or failure of login credentials
        if(result.success){
          // Save the token and redirect
          localStorage.setItem("token", result.token);
          navigate("/home")
          props.showAlert("Account created successfully!", "success")
        }else{
          props.showAlert("Invalid credentials!", "danger")
        }
    } catch (error) {
        console.error(error.message);
    }    
  }

  const handleChange=(e)=>{
    setRegisterCredentials({...registerCredentials,[e.target.name]: e.target.value})
  }

  return (
    <div style={{marginTop: '30px'}} className='container'>
      <h1 className='my-3'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' value={registerCredentials.name} aria-describedby="emailHelp" onChange={handleChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name='email' value={registerCredentials.email} aria-describedby="emailHelp" onChange={handleChange}/>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' value={registerCredentials.password} onChange={handleChange}/>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  )
}
