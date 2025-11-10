import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [eventName, setEventName] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (parseInt(eventDuration) <= 0) {
      alert("Duration must be greater than 0 minutes");
      return;
    }

    const eventData = {
      name: eventName.trim(),
      description: eventDesc.trim(),
      date: eventDate,
      location: eventLocation.trim(),
      duration: parseInt(eventDuration),
    };

    try {
      const res = await fetch(`${API_URL}/api/events/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (data.success) {
        alert(" Event created successfully!");
        // Clear form
        setEventName("");
        setEventDesc("");
        setEventDate("");
        setEventLocation("");
        setEventDuration("");
        // Redirect to events page
        navigate("/events");
      } else {
        alert(data.message || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">
        Create Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Event Date & Time</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">
            Duration (in minutes)
          </label>
          <input
            type="number"
            min="1"
            value={eventDuration}
            onChange={(e) => setEventDuration(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="e.g., 60"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800 transition text-lg"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
