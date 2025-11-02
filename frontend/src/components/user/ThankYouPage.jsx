export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          🎉 Thank You for Participating!
        </h1>
        <p className="text-gray-700 mb-6">
          Your quiz has been successfully submitted.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
