import React, { useEffect, useState, useRef } from 'react';

/**
 * CustomCursor
 * Renders a high-performance, GPU-accelerated dot cursor colored dynamically
 * according to the active theme's accent token (--accent).
 */
export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const posRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch-only devices to avoid showing a stuck dot on mobile tap
    if (typeof window !== 'undefined') {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
    }

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        setIsVisible(true);
      }

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(() => {
          setPosition({ x: posRef.current.x, y: posRef.current.y });
          animFrameRef.current = null;
        });
      }

      // Check if hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest(
          'a, button, input, textarea, select, [role="button"], label, [tabindex="0"], summary, .cursor-pointer'
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible]);

  // If on a touch-only device or position has not initialized, don't render
  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-200"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Outer ambient glow halo (expands gracefully on interactive hover) */}
      <div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ease-out"
        style={{
          width: isHoveringInteractive ? '36px' : '24px',
          height: isHoveringInteractive ? '36px' : '24px',
          backgroundColor: 'var(--accent)',
          opacity: isHoveringInteractive ? 0.25 : 0.12,
          filter: 'blur(4px)',
          transform: isClicking ? 'scale(0.85)' : 'scale(1)',
        }}
      />

      {/* Outer fine ring (scales smoothly on hover) */}
      <div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ease-out"
        style={{
          width: isHoveringInteractive ? '28px' : '20px',
          height: isHoveringInteractive ? '28px' : '20px',
          border: '1.5px solid var(--accent)',
          opacity: isHoveringInteractive ? 0.7 : 0.35,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
        }}
      />

      {/* Main core dot colored according to current theme */}
      <div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ease-out shadow-sm"
        style={{
          width: isHoveringInteractive ? '11px' : '9px',
          height: isHoveringInteractive ? '11px' : '9px',
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 10px var(--accent), 0 0 2px rgba(255, 255, 255, 0.6)',
          transform: isClicking ? 'scale(0.75)' : isHoveringInteractive ? 'scale(1.2)' : 'scale(1)',
        }}
      />
    </div>
  );
};
