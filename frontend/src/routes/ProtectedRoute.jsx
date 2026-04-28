import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children, allowedRole }) {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser;

            if (!user) {
                setLoading(false);
                return;
            }

            const docRef = doc(db, "users", user.uid);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                setUserData(snap.data());
            }

            setLoading(false);
        };

        checkUser();
    }, []);

    // ⏳ Loading state
    if (loading) {
        return <p className="text-center mt-10">Checking access...</p>;
    }

    // ❌ Not logged in
    if (!auth.currentUser) {
        return <Navigate to="/login" />;
    }

    // ❌ Role mismatch
    if (allowedRole && userData?.role !== allowedRole) {
        return <Navigate to="/" />;
    }

    // ❌ Profile incomplete
    if (!userData?.isProfileComplete) {
        if (userData?.role === "volunteer") {
            return <Navigate to="/profile/volunteer" />;
        } else if (userData?.role === "community") {
            return <Navigate to="/profile/community" />;
        } else if (userData?.role === "ngo") {
            return <Navigate to="/profile/ngo" />;
        }
    }

    // ✅ Allowed
    return children;
}