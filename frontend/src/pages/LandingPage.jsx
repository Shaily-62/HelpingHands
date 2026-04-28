import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="font-sans">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 bg-green-800 text-white">
        <h2 className="text-lg sm:text-xl font-semibold">HelpingHands 🌿</h2>

        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-3 sm:px-4 py-1.5 text-sm bg-white text-green-800 rounded-lg hover:bg-green-100"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-3 sm:px-4 py-1.5 text-sm bg-emerald-500 rounded-lg hover:bg-emerald-600"
          >
            Signup
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center px-4 sm:px-8 py-16 sm:py-24 bg-gradient-to-br from-green-50 to-emerald-100">
        <h1 className="text-2xl sm:text-4xl font-bold text-green-900 mb-4">
          Smart Volunteer Coordination Platform
        </h1>

        <p className="text-sm sm:text-lg text-green-700 max-w-xl mx-auto">
          Connecting communities, NGOs, and volunteers in real-time to deliver help faster.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Get Started
        </button>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-8 py-12 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-8">
          Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-green-50 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold mb-2">📥 Easy Requests</h3>
            <p className="text-sm text-green-700">
              Submit help requests quickly
            </p>
          </div>

          <div className="p-5 bg-green-50 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold mb-2">🤖 Smart Matching</h3>
            <p className="text-sm text-green-700">
              Find the best volunteer instantly
            </p>
          </div>

          <div className="p-5 bg-green-50 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold mb-2">📍 Live Tracking</h3>
            <p className="text-sm text-green-700">
              See requests on map in real-time
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 sm:px-8 py-12 bg-green-100 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-6">
          How It Works
        </h2>

        <div className="space-y-2 text-green-800 text-sm sm:text-base">
          <p>1. User submits request</p>
          <p>2. System matches volunteer</p>
          <p>3. Task assigned & completed</p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 py-12 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-4">
          Ready to Make Impact?
        </h2>

        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Join Now
        </button>
      </section>

    </div>
  );
}