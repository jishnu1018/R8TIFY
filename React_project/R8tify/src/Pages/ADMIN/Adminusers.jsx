import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/adminusers");
      console.log("Fetched users:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const reason = prompt("Please provide a reason for deleting this user:");
    if (!reason) {
      alert("Deletion reason is required.");
      return;
    }

    try {
      const response = await axios.delete(`api/userdelete/${email}`, {
        withCredentials: true, 

        data: { reason },
      });
      console.log("Delete response:", response.data);
      setUsers(users.filter((user) => user.email !== email));
      alert("User deleted successfully! A notification has been sent to the user.");
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      alert("Failed to delete user: " + (error.response?.data.error || error.message));
    }
  };

  return (
    <div className="bg-gray-100 p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Users</h2>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{user._id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phn_no || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <Link to="/admin" className="bg-black text-white text-xl px-6 py-3 rounded-full font-bold">
          Back
        </Link>
      </div>
    </div>
  );
};

export default AdminUsers;
