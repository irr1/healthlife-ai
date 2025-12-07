export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">HealthLife AI</h1>
        <p className="text-2xl mb-8">Your Personal AI Health Coach</p>
        <a
          href="/focus"
          className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
