# Space Media

## Current State
The video player (`VideoPlayer.tsx`) has basic audio language and subtitle selectors in the top-right toolbar. They are small icon-only Select dropdowns (Languages icon / Subtitles icon). When a new audio language is selected it updates `videoPlayer.audioLang` in context, and a small badge at the bottom of the player shows the active language. The subtitle selector updates `videoPlayer.subtitleLang` and shows a "CC: X" badge.

Issues / gaps:
- The audio language selector is only shown when `audioTracks.length > 1` (correct), but there is no clear visual indication which track is currently active inside the dropdown.
- Subtitle selector defaults to "English" even for videos where that language may not make sense for the current audio; there is no "Off" visual cue inside the dropdown.
- When a video is opened via `playVideo()`, `subtitleLang` is always hard-coded to "English" regardless of what language the user had previously selected or what the video supports.
- There is no "auto-off subtitles when main audio language matches" behavior: if the user's audio is already in the main/default language, subtitles should default to "Off".
- The player UI does not re-sync or acknowledge the language change with any visual feedback beyond a small badge.
- The selectors are tiny icon buttons in a congested top bar — hard to tap on mobile.

## Requested Changes (Diff)

### Add
- A full Netflix-style **language panel** that slides up from the bottom when the user taps the Languages or Subtitles icon — replacing the small inline Select dropdowns.
- The panel has two tabs: **Audio** and **Subtitles**.
- **Audio tab**: lists all `audioTracks` with language name + label (Stereo / 5.1 / Commentary). Active track has a checkmark + highlighted style. Tapping a track selects it, closes the panel, and shows a brief toast: "Audio: [Language]".
- **Subtitles tab**: lists all `video.subtitles` strings plus an "Off" option at the top. Active subtitle is highlighted with a checkmark. "Off" is the default when the selected audio language matches the video's primary/default language. Tapping a subtitle option closes the panel and shows "Subtitles: [Lang]" or "Subtitles off" toast.
- **Auto-off subtitle rule**: when `playVideo()` is called, if the video's `defaultAudioLang` matches the first (main) audio track, subtitles default to "Off". Only show subtitles by default when the content's primary language differs from what the user would expect (i.e., default subtitle = "Off" always on initial play, user can turn on manually).
- Language panel has a visible close button (X) and can be dismissed by tapping the backdrop.

### Modify
- `VideoPlayer.tsx`: Replace the two inline `<Select>` icon dropdowns in the top bar with two tap-friendly pill buttons ("Audio: [lang]" and "CC: [lang/Off]") that open the new bottom-sheet language panel.
- `AppContext.tsx` → `playVideo()`: change `subtitleLang` initial value from `"English"` to `"Off"`.
- The active audio language badge at the bottom of the player should update to show the full language name rather than the langCode.
- When language or subtitle changes, progress continues seamlessly — no reset.

### Remove
- The small `<Select>` icon-only dropdowns for audio and subtitles in the top bar.
- The "CC: X" and audio badge below the seek bar (replaced by the pill buttons in the top bar, which already convey the active selection).

## Implementation Plan
1. In `AppContext.tsx` `playVideo()`: set `subtitleLang: "Off"` as default.
2. In `VideoPlayer.tsx`:
   a. Add local state `showLangPanel: boolean` and `langPanelTab: "audio" | "subtitles"`.
   b. Replace the two `<Select>` dropdowns in the top-bar with two pill buttons:
      - "🎵 [Language name]" opens panel on Audio tab.
      - "CC [lang / Off]" opens panel on Subtitles tab.
   c. Add the bottom-sheet `LangPanel` component inside the player (above the controls overlay) that renders the two-tab list.
   d. Remove the bottom status badges.
   e. Backdrop click and X button dismiss the panel.
   f. Selecting audio/subtitle track calls `setAudioLang` / `setSubtitleLang`, shows a toast, and closes the panel.
