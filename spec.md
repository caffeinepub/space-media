# Space Media

## Current State
Space Media is a full-stack OTT + Music app with:
- Bottom nav tabs: Video | Music | Downloads | Studio (manager) | Analytics (manager) | Profile
- Video compartment: Netflix-like hero, carousels, web series, movie parts, HLS multi-audio playback
- Music compartment: Apple Music-like layout, MusicHome, MiniPlayer, MusicPlayer, playlists, custom playlists
- Downloads tab: split Video / Music filter with license expiry tracking
- Settings: theme chooser, EQ panel (5-band), player background chooser (Blue Moon / Red Nebula), download quality, offline toggle
- Studio tab (manager-only): video + music upload/edit/delete, analytics tab
- AppContext: full music player state (MusicPlayerState, playTrack, pauseMusic, queue, shuffle, repeat, volume, showMusicPlayer), customPlaylists, seedStudioMusic
- types.ts: MusicTrack, Playlist, Album, Artist, MusicPlayerState, StudioMusic, CustomPlaylist, PlayerBgId
- mockData.ts: mockTracks, mockPlaylists, mockAlbums, mockArtists, seedStudioMusic
- DownloadedItem.mediaType supports "video" | "music"

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- **Navigation (BottomNav.tsx)**: Remove "Music" tab entirely from baseTabs. Remove `Music` icon import. Remove now-playing mini-indicator from sidebar.
- **App.tsx**: Remove MiniPlayer, MusicHome, MusicPlayer imports and all JSX references. Remove `musicPlayer`, `showMusicPlayer`, `setShowMusicPlayer`, `hasMusicTrack` from destructuring.
- **AppContext.tsx**: Remove all music player state and functions (musicPlayer, playTrack, pauseMusic, resumeMusic, nextTrack, prevTrack, toggleShuffle, toggleRepeat, setMusicProgress, setVolume, showMusicPlayer, setShowMusicPlayer). Remove customPlaylists and all playlist functions. Remove studioMusic / seedStudioMusic state. Remove music progress simulation useEffect. Remove `sm_custom_playlists` and `sm_studio_music` keys. Remove music-typed seed downloads (dl2, dl4). Remove `playTrack` from context.
- **types.ts**: Remove `MusicTrack`, `Playlist`, `Album`, `Artist`, `MusicPlayerState`, `StudioMusic`, `CustomPlaylist`, `PlayerBgId` types. Remove `music` from `MediaType` (make it `"video"` only). Remove `playerBg` from `AppSettings`. Remove `music` from `TabId`.
- **mockData.ts**: Remove `mockTracks`, `mockPlaylists`, `mockAlbums`, `mockArtists`, `seedStudioMusic`. Remove music-related imports.
- **Downloads tab**: Remove "Music" filter tab entirely. Show only video downloads. Remove music playback logic (playTrack). Make it video-only list.
- **Settings tab**: Remove "Player Background" section entirely. Remove EQ section entirely. Remove `playerBg` and `eqBands`/`eqPreset` from settings updates.
- **Studio tab**: Remove music upload flow, music library items, music editor. Keep only video content management.
- **Studio Analytics**: Remove "Total Music" stat card. Remove music from genre breakdown and language coverage stats.
- **Search**: Remove "Music" tab. Make it video-only search.

### Remove
- `src/components/music/` directory — all files: MusicHome.tsx, MusicPlayer.tsx, MiniPlayer.tsx, CreatePlaylistModal.tsx, PlaylistDetailView.tsx, AddSongsSheet.tsx, UpNextQueue.tsx
- `src/components/settings/EQPanel.tsx`
- All music-related imports across all files

## Implementation Plan
1. Delete the entire `src/components/music/` folder
2. Delete `src/components/settings/EQPanel.tsx`
3. Update `types.ts` — remove music types, update MediaType to video-only, remove music from TabId, remove playerBg/eqBands/eqPreset from AppSettings
4. Update `mockData.ts` — remove all music mock data exports
5. Update `AppContext.tsx` — remove music player, playlists, studioMusic state; remove music seed downloads; remove music-related context methods
6. Update `App.tsx` — remove music imports and JSX
7. Update `BottomNav.tsx` — remove Music tab, remove now-playing sidebar widget
8. Update `DownloadsTab.tsx` — remove Music filter tab, make video-only
9. Update `SettingsTab.tsx` — remove Player Background and EQ sections, remove playerBg settings
10. Update `StudioTab.tsx` — remove music upload/library/editor sections
11. Update `StudioAnalyticsTab.tsx` — remove music stats
12. Update `SearchScreen.tsx` — remove music tab
13. Fix any remaining TypeScript errors from removed types
