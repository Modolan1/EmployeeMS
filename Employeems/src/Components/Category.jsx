import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

export const Category = () => {
  const [category, setCategory] = React.useState([]);

  useEffect(() => {
   axios.get('http://localhost:3000/auth/category')
    .then(result => {
      if (result.data.Status){ 
        setCategory(result.data.result);
        console.log(result.data.result);
      } else{
        alert('Failed to load categories: ' + result.data.Error);
      }
    })
    .catch(err => {
      console.error('Error fetching categories:', err);
      alert('Unable to connect to server. Please check if the server is running.');
    })
  }, []);
  
  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'> 
            <h3>Category list</h3>
        </div>
        <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
        <div className='mt-3'>
          <table className='table table-striped mt-3 px-5'>
      <thead>
        <tr>
          <th>Name</th>
          {/* <th>Category Name</th>
          <th>Actions</th> */}
        </tr>
        </thead>
        <tbody>
          {
          category.map(c => (
          <tr key={c.id}>
            
            <td>{c.name}</td>
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
 export default Category