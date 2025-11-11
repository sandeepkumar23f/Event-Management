import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold text-teal-600">Welcome to QuizArena</h1>
      <p className="text-gray-700">Host or participate in interactive quiz events!</p>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/admin-login")}
          className="bg-teal-600 text-white px-6 py-2 rounded"
        >
          Admin
        </button>

        <button
          onClick={() => navigate("/user-login")}
          className="bg-gray-800 text-white px-6 py-2 rounded"
        >
          User
        </button>
      </div>
    </div>
  );
}
