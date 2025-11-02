import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function GetQuestion() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // going to fetch question for that event
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/questions/user-questions/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.message);
        } else {
          setQuestions(data.questions);
        }
      } catch (error) {
        setError("Failed to fetch event questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);
  const handleAnswerSelect = (questionId, option) => {
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };
  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
    );

  if (questions.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600">
        No Questions found for this event
      </p>
    );

  const currentQuestion = questions[currentIndex];
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Event Quiz
        </h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <p className="text-gray-700 mb-6">{currentQuestion.description}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => (
              <label
                key={i}
                className={`block border p-3 rounded-lg cursor-pointer transition-all ${
                  answers[currentQuestion._id] === option
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "hover:bg-indigo-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option}
                  checked={answers[currentQuestion._id] === option}
                  onChange={() =>
                    handleAnswerSelect(currentQuestion._id, option)
                  }
                  className="mr-2 hidden"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => console.log("User answers:", answers)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
