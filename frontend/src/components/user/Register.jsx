import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RegisterPage() {
  const { id } = useParams(); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/events/explore/${id}`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) {
          setEvent(data.event);
        } else {
          setError(data.message || "Event not found");
        }
      } catch (err) {
        console.error(err);
        setError("Server error, please try again later");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!event) return;

    if (!user.name || !user.email || !user.password) {
      setError("All fields are required");
      return;
    }

    setRegistering(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/events/register/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(user), 
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "Registered successfully!");
        setError("");
      } else {
        setError(data.message || "Failed to register");
      }
    } catch (err) {
      console.error(err);
      setError("Server error, please try again later");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center items-center py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">{event.name}</h1>
        <p className="text-gray-600 mb-2">
          📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-gray-600 mb-2">
          📍 <strong>Location:</strong> {event.location || "TBA"}
        </p>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Your Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Your Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {successMsg ? (
          <p className="text-green-600 font-medium">{successMsg}</p>
        ) : (
          <button
            onClick={handleRegister}
            disabled={registering}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {registering ? "Registering..." : "Register"}
          </button>
        )}

        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  );
}
