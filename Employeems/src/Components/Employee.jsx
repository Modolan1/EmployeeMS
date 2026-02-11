import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export const Employee = () => {
      const [employee, setEmployee] = useState([])
      useEffect(()=>{
      axios.get('http://localhost:3000/auth/employee')
      .then(result => {
        if (result.data.Status){ 
          setEmployee(result.data.result);
          console.log(result.data.result);
        } else{
          alert('Failed to load employees: ' + result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error fetching employees:', err);
        alert('Unable to connect to server. Please check if the server is running.');
      })
      },[])
  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'> 
            <h3>Employee list</h3>
        </div>
        <Link to="/dashboard/add_employee" className='btn btn-success'>
        Add Employee
        
        </Link>
        <div className='mt-3'>
          <table className='table table-striped mt-3 px-5'>
      <thead>
        <tr>
          <th>Name</th>
          <th>image</th>
          <th>Email</th>
          <th>Address</th>
          <th>Salary</th>
          <th>Action</th>         
          
          {/* <th>Category Name</th>
          <th>Actions</th> */}
        </tr>
        </thead>
        <tbody>
          {
          employee.map(e => (
          <tr key={e.id}>
            
            <td>{e.name}</td>
            <td><img src={'http://localhost:3000/Images/'+e.image} className='employee_image' alt='employee image' /></td>
            <td>{e.email}</td>
            <td>{e.Address}</td>
            <td>{e.Salary}</td>
            <td> 
              <Link to={`/dashboard/edit_employee/${e.id}`} className='btn btn-primary btn-sm me-2'>Edit</Link>
              <button className='btn btn-primary btn-sm me-2'>Delete</button>
            </td>
            



            {/* <td>
              <button className='btn btn-primary btn-sm me-2'>Edit</button>
              </td> */}
          </tr>
          ))
        }
          </tbody>
    </table>
    </div>

    </div>
          
  )
}
export default Employee