import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminEventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/events/event-registrations/${id}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setRegistrations(data.registrations);
          setEventName(data.eventName || "Event");
        } else {
          setError(data.message || "Failed to fetch registrations");
        }
      } catch (err) {
        console.error(err);
        setError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id]);

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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Registrations for {eventName}
        </h1>

        {registrations.length === 0 ? (
          <p className="text-center text-gray-600">No registrations yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300">#</th>
                <th className="py-2 px-4 border border-gray-300">Name</th>
                <th className="py-2 px-4 border border-gray-300">Email</th>
                <th className="py-2 px-4 border border-gray-300">Password</th>
                <th className="py-2 px-4 border border-gray-300">
                  Registered At
                </th>
              </tr>
            </thead>
            <tbody>
              {registrations.length > 0 &&
                registrations.map((reg, index) => (
                  <tr
                    key={reg._id || index}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="py-2 px-4 border border-gray-300">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {reg.name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {reg.email || "N/A"}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {reg.password || "N/A"}
                    </td>
                    <td className="py-2 px-4 border border-gray-300">
                      {reg.registeredAt
                        ? new Date(reg.registeredAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
