import { useApp } from "@/AppContext";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { DownloadQuality } from "@/types";
import {
  Clapperboard,
  LogOut,
  Shield,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import EQPanel from "./EQPanel";
import ThemeChooser from "./ThemeChooser";

function getRoleLabel(role: string): { text: string; class: string } {
  switch (role) {
    case "manager":
      return { text: "Manager", class: "bg-purple-500/20 text-purple-400" };
    case "staff":
      return { text: "Staff", class: "bg-green-500/20 text-green-400" };
    case "scientist":
      return { text: "Scientist", class: "bg-blue-500/20 text-blue-400" };
    default:
      return { text: "Tourist", class: "bg-amber-500/20 text-amber-400" };
  }
}

function getLicenseText(role: string): string {
  switch (role) {
    case "manager":
      return "Manager: 365-day offline license";
    case "staff":
      return "Staff: 180-day offline license";
    case "scientist":
      return "Scientist: 180-day offline license";
    default:
      return "Tourist: 30-day offline license";
  }
}

export default function SettingsTab() {
  const {
    passenger,
    logout,
    settings,
    updateSettings,
    isConnected,
    toggleConnection,
  } = useApp();

  const role = passenger?.role ?? "tourist";
  const licenseText = getLicenseText(role);
  const roleLabel = getRoleLabel(role);
  const isManager = role === "manager";
  const isStaff = role === "staff";

  const qualities: DownloadQuality[] = ["low", "medium", "high"];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold font-display text-foreground">
          Settings
        </h1>
        <StatusPill />
      </div>

      <div className="px-4 space-y-6 pb-24">
        {/* ─── Profile ─────────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Profile
          </h3>
          <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                }}
              >
                {isManager ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground">
                  {passenger?.name ?? "Unknown"}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${roleLabel.class}`}
                  >
                    {roleLabel.text}
                  </span>
                  {isManager && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    >
                      <Clapperboard className="w-2.5 h-2.5" />
                      Studio Access
                    </motion.span>
                  )}
                  {isStaff && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                      Staff
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passenger ID</span>
                <span className="font-mono text-xs text-foreground truncate max-w-[160px]">
                  {passenger?.id ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trip ID</span>
                <span className="font-semibold text-foreground">
                  {passenger?.tripId ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">License</span>
                <span className="text-xs font-medium text-green-400">
                  {licenseText}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </section>

        {/* ─── Theme ───────────────────────────────── */}
        <section>
          <ThemeChooser />
        </section>

        {/* ─── Equalizer ───────────────────────────── */}
        <section>
          <div className="bg-card rounded-2xl border border-border p-4">
            <EQPanel />
          </div>
        </section>

        {/* ─── Download Quality ────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Download Quality
          </h3>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              {qualities.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => updateSettings({ downloadQuality: q })}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    settings.downloadQuality === q
                      ? "text-white"
                      : "text-muted-foreground"
                  }`}
                  style={
                    settings.downloadQuality === q
                      ? {
                          background:
                            "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                        }
                      : undefined
                  }
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {settings.downloadQuality === "low"
                ? "Saves space, lower quality (480p)"
                : settings.downloadQuality === "medium"
                  ? "Balanced quality (720p)"
                  : "Best quality, uses more space (1080p+)"}
            </p>
          </div>
        </section>

        {/* ─── Connection ──────────────────────────── */}
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Connection
          </h3>
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Simulate Offline Mode
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isConnected
                      ? "Currently connected to local server"
                      : "Server unreachable"}
                  </p>
                </div>
              </div>
              <Switch
                checked={!isConnected}
                onCheckedChange={toggleConnection}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground opacity-40">
            Space Media v2.0 · Orbital Class Entertainment
          </p>
          <p className="text-xs text-muted-foreground opacity-40 mt-1">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
