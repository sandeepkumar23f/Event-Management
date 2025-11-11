import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [activeTimers, setActiveTimers] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events for admin
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events`, {
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

  // Delete Event
  const deleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(
        `${API_URL}/api/events/delete/${eventId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
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

  // Update Event
  const updateEvent = async (eventId, updatedData) => {
    try {
      const res = await fetch(
        `${API_URL}/api/events/update/${eventId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );
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

  // Navigate to leaderboard page
  const viewLeaderBoard = (eventId) => {
    navigate(`/admin/leaderboard/${eventId}`);
  };

  // Start contest
  const startContest = async (eventId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/events/start-contest/${eventId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        const { startTime, duration } = data;
        startCountdown(eventId, startTime, duration);
      } else alert(data.message || "Failed to start contest");
    } catch (err) {
      console.error(err);
      alert("Server error, please try again later");
    }
  };

  const startCountdown = (eventId, startTime, duration) => {
    const endTime = startTime + duration;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = endTime - now;

      setActiveTimers((prev) => ({
        ...prev,
        [eventId]: remaining > 0 ? remaining : 0,
      }));

      if (remaining <= 0) {
        clearInterval(interval);
        setActiveTimers((prev) => {
          const updated = { ...prev };
          delete updated[eventId];
          return updated;
        });
        alert(`Contest for event ${eventId} ended automatically!`);
      }
    };

    updateTimer(); // run once immediately
    const interval = setInterval(updateTimer, 1000);
  };

  // Format time (mm:ss)
  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Loader
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
            {events.map((event, index) => {
              const timeLeft = activeTimers[event._id];

              return (
                <div
                  key={event._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6"
                >
                  {editingEvent === event._id ? (
                    <div>
                      {/* Name */}
                      <input
                        type="text"
                        defaultValue={event.name}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Event Name"
                        onChange={(e) => (event.name = e.target.value)}
                      />

                      {/* Description */}
                      <textarea
                        defaultValue={event.description}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Event Description"
                        onChange={(e) => (event.description = e.target.value)}
                      />

                      {/* Date & Time */}
                      <input
                        type="datetime-local"
                        defaultValue={event.date?.slice(0, 16)}
                        className="w-full p-2 border rounded mb-2"
                        onChange={(e) => (event.date = e.target.value)}
                      />

                      <input
                        type="number"
                        min="1"
                        defaultValue={event.duration}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Duration (in minutes)"
                        onChange={(e) =>
                          (event.duration = parseInt(e.target.value))
                        }
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
                            timeLeft
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {timeLeft ? "Running" : "Idle"}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2">{event.description}</p>

                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(event.date).toLocaleString()}
                        </p>
                        <p>
                          <strong>Duration:</strong> {event.duration} mins
                        </p>
                        <p>
                          <strong>Registered:</strong>{" "}
                          {event.registrationCount ??
                            event.registrations?.length ??
                            0}{" "}
                          participants
                        </p>
                      </div>

                      {/* Countdown timer display */}
                      {timeLeft && (
                        <p className="text-green-700 font-bold text-lg mb-2">
                          Ends in: {formatTime(timeLeft)}
                        </p>
                      )}

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
                          onClick={() => viewLeaderBoard(event._id)}
                          className="col-span-2 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
                        >
                          LeaderBoard
                        </button>

                        {timeLeft ? (
                          <button
                            disabled
                            className="col-span-2 bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                          >
                            Contest Running...
                          </button>
                        ) : (
                          <button
                            onClick={() => startContest(event._id)}
                            className="col-span-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                          >
                            Start Contest
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
