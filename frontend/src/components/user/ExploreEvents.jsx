import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExploreEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching events from /api/events/explore...");
        
        const res = await fetch("http://localhost:5000/api/events/explore", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });
        
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API Response:", data); 

        if (data.success) {
          const availableEvents = data.events || [];
          console.log("Available events:", availableEvents);
          setEvents(availableEvents);
        } else {
          setError(data.message || "Failed to load events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Upcoming Events
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {event.name}
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              📅 <strong>Date:</strong>{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-4">
              {event.description || "No description available"}
            </p>

            <button
              onClick={() => navigate(`/register-event/${event._id}`)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
