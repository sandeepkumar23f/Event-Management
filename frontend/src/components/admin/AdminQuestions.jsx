import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);


  const fetchQuestions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/questions`, { credentials: "include", cache: "no-store" });
      const data = await res.json();

      if (data.success) setQuestions(data.questions || []);
      else alert(data.message || "Failed to fetch questions");
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  };

  const deleteQuestion = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/delete-question/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();

      if (data.success) fetchQuestions();
      else alert(data.message || "Failed to delete question");
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 w-full min-h-screen bg-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
        Questions Dashboard
      </h1>

      {questions.length === 0 ? (
        <p className="text-center text-gray-600 text-sm sm:text-base">
          No questions found.{" "}
          <Link
            to="/add-qns"
            className="text-blue-500 underline font-medium"
          >
            Add a new question
          </Link>
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-4 overflow-x-auto">
          <ul className="divide-y divide-gray-200">
            {questions.map((qn) => (
              <li
                key={qn._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center py-3 hover:bg-blue-50 rounded-lg px-2 sm:px-4 transition"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-gray-800 truncate">
                    {qn.description}
                  </span>
                  <span className="text-sm sm:text-base text-gray-500">
                    Options: {qn.options.join(", ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 mt-2 md:mt-0 flex-wrap">
                  <button
                    onClick={() => deleteQuestion(qn._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition text-sm sm:text-base"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update-question/${qn._id}`}
                    className="text-blue-600 hover:underline font-medium text-sm sm:text-base"
                  >
                    Update
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
