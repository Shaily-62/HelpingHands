import { useState } from "react";
import { db, auth } from "../../config/firebase.config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function NGOProfile() {
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("general");
  const [description, setDescription] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const orgTypes = [
    "healthcare",
    "education",
    "disaster",
    "food",
    "general"
  ];

  const handleSubmit = async () => {
    if (!orgName || !phone) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        organizationName: orgName,
        phone,
        address,
        organizationType: type,
        description,
        registrationNumber: regNumber,

        verified: false, // future feature

        isProfileComplete: true,
        createdAt: serverTimestamp()
      });

      alert("NGO profile saved successfully 🎉");

      navigate("/ngo-dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">

      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-md">

        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          NGO Profile 🏢
        </h2>

        {/* Organization Name */}
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Contact Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Address */}
        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Organization Type */}
        <p className="text-sm font-medium mb-2">Organization Type</p>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          {orgTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          placeholder="Describe your organization"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Registration Number */}
        <input
          type="text"
          placeholder="Registration Number (optional)"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </div>
    </div>
  );
}