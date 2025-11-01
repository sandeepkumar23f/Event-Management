import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userData.email || !userData.password) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user-login", userData.email);
        alert("Login successful!");
        navigate("/user-dashboard"); 
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4 bg-gray-100">
      <h1 className="text-2xl font-semibold text-black">User Login</h1>

      <label className="w-64 text-left text-black">Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        className="w-64 border border-black rounded px-3 py-2 text-black"
      />

      <label className="w-64 text-left text-black">Password</label>
      <input
        type="password"
        placeholder="Enter your password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        className="w-64 border border-black rounded px-3 py-2 text-black"
      />

      <button
        onClick={handleLogin}
        className="w-64 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>

      <Link to="/user-signup" className="text-blue-600 underline">
        Don’t have an account? Sign Up
      </Link>
    </div>
  );
}
