import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { logout } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;

      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) {
        setUserData(snap.data());
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!auth.currentUser) return null;

  return (
    <div className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-lg font-semibold text-emerald-700">
        HH+ 🌿
      </h1>

      {/* Links */}
      <div className="flex items-center gap-4 text-sm">

        {userData?.role === "ngo" && (
          <Link to="/ngo-dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
        )}

        {userData?.role === "volunteer" && (
          <Link to="/volunteer-dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
        )}

        {userData?.role === "community" && (
          <Link to="/request-help" className="hover:text-indigo-600">
            Request Help
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}