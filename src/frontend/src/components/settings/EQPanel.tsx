import { useApp } from "@/AppContext";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const BANDS = ["60Hz", "250Hz", "1kHz", "4kHz", "16kHz"];
const PRESETS: Record<string, number[]> = {
  Flat: [0, 0, 0, 0, 0],
  "Bass Boost": [8, 6, 0, -2, -3],
  "Treble Boost": [-3, -2, 0, 5, 8],
  Vocal: [-2, 0, 4, 4, 1],
};

export default function EQPanel() {
  const { settings, updateSettings } = useApp();
  const bands = settings.eqBands ?? [0, 0, 0, 0, 0];
  const preset = settings.eqPreset ?? "Flat";

  function handlePreset(name: string) {
    updateSettings({ eqPreset: name, eqBands: PRESETS[name] });
  }

  function handleBand(index: number, value: number) {
    const newBands = [...bands];
    newBands[index] = value;
    updateSettings({ eqBands: newBands, eqPreset: "Custom" });
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Equalizer
      </h3>

      {/* Preset buttons */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {Object.keys(PRESETS).map((name) => (
          <button
            type="button"
            key={name}
            onClick={() => handlePreset(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              preset === name
                ? "text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            style={
              preset === name
                ? {
                    background:
                      "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                  }
                : undefined
            }
          >
            {name}
          </button>
        ))}
        {preset === "Custom" && (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            Custom
          </span>
        )}
      </div>

      {/* 5 Band sliders */}
      <div className="flex gap-4 justify-between px-1">
        {BANDS.map((band, i) => (
          <div key={band} className="flex flex-col items-center gap-2 flex-1">
            <span className="text-xs font-medium text-foreground w-5 text-center">
              {bands[i] > 0 ? `+${bands[i]}` : bands[i]}
            </span>
            <div className="h-32 flex items-center justify-center">
              <Slider
                orientation="vertical"
                value={[bands[i]]}
                onValueChange={(val) => handleBand(i, val[0])}
                min={-12}
                max={12}
                step={1}
                className="h-full"
              />
            </div>
            <span
              className="text-[9px] text-muted-foreground text-center"
              style={{ lineHeight: 1.2 }}
            >
              {band}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-3 text-center opacity-60">
        EQ is visual only in prototype mode
      </p>
    </div>
  );
}
