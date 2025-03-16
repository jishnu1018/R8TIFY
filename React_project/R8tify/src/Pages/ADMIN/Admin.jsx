import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("/api/userstats", { withCredentials: true });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        const fetchRecentUsers = async () => {
            try {
                const response = await axios.get("/api/recentusers", { withCredentials: true });
                setRecentUsers(response.data);
            } catch (error) {
                console.error("Error fetching recent users:", error);
            }
        };

        fetchStats();
        fetchRecentUsers();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.get("/api/adminlogout", { withCredentials: true });
            console.log("Admin logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="bg-gray-100 font-sans flex">
            <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-center font-bold text-2xl border-b border-gray-700">
                    Admin Dashboard
                </div>
                <nav className="mt-4">
                    <ul>
                        <li className="p-4 hover:bg-gray-700">
                            <Link to="#">Dashboard</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 w-60">
                            <Link to="/adminusers">Users</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 w-60">
                            <Link to="/adminproducts">Products</Link>
                        </li>
                        <li className="p-4 hover:bg-gray-700 w-60">
                            <Link to="/seereviews">Reviews</Link>
                        </li>
                        
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-700 mt-auto">
                    
                    <button 
                        onClick={handleLogout} 
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-700 transition">
                        Logout
                    </button>
                </div>
            </div>

       
            <div className="flex-1 p-6">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Welcome, Admin!</h1>
                    <Link to="/adminadd">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Add Product
                        </button>
                    </Link>
                </header>

      
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-gray-600">Total Users</h2>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white shadow-md rounded p-6">
                        <h2 className="text-gray-600">Total Products</h2>
                        <p className="text-3xl font-bold">{stats.totalProducts}</p>
                    </div>
                </div>

      
                <div className="bg-white shadow-md rounded p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                    <table className="w-full text-left">
                        <thead>
                            <tr>
                                <th className="border-b p-4">Date</th>
                                <th className="border-b p-4">Name</th>
                                <th className="border-b p-4">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="border-b p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="border-b p-4">{user.name}</td>
                                        <td className="border-b p-4">{user.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border-b p-4 text-center" colSpan="3">
                                        No recent users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
