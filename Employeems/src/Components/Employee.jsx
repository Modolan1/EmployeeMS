import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper: support different id field names (id, EmployeeId, _id)
  const getId = (e) => e.id ?? e.EmployeeId ?? e._id;

  useEffect(() => {
    console.log(' Fetching employees...');
    setLoading(true);
    setError(null);
    
    axios
      .get("http://localhost:3000/auth/employee", {
        withCredentials: true
      })
      .then((res) => {
        console.log(" Employee response:", res.data);
        if (res.data?.Status) {
          const empData = res.data.Result || res.data.result || [];
          console.log(' Employees loaded:', empData.length);
          setEmployees(empData);
        } else {
          const errorMsg = res.data?.Error || "Unknown error";
          console.error(" Failed to load employees:", errorMsg);
          setError("Failed to load employees: " + errorMsg);
        }
      })
      .catch((err) => {
        console.error(" Error fetching employees:", err);
        const errorMsg = err.response?.data?.Error || err.message || "Unable to connect to server";
        setError(errorMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      alert("Employee ID is missing.");
      return;
    }

    const ok = window.confirm("Are you sure you want to delete this employee?");
    if (!ok) return;

    try {
      console.log('  Deleting employee:', id);
      const res = await axios.delete(`http://localhost:3000/auth/delete_employee/${id}`, {
        withCredentials: true
      });
      console.log("Delete response:", res.data);

      if (res.data?.Status) {
        // Remove from UI immediately
        setEmployees((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
        alert("Employee deleted successfully!");
      } else {
        alert(res.data?.Error || "Delete failed. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting employee:", err?.response?.data || err.message);
      alert(err?.response?.data?.Error || "Unable to delete employee. Please try again.");
    }
  };

  if (loading) {
    return <div className="px-5 mt-3 p-4">Loading employees...</div>;
  }

  if (error) {
    return <div className="px-5 mt-3 alert alert-danger">{error}</div>;
  }

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee list</h3>
      </div>

      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>

      {employees.length === 0 ? (
        <div className="alert alert-info mt-3">No employees found. Click "Add Employee" to create one.</div>
      ) : (
        <div className="mt-3">
          <table className="table table-striped mt-3 px-5">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Email</th>
                <th>Address</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((e) => {
                const id = getId(e);

                return (
                  <tr key={id}>
                    <td>{e.name}</td>

                    <td>
                      {e.image ? (
                        <img
                          src={`http://localhost:3000/Images/${e.image}`}
                          className="employee_image"
                          alt="employee img"
                          style={{ width: '50px', height: '50px', borderRadius: '4px' }}
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>

                    <td>{e.email}</td>
                  <td>{e.address ?? e.Address ?? "-"}</td>
                  <td>{e.salary ?? e.Salary ?? "-"}</td>

                  <td>
                    <Link to={`/dashboard/edit_employee/${id}`} className="btn btn-primary btn-sm me-2">
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/dashboard/employee/${id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Debug tip: uncomment to see what fields your API actually returns */}
        {/* <pre>{JSON.stringify(employees, null, 2)}</pre> */}
      </div>
        )}
    </div>
  );
};

export default Employee;