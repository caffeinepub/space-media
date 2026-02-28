import { useApp } from "@/AppContext";
import type { TabId } from "@/types";
import { Download, Film, Music, User } from "lucide-react";
import { motion } from "motion/react";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "video", label: "Video", icon: Film },
  { id: "music", label: "Music", icon: Music },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav
      className="flex items-stretch border-t border-border bg-card"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            type="button"
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative min-h-[56px]"
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute top-0 left-2 right-2 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <Icon
              className={`w-5 h-5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              strokeWidth={isActive ? 2.2 : 1.8}
            />
            <span
              className={`text-[10px] font-semibold transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
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
