/**
 * OWNER EDITING AREA — add every public song, direct MP3 URL, and cover image here before publishing.
 * The website only reads this catalog. Guests cannot upload files or add external links.
 *
 * For cover images, upload your authorized image through the project asset workflow and paste the returned
 * /manus-storage/... URL into `coverImage`. The same image is used on the album sleeve AND rotating vinyl label.
 * For audio, paste a direct, authorized .mp3 URL into `audioUrl` (for example, a direct Archive item file URL).
 */

export type CatalogLyricCue = { start: number; end: number; text: string };

export type CatalogTrack = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  lyrics?: CatalogLyricCue[];
};

export type CatalogAlbum = {
  id: string;
  title: string;
  coverImage: string;
  tracks: CatalogTrack[];
};

export const musicCatalog: CatalogAlbum[] = [
  // COPY THIS BLOCK FOR EACH MOVIE ALBUM YOU ADD:
  // {
  //   id: "your-movie-id",
  //   title: "Your Movie Title",
  //   coverImage: "/manus-storage/your-authorized-cover-image.jpg",
  //   tracks: [
  //     {
  //       id: "your-movie-opening-song",
  //       title: "Song Title",
  //       artist: "Artist / Film Cast",
  //       audioUrl: "https://archive.org/download/your-item/your-song.mp3",
  //       // Optional: add timestamped lyric cues if you want the on-screen lyric room later.
  //       // lyrics: [{ start: 0, end: 4.2, text: "First line" }],
  //     },
  //   ],
  // },
];
