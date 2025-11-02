import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function RegisteredEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRegistered = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/registrations`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setEvents(data.events);
    };
    fetchRegistered();
  }, []);

  const attendQuiz = (eventId) =>{
    navigate(`/mcq-questions/${eventId}`);
  }
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        🎯 Registered Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-600">No events registered yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {events.map((e) => (
            <div
              key={e._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-blue-800">{e.name}</h2>
              <p className="text-gray-600">
                {new Date(e.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-2">{e.description}</p>
              <button
              onClick={()=> attendQuiz(e._id)}
               className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Attend
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
