import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const adminData = localStorage.getItem("admin-login");
    if (!adminData) {
      navigate("/admin-login");
    } else {
      try {
        setAdminEmail(JSON.parse(adminData).email || adminData);
      } catch {
        setAdminEmail(adminData);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin-login");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Welcome, {adminEmail} 👋
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          This is your admin dashboard. You can manage events and MCQs here.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mt-10">
          <div className="bg-blue-100 p-6 rounded-xl hover:bg-blue-200 transition">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              Create Event
            </h2>
            <p className="text-gray-600">
              Add new events that users can participate in.
            </p>
            <button
              onClick={() => navigate("/create-event")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Event
            </button>
          </div>

          <div className="bg-green-100 p-6 rounded-xl hover:bg-green-200 transition">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Manage Events
            </h2>
            <p className="text-gray-600">Edit or remove existing events.</p>
            <button
              onClick={() => navigate("/events")}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Manage Events
            </button>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl hover:bg-yellow-200 transition">
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              MCQ Section
            </h2>
            <p className="text-gray-600">
              Create and manage multiple-choice questions for events.
            </p>
            <button
              onClick={() => navigate("/create-mcq-event")}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              Manage MCQs
            </button>
          </div>

          <div className="bg-red-100 p-6 rounded-xl hover:bg-red-200 transition">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Logout</h2>
            <p className="text-gray-600">Sign out from the admin account.</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
