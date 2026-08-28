import { useEffect, useRef } from "react";

const MAX_PARTICLES = 20;
const PARTICLE_LIFETIME_MS = 1450;
const MIN_DISTANCE_PX = 12;
const MIN_INTERVAL_MS = 38;

export default function PixieTrail() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!layer || prefersReducedMotion.matches || !finePointer.matches) return;

    let lastX = 0;
    let lastY = 0;
    let lastCreatedAt = 0;
    let hasLastPosition = false;
    const timers = new Set<number>();

    const releaseParticle = (particle: HTMLSpanElement, timer: number) => {
      particle.remove();
      timers.delete(timer);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const now = performance.now();
      if (!hasLastPosition) {
        lastX = event.clientX;
        lastY = event.clientY;
        hasLastPosition = true;
        return;
      }

      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < MIN_DISTANCE_PX || now - lastCreatedAt < MIN_INTERVAL_MS) return;

      lastX = event.clientX;
      lastY = event.clientY;
      lastCreatedAt = now;
      if (layer.childElementCount >= MAX_PARTICLES) layer.firstElementChild?.remove();

      const particle = document.createElement("span");
      particle.className = "pixie-particle";
      const directionX = deltaX / distance;
      const directionY = deltaY / distance;
      particle.style.setProperty("--pixie-x", `${event.clientX}px`);
      particle.style.setProperty("--pixie-y", `${event.clientY}px`);
      particle.style.setProperty("--pixie-angle", `${Math.atan2(deltaY, deltaX) * 180 / Math.PI}deg`);
      particle.style.setProperty("--pixie-drift-x", `${-directionX * (25 + Math.random() * 22)}px`);
      particle.style.setProperty("--pixie-drift-y", `${-directionY * (25 + Math.random() * 22)}px`);
      particle.style.setProperty("--pixie-size", `${2 + Math.random() * 2.4}px`);
      particle.style.setProperty("--pixie-tail-length", `${Math.min(58, 25 + distance * 0.95)}px`);
      layer.appendChild(particle);

      const timer = window.setTimeout(() => releaseParticle(particle, timer), PARTICLE_LIFETIME_MS);
      timers.add(timer);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      timers.forEach(timer => window.clearTimeout(timer));
      layer.replaceChildren();
    };
  }, []);

  return <div className="pixie-trail" ref={layerRef} aria-hidden="true" />;
}
