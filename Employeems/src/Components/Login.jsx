import React, { use } from 'react'
import './styles.css'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    }) 
    const [error, setError] = useState(null)
    
    const navigate = useNavigate()
    axios.defaults.withCredentials = true; // for cookies generation

    const handleSubmit =(event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result =>{
    
                navigate('/dashboard')
                console.log(result);
            
        })

        .catch(err => console.log(err))
    }


  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
       <div className='p-3 rounded w-25 border loginForm'>
        { <div className='text-warning'>
            {error && error}
        </div> }
        <h2>Login page</h2>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor='email'>Email:</label>
                <input type="email" name='email' autoComplete='off' placeholder='Enter your mail' onChange={(e) =>setValues({...values, email : e.target.value})} className='form-control rounded-0' />

            </div>
            <div className='mb-3'>
                <label htmlFor='password'>Password:</label>
                <input type="password" name='password' autoComplete='off' placeholder='Enter your password' onChange={(e) =>setValues({...values, password : e.target.value})} className='form-control rounded-0' />
            </div>
            <button className='btn-btn-success w-100 rounded-0 mb-2'>Log in</button>
            <div className='mb-1'>
                <input type="checkbox" name='tick' id ="tickmark" className ='me-2' autoComplete='off'  />
                 <label htmlFor='password'>Agree to our terms and conditions:</label>
            </div>
        </form>
       </div>
    </div>
  )
}

export default Login
