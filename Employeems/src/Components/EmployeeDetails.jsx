import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const EmployeeDetails = () => {
    const [employee, setEmployee] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const {id} = useParams()
    const navigate = useNavigate()
    
    useEffect(()=>{
        console.log('📋 Fetching employee details for ID:', id);
        setLoading(true);
        
        axios.get('http://localhost:3000/employee/details/' + id)
            .then(result => {
                console.log('📦 Employee details response:', result.data);
                
                if (result.data && result.data.length > 0) {
                    setEmployee(result.data[0]);
                    console.log('✅ Employee loaded:', result.data[0].name);
                } else {
                    setError('Employee not found');
                }
            })
            .catch(err => {
                console.error('❌ Error fetching employee:', err);
                setError('Failed to load employee details');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id])

    const handleLogout = async () => {
        console.log('🚪 Logging out employee...');
        try {
            await axios.get('http://localhost:3000/employee/logout', {
                withCredentials: true
            })
            console.log(' Logout successful, redirecting...');
            localStorage.removeItem("valid");
            // localStorage.removeItem("userRole");
            navigate('/start')
        } catch (err) {
            console.error(' Logout error:', err);
        }
    }

    if (loading) {
        return <div className="p-4">Loading employee details...</div>
    }

    if (error) {
        return <div className="p-4 alert alert-danger">{error}</div>
    }

    if (!employee) {
        return <div className="p-4 alert alert-warning">No employee data available</div>
    }
   
    return (
        <div >
            <div className="p-2 d-flex justify-content-center shadow">
                <h3>Employee Details</h3>
            </div>
            <div className="card d-flex align=item-center flex-column mt-5">
                <img src={'http://localhost:3000/Images/'+employee.image} className='employee_image'/>
                <div className="card-body">
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Salary:</strong> ${employee.salary}</p>
                    <p><strong>Address:</strong> {employee.address}</p>
                </div>
                <div>
                <button className='btn btn-primary me-2'>Edit</button>
                <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetails