import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RegisterPage() {
  const { id } = useParams(); // event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/explore-events/${id}`, {
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

    setRegistering(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/register-event/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Registered successfully!");
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

  if (error) {
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
        <p className="text-gray-600 mb-4">
          🎯 <strong>Capacity:</strong> {event.capacity}
        </p>

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
      </div>
    </div>
  );
}
