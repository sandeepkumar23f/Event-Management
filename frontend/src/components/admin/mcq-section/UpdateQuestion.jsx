import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateQuestion() {
  const { id: questionId, eventId } = useParams();
  const [formData, setFormData] = useState({
    description: "",
    options: ["", "", "", ""],
    correctOption: "",
  });
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch the existing question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/questions/${questionId}`,
          { 
            method: "GET",
            credentials: "include" 
          }
        );
        
        // Check if response is OK before parsing JSON
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
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
        console.error("Fetch error:", err);
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
    setFormData({ ...formData, correctOption: e.target.value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(
      `${API_URL}/api/questions/${questionId}`, 
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          description: formData.description.trim(),
          options: formData.options.map(opt => opt.trim()),
          correctOption: formData.correctOption.trim().toUpperCase(),
          eventId: eventId // Make sure this is the correct event ID
        }), 
      }
    );

    const result = await res.json();

    if (result.success) {
      alert(result.message || "Question updated successfully!");
      navigate(`/questions/${eventId}`);
    } else {
      alert(result.message || "Error updating question");
    }
  } catch (err) {
    console.error("Error updating question:", err);
    alert("Server error, try again later");
  } finally {
    setLoading(false);
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
            rows="3"
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
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
            placeholder="Enter correct option (A, B, C, or D)"
            maxLength={1}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {loading ? "Updating..." : "Update Question"}
        </button>
      </form>
    </div>
  );
}