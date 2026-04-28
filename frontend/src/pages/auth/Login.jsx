import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
        if (!password) errs.password = "Password is required.";
        return errs;
    };

    const handleLogin = async () => {
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // 🔐 Login user
            await login(email, password);

            const user = auth.currentUser;

            // 📦 Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (!userDoc.exists()) {
                throw new Error("User data not found");
            }

            const userData = userDoc.data();

            // 🚀 REDIRECTION LOGIC

            if (!userData.isProfileComplete) {
                // 👇 Send to profile form
                if (userData.role === "volunteer") {
                    navigate("/volunteer-profile");
                } else if (userData.role === "community") {
                    navigate("/community-profile");
                } else if (userData.role === "ngo") {
                    navigate("/ngo-profile");
                }
            } else {
                // 👇 Send to dashboard
                if (userData.role === "volunteer") {
                    navigate("/volunteer-dashboard");
                } else if (userData.role === "community") {
                    navigate("/request-help");
                } else if (userData.role === "ngo") {
                    navigate("/ngo-dashboard");
                }
            }

        } catch (err) {
            const msg =
                err.code === "auth/user-not-found" ? "No account found with this email." :
                    err.code === "auth/wrong-password" ? "Incorrect password. Try again." :
                        err.code === "auth/too-many-requests" ? "Too many attempts. Please wait a moment." :
                            err.message;

            setErrors({ submit: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md sm:max-w-lg bg-white border border-green-100 rounded-2xl p-6 sm:p-8 md:p-10 shadow-md">

                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-semibold text-green-800 mb-1 text-center sm:text-left">
                    Welcome back
                </h2>
                <p className="text-xs sm:text-sm text-green-600 mb-6 sm:mb-8 text-center sm:text-left">
                    Sign in to your account
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
                <div className="mb-2">
                    <label className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 text-sm border border-green-200 rounded-lg bg-green-50 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end mb-5 sm:mb-6">
                    <a
                        href="/forgot-password"
                        className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                    >
                        Forgot password?
                    </a>
                </div>

                {/* Submit error */}
                {errors.submit && (
                    <p className="text-xs text-red-500 text-center mb-3">{errors.submit}</p>
                )}

                {/* Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-60"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4 sm:my-5">
                    <div className="flex-1 h-px bg-green-100" />
                    <span className="text-xs text-green-400">or</span>
                    <div className="flex-1 h-px bg-green-100" />
                </div>

                {/* Signup */}
                <p className="text-center text-xs sm:text-sm text-green-600">
                    Don't have an account?{" "}
                    <a
                        href="/signup"
                        className="text-emerald-700 font-semibold hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}