import { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase.config";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

export default function VolunteerDashboard() {
    const [tasks, setTasks] = useState([]);

    // Fetch assigned tasks
    const fetchTasks = async () => {
        const q = query(
            collection(db, "requests"),
            where("assignedVolunteer", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Mark as completed
    const markCompleted = async (id) => {
        await updateDoc(doc(db, "requests", id), {
            status: "completed"
        });

        alert("Task completed ✅");

        fetchTasks(); // refresh
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">

            <div className="max-w-4xl mx-auto">

                <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
                    Volunteer Dashboard 🙋
                </h2>

                {tasks.length === 0 ? (
                    <p className="text-indigo-600">No assigned tasks</p>
                ) : (

                    <div className="grid gap-4">

                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm"
                            >

                                <h3 className="text-lg font-semibold text-indigo-800">
                                    {task.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-2">
                                    {task.description}
                                </p>

                                <p className="text-xs mb-1">
                                    Type: {task.type}
                                </p>

                                <p className="text-xs mb-2">
                                    Urgency: {task.urgency}
                                </p>

                                <p className="text-sm mb-3">
                                    Status:
                                    <span className={`ml-2
                    ${task.status === "completed"
                                            ? "text-green-600"
                                            : "text-blue-600"}
                  `}>
                                        {task.status}
                                    </span>
                                </p>

                                {/* Complete Button */}
                                {task.status !== "completed" && (
                                    <button
                                        onClick={() => markCompleted(task.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        Mark as Completed
                                    </button>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}