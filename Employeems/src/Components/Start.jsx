import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

export default function Start() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    console.log('🔐 Navigating to admin login...');
    navigate("/admin/login");
  };

  const handleEmployeeLogin = () => {
    console.log('🔐 Navigating to employee login...');
    navigate("/employeelogin");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded w-50 border loginForm text-center">
        <h2 className="mb-4">Welcome to Employee Management System</h2>
        <p className="mb-4 text-muted">
          Please select your role to continue to the login page.
        </p>

        <div className="d-grid gap-3">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAdminLogin}
          >
            <i className="bi bi-shield-check me-2"></i>
            Admin Login
          </button>

          <button
            className="btn btn-success btn-lg"
            onClick={handleEmployeeLogin}
          >
            <i className="bi bi-person-check me-2"></i>
            Employee Login
          </button>
        </div>

        <hr className="my-4" />
        
        <p className="text-muted small">
          <strong>Admin:</strong> Access dashboard and manage employees<br/>
          <strong>Employee:</strong> View your profile and details
        </p>
      </div>
    </div>
  );
}

