import { useState } from "react";
import { db, auth } from "../../config/firebase.config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CommunityProfile() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [familySize, setFamilySize] = useState(1);
    const [helpTypes, setHelpTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const helpOptions = ["food", "medical", "education", "shelter"];

    // Toggle selection
    const toggleHelp = (type) => {
        if (helpTypes.includes(type)) {
            setHelpTypes(helpTypes.filter(t => t !== type));
        } else {
            setHelpTypes([...helpTypes, type]);
        }
    };

    const handleSubmit = async () => {
        if (!phone || helpTypes.length === 0) {
            alert("Please fill required fields");
            return;
        }

        try {
            setLoading(true);

            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                phone,
                address,
                familySize: Number(familySize),
                preferredHelpTypes: helpTypes,

                isProfileComplete: true,
                createdAt: serverTimestamp()
            });

            alert("Profile saved successfully 🎉");

            navigate("/request-help"); // go to request page

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">

            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-md">

                <h2 className="text-xl font-semibold text-green-800 mb-4">
                    Complete Your Profile 🌿
                </h2>

                {/* Phone */}
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                />

                {/* Address */}
                <textarea
                    placeholder="Your Address (optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                />

                {/* Family Size */}
                <input
                    type="number"
                    placeholder="Family Size"
                    value={familySize}
                    onChange={(e) => setFamilySize(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded-lg"
                />

                {/* Help Types */}
                <p className="text-sm font-medium mb-2">Type of Help Needed</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {helpOptions.map((type) => (
                        <button
                            key={type}
                            onClick={() => toggleHelp(type)}
                            className={`px-3 py-1 rounded-full text-sm border
                ${helpTypes.includes(type)
                                    ? "bg-green-100 border-green-500"
                                    : "bg-gray-100"}
              `}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 text-white rounded-lg"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>

            </div>
        </div>
    );
}