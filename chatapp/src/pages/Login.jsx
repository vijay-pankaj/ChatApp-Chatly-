import { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { connectSocket } from "../services/socket";
import { toast } from "react-toastify";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.warn("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user); // also saves to localStorage via updateUser

      const socket = connectSocket();
      socket.emit("register", res.data.user.id);

      toast.success("Logged in successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 w-full max-w-md">

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 bg-[#185FA5] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path
                d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
                fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[17px] font-medium text-gray-900">Chatly</span>
        </div>

        <h2 className="text-[22px] font-semibold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-7">Sign in to continue to your account</p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full h-[42px] border border-gray-300 rounded-xl px-3.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#185FA5] focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-medium text-gray-700">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs text-[#185FA5] font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full h-[42px] border border-gray-300 rounded-xl px-3.5 text-sm text-gray-900 bg-gray-50 outline-none focus:border-[#185FA5] focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-11 bg-[#185FA5] hover:bg-[#0C447C] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-[15px] font-medium transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 8L8 15M15 8H1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        {/* <div className="flex items-center gap-2.5 my-5">
          <span className="flex-1 h-px bg-gray-200" />
          <p className="text-xs text-gray-400 whitespace-nowrap">or continue with</p>
          <span className="flex-1 h-px bg-gray-200" />
        </div> */}

        {/* Google */}
        {/* <button className="w-full h-[42px] bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl text-sm font-medium text-gray-700 flex items-center justify-center gap-2.5 transition">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.67 3.67 0 0 1-1.6 2.41v2h2.58c1.51-1.39 2.4-3.44 2.4-5.87z" fill="#4285F4" />
            <path d="M8 16c2.16 0 3.97-.71 5.29-1.93l-2.58-2a4.8 4.8 0 0 1-7.15-2.52H.96v2.07A8 8 0 0 0 8 16z" fill="#34A853" />
            <path d="M3.56 9.55A4.8 4.8 0 0 1 3.31 8c0-.54.09-1.06.25-1.55V4.38H.96A8 8 0 0 0 0 8c0 1.29.31 2.51.96 3.62l2.6-2.07z" fill="#FBBC05" />
            <path d="M8 3.18c1.22 0 2.31.42 3.17 1.24l2.37-2.37A8 8 0 0 0 .96 4.38l2.6 2.07C4.27 4.56 5.97 3.18 8 3.18z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button> */}

        <p className="text-center mt-6 text-[13px] text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#185FA5] font-medium hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}