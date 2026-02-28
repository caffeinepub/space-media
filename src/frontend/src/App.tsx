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

// Shared
import BottomNav from "./components/shared/BottomNav";

// ─── Auth Shell ───────────────────────────────────────────────────────────────

type AuthStep = "staff-key" | "passenger-setup";

function AuthShell() {
  const [step, setStep] = useState<AuthStep>("staff-key");

  return (
    <div className="w-full max-w-[480px] mx-auto h-dvh overflow-hidden">
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
  } = useApp();

  const hasMusicTrack = !!musicPlayer.currentTrack;

  return (
    <div className="w-full max-w-[480px] mx-auto h-dvh flex flex-col overflow-hidden relative">
      {/* Main content area */}
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
            {activeTab === "profile" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini player */}
      <AnimatePresence>
        {hasMusicTrack && !showMusicPlayer && (
          <MiniPlayer onExpand={() => setShowMusicPlayer(true)} />
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <BottomNav />

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
