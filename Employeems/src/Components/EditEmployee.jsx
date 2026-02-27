import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const EditEmployee = () => {
  const { id } = useParams(); // ✅ FIXED
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    address: '',
    image: null,
    category_id: ''
  });

  const [category, setCategory] = useState([]);
  

  useEffect(() => {
    // Fetch categories
    axios.get('http://localhost:3000/auth/category')
      .then(result => {
        if (result.data.Status) {
          setCategory(result.data.Result || result.data.result || []);
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.error(err));

    // Fetch employee by ID
    axios.get(`http://localhost:3000/auth/employee/${id}`)
      .then(result => {
        const emp = (result.data.Result || result.data.result || [])[0];
        if (emp) {
          setEmployee(prev => ({
            ...prev,
            name: emp.name,
            email: emp.email,
            salary: emp.salary,
            address: emp.address,
            category_id: emp.category_id
          }));
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  // ✅ HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('salary', employee.salary);
    formData.append('address', employee.address);
    formData.append('category_id', employee.category_id);

    if (employee.image) {
      formData.append('image', employee.image);
    }

    axios.put(`http://localhost:3000/auth/edit_employee/${id}`, formData)
      .then(result => {
        if (result.data.Status) {
          alert('Employee updated successfully');
          navigate('/dashboard/employee');
        } else {
          alert('Failed to update: ' + result.data.Error);
        }
      })
      .catch(err => {
        console.error('Error updating employee:', err);
        if (err.response) {
          const errorMsg = err.response.data?.Error || err.response.statusText || 'Unable to update employee';
          console.error('Server error response:', errorMsg);
          alert('Server error: ' + errorMsg);
        } else if (err.request) {
          alert('Unable to connect to server. Please check if the server is running.');
        } else {
          alert('Error: ' + err.message);
        }
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-3 rounded w-25 border'>
        <h2>Edit Employee</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-control"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={employee.address}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={employee.category_id}
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {category.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-success w-100">Edit Employee</button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
