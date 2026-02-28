import { useApp } from "@/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Passenger, PassengerRole } from "@/types";
import { getFromLocalStorage, setToLocalStorage } from "@/useLocalStorage";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Rocket,
  User,
  UserSearch,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface PassengerSetupScreenProps {
  onBack: () => void;
}

type Mode = "create" | "find";

export default function PassengerSetupScreen({
  onBack,
}: PassengerSetupScreenProps) {
  const { login } = useApp();
  const [mode, setMode] = useState<Mode>("create");

  // Create mode fields
  const [role, setRole] = useState<PassengerRole>("tourist");
  const [name, setName] = useState("");
  const [passportId, setPassportId] = useState("");
  const [tripId, setTripId] = useState("");

  // Find mode fields
  const [findId, setFindId] = useState("");
  const [foundPassenger, setFoundPassenger] = useState<Passenger | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Create ────────────────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Passenger name is required.");
      return;
    }
    if (!tripId.trim()) {
      setError("Trip ID is required.");
      return;
    }

    setLoading(true);
    setError("");

    const newId = uuidv4();
    const passenger: Passenger = {
      id: newId,
      name: name.trim(),
      role,
      tripId: tripId.trim(),
      passportId: passportId.trim() || undefined,
      createdAt: Date.now(),
    };

    // Save to localStorage
    const passengers = getFromLocalStorage<Record<string, Passenger>>(
      "sm_passengers",
      {},
    );
    passengers[newId] = passenger;
    setToLocalStorage("sm_passengers", passengers);

    setLoading(false);
    login(passenger);
  }

  // ─── Find ──────────────────────────────────────────────────────────────────

  async function handleFind(e: React.FormEvent) {
    e.preventDefault();
    if (!findId.trim()) {
      setError("Passenger ID is required.");
      return;
    }

    setLoading(true);
    setError("");
    setFoundPassenger(null);

    // Search localStorage
    const passengers = getFromLocalStorage<Record<string, Passenger>>(
      "sm_passengers",
      {},
    );
    const found = passengers[findId.trim()];
    if (found) {
      setFoundPassenger(found);
    } else {
      setError("Passenger not found. Please check the ID and try again.");
    }

    setLoading(false);
  }

  function handleLoginFound() {
    if (foundPassenger) {
      login(foundPassenger);
    }
  }

  return (
    <div
      className="flex flex-col min-h-dvh px-6 py-8 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 10%, oklch(0.20 0.08 290 / 0.4), transparent 50%), oklch(var(--background))",
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-8 z-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mr-3"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
            }}
          >
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-foreground font-display">
            Passenger Setup
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-xl bg-secondary p-1 mb-6 z-10">
        <button
          type="button"
          onClick={() => {
            setMode("create");
            setError("");
            setFoundPassenger(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "create"
              ? "bg-card text-foreground shadow-card-dark"
              : "text-muted-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          Create New
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("find");
            setError("");
            setFoundPassenger(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            mode === "find"
              ? "bg-card text-foreground shadow-card-dark"
              : "text-muted-foreground"
          }`}
        >
          <UserSearch className="w-4 h-4" />
          Find Existing
        </button>
      </div>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {mode === "create" ? (
          <motion.form
            key="create"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleCreate}
            className="space-y-5 z-10"
          >
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm text-muted-foreground">
                Passenger Role
              </Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as PassengerRole)}
              >
                <SelectTrigger className="h-12 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourist">
                    <div>
                      <div className="font-semibold">Tourist</div>
                      <div className="text-xs text-muted-foreground">
                        30-day offline license
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="scientist">
                    <div>
                      <div className="font-semibold">Scientist</div>
                      <div className="text-xs text-muted-foreground">
                        180-day offline license
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Passenger Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Full name"
                className="h-12 bg-secondary border-border text-base"
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="passport"
                className="text-sm text-muted-foreground"
              >
                Passport / ID <span className="text-xs">(optional)</span>
              </Label>
              <Input
                id="passport"
                value={passportId}
                onChange={(e) => setPassportId(e.target.value)}
                placeholder="Passport or ID number"
                className="h-12 bg-secondary border-border text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trip" className="text-sm text-muted-foreground">
                Trip ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="trip"
                value={tripId}
                onChange={(e) => {
                  setTripId(e.target.value);
                  setError("");
                }}
                placeholder="e.g. ORBIT-2024-A7"
                className="h-12 bg-secondary border-border text-base"
                autoCapitalize="characters"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
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
                  Creating...
                </span>
              ) : (
                "Create New Passenger"
              )}
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="find"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 z-10"
          >
            <form onSubmit={handleFind} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="findId"
                  className="text-sm text-muted-foreground"
                >
                  Passenger ID
                </Label>
                <Input
                  id="findId"
                  value={findId}
                  onChange={(e) => {
                    setFindId(e.target.value);
                    setError("");
                    setFoundPassenger(null);
                  }}
                  placeholder="Enter Passenger ID (UUID)"
                  className="h-12 bg-secondary border-border text-base font-mono text-sm"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                variant="secondary"
                className="w-full h-12 text-base font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    <UserSearch className="w-4 h-4 mr-2" />
                    Find Passenger
                  </>
                )}
              </Button>
            </form>

            <AnimatePresence>
              {foundPassenger && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-card border border-border p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-foreground">
                      Passenger found
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-semibold">
                        {foundPassenger.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role</span>
                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs ${
                          foundPassenger.role === "scientist"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {foundPassenger.role}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trip</span>
                      <span className="font-mono text-xs">
                        {foundPassenger.tripId}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleLoginFound}
                    className="w-full h-10 font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                      border: "none",
                      color: "white",
                    }}
                  >
                    Login as {foundPassenger.name}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Demo hint */}
            <p className="text-xs text-muted-foreground text-center opacity-60">
              Use "Create New Passenger" for first-time boarding
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
