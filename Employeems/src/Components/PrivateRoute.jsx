import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const valid = localStorage.getItem("valid");
    const userRole = localStorage.getItem("userRole");
    console.log(' PrivateRoute check - valid:', valid, 'role:', userRole);
    
    setIsAuthenticated(valid === "true" || valid === true);
  }, []);

  if (isAuthenticated === null) {
    return <div className="p-4">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    console.log(' Not authenticated, redirecting to /start');
    return <Navigate to="/start" replace />;
  }
  
  console.log(' User authenticated, rendering protected content');
  return children;
}

export default PrivateRoute