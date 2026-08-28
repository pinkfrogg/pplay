# Curated Music Catalog — Owner Guide

The guest-facing player reads one visible source file only: **`client/src/lib/musicCatalog.ts`**. In the Code panel, open **Source → lib → musicCatalog.ts**. Add every movie album, MP3 link, and cover image there before publishing. Visitors will see the catalog and control playback, but they cannot submit media or links.

| What you want to change | Where to edit | Field to update |
|---|---|---|
| Movie/album name | `client/src/lib/musicCatalog.ts` | `title` on an album |
| Album or Barbie-cover image | `client/src/lib/musicCatalog.ts` | `coverImage` on an album |
| Song name and artist | `client/src/lib/musicCatalog.ts` | `title` and `artist` on a track |
| Direct authorized MP3 link | `client/src/lib/musicCatalog.ts` | `audioUrl` on a track |
| Optional timed lyrics | `client/src/lib/musicCatalog.ts` | `lyrics` array on a track |

> The album `coverImage` is intentionally used in **three places**: the album DVD card, the sleeve behind the turntable, and the central label of the rotating vinyl. Replace it once and every related visual updates together.

## Adding cover images

Upload an image you are authorized to use through the project asset workflow, then paste the returned `/manus-storage/...` URL into `coverImage`. Keep the image square when possible so it reads well both as a sleeve and as a vinyl label.

## Adding MP3 links

Paste a direct MP3 file URL into `audioUrl`, rather than a webpage URL. You are responsible for confirming that you own the audio or are authorized to share and play it. For best animated visualizer behavior, use a source that permits browser cross-origin media access.

## Example album block

```ts
{
  id: "movie-title",
  title: "Movie Title",
  coverImage: "/manus-storage/movie-title-cover.jpg",
  tracks: [
    {
      id: "movie-title-opening",
      title: "Opening Song",
      artist: "Artist Name",
      audioUrl: "https://your-authorized-host.example/opening-song.mp3",
    },
  ],
}
```
