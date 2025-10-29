import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user-login");
    if (!userData) {
      navigate("/user-login");
    } else {
      setUserName(userData);    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-indigo-100 pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">
          Welcome, {userName} 👋
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          This is your personal event dashboard.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          <div className="bg-indigo-100 p-6 rounded-xl hover:bg-indigo-200 transition">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">
              View Events
            </h2>
            <p className="text-gray-600">
              Browse and participate in events created by admins.
            </p>
            <button
              onClick={() => navigate("/explore-events")}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Explore Events
            </button>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl hover:bg-yellow-200 transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              My Registrations
            </h2>
            <p className="text-gray-600">
              View events you have registered for and manage your participation.
            </p>
            <button
              onClick={() => navigate("/my-registrations")}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              View Registrations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
