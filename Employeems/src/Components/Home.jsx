import axios from "axios";
import React, { useEffect, useState } from "react";

const StatCard = ({ title, value, subtitle, loading }) => {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="text-muted small">{subtitle}</div>
            <h5 className="mb-2">{title}</h5>
          </div>
          <span className="badge bg-light text-dark border">Overview</span>
        </div>

        <div className="mt-2">
          <div className="display-6 fw-semibold mb-0">
            {loading ? <span className="text-muted">...</span> : value}
          </div>
        </div>

        <div className="mt-auto pt-3">
          <div className="text-muted small">Updated just now</div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [stats, setStats] = useState({
    adminTotal: 0,
    employeeTotal: 0,
    salaryTotal: 0,
  });
  const [admins, setAdmins] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const [adminRes, empRes, salaryRes] = await Promise.all([
          axios.get("http://localhost:3000/auth/admin_count", { withCredentials: true }),
          axios.get("http://localhost:3000/auth/employee_count", { withCredentials: true }),
          axios.get("http://localhost:3000/auth/salary_count", { withCredentials: true }),
        ]);

        console.log('📊 Admin count response:', adminRes.data);
        console.log('📊 Employee count response:', empRes.data);
        console.log('📊 Salary count response:', salaryRes.data);

        // Match backend aliases in AdminRoute.js
        const adminTotal = adminRes.data?.Status
          ? Number(adminRes.data?.Result?.[0]?.adminTotal || 0)
          : 0;

        const employeeTotal = empRes.data?.Status
          ? Number(empRes.data?.Result?.[0]?.employeeTotal || 0)
          : 0;

        const salaryTotal = salaryRes.data?.Status
          ? Number(salaryRes.data?.Result?.[0]?.salaryTotal || 0)
          : 0;

        console.log('✅ Parsed stats:', { adminTotal, employeeTotal, salaryTotal });
        setStats({ adminTotal, employeeTotal, salaryTotal });
      } catch (err) {
        console.error("Dashboard stats error:", err?.response?.data || err.message);
        setError("Unable to load dashboard stats. Please refresh or check the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    AdminRecord();
  }, []);
  const AdminRecord = () => {
    const apiUrl = 'http://localhost:3000/auth/admin_records';
    console.log('🔄 Fetching admin records from:', apiUrl);
    
    axios.get(apiUrl, { withCredentials: true })
      .then(result => {
        console.log('📦 Response received:', result.data);
        
        // Check if we received HTML instead of JSON (backend not running)
        if (typeof result.data === 'string' && result.data.includes('<!doctype')) {
          console.error('❌ Backend is not running! Received HTML instead of JSON');
          console.error('❌ Make sure you ran: npm start (in the root directory)');
          alert('Backend server is not running. Please start it with: npm start');
          return;
        }
        
        if(result.data.Status){
          console.log('✅ Setting admins:', result.data.Result);
          setAdmins(result.data.Result);
        } else {
          console.error('❌ Error from server:', result.data.Error);
          alert('Error: ' + result.data.Error);
        }
      })
      .catch(err => {
        console.error('❌ Network error:', err.message);
        console.error('❌ Is the backend running on port 3000? Run: npm start');
        alert('Failed to connect to backend. Make sure Node server is running on port 3000');
      });
  }

  return (
    <div className="container-fluid px-4 py-4 card shadow-sm border-0 h-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-1">Dashboard</h3>
          <div className="text-muted">Quick overview of your system</div>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => window.location.reload()}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <StatCard
            title="Admins"
            subtitle="Total Admin Accounts"
            value={stats.adminTotal.toLocaleString()}
            loading={loading}
          />
        </div>

        <div className="col-12 col-md-4">
          <StatCard
            title="Employees"
            subtitle="Total Employee Records"
            value={stats.employeeTotal.toLocaleString()}
            loading={loading}
          />
        </div>

        <div className="col-12 col-md-4">
          <StatCard
            title="Payroll"
            subtitle="Total Salary (All Employees)"
            value={`$${stats.salaryTotal.toLocaleString()}`}
            loading={loading}
          />
        </div>

        <h3>List of Admins</h3>
        <table className= ''>
          <thead>
            <tr>
              <th >Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              admins && admins.length > 0 ? (
                admins.map((a, index) =>(
                  <tr key={a.id || index}>
                    <td>{a.email}</td>
                    <td><button className="btn btn-sm btn-warning">Edit</button></td>
                    <td><button className="btn btn-sm btn-danger">Delete</button></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">No admins found</td>
                </tr>
              )
            }

          </tbody>
        </table>
      </div>
     <div>
      
      
     </div>
    </div>
  );
};

export default Home;