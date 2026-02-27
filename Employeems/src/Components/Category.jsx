import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

export const Category = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📋 Fetching categories...');
    setLoading(true);
    setError(null);
    
    axios.get('http://localhost:3000/auth/category', {
      withCredentials: true
    })
      .then(result => {
        console.log('✅ Category response:', result.data);
        if (result.data.Status){ 
          const catData = result.data.Result || result.data.result || [];
          console.log('✅ Categories loaded:', catData.length);
          setCategory(catData);
        } else {
          const errorMsg = result.data.Error || "Unknown error";
          console.error('❌ Failed to load categories:', errorMsg);
          setError('Failed to load categories: ' + errorMsg);
        }
      })
      .catch(err => {
        console.error('❌ Error fetching categories:', err);
        const errorMsg = err.response?.data?.Error || err.message || 'Unable to connect to server';
        setError(errorMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="px-5 mt-3 p-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="px-5 mt-3 alert alert-danger">{error}</div>;
  }
  
  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'> 
            <h3>Category list</h3>
        </div>
        <Link to="/dashboard/add_category" className='btn btn-success'>Add Category</Link>
        
        {category.length === 0 ? (
          <div className="alert alert-info mt-3">No categories found. Click "Add Category" to create one.</div>
        ) : (
          <div className='mt-3'>
            <table className='table table-striped mt-3 px-5'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {
                  category.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

export default Category