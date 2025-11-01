import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) setEvents(data.events || []);
      else alert(data.message || "Failed to fetch events");
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/delete/${eventId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        alert("Event deleted successfully!");
        fetchEvents();
      } else alert(data.message || "Failed to delete event");
    } catch (err) {
      console.error(err);
      alert("Server error, please try again later");
    }
  };

  const updateEvent = async (eventId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/update/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Event updated successfully!");
        setEditingEvent(null);
        fetchEvents();
      } else alert(data.message || "Failed to update event");
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  };

  const startContest = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/start/${eventId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        alert("Contest started successfully!");
        fetchEvents();
      } else alert(data.message || "Failed to start contest");
    } catch (err) {
      console.error(err);
      alert("Server error, please try again later");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-blue-100 py-10 px-5">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
          Admin Event Dashboard
        </h1>

        {events.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No events created yet.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <div
                key={event._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6"
              >
                {editingEvent === event._id ? (
                  <div>
                    <input
                      type="text"
                      defaultValue={event.name}
                      className="w-full p-2 border rounded mb-2"
                      onChange={(e) => (event.name = e.target.value)}
                    />
                    <textarea
                      defaultValue={event.description}
                      className="w-full p-2 border rounded mb-2"
                      onChange={(e) => (event.description = e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      defaultValue={event.date?.slice(0, 16)}
                      className="w-full p-2 border rounded mb-2"
                      onChange={(e) => (event.date = e.target.value)}
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateEvent(event._id, event)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingEvent(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-xl font-semibold text-indigo-900">
                        {index + 1}. {event.name}
                      </h2>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          event.status === "started"
                            ? "bg-green-100 text-green-700"
                            : event.status === "upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.status || "upcoming"}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-2">{event.description}</p>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Registered:</strong>{" "}
                        {event.participants?.length || 0}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => navigate(`/questions/${event._id}`)}
                        className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Questions
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/event-registrations/${event._id}`)
                        }
                        className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Registrations
                      </button>

                      <button
                        onClick={() => setEditingEvent(event._id)}
                        className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteEvent(event._id)}
                        className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => startContest(event._id)}
                        className="col-span-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Start Contest
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
