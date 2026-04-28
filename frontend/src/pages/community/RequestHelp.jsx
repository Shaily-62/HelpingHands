import { useState } from "react";
import { addRequest } from "../../services/requestService";
import { auth } from "../../config/firebase.config";
import { useNavigate } from "react-router-dom";

export default function RequestHelp() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("food");
    const [urgency, setUrgency] = useState("medium");
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    // 📍 Get User Location
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setLocation(coords);
                alert("Location captured ✅");
            },
            (error) => {
                alert("Location permission denied ❌");
            }
        );
    };

    // 🚀 Submit Request
    const handleSubmit = async () => {
        if (!title) {
            alert("Please enter a title");
            return;
        }

        try {
            setLoading(true);

            await addRequest({
                title,
                type,
                urgency,

                // 📍 Use real location or fallback
                location: location || {
                    lat: 19.076,
                    lng: 72.877
                },

                status: "pending",
                assignedVolunteer: null,
                createdBy: auth.currentUser.uid,
                createdAt: new Date()
            });

            alert("Request submitted successfully 🎉");
            navigate("/my-requests");

            // Reset
            setTitle("");
            setLocation(null);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 sm:px-6 lg:px-8">

            <div className="w-full max-w-md sm:max-w-lg bg-white border border-green-100 rounded-2xl p-6 sm:p-8 md:p-10 shadow-md">

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-1">
                    Request Help 🌿
                </h2>
                <p className="text-sm text-green-600 mb-6">
                    Submit your request and we’ll connect you with volunteers.
                </p>

                <button
                    onClick={() => navigate("/my-requests")}
                    className="mb-4 text-sm text-emerald-600 underline"
                >
                    ← Go to My Requests
                </button>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-green-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Need food supplies"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    />
                </div>

                {/* Type */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-green-700 mb-1">
                        Type of Help
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                    >
                        <option value="food">🍱 Food</option>
                        <option value="medical">💊 Medical</option>
                        <option value="education">📚 Education</option>
                    </select>
                </div>

                {/* Urgency */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-green-700 mb-2">
                        Urgency Level
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                        {["low", "medium", "high"].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setUrgency(level)}
                                className={`py-2 rounded-lg text-sm font-medium border transition
                                ${urgency === level
                                        ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                                        : "bg-green-50 border-green-200 text-green-600 hover:border-emerald-300"
                                    }`}
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 📍 Location Button */}
                <button
                    onClick={handleGetLocation}
                    className="w-full mb-3 py-2 bg-white border border-emerald-400 text-emerald-600 rounded-lg text-sm hover:bg-emerald-50 transition"
                >
                    📍 Use My Location
                </button>

                {/* Show location */}
                {location && (
                    <p className="text-xs text-green-600 mb-3">
                        Location: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
                    </p>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition"
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </div>
        </div>
    );
}