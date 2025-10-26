import { useState, useEffect } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null); // For inline editing

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/events", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setEvents(data.events || []);
      } else {
        alert(data.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    } finally {
      setLoading(false);
    }
  };

  // Delete Event
  // Delete Event
const deleteEvent = async (eventId) => {
  if (!window.confirm("Are you sure you want to delete this event?")) return;

  console.log("Deleting event:", eventId); // Debugging

  try {
    const res = await fetch(`http://localhost:5000/delete-event/${eventId}`, {
      method: "DELETE",
      credentials: "include", // important if backend uses JWT in cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is ok
    if (!res.ok) {
      console.error("Server returned error:", res.status, res.statusText);
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.message || "Failed to delete event");
      return;
    }

    const data = await res.json();

    if (data.success) {
      alert("Event deleted successfully!");
      fetchEvents(); // Refresh events
    } else {
      alert(data.message || "Failed to delete event");
    }
  } catch (err) {
    console.error("Error deleting event:", err);
    alert("Server error, please try again later");
  }
};

  // Update Event
  const updateEvent = async (eventId, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/update-event/${eventId}`, {
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
      } else {
        alert(data.message || "Failed to update event");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading your events...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Your Created Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">No events created yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {events.map((event, index) => (
            <div
              key={event._id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition bg-indigo-50"
            >
              {editingEvent === event._id ? (
                // Inline editing form
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
                    type="date"
                    defaultValue={event.date.split("T")[0]}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) => (event.date = e.target.value)}
                  />
                  <input
                    type="number"
                    defaultValue={event.capacity}
                    className="w-full p-2 border rounded mb-2"
                    onChange={(e) => (event.capacity = parseInt(e.target.value))}
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
                // Normal event display
                <>
                  <h2 className="text-xl font-semibold text-indigo-900">
                    {index + 1}. {event.name}
                  </h2>
                  <p className="text-gray-700 mt-1">{event.description}</p>
                  <p className="text-gray-600 mt-1">
                    Date: {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Capacity: {event.capacity} | Registered:{" "}
                    {event.participants?.length || 0}
                  </p>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => setEditingEvent(event._id)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
