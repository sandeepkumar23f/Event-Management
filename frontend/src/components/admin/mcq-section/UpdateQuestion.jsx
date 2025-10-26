import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateQuestion() {
  const { id: questionId, eventId } = useParams();
  const [formData, setFormData] = useState({
    description: "",
    options: ["", "", "", ""],
    correctOption: "",
  });

  const navigate = useNavigate();

  // Fetch the existing question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/question/${questionId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.success) {
          setFormData({
            description: data.question.description,
            options: data.question.options,
            correctOption: data.question.correctOption,
          });
        } else {
          alert(data.message || "Failed to fetch question");
        }
      } catch (err) {
        console.error(err);
        alert("Server error, try again later");
      }
    };

    if (questionId) fetchQuestion();
  }, [questionId]);

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectOptionChange = (e) => {
    setFormData({ ...formData, correctOption: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      alert("Question description is required");
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      alert("All four options are required");
      return;
    }

    if (!formData.correctOption) {
      alert("Please select the correct option");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/update-question/${questionId}`, 
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, eventId }), 
        }
      );

      const result = await res.json();

      if (result.success) {
        alert("Question updated successfully!");
        navigate(`/questions/${eventId}`);
      } else {
        alert(result.message || "Error updating question");
      }
    } catch (err) {
      console.error("Error updating question:", err);
      alert("Server error, try again later");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
          Update Question
        </h2>

        {/* Question description */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Question Description</label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter question..."
          />
        </div>

        {/* Options */}
        {formData.options.map((opt, index) => (
          <div key={index} className="mb-3">
            <label className="block font-medium mb-1">Option {index + 1}</label>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={`Enter option ${index + 1}`}
            />
          </div>
        ))}

        {/* Correct option selection */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Correct Option (A-D)</label>
          <input
            type="text"
            value={formData.correctOption}
            onChange={handleCorrectOptionChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter correct option (A, B, C, or D)"
            maxLength={1}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Question
        </button>
      </form>
    </div>
  );
}
