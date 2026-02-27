import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await axios.get('http://localhost:3000/auth/logout', {
      withCredentials: true
    })
    // to ensure the not going back to last section after logout
    localStorage.removeItem("valid")
    navigate('/start')
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">

        {/* SIDEBAR */}
        <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
          <div className="d-flex flex-column px-3 pt-3 text-white min-vh-100">

            <Link
              to="/dashboard"
              className="text-white text-decoration-none fs-4 fw-bold mb-4"
            >
              Modolan Tech
            </Link>

            <ul className="nav nav-pills flex-column mb-auto">

              <li className="nav-item mb-2">
                <Link to="/dashboard" className="nav-link text-white">
                  <i className="bi bi-house me-2"></i> Dashboard
                </Link>
              </li>

              <li className="nav-item mb-2">
                <Link to="/dashboard/employee" className="nav-link text-white">
                  <i className="bi bi-people me-2"></i> Manage Employees
                </Link>
              </li>

              <li className="nav-item mb-2">
                <Link to="/dashboard/category" className="nav-link text-white">
                  <i className="bi bi-tags me-2"></i> Category
                </Link>
              </li>

              <li className="nav-item mb-2">
                <Link to="/dashboard/profile" className="nav-link text-white">
                  <i className="bi bi-person me-2"></i> Profile
                </Link>
              </li>

            </ul>

            <hr />

            <button
              onClick={handleLogout}
              className="btn btn-outline-light w-100"
            >
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col px-0">

          {/* TOP BAR */}
          <div className="d-flex justify-content-between align-items-center p-3 shadow-sm bg-white">
            <h5 className="mb-0">Employee Management System</h5>
          </div>

          <div className="p-4">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
