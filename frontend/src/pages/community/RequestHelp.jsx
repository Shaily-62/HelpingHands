import { useState } from "react";
import { addRequest } from "../../services/requestService";
import { auth } from "../../config/firebase.config";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView";

export default function RequestHelp() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [type, setType] = useState("food");
    const [urgency, setUrgency] = useState("medium");
    const [location, setLocation] = useState(null);

    const [locLoading, setLocLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    // 📍 Get User Location
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        setLocLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocLoading(false);
            },
            () => {
                alert("Location permission denied ❌");
                setLocLoading(false);
            }
        );
    };

    // 🚀 Submit Request
    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        if (!auth.currentUser) {
            alert("Please login first");
            return;
        }

        try {
            setLoading(true);

            await addRequest({
                title: title.trim(),
                type,
                urgency,

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

            // Reset
            setTitle("");
            setLocation(null);

            navigate("/my-requests");

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">

            <div className="w-full max-w-md bg-white border border-green-100 rounded-2xl p-6 shadow-md">

                {/* Heading */}
                <h2 className="text-xl font-semibold text-green-800 mb-1">
                    Request Help 🌿
                </h2>
                <p className="text-sm text-green-600 mb-6">
                    Submit your request and we’ll connect you with volunteers.
                </p>

                {/* Back */}
                <button
                    onClick={() => navigate("/my-requests")}
                    className="mb-4 text-sm text-emerald-600 underline"
                >
                    ← Go to My Requests
                </button>

                {/* Title */}
                <div className="mb-4">
                    <label className="text-xs text-green-700 mb-1 block">
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Need food supplies"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-green-50 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                </div>

                {/* Type */}
                <div className="mb-4">
                    <label className="text-xs text-green-700 mb-1 block">
                        Type of Help
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-green-50"
                    >
                        <option value="food">🍱 Food</option>
                        <option value="medical">💊 Medical</option>
                        <option value="education">📚 Education</option>
                    </select>
                </div>

                {/* Urgency */}
                <div className="mb-4">
                    <label className="text-xs text-green-700 mb-2 block">
                        Urgency Level
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                        {["low", "medium", "high"].map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setUrgency(level)}
                                className={`py-2 rounded-lg border text-sm
                                    ${urgency === level
                                        ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                                        : "bg-green-50 border-green-200 text-green-600"
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <button
                    onClick={handleGetLocation}
                    disabled={locLoading}
                    className="w-full mb-3 py-2 border border-emerald-400 text-emerald-600 rounded-lg text-sm hover:bg-emerald-50"
                >
                    {locLoading ? "Getting location..." : "📍 Use My Location"}
                </button>

                {/* Map */}
                {location && (
                    <div className="mb-4">
                        <p className="text-xs text-green-600 mb-2">
                            📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </p>

                        <MapView location={location} />
                    </div>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-60"
                >
                    {loading ? "Submitting..." : "Submit Request"}
                </button>
            </div>
        </div>
    );
}