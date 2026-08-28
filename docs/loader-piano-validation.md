# Loader Piano Validation

The public first-visit overlay was inspected after the late-crown timing adjustment. During the circulation phase, the eight notes and sparkle fragments remain visible around the center while the crown remains hidden. The synthesized piano phrase is scheduled as the overlay starts and resolves with crown completion, before the overlay fades away to reveal the collection. The former `/intro-preview` replay route and public animation controls have been removed; its retired address now redirects directly to `/` so an older preview link cannot lead to a 404 after the overlay finishes.

The loading path retains the short non-animated reduced-motion fallback. Browser autoplay permissions can still suppress sound in some listener environments, but the loading sequence always attempts to begin its accompaniment automatically without displaying a guest-facing audio or replay menu.
