import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff, KeyRound, Rocket } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
interface StaffKeyScreenProps {
  onSuccess: () => void;
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  width: ((i * 7 + 13) % 3) + 1,
  height: ((i * 11 + 7) % 3) + 1,
  left: (i * 37 + 17) % 100,
  top: (i * 53 + 29) % 100,
  opacity: ((i * 17 + 11) % 6) / 10 + 0.1,
  duration: ((i * 13 + 5) % 3) + 2,
  delay: (i * 7 + 3) % 3,
}));

export default function StaffKeyScreen({ onSuccess }: StaffKeyScreenProps) {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const STAFF_KEY = "SPACE2024";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) {
      setError("Please enter the staff special key.");
      return;
    }
    setLoading(true);
    setError("");

    // Client-side validation (prototype)
    await new Promise((r) => setTimeout(r, 600)); // Simulate network

    if (key.trim().toUpperCase() !== STAFF_KEY) {
      setError("Invalid key. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  }

  return (
    <div
      className="flex flex-col min-h-dvh items-center justify-center px-6 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, oklch(0.20 0.08 290 / 0.5), transparent 60%), oklch(var(--background))",
      }}
    >
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.height,
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.opacity,
            }}
            animate={{ opacity: [null, 0.1, 0.8] }}
            transition={{
              duration: star.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: star.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
            className="mb-4 relative"
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-glow"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
              }}
            >
              <Rocket className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-foreground tracking-tight font-display"
          >
            Space Media
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-sm mt-1"
          >
            Inflight Entertainment System
          </motion.p>
        </div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6 border border-border bg-card shadow-card-dark"
        >
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Staff Authorization
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            A staff member must unlock access before passengers can board.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="Enter Staff Special Key"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError("");
                }}
                className="pr-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-base h-12"
                autoComplete="off"
                autoCapitalize="characters"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                border: "none",
                color: "white",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Unlock Access"
              )}
            </Button>
          </form>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6 opacity-50">
          Space Media v2.0 · Orbital Class Entertainment
        </p>
      </motion.div>
    </div>
  );
}
