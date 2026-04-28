import { useState } from "react";
import { signup } from "../../services/authService";

const ROLES = [
    { value: "community", label: "Community", icon: "🏘" },
    { value: "volunteer", label: "Volunteer", icon: "🤝" },
    { value: "ngo", label: "NGO", icon: "🌍" },
];

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("community");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
        if (password.length < 8) errs.password = "Password must be at least 8 characters.";
        return errs;
    };

    const handleSignup = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        setErrors({});
        try {
            await signup(email, password, role);
            alert("Account created successfully!");
        } catch (err) {
            setErrors({ submit: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md sm:max-w-lg bg-white border border-green-100 rounded-2xl p-6 sm:p-8 md:p-10 shadow-md">

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-1 text-center sm:text-left">
                    Join us 🌿
                </h2>
                <p className="text-xs sm:text-sm text-green-600 mb-6 sm:mb-8 text-center sm:text-left">
                    Create your account to get started
                </p>

                {/* Email */}
                <div className="mb-4 sm:mb-5">
                    <label className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="mb-4 sm:mb-5">
                    <label className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Role selector */}
                <div className="mb-6">
                    <label className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-2">
                        I am a...
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {ROLES.map(({ value, label, icon }) => (
                            <button
                                key={value}
                                onClick={() => setRole(value)}
                                className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-sm font-medium transition-all
                            ${role === value
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                        : "border-green-200 bg-green-50 text-green-600 hover:border-emerald-300"
                                    }`}
                            >
                                <span className="text-xl mb-1">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit error */}
                {errors.submit && (
                    <p className="text-xs text-red-500 mb-3">{errors.submit}</p>
                )}

                {/* Button */}
                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-60"
                >
                    {loading ? "Creating account..." : "Create account"}
                </button>

                {/* Footer */}
                <p className="text-center text-xs sm:text-sm text-green-600 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-emerald-700 font-semibold hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}