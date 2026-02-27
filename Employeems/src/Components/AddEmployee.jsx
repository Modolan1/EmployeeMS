import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    password:'',
    salary: '',
    address:'',
    image:'',
    category_id: ''
  })

  const [category, setCategory] = useState([]);
   const navigate = useNavigate();

  useEffect(() => {
   axios.get('http://localhost:3000/auth/category')
    .then(result => {
      if (result.data.Status){ 
        setCategory(result.data.Result || result.data.result || []);
        console.log(result.data.Result || result.data.result);
      } else{
        alert('Failed to load categories: ' + result.data.Error);
      }
    }).catch(err => {
      console.error('Error fetching categories:', err);
      alert('Unable to connect to server. Please ensure the server is running.');
    })
  }, []);

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!employee.name || !employee.email || !employee.password || !employee.salary || !employee.address || !employee.category_id) {
    alert("Please fill in all required fields");
    return;
  }

  const formData = new FormData();
  formData.append("name", employee.name.trim());
  formData.append("email", employee.email.trim());
  formData.append("password", employee.password);
  formData.append("salary", employee.salary);         // keep as string/number
  formData.append("address", employee.address.trim());
  formData.append("category_id", employee.category_id);

  // only append image if user selected one
  if (employee.image) {
    formData.append("image", employee.image);
  }

  try {
    const res = await axios.post(
      "http://localhost:3000/auth/add_employee",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("Add employee response:", res.data);

    if (res.data?.Status) {
      alert("Employee added successfully!");
      navigate("/dashboard/employee");
    } else {
      alert("Failed to add employee: " + (res.data?.Error || "Unknown error"));
    }
  } catch (err) {
    console.error("Error adding employee:", err?.response?.data || err.message);
    alert(err?.response?.data?.Error || "Server error adding employee");
  }
};

  //   setForm({ name: '', email: '', salary: '', category: '' })
  //   setEditId(null)
  //   fetchEmployees()
  // }

  // const handleEdit = (emp) => {
  //   setForm(emp)
  //   setEditId(emp.id)
  // }

  // const handleDelete = async (id) => {
  //   if (window.confirm('Delete this employee?')) {
  //     await axios.delete(
  //       `http://localhost:3000/employee/delete/${id}`
  //     )
  //     fetchEmployees()
  //   }
  // }
  

  return (<div className='d-flex justify-content-center align-items-center h-75'>
       <div className='p-3 rounded w-25 border'>
        <h2>Add Employee</h2>
        <form  onSubmit={handleSubmit}>

            <div className=" col-12 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                id='ullName'
                placeholder="Enter full name"
                onChange={(e)=> setEmployee({...employee, name: e.target.value})}
                autoComplete='off'
                required
              />
            </div>

            <div className=" col-12 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id='email'
                placeholder="Enter email address"
                onChange={(e)=> setEmployee({...employee, email: e.target.value})}
                autoComplete='off'
                required
              />
            </div>
            <div className=" col-12 mb-3">
              <label className="form-label">password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id='password'
                placeholder="Enter password"
                onChange={(e)=> setEmployee({...employee, password: e.target.value})}
                autoComplete='off'
                required
              />
            </div>

            <div className=" col-12 mb-3">
              <label className="form-label">Salary</label>
              <input
                type="number"
                name="salary"
                className="form-control"
                id='salary'
                placeholder="Enter salary"
                onChange={(e)=> setEmployee({...employee, salary: e.target.value})}
                autoComplete='off'
                required
              />
            </div>

            <div className=" col-12 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control rounded-0"
                id='inputAddress'
                placeholder="123 Main St"
                onChange={(e)=> setEmployee({...employee, address: e.target.value})}
                autoComplete='off'
                required
              />
            </div>
            <div className=" col-12 mb-3">
              <label className="form-label">Select image</label>
              <input
                type="file"
                name="image"
                className="form-control rounded-0"
                id='inputGroupFile01'
                onChange={(e)=> setEmployee({...employee, image: e.target.files[0]})}
              />
            </div>
            <div className=' col-12 mb-3'>
                <label htmlFor='category'>Category:</label>
                <select name='category'  id='category' 
                className='form-select rounded-0'
                onChange={(e)=> setEmployee({...employee, category_id: e.target.value})}
                required>
                    <option value="">Select Category</option>
                    {category.map(c =>{
                        return<option key={c.id} value={c.id}>{c.name}</option>
                    })}
                </select>
            </div>
            <div>
            <button className='btn-btn-success w-100 rounded-0 mb-2'>Add Employee</button>
            <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard/employee')}
              >
                
              </button>
              </div>
        </form>
       </div>
    </div>




    
  )
}

export default AddEmployee
