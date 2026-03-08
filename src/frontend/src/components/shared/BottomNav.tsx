import { useApp } from "@/AppContext";
import type { TabId } from "@/types";
import {
  BarChart2,
  Clapperboard,
  Download,
  Film,
  Rocket,
  User,
} from "lucide-react";
import { motion } from "motion/react";

interface AppNavProps {
  /** When true, renders the bottom mobile nav. When false/undefined, renders sidebar. */
  bottom?: boolean;
}

export default function AppNav({ bottom = false }: AppNavProps) {
  const { activeTab, setActiveTab, passenger } = useApp();
  const isManager = passenger?.role === "manager";

  const baseTabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "video", label: "Video", icon: Film },
    { id: "downloads", label: "Downloads", icon: Download },
  ];

  const managerOnlyTabs: {
    id: TabId;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "studio",
      label: "Studio",
      icon: Clapperboard,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart2,
    },
  ];

  const profileTab: { id: TabId; label: string; icon: React.ElementType } = {
    id: "profile",
    label: "Profile",
    icon: User,
  };

  const tabs = isManager
    ? [...baseTabs, ...managerOnlyTabs, profileTab]
    : [...baseTabs, profileTab];

  // ─── Bottom nav (mobile only) ───────────────────────────────────────────────
  if (bottom) {
    return (
      <nav
        className="md:hidden flex items-stretch border-t border-border bg-card"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Main navigation"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const isManagerTab = id === "studio" || id === "analytics";
          return (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              data-ocid={`nav.${id}.tab`}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative min-h-[56px] focus-visible:outline-none focus-visible:bg-secondary/50"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator-bottom"
                  className="absolute top-0 left-2 right-2 h-0.5 rounded-full"
                  style={{
                    background: isManagerTab
                      ? "linear-gradient(90deg, oklch(0.65 0.18 290), oklch(0.55 0.22 300))"
                      : "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive
                    ? isManagerTab
                      ? "text-purple-400"
                      : "text-primary"
                    : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive
                    ? isManagerTab
                      ? "text-purple-400"
                      : "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // ─── Sidebar nav (md+) ──────────────────────────────────────────────────────
  return (
    <aside
      className="hidden md:flex flex-col border-r border-border bg-card shrink-0
        w-16 lg:w-52 xl:w-60
        transition-[width] duration-300"
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-3 lg:px-4 py-4 lg:py-5 border-b border-border">
        <div
          className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-glow-sm"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
          }}
        >
          <Rocket
            className="w-4 h-4 lg:w-5 lg:h-5 text-white"
            strokeWidth={1.5}
          />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <p className="text-sm font-bold font-display gradient-text leading-none">
            Space Media
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
            Inflight Entertainment
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col flex-1 px-2 py-3 gap-1 overflow-y-auto scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const isManagerTab = id === "studio" || id === "analytics";

          return (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={isActive ? "page" : undefined}
              data-ocid={`nav.${id}.tab`}
              className={`relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                xl:py-3
                ${
                  isActive
                    ? isManagerTab
                      ? "bg-purple-500/15 text-purple-400"
                      : "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
            >
              {/* Active indicator pill */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                  style={{
                    background: isManagerTab
                      ? "linear-gradient(180deg, oklch(0.65 0.18 290), oklch(0.55 0.22 300))"
                      : "linear-gradient(180deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <Icon
                className="w-5 h-5 shrink-0 transition-colors"
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span className="hidden lg:block text-sm font-semibold truncate">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
