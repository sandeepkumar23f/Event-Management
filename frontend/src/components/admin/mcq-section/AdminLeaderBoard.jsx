import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminLeaderboard() {
  const { id } = useParams(); // eventId
  const [leaderboard, setLeaderboard] = useState([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard/${id}`);
        const data = await res.json();

        if (data.success) {
          setLeaderboard(data.leaderboard);
          setEventName(data.eventName);
        } else {
          setError(data.message || "Failed to load leaderboard");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
        🏆 {eventName} Leaderboard
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Check out the top performers for this event!
      </p>

      {leaderboard.length === 0 ? (
        <p className="text-center text-gray-600">No submissions yet.</p>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Rank</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left rounded-tr-lg">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`border-b hover:bg-indigo-50 transition ${
                      idx === 0
                        ? "bg-yellow-50 font-semibold text-yellow-700"
                        : idx === 1
                        ? "bg-gray-50 text-gray-700"
                        : idx === 2
                        ? "bg-orange-50 text-orange-700"
                        : ""
                    }`}
                  >
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">{entry.userName || "Anonymous"}</td>
                    <td className="p-3 text-gray-600">
                      {entry.email || "Not provided"}
                    </td>
                    <td className="p-3 font-medium">{entry.score}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
