import { useApp } from "@/AppContext";
import type { ThemeDefinition, ThemeId } from "@/types";
import { CheckCircle } from "lucide-react";
import { motion } from "motion/react";

const THEMES: ThemeDefinition[] = [
  {
    id: "nebula",
    name: "Nebula",
    imageUrl: "/assets/generated/theme-nebula.dim_400x200.jpg",
    dataAttr: "",
  },
  {
    id: "dark",
    name: "Dark Space",
    imageUrl: "/assets/generated/theme-dark.dim_400x200.jpg",
    dataAttr: "dark",
  },
  {
    id: "aurora",
    name: "Aurora",
    imageUrl: "/assets/generated/theme-aurora.dim_400x200.jpg",
    dataAttr: "aurora",
  },
  {
    id: "crimson",
    name: "Crimson",
    imageUrl: "/assets/generated/theme-crimson.dim_400x200.jpg",
    dataAttr: "crimson",
  },
  {
    id: "ocean",
    name: "Ocean",
    imageUrl: "/assets/generated/theme-ocean.dim_400x200.jpg",
    dataAttr: "ocean",
  },
  {
    id: "desert",
    name: "Desert",
    imageUrl: "/assets/generated/theme-desert.dim_400x200.jpg",
    dataAttr: "desert",
  },
  {
    id: "arctic",
    name: "Arctic",
    imageUrl: "/assets/generated/theme-arctic.dim_400x200.jpg",
    dataAttr: "arctic",
  },
  {
    id: "neon",
    name: "Neon",
    imageUrl: "/assets/generated/theme-neon.dim_400x200.jpg",
    dataAttr: "neon",
  },
];

export default function ThemeChooser() {
  const { settings, updateSettings } = useApp();
  const currentTheme = settings.theme as ThemeId;

  function handleSelect(theme: ThemeDefinition) {
    updateSettings({ theme: theme.id });
    document.documentElement.setAttribute("data-theme", theme.dataAttr);
  }

  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        App Theme
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((theme, i) => {
          const isSelected = currentTheme === theme.id;
          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleSelect(theme)}
              className={`relative rounded-xl overflow-hidden focus:outline-none transition-all ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-offset-background ring-primary"
                  : "hover:opacity-90"
              }`}
            >
              <img
                src={theme.imageUrl}
                alt={theme.name}
                className="w-full h-16 object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 pb-1.5">
                <p className="text-white text-xs font-semibold">{theme.name}</p>
                {isSelected && (
                  <CheckCircle
                    className="w-4 h-4"
                    style={{ color: "oklch(var(--theme-accent))" }}
                  />
                )}
              </div>
              {isSelected && (
                <div className="absolute inset-0 ring-2 ring-primary rounded-xl pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
