import { type CSSProperties, useEffect, useRef, useState } from "react";
import { marqueeScrollDistance } from "@/lib/titleMarquee";

type MarqueeTitleProps = {
  children: string;
  className?: string;
  active?: boolean;
};

export default function MarqueeTitle({ children, className = "", active = false }: MarqueeTitleProps) {
  const viewportRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const text = textRef.current;
    if (!viewport || !text) return;

    let frame: number | null = null;
    const measure = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setDistance(marqueeScrollDistance(text.scrollWidth, viewport.clientWidth));
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(text);
    measure();
    void document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [children, active]);

  const hasOverflow = distance > 0;
  const shouldLoop = active && hasOverflow;
  return (
    <h3
      ref={viewportRef}
      className={`${className} ${shouldLoop ? "track-title--marquee" : ""}`.trim()}
      style={shouldLoop ? ({ "--title-scroll-distance": `${textRef.current?.scrollWidth ? textRef.current.scrollWidth + 54 : distance + 54}px` } as CSSProperties) : undefined}
      title={children}
    >
      {shouldLoop ? <span className="track-title-marquee-track"><span ref={textRef}>{children}</span><span aria-hidden="true">{children}</span></span> : <span ref={textRef}>{children}</span>}
    </h3>
  );
}
