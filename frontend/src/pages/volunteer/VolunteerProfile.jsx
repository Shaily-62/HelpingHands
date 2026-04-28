import { useState } from "react";
import { db, auth } from "../../config/firebase.config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VolunteerProfile() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [experience, setExperience] = useState("beginner");
  const [distance, setDistance] = useState(5);
  const [loading, setLoading] = useState(false);

  const skillOptions = [
    "medical",
    "education",
    "food_distribution",
    "transport",
    "elder_care"
  ];

  const languageOptions = ["english", "hindi", "marathi"];

  // Toggle selection
  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    if (!phone || skills.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        phone,
        skills,
        languages,
        experienceLevel: experience,
        preferredDistance: Number(distance),

        availability: {
          isAvailable: true,
          lastUpdated: serverTimestamp()
        },

        rating: 0,
        completedTasks: 0,
        isProfileComplete: true,
        createdAt: serverTimestamp()
      });

      alert("Profile saved successfully 🎉");

      navigate("/volunteer-dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">

      <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-md">

        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
          Complete Your Profile 🙋
        </h2>

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* Skills */}
        <p className="text-sm font-medium mb-2">Select Skills</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleItem(skill, skills, setSkills)}
              className={`px-3 py-1 rounded-full text-sm border
                ${skills.includes(skill)
                  ? "bg-indigo-100 border-indigo-500"
                  : "bg-gray-100"}
              `}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Languages */}
        <p className="text-sm font-medium mb-2">Languages</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {languageOptions.map((lang) => (
            <button
              key={lang}
              onClick={() => toggleItem(lang, languages, setLanguages)}
              className={`px-3 py-1 rounded-full text-sm border
                ${languages.includes(lang)
                  ? "bg-green-100 border-green-500"
                  : "bg-gray-100"}
              `}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Experience */}
        <p className="text-sm font-medium mb-2">Experience Level</p>
        <select
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        {/* Distance */}
        <p className="text-sm font-medium mb-2">
          Preferred Distance (km)
        </p>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
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