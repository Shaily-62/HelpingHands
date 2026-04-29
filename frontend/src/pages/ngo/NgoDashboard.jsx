import { useEffect, useState } from "react";
import { db } from "../../config/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { getAvailableVolunteers } from "../../services/volunteerService";
import { assignVolunteer } from "../../services/assignmentService";
import { getBestVolunteers } from "../../utils/matchVolunteer";
import MapView from "../../components/MapView";

export default function NGODashboard() {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ─────────────────────────────────────────────
  // 🔄 Data Fetching
  // ─────────────────────────────────────────────

  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, "requests"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(data);
    return data;
  };

  const fetchVolunteers = async () => {
    const data = await getAvailableVolunteers();
    setVolunteers(data);
    return data;
  };

  useEffect(() => {
    const init = async () => {
      setPageLoading(true);
      await Promise.all([fetchRequests(), fetchVolunteers()]);
      setPageLoading(false);
    };
    init();
  }, []);

  // ─────────────────────────────────────────────
  // 🚀 Manual Assign
  // ─────────────────────────────────────────────

  const handleAssign = async (volunteerId) => {
    if (loading) return;
    try {
      setLoading(true);
      await assignVolunteer(selectedRequest, volunteerId);
      alert("Volunteer assigned ✅");
      setSelectedRequest(null);
      await Promise.all([fetchRequests(), fetchVolunteers()]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // ⚡ Auto Assign
  // ─────────────────────────────────────────────

  const handleAutoAssign = async (reqId) => {
    if (loading) return;
    try {
      setLoading(true);

      // Re-fetch fresh data before matching so we work with latest state
      const [freshRequests, freshVolunteers] = await Promise.all([
        fetchRequests(),
        fetchVolunteers(),
      ]);

      const requestObj = freshRequests.find((r) => r.id === reqId);
      if (!requestObj) {
        alert("Request not found");
        return;
      }

      const matched = getBestVolunteers(requestObj, freshVolunteers);

      if (!matched.length) {
        alert("No volunteers found. Check skills/availability in Firestore.");
        return;
      }

      // Lower threshold: any positive score is acceptable
      const best = matched[0];
      if (best.matchScore < 10) {
        alert(
          `Closest match is ${best.name} but score is very low (${best.matchScore}). Assign manually?`
        );
        return;
      }

      await assignVolunteer(reqId, best.id);
      alert(`Auto-assigned to ${best.name} (score: ${best.matchScore}) ✅`);

      await Promise.all([fetchRequests(), fetchVolunteers()]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // 🧠 Matching Panel Data
  // ─────────────────────────────────────────────

  const selectedReqObj = requests.find((r) => r.id === selectedRequest);
  const matchedVolunteers = selectedReqObj
    ? getBestVolunteers(selectedReqObj, volunteers)
    : [];

  // ─────────────────────────────────────────────
  // 🟡 Page Loader
  // ─────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-indigo-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // 🖼️ Render
  // ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
          NGO Dashboard 🏢
        </h2>

        {/* ── Requests List ── */}
        {requests.length === 0 ? (
          <p className="text-gray-500">No requests available</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border rounded-xl p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-1">{req.title}</h3>

                <p className="text-sm text-gray-600 mb-2">
                  {req.description || "No description"}
                </p>

                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    {req.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      req.urgency === "high"
                        ? "bg-red-100 text-red-600"
                        : req.urgency === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {req.urgency}
                  </span>
                </div>

                <p className="text-sm mb-1">
                  Status:{" "}
                  <span className="ml-1 font-medium">{req.status}</span>
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Volunteer: {req.assignedVolunteer || "Not assigned"}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRequest(req.id)}
                    disabled={req.status !== "pending"}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded disabled:opacity-40 hover:bg-indigo-700 transition"
                  >
                    Assign
                  </button>

                  <button
                    onClick={() => handleAutoAssign(req.id)}
                    disabled={req.status !== "pending" || loading}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded disabled:opacity-40 hover:bg-green-700 transition"
                  >
                    ⚡ Auto Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Map ── */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Live Map View 🌍</h3>
          <MapView
            requests={requests}
            volunteers={volunteers}
            selectedRequest={selectedRequest}
          />
        </div>
      </div>

      {/* ── Match Panel ── */}
      {selectedRequest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl max-h-[50vh] overflow-y-auto z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Best Matching Volunteers 🤖
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-sm text-red-500 hover:underline"
              >
                Close ✕
              </button>
            </div>

            {matchedVolunteers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No matching volunteers found.</p>
                <p className="text-xs mt-1 text-gray-400">
                  Check that volunteers have matching skills and are marked available in Firestore.
                </p>
              </div>
            ) : (
              matchedVolunteers.map((vol, i) => (
                <div
                  key={vol.id}
                  className="flex items-center justify-between mb-2 border rounded-lg p-3 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {vol.name}
                      {i === 0 && (
                        <span className="text-green-600 text-xs ml-2 bg-green-50 px-1.5 py-0.5 rounded">
                          ⭐ Best Match
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {vol.skills?.join(", ") || "No skills listed"}
                    </p>
                    <p className="text-xs text-green-600 mt-0.5 font-medium">
                      Score: {vol.matchScore}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAssign(vol.id)}
                    disabled={loading}
                    className="bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-40 transition"
                  >
                    Assign
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}