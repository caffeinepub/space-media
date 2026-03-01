import { Button } from "@/components/ui/button";
import { seedStudioMusic, seedStudioVideos } from "@/mockData";
import {
  ArrowLeft,
  BarChart2,
  Film,
  Globe,
  Music,
  TrendingUp,
  Upload,
} from "lucide-react";
import { useMemo } from "react";

interface StudioAnalyticsProps {
  onBack: () => void;
  onUploadVideo: () => void;
  onUploadMusic: () => void;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WEEKLY_VIEWS = [1200, 1850, 1400, 2100, 1750, 2800, 2400];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TOP_CONTENT = [
  { id: "sv1", title: "Stellar Odyssey", type: "video" as const, views: 18400 },
  { id: "sv2", title: "Gravity's Edge", type: "video" as const, views: 15200 },
  {
    id: "sm1",
    title: "Cosmic Drift",
    type: "music" as const,
    views: 12800,
  },
  { id: "sv3", title: "Dark Matter", type: "video" as const, views: 9600 },
  { id: "sm2", title: "Solar Winds", type: "music" as const, views: 7300 },
];

const MOCK_DOWNLOADS = 1247;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 ${
        accent
          ? "bg-purple-500/10 border-purple-500/30"
          : "bg-card border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            accent ? "bg-purple-500/20" : "bg-secondary"
          }`}
        >
          <Icon
            className={`w-3.5 h-3.5 ${accent ? "text-purple-400" : "text-muted-foreground"}`}
          />
        </div>
      </div>
      <span
        className={`text-2xl font-bold leading-none ${
          accent ? "text-purple-300" : "text-foreground"
        }`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
    </div>
  );
}

function WeeklyBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data);

  return (
    <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-foreground">
          Views This Week
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {data.reduce((s, v) => s + v, 0).toLocaleString()} total
        </span>
      </div>

      {/* SVG bar chart */}
      <div className="relative" style={{ paddingBottom: "24px" }}>
        <svg
          viewBox={`0 0 ${data.length * 44} 80`}
          className="w-full overflow-visible"
          aria-label="Weekly views bar chart"
          role="img"
        >
          <title>Weekly Views Bar Chart</title>
          {data.map((val, i) => {
            const barH = Math.max(4, (val / max) * 64);
            const x = i * 44 + 4;
            const y = 70 - barH;
            const isMax = val === max;
            return (
              <g key={DAY_LABELS[i]}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={36}
                  height={barH}
                  rx={4}
                  fill={isMax ? "oklch(0.65 0.18 290)" : "oklch(0.55 0.12 290)"}
                  opacity={isMax ? 1 : 0.6}
                />
                {/* Value label */}
                <text
                  x={x + 18}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="7"
                  fill={isMax ? "oklch(0.85 0.1 290)" : "oklch(0.65 0.05 280)"}
                  fontWeight={isMax ? "700" : "400"}
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
                {/* Day label */}
                <text
                  x={x + 18}
                  y={80}
                  textAnchor="middle"
                  fontSize="8"
                  fill="oklch(0.55 0.03 280)"
                >
                  {DAY_LABELS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function TopContentList() {
  const maxViews = TOP_CONTENT[0].views;

  return (
    <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-foreground">Top 5 Content</h3>
      </div>
      <div className="space-y-3">
        {TOP_CONTENT.map((item, i) => {
          const pct = Math.round((item.views / maxViews) * 100);
          return (
            <div key={item.id} className="flex items-center gap-3">
              {/* Rank */}
              <span
                className={`w-5 shrink-0 text-xs font-bold text-center ${
                  i === 0 ? "text-purple-400" : "text-muted-foreground"
                }`}
              >
                #{i + 1}
              </span>

              {/* Type icon */}
              <div className="w-6 h-6 shrink-0 rounded-md bg-secondary flex items-center justify-center">
                {item.type === "video" ? (
                  <Film className="w-3 h-3 text-purple-400" />
                ) : (
                  <Music className="w-3 h-3 text-violet-400" />
                )}
              </div>

              {/* Bar + label */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground truncate pr-2">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {item.views.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        i === 0
                          ? "oklch(0.65 0.18 290)"
                          : `oklch(${0.55 + i * 0.02} ${0.1 - i * 0.01} 290)`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudioAnalytics({
  onBack,
  onUploadVideo,
  onUploadMusic,
}: StudioAnalyticsProps) {
  // Genre breakdown from mock data
  const genreData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of seedStudioVideos) {
      counts[v.genre] = (counts[v.genre] ?? 0) + 1;
    }
    for (const m of seedStudioMusic) {
      counts[m.genre] = (counts[m.genre] ?? 0) + 1;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([genre, count]) => ({
        genre,
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Audio language coverage
  const langData = useMemo(() => {
    const langCounts: Record<string, number> = {};
    let multiLangCount = 0;
    for (const v of seedStudioVideos) {
      if (v.audioTracks.length > 1) multiLangCount++;
      for (const t of v.audioTracks) {
        langCounts[t.language] = (langCounts[t.language] ?? 0) + 1;
      }
    }
    return {
      multiLangCount,
      totalVideos: seedStudioVideos.length,
      langs: Object.entries(langCounts)
        .map(([lang, count]) => ({ lang, count }))
        .sort((a, b) => b.count - a.count),
    };
  }, []);

  const totalPublished =
    seedStudioVideos.filter((v) => v.isPublished).length +
    seedStudioMusic.filter((m) => m.isPublished).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 lg:px-6 xl:px-8 py-3 xl:py-4 border-b border-border shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.04 290 / 0.8), oklch(0.12 0.02 270 / 0.6))",
        }}
      >
        <div className="flex items-center gap-2 xl:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Back to Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 xl:w-5 xl:h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm xl:text-base font-bold text-foreground leading-none">
              Analytics
            </h1>
            <p className="text-[10px] xl:text-xs text-muted-foreground">
              Content Performance
            </p>
          </div>
        </div>

        {/* Quick upload actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onUploadVideo}
            className="h-8 text-xs gap-1.5 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hidden sm:flex"
          >
            <Upload className="w-3 h-3" />
            Video
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onUploadMusic}
            className="h-8 text-xs gap-1.5 border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hidden sm:flex"
          >
            <Upload className="w-3 h-3" />
            Music
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-4 lg:px-6 xl:px-8 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
          <BarChart2 className="w-3.5 h-3.5" />
          Analytics
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 lg:px-6 xl:px-8 py-4 lg:py-6 space-y-5 max-w-5xl mx-auto">
          {/* ── Stat Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={Film}
              label="Total Videos"
              value={seedStudioVideos.length}
            />
            <StatCard
              icon={Music}
              label="Total Music"
              value={seedStudioMusic.length}
            />
            <StatCard
              icon={BarChart2}
              label="Published"
              value={totalPublished}
              accent
            />
            <StatCard
              icon={TrendingUp}
              label="Downloads"
              value={MOCK_DOWNLOADS}
              accent
            />
          </div>

          {/* ── Chart + Top Content ────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WeeklyBarChart data={WEEKLY_VIEWS} />
            <TopContentList />
          </div>

          {/* ── Genre Breakdown + Language Coverage ───────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Genre Breakdown */}
            <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                Genre Breakdown
              </h3>
              <div className="flex flex-wrap gap-2">
                {genreData.map(({ genre, count, pct }) => (
                  <div
                    key={genre}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/60 hover:bg-secondary transition-colors"
                  >
                    <span className="text-xs font-medium text-foreground">
                      {genre}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Language Coverage */}
            <div className="rounded-xl border border-border bg-card p-4 lg:p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Audio Language Coverage
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {langData.multiLangCount} of {langData.totalVideos} videos have
                multi-language audio
              </p>
              <div className="space-y-2">
                {langData.langs.map(({ lang, count }) => (
                  <div key={lang} className="flex items-center gap-3">
                    <span className="text-xs text-foreground font-medium w-20 shrink-0 truncate">
                      {lang}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round((count / langData.totalVideos) * 100)}%`,
                          background: "oklch(0.65 0.18 290)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 w-16 text-right">
                      {count} video{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick Actions ──────────────────────────────────────── */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 lg:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Film className="w-3.5 h-3.5" />
                Go to Library
              </Button>
              <Button
                size="sm"
                onClick={onUploadVideo}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Video
              </Button>
              <Button
                size="sm"
                onClick={onUploadMusic}
                className="gap-2 bg-violet-600 hover:bg-violet-700 text-white border-0"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Music
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
