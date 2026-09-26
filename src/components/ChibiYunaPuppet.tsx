import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface ChibiYunaPuppetProps {
  className?: string;
}

// Preset generic phrases appended to "I'm Yuna,"
const INTRO_PHRASES = [
  ' nice to meet you!',
  ' wanna chat?',
  ' welcome to the website!',
  ' at your service!',
  ' exploring the Mux universe with you!',
  ' need help finding any apps?',
];

// Poking warning phrases when clicked > 4 times in 5 seconds
const ANNOYED_PHRASES = [
  'Hey! Stop poking me!',
  "That's not nice to poke me!",
  "You're being a pervert!",
  'Ugh... stop poking!',
  'Hey! Personal space, please!',
  'Ouch! Stop that!',
];

// Idle thoughts when user hasn't clicked recently
const IDLE_THOUGHTS = [
  'Mux cultivates art, science, technology, and research.',
  'Click any app card below to launch live tools!',
  'Did you know MuxAI provides customizable LLM personas?',
  'You can change themes anytime from the palette icon.',
  'Need a break? Toggle ambient soundtrack in the dock.',
  'Looking for technical guides? Check out our Posts page!',
];

export const ChibiYunaPuppet: React.FC<ChibiYunaPuppetProps> = ({ className = '' }) => {
  // Thought bubble states
  const [bubbleText, setBubbleText] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState<boolean>(false);
  const [mood, setMood] = useState<'normal' | 'happy' | 'annoyed' | 'shocked'>('normal');

  // Eye tracking & puppet physics
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState<{ x: number; y: number; rotate: number }>({ x: 0, y: 0, rotate: 0 });
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isHopping, setIsHopping] = useState<boolean>(false);

  // References for typing animations, clicks, and timers
  const puppetContainerRef = useRef<HTMLDivElement | null>(null);
  const clickTimestampsRef = useRef<number[]>([]);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bubbleHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInteractingRef = useRef<boolean>(false);

  // Clear all pending text/typing timers
  const clearTypingTimers = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (exitTimerRef.current) clearInterval(exitTimerRef.current);
    if (bubbleHoldTimerRef.current) clearTimeout(bubbleHoldTimerRef.current);
  }, []);

  // Animate thought bubble: typing entrance, hold, typing exit
  const speak = useCallback(
    (text: string, forcePriority: boolean = false, holdDuration?: number) => {
      clearTypingTimers();

      setBubbleText(text);
      setDisplayedText('');
      setIsBubbleVisible(true);
      setIsTyping(true);
      setIsExiting(false);

      let charIndex = 0;
      const typeSpeed = 28; // ms per char

      typingTimerRef.current = setInterval(() => {
        charIndex++;
        if (charIndex <= text.length) {
          setDisplayedText(text.slice(0, charIndex));
        } else {
          // Finished typing entrance
          if (typingTimerRef.current) clearInterval(typingTimerRef.current);
          setIsTyping(false);

          // Hold duration before typing exit
          const holdTime = holdDuration || Math.max(3000, text.length * 75);

          bubbleHoldTimerRef.current = setTimeout(() => {
            // Start typing exit (backspacing)
            setIsExiting(true);
            let exitIndex = text.length;
            const exitSpeed = 16; // ms per char backspace

            exitTimerRef.current = setInterval(() => {
              exitIndex--;
              if (exitIndex >= 0) {
                setDisplayedText(text.slice(0, exitIndex));
              } else {
                // Exit finished
                if (exitTimerRef.current) clearInterval(exitTimerRef.current);
                setIsExiting(false);
                setIsBubbleVisible(false);
                setDisplayedText('');
                setBubbleText('');
                setMood('normal');
              }
            }, exitSpeed);
          }, holdTime);
        }
      }, typeSpeed);
    },
    [clearTypingTimers]
  );

  // 1. Session greeting: runs only once per browser session (not on every page visit)
  useEffect(() => {
    const SESSION_GREET_KEY = 'yuna_session_greeted_v1';
    const alreadyGreeted = sessionStorage.getItem(SESSION_GREET_KEY);

    if (!alreadyGreeted) {
      sessionStorage.setItem(SESSION_GREET_KEY, 'true');

      // Detect device local time
      const hour = new Date().getHours();
      let greeting = 'Hi! Welcome to HuanMux.';

      if (hour >= 5 && hour < 12) {
        greeting = 'Good morning! ☕ Hope you have a wonderful day.';
      } else if (hour >= 12 && hour < 17) {
        greeting = 'Good afternoon! ☀️ How is everything going?';
      } else if (hour >= 17 && hour < 22) {
        greeting = 'Good evening! 🌆 Relax and enjoy your stay.';
      } else {
        greeting = 'Hi night owl! 🌙 Need late-night inspiration?';
      }

      // Delay initial greeting slightly for page smoothness
      const initialTimer = setTimeout(() => {
        setMood('happy');
        speak(greeting, false, 4500);
      }, 1200);

      return () => clearTimeout(initialTimer);
    }
  }, [speak]);

  // 2. Idle thought rotation every 20-30 seconds if not recently interacted
  useEffect(() => {
    const scheduleNextThought = () => {
      const delay = Math.floor(Math.random() * 12000) + 20000;
      idleTimerRef.current = setTimeout(() => {
        if (!isInteractingRef.current && !isBubbleVisible) {
          const randomThought = IDLE_THOUGHTS[Math.floor(Math.random() * IDLE_THOUGHTS.length)];
          speak(randomThought, false, 4000);
        }
        scheduleNextThought();
      }, delay);
    };

    scheduleNextThought();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [speak, isBubbleVisible]);

  // 3. Eye tracking & head tilt on pointermove
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!puppetContainerRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = puppetContainerRef.current.getBoundingClientRect();
      const puppetCenterX = rect.left + rect.width / 2;
      const puppetCenterY = rect.top + rect.height / 2;

      const dx = clientX - puppetCenterX;
      const dy = clientY - puppetCenterY;
      const distance = Math.hypot(dx, dy);

      // Max eye pupil displacement within eye socket (SVG units)
      const maxPupilDist = 3.2;
      const angle = Math.atan2(dy, dx);
      const intensity = Math.min(distance / 120, 1) * maxPupilDist;

      const pupilX = Math.cos(angle) * intensity;
      const pupilY = Math.sin(angle) * intensity;

      setPupilOffset({ x: pupilX, y: pupilY });

      // Subtle 2.5D head tilt
      const tiltX = Math.max(-4, Math.min(4, (dy / window.innerHeight - 0.5) * 6));
      const tiltY = Math.max(-6, Math.min(6, (dx / window.innerWidth - 0.5) * 8));
      const rotate = Math.max(-4, Math.min(4, (dx / window.innerWidth - 0.5) * 5));

      setHeadTilt({ x: tiltX, y: tiltY, rotate });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  // 4. Natural blinking loop
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const runBlinkCycle = () => {
      const nextBlinkDelay = Math.floor(Math.random() * 3200) + 2400;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          runBlinkCycle();
        }, 140);
      }, nextBlinkDelay);
    };

    runBlinkCycle();

    return () => clearTimeout(blinkTimeout);
  }, []);

  // 5. Click & Poke Handler with strict sliding time windows
  const handlePuppetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    isInteractingRef.current = true;
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 4000);

    const now = Date.now();
    clickTimestampsRef.current.push(now);

    // Keep timestamps within the last 10 seconds (max evaluation window)
    clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => now - t <= 10000);

    // Dynamic counts
    const clicksLast10s = clickTimestampsRef.current.length;
    const clicksLast5s = clickTimestampsRef.current.filter((t) => now - t <= 5000).length;

    // Check condition 2: More than 8 clicks within 10 seconds -> redirect to ToS in same tab
    if (clicksLast10s > 8) {
      setMood('shocked');
      setIsShaking(true);
      speak("That's it! Read our Terms of Service! 🚨", true, 3000);

      setTimeout(() => {
        window.location.href = 'https://makronweb.vercel.app/tos/';
      }, 750);
      return;
    }

    // Check condition 1: More than 4 clicks within 5 seconds -> annoyed poke reaction
    // (Note: poking more than 4 times over > 5s will have clicksLast5s <= 4, so this won't activate)
    if (clicksLast5s > 4) {
      setMood('annoyed');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      const annoyedPhrase = ANNOYED_PHRASES[Math.floor(Math.random() * ANNOYED_PHRASES.length)];
      speak(annoyedPhrase, true, 3200);
      return;
    }

    // Normal Click: Self introduction as Yuna
    setMood('happy');
    setIsHopping(true);
    setTimeout(() => setIsHopping(false), 350);

    const randomSuffix = INTRO_PHRASES[Math.floor(Math.random() * INTRO_PHRASES.length)];
    const introText = `I'm Yuna,${randomSuffix}`;
    speak(introText, false, 3500);
  };

  return (
    <div
      ref={puppetContainerRef}
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{ zIndex: 50 }}
    >
      {/* =========================================================================
          THOUGHT BUBBLE (Dynamic Flexible Width with max-size up to 95vw,
          Themed & Colored to Current Palette with Typing Entrance/Exit Animations)
          ========================================================================= */}
      {isBubbleVisible && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center transition-all duration-300 z-50"
          style={{
            width: 'max-content',
            maxWidth: '95vw',
            animation: isExiting ? 'fadeShrink 0.25s forwards' : 'popBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Main Thought Cloud Bubble with Flexible Dynamic Width & 95vw Max Constraint */}
          <div
            className="px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] font-medium leading-snug tracking-wide text-center relative border backdrop-blur-xl shadow-2xl transition-colors duration-200 break-words"
            style={{
              width: 'fit-content',
              maxWidth: '95vw',
              backgroundColor: 'var(--surface, rgba(17, 24, 39, 0.94))',
              color: 'var(--text, #ffffff)',
              borderColor:
                mood === 'annoyed' || mood === 'shocked'
                  ? 'rgba(239, 68, 68, 0.6)'
                  : 'var(--card-border, rgba(255, 255, 255, 0.15))',
              boxShadow:
                mood === 'annoyed' || mood === 'shocked'
                  ? '0 10px 25px -5px rgba(239, 68, 68, 0.35), 0 0 15px rgba(239, 68, 68, 0.2)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 16px var(--accent-glow, rgba(99, 102, 241, 0.25))',
            }}
          >
            {/* Thought content with blinking cursor during typing */}
            <span className="font-semibold">{displayedText}</span>
            {isTyping && (
              <span
                className="inline-block w-1.5 h-3 ml-1 align-middle animate-pulse"
                style={{ backgroundColor: 'var(--accent, #6366f1)' }}
              />
            )}
          </div>

          {/* Connected Thought Dots (Classic Thought Bubble Tail) */}
          <div className="flex flex-col items-center -mt-0.5 space-y-1">
            <span
              className="w-2.5 h-2.5 rounded-full border backdrop-blur-md transition-colors"
              style={{
                backgroundColor: 'var(--surface, rgba(17, 24, 39, 0.94))',
                borderColor: 'var(--card-border, rgba(255, 255, 255, 0.15))',
              }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full border backdrop-blur-md transition-colors"
              style={{
                backgroundColor: 'var(--surface, rgba(17, 24, 39, 0.94))',
                borderColor: 'var(--card-border, rgba(255, 255, 255, 0.15))',
              }}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          CHIBI PUPPET WITH LIVE MOVING EYES (Live2D Style SVG Puppet)
          ========================================================================= */}
      <button
        type="button"
        onClick={handlePuppetClick}
        aria-label="Yuna Chibi Mascot - Click to interact"
        title="I'm Yuna! Tap to talk with me"
        className={`group relative outline-none cursor-pointer transform transition-transform duration-150 ${
          isShaking ? 'animate-shake' : ''
        } ${isHopping ? 'scale-110 -translate-y-2' : 'hover:scale-105 active:scale-95'}`}
        style={{
          transform: `perspective(600px) rotateX(${headTilt.x}deg) rotateY(${headTilt.y}deg) rotateZ(${headTilt.rotate}deg)`,
        }}
      >
        {/* Subtle breathing glow ring on hover */}
        <div
          className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-sm pointer-events-none"
          style={{ backgroundColor: 'var(--accent, #6366f1)' }}
        />

        {/* Chibi SVG Puppet Container */}
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg filter transition-all duration-200"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Soft face shadow gradient */}
            <radialGradient id="faceGrad" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#fff5ee" />
              <stop offset="85%" stopColor="#fde2d2" />
              <stop offset="100%" stopColor="#f9ceb7" />
            </radialGradient>

            {/* Silky dark anime hair gradient with subtle violet highlights */}
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c2738" />
              <stop offset="50%" stopColor="#1b1824" />
              <stop offset="100%" stopColor="#0f0d14" />
            </linearGradient>

            {/* Hair highlight sheen */}
            <linearGradient id="hairSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(192, 132, 252, 0.45)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Deep gem violet iris gradient */}
            <radialGradient id="irisGrad" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="45%" stopColor="#818cf8" />
              <stop offset="80%" stopColor="#4338ca" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>

            {/* Sclera (eye white) shadow */}
            <linearGradient id="eyeWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Cute Cheek Blush Gradient */}
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={mood === 'annoyed' ? '0.75' : '0.45'} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Back Hair Layer */}
          <path
            d="M 22 45 C 15 65, 12 85, 28 92 C 34 88, 30 70, 32 58 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 78 45 C 85 65, 88 85, 72 92 C 66 88, 70 70, 68 58 Z"
            fill="url(#hairGrad)"
          />

          {/* 2. Chibi Shoulders & Gothic Ribbon Collar */}
          <path
            d="M 34 82 C 40 80, 60 80, 66 82 C 74 86, 78 95, 78 98 C 65 101, 35 101, 22 98 C 22 95, 26 86, 34 82 Z"
            fill="#18181b"
          />
          <circle cx="50" cy="85" r="3.5" fill="var(--accent, #818cf8)" />
          <path
            d="M 44 85 L 50 87 L 56 85 L 50 83 Z"
            fill="#e2e8f0"
            opacity="0.9"
          />

          {/* 3. Chibi Face & Ears */}
          <path
            d="M 27 50 C 26 34, 74 34, 73 50 C 73 68, 62 78, 50 78 C 38 78, 27 68, 27 50 Z"
            fill="url(#faceGrad)"
          />

          {/* Cute Little Ears */}
          <circle cx="27" cy="52" r="3.5" fill="#fde2d2" />
          <circle cx="73" cy="52" r="3.5" fill="#fde2d2" />

          {/* 4. Cheeks Blush */}
          <ellipse cx="35" cy="58" rx="6.5" ry="3.5" fill="url(#blushGrad)" />
          <ellipse cx="65" cy="58" rx="6.5" ry="3.5" fill="url(#blushGrad)" />

          {/* 5. Left Eye Socket & Moving Pupil */}
          <g id="left-eye-socket" transform="translate(37, 51)">
            {/* Eye Sclera (White base) */}
            <clipPath id="leftEyeClip">
              <ellipse cx="0" cy="0" rx="6.5" ry={isBlinking ? 0.5 : 8} />
            </clipPath>

            <ellipse
              cx="0"
              cy="0"
              rx="6.5"
              ry={isBlinking ? 0.5 : 8}
              fill="url(#eyeWhiteGrad)"
            />

            {/* Moving Pupil & Iris with cursor tracking */}
            {!isBlinking && (
              <g
                clipPath="url(#leftEyeClip)"
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  transition: 'transform 0.05s ease-out',
                }}
              >
                {/* Iris */}
                <ellipse cx="0" cy="0.5" rx="5.2" ry="7" fill="url(#irisGrad)" />
                {/* Pupil Core */}
                <ellipse cx="0" cy="1" rx="2.5" ry="3.5" fill="#09090b" />
                {/* Primary Sparkle Highlight */}
                <circle cx="-1.8" cy="-2" r="1.8" fill="#ffffff" />
                {/* Secondary Micro Highlight */}
                <circle cx="1.6" cy="2.2" r="0.9" fill="#ffffff" opacity="0.85" />
              </g>
            )}

            {/* Eyelash & Eyelid Crease */}
            <path
              d={
                isBlinking
                  ? 'M -7 0 Q 0 1, 7 0'
                  : mood === 'annoyed'
                  ? 'M -7 -6 Q 0 -4, 7 -5'
                  : 'M -7 -6 Q 0 -9, 7 -5'
              }
              fill="none"
              stroke="#18181b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* 6. Right Eye Socket & Moving Pupil */}
          <g id="right-eye-socket" transform="translate(63, 51)">
            <clipPath id="rightEyeClip">
              <ellipse cx="0" cy="0" rx="6.5" ry={isBlinking ? 0.5 : 8} />
            </clipPath>

            <ellipse
              cx="0"
              cy="0"
              rx="6.5"
              ry={isBlinking ? 0.5 : 8}
              fill="url(#eyeWhiteGrad)"
            />

            {!isBlinking && (
              <g
                clipPath="url(#rightEyeClip)"
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                  transition: 'transform 0.05s ease-out',
                }}
              >
                {/* Iris */}
                <ellipse cx="0" cy="0.5" rx="5.2" ry="7" fill="url(#irisGrad)" />
                {/* Pupil Core */}
                <ellipse cx="0" cy="1" rx="2.5" ry="3.5" fill="#09090b" />
                {/* Primary Sparkle Highlight */}
                <circle cx="-1.8" cy="-2" r="1.8" fill="#ffffff" />
                {/* Secondary Micro Highlight */}
                <circle cx="1.6" cy="2.2" r="0.9" fill="#ffffff" opacity="0.85" />
              </g>
            )}

            <path
              d={
                isBlinking
                  ? 'M -7 0 Q 0 1, 7 0'
                  : mood === 'annoyed'
                  ? 'M -7 -5 Q 0 -4, 7 -6'
                  : 'M -7 -5 Q 0 -9, 7 -6'
              }
              fill="none"
              stroke="#18181b"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* 7. Expressive Eyebrows */}
          <path
            d={
              mood === 'annoyed'
                ? 'M 30 38 Q 36 41, 42 43'
                : mood === 'shocked'
                ? 'M 31 35 Q 36 33, 42 36'
                : 'M 31 40 Q 36 37, 43 40'
            }
            fill="none"
            stroke="#27272a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d={
              mood === 'annoyed'
                ? 'M 69 38 Q 63 41, 57 43'
                : mood === 'shocked'
                ? 'M 68 35 Q 63 33, 57 36'
                : 'M 68 40 Q 63 37, 56 40'
            }
            fill="none"
            stroke="#27272a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* 8. Cute Little Nose */}
          <circle cx="50" cy="59" r="0.8" fill="#f43f5e" opacity="0.6" />

          {/* 9. Expressive Mouth */}
          {mood === 'annoyed' ? (
            <path
              d="M 46 68 Q 50 65, 54 68"
              fill="none"
              stroke="#be185d"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : isTyping ? (
            /* Animated talking mouth when speaking */
            <ellipse
              cx="50"
              cy="67"
              rx="2.8"
              ry="3.2"
              fill="#be185d"
              className="animate-pulse"
            />
          ) : (
            <path
              d="M 46 66 Q 50 70, 54 66"
              fill="none"
              stroke="#be185d"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}

          {/* 10. Front Anime Hair Bangs & Silhouette */}
          <path
            d="M 25 44 C 23 25, 77 25, 75 44 C 70 41, 65 46, 61 51 C 58 45, 53 44, 50 49 C 47 44, 42 45, 39 51 C 35 46, 30 41, 25 44 Z"
            fill="url(#hairGrad)"
          />

          {/* Hair Light Sheen Arc */}
          <path
            d="M 30 35 Q 50 31, 70 35"
            fill="none"
            stroke="url(#hairSheen)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* 11. Yuna's Signature Gothic Hair Accessory / Purple Rose */}
          <g transform="translate(24, 30)">
            <circle cx="0" cy="0" r="4.5" fill="var(--accent, #818cf8)" />
            <circle cx="0" cy="0" r="2.8" fill="#c084fc" opacity="0.9" />
            <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
            {/* Small accessory ribbon */}
            <path
              d="M -3 3 L -6 9 L -2 7 L 0 10 L 0 4 Z"
              fill="#18181b"
              opacity="0.85"
            />
          </g>

          {/* 12. Cute Bouncing Ahoge (Top hair strand) */}
          <path
            d="M 49 22 Q 47 13, 56 12 Q 52 17, 51 22 Z"
            fill="url(#hairGrad)"
            className="transition-transform duration-300 origin-bottom"
            style={{
              transform: isHopping ? 'rotate(-12deg)' : 'rotate(0deg)',
            }}
          />
        </svg>
      </button>

      {/* Global Embedded Keyframe Styles for Puppet & Thought Bubble */}
      <style>{`
        @keyframes popBounce {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(10px);
          }
          70% {
            opacity: 1;
            transform: scale(1.05) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeShrink {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.7) translateY(8px);
          }
        }
        @keyframes puppetShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20% { transform: translateX(-4px) rotate(-6deg); }
          40% { transform: translateX(4px) rotate(6deg); }
          60% { transform: translateX(-3px) rotate(-4deg); }
          80% { transform: translateX(3px) rotate(4deg); }
        }
        .animate-shake {
          animation: puppetShake 0.45s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Also export alias for compatibility
export const ChibiSerafinaPuppet = ChibiYunaPuppet;
export default ChibiYunaPuppet;
