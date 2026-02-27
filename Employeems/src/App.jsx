import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Login from './Components/Login'
import {BrowserRouter, Routes, Route, Navigate}from 'react-router-dom'
import React from 'react'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Employee from './Components/Employee'
import Category from './Components/Category'
import Profile from './Components/Profile'
import AddCategory from './Components/AddCategory'
import AddEmployee from './Components/AddEmployee'
import EditEmployee from './Components/EditEmployee'
import ViewEmployee from './Components/ViewEmployee'
import Start from './Components/Start'
import EmployeeLogin from './Components/EmployeeLogin'
import EmployeeDetails from './Components/EmployeeDetails'
import PrivateRoute from './Components/PrivateRoute'
import AdminRegister from './Components/AdminRegister'

function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path= '/' element={<Navigate to="/start" replace />}></Route>
        <Route path= '/start' element={<Start/>}></Route>
        <Route path= '/admin/register' element={<AdminRegister/>}></Route>
        <Route path= '/admin/login' element={<Login/>}></Route>
        <Route path= '/adminlogin' element={<Navigate to="/admin/login" replace />}></Route>
        <Route path= '/employeelogin' element={<EmployeeLogin/>}></Route>
        <Route path= '/employeedetails/:id' element={<EmployeeDetails/>}></Route>
        
        {/* Protected Dashboard Routes */}
        <Route 
          path = '/dashboard' 
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
        >
          <Route path= '' element={<Home/>}></Route>
          <Route path= 'employee' element={<Employee/>}></Route>
          <Route path= 'employee/:id' element={<ViewEmployee/>}></Route>
          <Route path= 'category' element={<Category/>}></Route>
          <Route path= 'profile' element={<Profile/>}></Route>
          <Route path= 'add_category' element={<AddCategory/>}></Route>
          <Route path= 'add_employee' element={<AddEmployee/>}></Route>
          <Route path= 'edit_employee/:id' element={<EditEmployee/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
