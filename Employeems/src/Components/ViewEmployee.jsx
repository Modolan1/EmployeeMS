import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/auth/employee/${id}`);
        if (res.data?.Status) {
          // Some APIs return result as array; normalize
          const data = Array.isArray(res.data.result) ? res.data.result[0] : res.data.result;
          setEmployee(data);
        } else {
          alert(res.data?.Error || "Failed to load employee details");
        }
      } catch (err) {
        console.error("Error loading employee details:", err);
        alert("Unable to load employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!employee) return <div className="p-4">Employee not found.</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Employee Details</h3>
        <Link to="/dashboard/employee" className="btn btn-outline-secondary btn-sm">
          Back
        </Link>
      </div>

      <div className="card mt-3 p-3">
        <div className="d-flex gap-4 align-items-start">
          <div>
            {employee.image ? (
              <img
                src={`http://localhost:3000/Images/${employee.image}`}
                alt="employee"
                style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 8 }}
              />
            ) : (
              <div style={{ width: 160, height: 160, border: "1px solid #ccc", borderRadius: 8 }} />
            )}
          </div>

          <div>
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Address:</strong> {employee.address ?? employee.Address ?? "-"}</p>
            <p><strong>Salary:</strong> {employee.salary ?? employee.Salary ?? "-"}</p>
            <p><strong>Category:</strong> {employee.category_name ?? employee.categoryName ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;