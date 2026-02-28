# Space Media

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full-stack Space Media app: a mobile-first offline media platform for passengers on a spacecraft/vessel, with Netflix-like Video and Apple Music-like Music experiences in one app.
- Bottom navigation: Video | Music | Downloads | Profile/Settings
- Top-right status pill showing Connected / Offline state (mocked via local flag)
- Staff-assisted login flow: Special Key screen → Passenger Setup (create/find by ID) with role selection (Tourist / Scientist)
- Passenger data model stored in localStorage: passengerId, name, role, tripId, createdAt
- DownloadedItem data model in localStorage: id, type, title, artworkUrl, downloadedAt, expiresAt, licenseStatus, genre, language, artist, album, tags
- VIDEO tab: hero banner, horizontal carousels (Continue Watching, Trending, Genres, Recently Added), video detail page, prototype player UI with resume + subtitles selector
- MUSIC tab: Apple Music-like layout with Recently Played, Featured Playlists, Albums grid, Artists list; full music player with artwork, progress bar, controls (play/pause/next/prev/shuffle/repeat), Up Next queue; mini-player bar
- SEARCH: available in Video tab, Music tab, and Downloads tab; offline-first local index search; tabs for Videos/Music; Downloaded Only filter toggle; badges for Downloaded vs Stream Only
- DOWNLOADS tab: split into Downloaded Videos / Downloaded Music; license countdown ("Expires in X days"); expired items show "LICENSE EXPIRED" in red; click expired → modal with OK and Renew (Renew disabled if Offline); Renew All button (only when Connected); delete download; sort options (Expiring soon / Recently downloaded / Size)
- Role-based expiry: Tourist = 30 days, Scientist = 180 days, applied automatically at download time
- SETTINGS: 8 theme chooser with local bundled theme preview images; global theme application; 5-band EQ UI + presets (Flat, Bass Boost, Treble Boost, Vocal) [UI only]; Download quality selector (Low/Medium/High); read-only display of logged-in role + license duration rule
- Profile page: view-only display of Passenger ID, Name, Role, Trip package, Start/End date
- All data powered by mock APIs and localStorage

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

**Backend (Motoko)**
- Passenger actor: store/retrieve passengers by ID, store with role, name, tripId, createdAt
- DownloadedItem actor: store/retrieve downloaded items per passenger, compute licenseStatus based on expiresAt
- App config actor: store/retrieve staff special key (hardcoded default), theme preferences

**Frontend (React + TypeScript)**
1. App shell: bottom nav tabs, top-right status pill, global theme context, auth guard
2. Auth screens: StaffKeyScreen, PassengerSetupScreen (create/find flow)
3. Video tab: HeroBanner, ContentRow (carousel), VideoDetailPage, VideoPlayerPage
4. Music tab: MusicHome, AlbumGrid, ArtistsList, PlaylistsSection, MusicPlayerPage, MiniPlayerBar, UpNextQueue
5. Search: SearchScreen (shared), offline local index, Downloaded Only filter, tab switcher
6. Downloads tab: DownloadsScreen split by type, LicenseExpiredModal, sort controls, Renew All
7. Settings tab: ThemeChooser (8 local images), EQPanel (5-band + presets), DownloadQualitySelector, ProfileReadOnly
8. Data layer: localStorage hooks for passengers, downloads, search index, theme/settings
9. Mock data: 10 video items, 20 music tracks, 5 playlists, 5 albums, 8 artists
