# Space Media

## Current State
Space Media is a full-featured offline media app with:
- Netflix-like Video compartment
- Apple Music-like Music compartment with existing MusicPlayer.tsx (card-style, dark background)
- Downloads tab with license expiry
- Manager Studio tab
- Settings with ThemeChooser (8 themes), EQPanel, download quality
- Bottom nav (mobile) / sidebar (tablet+)
- Passenger login with staff key

The existing MusicPlayer.tsx shows a dark card overlay on top of a blurred background with artwork, track info, progress bar, and controls. It does NOT have a full-screen background image or glassmorphism treatment.

## Requested Changes (Diff)

### Add
- New `NowPlayingScreen` component: a full-screen, immersive "Now Playing" view with:
  - Full-screen background image (space theme) filling the entire screen
  - Subtle dark gradient overlay at the bottom
  - Large frosted-glass rounded card at the bottom (glassmorphism: blur, translucent, soft shadow, border)
  - Card content:
    - Top row: Heart/Favorite icon (left), Song title + subtitle (center-left), "..." menu icon (right)
    - Progress bar section: thin Apple Music-style bar + time labels
    - Controls row: Shuffle | Prev | large Play/Pause circle | Next | Repeat
  - Two background themes: "Blue Moon" (uploaded BLUE-MOON-L-1.jpg) and "Red Nebula" (generated red-nebula-bg.dim_1080x1920.jpg)
  - Player-specific theme selector in the component (separate from global app theme)
  - Smooth animated background fade when switching themes
  - Mobile-first, also scales to tablet
- Store selected player background theme in local state (or settings)

### Modify
- Replace/upgrade MusicPlayer.tsx to use the new NowPlayingScreen full-screen glassmorphism layout when open (keep all existing player state/controls wired)
- Settings tab: add a "Player Background" section with two theme options (Blue Moon / Red Nebula) so user can switch from Settings too

### Remove
- Nothing removed; existing controls/state (shuffle, repeat, queue, volume) remain but volume and Up Next queue collapse to a secondary section or remain as-is below the main glass card

## Implementation Plan
1. Create `NowPlayingScreen.tsx` component with:
   - Full-screen fixed overlay
   - Background `<img>` that crossfades between the two themes using CSS transitions / framer-motion
   - Bottom gradient overlay div
   - Glassmorphism card: `backdrop-blur`, semi-transparent bg, rounded-3xl, shadow, border
   - Card top row: Heart toggle, song title + subtitle text, MoreHorizontal ("...") icon button
   - Progress bar: custom thin range or Slider component + time labels
   - Controls: Shuffle, SkipBack, Play/Pause circle button, SkipForward, Repeat
   - Animate play/pause with scale transition
2. Add player background theme state to AppContext (playerBg: "blue-moon" | "red-nebula") persisted in settings
3. Update MusicPlayer.tsx to render NowPlayingScreen instead of current card overlay
4. Add "Player Background" picker in SettingsTab with two thumbnail buttons
5. Use /assets/uploads/BLUE-MOON-L-1.jpg and /assets/generated/red-nebula-bg.dim_1080x1920.jpg as local assets
