import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminSignup() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSignup = async () => {
  if (!userData.name || !userData.email || !userData.password) {
    alert("All fields are required");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/auth/admin-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      localStorage.setItem("admin-login", userData.email);
      navigate("/admin-dashboard");
    } else {
      alert(result.message || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Server error. Please try again later.");
  }
};


  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <h1 className="text-2xl font-semibold text-black">Sign Up</h1>

      <label className="w-64 text-left text-black">Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        className="w-64 border border-black rounded px-3 py-2 text-black"
      />

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
        onClick={handleSignup}
        className="w-64 bg-green-600 text-white py-2 rounded"
      >
        Sign Up
      </button>

      <Link to="/admin-login" className="text-blue-600 underline">
        Already have an account? Login
      </Link>
    </div>
  );
}
