import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store";
import { ShieldAlert, Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useToastStore } from "@/store/toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loadUser, token } = useAuthStore();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      await loadUser();
      addToast({ type: "success", title: "Welcome back", message: `Signed in as ${username}` });
      navigate("/dashboard");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
            <ShieldAlert className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Crime Intelligence</h1>
          <p className="mt-1 text-sm text-slate-400">Karnataka State Police</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-xs text-slate-500">
            Use scrb_admin / admin123 to login
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
