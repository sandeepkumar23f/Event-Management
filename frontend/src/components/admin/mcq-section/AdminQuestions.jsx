import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function AdminQuestions() {
  const { eventId } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (eventId) fetchQuestions();
  }, [eventId]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/questions/${eventId}`, {
        credentials: "include",
        cache: "no-store",
      });
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
      const res = await fetch(`http://localhost:5000/delete/${id}/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) fetchQuestions();
      else alert(data.message || "Failed to delete question");
    } catch (err) {
      console.error(err);
      alert("Server error, try again later");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Questions Dashboard
          </h1>
          <Link
            to={`/add-question/${eventId}`}
            className="mt-3 sm:mt-0 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-medium"
          >
            + Add New Question
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">
              No questions found. Start by adding a new question.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {questions.map((qn, index) => (
              <div
                key={qn._id}
                className="bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-gray-800 font-semibold text-lg mb-2">
                    Q{index + 1}: {qn.description}
                  </h2>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {qn.options.map((opt, i) => {
                      const optionLabel = String.fromCharCode(65 + i); // A, B, C, D
                      const isCorrect =
                        optionLabel === qn.correctOption ||
                        opt === qn.correctOption;
                      return (
                        <li
                          key={i}
                          className={`flex items-center gap-2 ${
                            isCorrect ? "text-green-600 font-semibold" : ""
                          }`}
                        >
                          <span className="font-medium">{optionLabel}.</span>
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                              Correct
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => deleteQuestion(qn._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition font-medium text-sm"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/update-question/${qn._id}/${eventId}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-1 rounded-lg transition font-medium text-sm"
                  >
                    Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
