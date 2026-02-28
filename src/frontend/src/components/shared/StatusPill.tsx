import { useApp } from "@/AppContext";
import { Wifi, WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function StatusPill() {
  const { isConnected } = useApp();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isConnected ? "connected" : "offline"}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
          isConnected
            ? "bg-green-500/15 text-green-400 border border-green-500/25"
            : "bg-red-500/15 text-red-400 border border-red-500/25"
        }`}
      >
        {isConnected ? (
          <>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <Wifi className="w-3 h-3" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
