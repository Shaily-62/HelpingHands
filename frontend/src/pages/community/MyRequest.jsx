import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const q = query(
        collection(db, "requests"),
        where("createdBy", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRequests(data);
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-semibold text-green-800 mb-6">
          My Requests 📋
        </h2>

        {requests.length === 0 ? (
          <p className="text-green-600">No requests found.</p>
        ) : (
          <div className="grid gap-4">

            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                {/* Title */}
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  {req.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3">
                  {req.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">

                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
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
                <p className="text-sm">
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

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}