# Dusty Rose Music Player — Design Direction

## Three possible directions

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| **Rosewood Listening Room** | A grown-up, tactile vinyl lounge in dusty rose, lipstick red, and warm paper tones. It makes a personal music collection feel like a private record library rather than a streaming dashboard. | 0.06 |
| **Dollhouse Mixtape** | A soft, playful bedroom collage with sticker-like ephemera, tiny handwritten notes, and bubblegum details. It is nostalgic, bright, and intentionally maximal. | 0.03 |
| **Satin FM** | A late-evening radio interface with dark mauve glass, luminous controls, and slow-motion motion graphics. It feels cinematic and gently futuristic. | 0.08 |

## Chosen approach: Rosewood Listening Room

### Design Movement

**1970s record-sleeve modernism refined through contemporary editorial design.** The player should read as a personal archive: tactile, composed, and quietly expressive rather than an imitation of a generic streaming service.

### Core Principles

1. **Tangible ritual over utility-dashboard styling.** The disc, sleeve, track list, and transport controls are treated as physical listening objects.
2. **Warm asymmetry.** A tall collection rail and a generously sized listening-stage form the layout, avoiding a centered-card composition.
3. **Calm density.** The interface leaves breathing room but keeps useful playback information visible, with a restrained amount of ornament.
4. **Personal-first playback.** Uploaded MP3s remain in the browser session; direct MP3 links are played only on the user’s device.

### Color Philosophy

Dusty rose is the emotional anchor: it is less saccharine than bubblegum pink and more intimate than bright red. It is supported by bone-paper backgrounds, rosewood ink, oxblood shadows, and small touches of antique gold. The contrast is deliberately warm and readable, never pale-on-pale.

### Layout Paradigm

The page is a **listening-room split**. A slim vertical shelf at left holds the editable queue; the right side is a single, roomy stage with the spinning vinyl as its visual center. Lower controls form a horizontal transport strip, like the fascia of a hi-fi component.

### Signature Elements

1. A **rotating charcoal vinyl disc** with concentric grooves and a dusty-rose label while audio is playing.
2. A **rosewood shelf rail** with numbered track cards and a tiny “now playing” marker.
3. A subtle **paper-grain field** with small ruled metadata labels that echo a catalog card.

### Interaction Philosophy

Interaction should feel physical and intentional. Controls have modest press depth, track changes gently slide the label detail, and the record pauses immediately when audio pauses. All actions remain keyboard-accessible and state changes are explicit.

### Animation

The vinyl rotates linearly only during active playback. The tonearm moves into place when a track starts and rests outward when paused. Controls use short, weighty 120–180 ms transitions, and queue selection uses an 180 ms slide/fade. All optional motion is disabled by `prefers-reduced-motion`.

### Typography System

**DM Serif Display** is used sparingly for the large track title and section statements. **DM Mono** handles timestamps, queue numbers, and technical metadata. **Manrope** supports utility labels and long text. Titles are large but left-aligned; UI text stays compact and high-contrast.

### Brand Essence

**A private, editable listening room for cherished digital tracks, designed for people who still want music playback to feel ceremonial.**

Personality: **tactile, composed, affectionate**.

### Brand Voice

Headlines are direct but sensorial; CTAs use precise verbs and avoid startup language. Examples: “Put a favorite on the turntable.” and “Bring in a track from your archive.”

### Wordmark & Logo

The mark is a **rose-petal spindle**: four offset oval petals circling a central record hole, creating a simple flower/label hybrid. The wordmark is compact, with a small-caps mono eyebrow and a display-name lockup; it is not a default-font text treatment.

### Signature Brand Color

**Rosewood Blush — `#B45D70`**. It is used for the record label, primary action fill, playback progress, and selected-track signal.

## Style Decisions

- The transport is a tactile **Rosewood R-01 hi-fi fascia**, using compact mono engraving, a blush progress signal, warm metallic separators, and weighted controls rather than default media-player chrome.
- The collection rail is a rosewood record shelf: catalog-card markings, ruled dividers, and selected-record signals appear before any music is added.
- The empty view has one dominant editorial statement. Supporting copy is quiet archive metadata, not a second competing headline.
- Albums are collectible **DVD-and-vinyl packages**, with one original cover per user-defined movie grouping. The player never labels generated artwork as an official cover or assumes a song belongs to a particular movie; the user supplies each album name.
- The live visualizer is a quiet row of blush spectrum bars beneath the album-aware turntable, not a dashboard graphic. It responds to the browser audio signal and falls quiet immediately on pause.
- Evening mode shifts the paper-and-rosewood material system into muted plum, oxblood, charcoal, and low-contrast blush. Its toggle remains a compact engraved control in the header.
