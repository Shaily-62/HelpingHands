import { useEffect, useState } from "react";
import { db } from "../../config/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { getAvailableVolunteers } from "../../services/volunteerService";
import { assignVolunteer } from "../../services/assignmentService";
import { getBestVolunteers } from "../../utils/matchVolunteer";

export default function NGODashboard() {
    const [requests, setRequests] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    // 🔄 Fetch Requests
    const fetchRequests = async () => {
        try {
            const snapshot = await getDocs(collection(db, "requests"));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(data);
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    };

    // 🔄 Fetch Volunteers
    const fetchVolunteers = async () => {
        try {
            const data = await getAvailableVolunteers();
            setVolunteers(data);
        } catch (err) {
            console.error("Error fetching volunteers:", err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setPageLoading(true);
            await Promise.all([fetchRequests(), fetchVolunteers()]);
            setPageLoading(false);
        };
        init();
    }, []);

    // 🚀 Handle Assignment
    const handleAssign = async (volunteerId) => {
        try {
            setLoading(true);

            await assignVolunteer(selectedRequest, volunteerId);

            alert("Volunteer assigned successfully ✅");

            setSelectedRequest(null);

            // 🔄 Refresh data
            await Promise.all([fetchRequests(), fetchVolunteers()]);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🧠 Matching Logic
    const selectedReqObj = requests.find(r => r.id === selectedRequest);

    const matchedVolunteers = selectedReqObj
        ? getBestVolunteers(selectedReqObj, volunteers)
        : [];

    // 🟡 Page Loader
    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-indigo-600">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

            <div className="max-w-5xl mx-auto">

                {/* Heading */}
                <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
                    NGO Dashboard 🏢
                </h2>

                {/* Requests */}
                {requests.length === 0 ? (
                    <p className="text-indigo-600">No requests available</p>
                ) : (
                    <div className="grid gap-4">

                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                            >
                                {/* Title */}
                                <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                                    {req.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-3">
                                    {req.description || "No description"}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-3">

                                    <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                                        {req.type}
                                    </span>

                                    <span className={`px-2 py-1 text-xs rounded
                                        ${req.urgency === "high"
                                            ? "bg-red-100 text-red-600"
                                            : req.urgency === "medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-600"}
                                    `}>
                                        {req.urgency}
                                    </span>

                                </div>

                                {/* Status */}
                                <p className="text-sm mb-2">
                                    Status:
                                    <span className={`ml-2 font-medium
                                        ${req.status === "pending"
                                            ? "text-orange-500"
                                            : req.status === "assigned"
                                                ? "text-blue-600"
                                                : "text-green-600"}
                                    `}>
                                        {req.status}
                                    </span>
                                </p>

                                {/* Assigned */}
                                <p className="text-xs text-gray-500 mb-3">
                                    Volunteer: {req.assignedVolunteer || "Not assigned"}
                                </p>

                                {/* Button */}
                                <button
                                    disabled={req.status !== "pending"}
                                    onClick={() => setSelectedRequest(req.id)}
                                    className={`px-4 py-2 text-sm rounded-lg
                                        ${req.status !== "pending"
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"}
                                    `}
                                >
                                    Assign Volunteer
                                </button>

                            </div>
                        ))}

                    </div>
                )}
            </div>

            {/* 🔽 SMART MATCH PANEL */}
            {selectedRequest && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 max-h-[50vh] overflow-y-auto">

                    <h3 className="text-lg font-semibold mb-3">
                        Best Matching Volunteers 🤖
                    </h3>

                    {matchedVolunteers.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No available volunteers
                        </p>
                    ) : (
                        matchedVolunteers.map((vol, index) => (
                            <div
                                key={vol.id}
                                className="flex justify-between items-center mb-2 border p-3 rounded"
                            >
                                <div>
                                    <p className="font-medium">
                                        {vol.name}
                                        {index === 0 && (
                                            <span className="ml-2 text-xs text-green-600 font-bold">
                                                ⭐ Best Match
                                            </span>
                                        )}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {vol.skills?.join(", ")}
                                    </p>

                                    <p className="text-xs text-green-600 font-semibold">
                                        Match Score: {vol.matchScore}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAssign(vol.id)}
                                    disabled={loading}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading ? "Assigning..." : "Assign"}
                                </button>
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => setSelectedRequest(null)}
                        className="mt-3 text-sm text-red-500"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}