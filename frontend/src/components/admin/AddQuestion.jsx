import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddQuestion() {
  const [formData, setFormData] = useState({
    description: "",
    options: ["", "", "", ""],
  });
  const navigate = useNavigate();

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!formData.description.trim()) {
      alert("Question description is required");
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      alert("All four options are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-qns", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert(" Question added successfully!");
        navigate("/questions");
      } else {
        alert(result.message || "Error adding question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Server error, please try again later");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">
          Add New Question
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
            <label className="block font-medium mb-1">
              Option {index + 1}
            </label>
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
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Question
        </button>
      </form>
    </div>
  );
}
