import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateQuestion() {
  const [questionData, setQuestionData] = useState({
    description: "",
    options: ["", "", "", ""],
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:5000/question/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.question) {
          setQuestionData({
            description: data.question.description,
            options: data.question.options,
          });
        } else {
          alert(data.message || "Failed to fetch question details");
        }
      } catch (err) {
        console.error("Error fetching question:", err);
        alert("Error fetching question details");
      }
    };

    getQuestion();
  }, [id]);

  const handleDescriptionChange = (e) => {
    setQuestionData({ ...questionData, description: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const updateQuestion = async () => {
    if (!questionData.description.trim() || questionData.options.some((opt) => !opt.trim())) {
      alert("Please fill in the question description and all four options");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/update-question/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(questionData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Question updated successfully!");
        navigate("/questions");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Server error while updating question");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Update Question
        </h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Question Description</label>
          <textarea
            value={questionData.description}
            onChange={handleDescriptionChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter the question..."
          />
        </div>

        {questionData.options.map((opt, index) => (
          <div key={index} className="mb-3">
            <label className="block font-semibold mb-1">Option {index + 1}</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={`Enter option ${index + 1}`}
            />
          </div>
        ))}

        <button
          onClick={updateQuestion}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Question
        </button>
      </div>
    </div>
  );
}
