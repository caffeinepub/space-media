import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AppProvider, useApp } from "./AppContext";

import PassengerSetupScreen from "./components/auth/PassengerSetupScreen";
// Auth
import StaffKeyScreen from "./components/auth/StaffKeyScreen";

import VideoDetail from "./components/video/VideoDetail";
// Video
import VideoHome from "./components/video/VideoHome";
import VideoPlayer from "./components/video/VideoPlayer";

import MiniPlayer from "./components/music/MiniPlayer";
// Music
import MusicHome from "./components/music/MusicHome";
import MusicPlayer from "./components/music/MusicPlayer";

// Search
import SearchScreen from "./components/search/SearchScreen";

// Downloads
import DownloadsTab from "./components/downloads/DownloadsTab";

// Settings
import SettingsTab from "./components/settings/SettingsTab";

import StudioAnalyticsTab from "./components/studio/StudioAnalyticsTab";
// Studio
import StudioTab from "./components/studio/StudioTab";

// Shared
import AppNav from "./components/shared/BottomNav";

// ─── Auth Shell ───────────────────────────────────────────────────────────────

type AuthStep = "staff-key" | "passenger-setup";

function AuthShell() {
  const [step, setStep] = useState<AuthStep>("staff-key");

  return (
    <div className="w-full h-dvh overflow-hidden flex items-center justify-center bg-background">
      <div className="w-full max-w-lg mx-auto h-full overflow-hidden md:h-auto md:max-h-[90vh] md:rounded-2xl md:border md:border-border md:shadow-card-lg">
        <AnimatePresence mode="wait">
          {step === "staff-key" ? (
            <motion.div key="staff" className="h-full">
              <StaffKeyScreen onSuccess={() => setStep("passenger-setup")} />
            </motion.div>
          ) : (
            <motion.div key="setup" className="h-full">
              <PassengerSetupScreen onBack={() => setStep("staff-key")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main App Shell ───────────────────────────────────────────────────────────

function MainApp() {
  const {
    activeTab,
    musicPlayer,
    showMusicPlayer,
    setShowMusicPlayer,
    showVideoPlayer,
    showSearch,
    searchInitialTab,
    selectedVideo,
    setSelectedVideo,
    passenger,
  } = useApp();

  const hasMusicTrack = !!musicPlayer.currentTrack;

  return (
    // On md+: flex-row so sidebar sits on the left, content fills rest
    <div className="w-full h-dvh flex flex-col md:flex-row overflow-hidden relative bg-background">
      {/* Sidebar nav — visible on md+ */}
      <AppNav />

      {/* Main content column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Content area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0"
            >
              {activeTab === "video" &&
                (selectedVideo ? (
                  <VideoDetail
                    video={selectedVideo}
                    onBack={() => setSelectedVideo(null)}
                    onSelect={setSelectedVideo}
                  />
                ) : (
                  <VideoHome onSelectVideo={setSelectedVideo} />
                ))}
              {activeTab === "music" && <MusicHome />}
              {activeTab === "downloads" && <DownloadsTab />}
              {activeTab === "studio" && passenger?.role === "manager" && (
                <StudioTab />
              )}
              {activeTab === "analytics" && passenger?.role === "manager" && (
                <StudioAnalyticsTab />
              )}
              {activeTab === "profile" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini player — hidden on md+ when sidebar already provides layout context */}
        <AnimatePresence>
          {hasMusicTrack && !showMusicPlayer && (
            <MiniPlayer onExpand={() => setShowMusicPlayer(true)} />
          )}
        </AnimatePresence>

        {/* Bottom nav — mobile only (md+ uses sidebar in AppNav) */}
        <AppNav bottom />
      </div>

      {/* Full music player overlay */}
      <AnimatePresence>
        {showMusicPlayer && hasMusicTrack && (
          <MusicPlayer onClose={() => setShowMusicPlayer(false)} />
        )}
      </AnimatePresence>

      {/* Video player overlay */}
      <AnimatePresence>{showVideoPlayer && <VideoPlayer />}</AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {showSearch && <SearchScreen initialTab={searchInitialTab} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

function AppInner() {
  const { isAuthenticated } = useApp();

  return (
    <>
      {isAuthenticated ? <MainApp /> : <AuthShell />}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(var(--card))",
            color: "oklch(var(--card-foreground))",
            border: "1px solid oklch(var(--border))",
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
