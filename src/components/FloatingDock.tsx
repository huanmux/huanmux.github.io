import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Palette,
  Volume2,
  VolumeX,
  ArrowUp,
  Search,
  SkipForward,
} from 'lucide-react';

interface FloatingDockProps {
  onScrollToApps: () => void;
  onOpenThemeDrawer: () => void;
  onFocusSearch: () => void;
}

const PLAYLIST = [
  'https://dewanmukto.github.io/asset/audio/Track01.mp3',
  'https://dewanmukto.github.io/asset/audio/Track02.mp3',
  'https://dewanmukto.github.io/asset/audio/Track03.mp3',
  'https://dewanmukto.github.io/asset/audio/Track04.mp3',
  'https://dewanmukto.github.io/asset/audio/Track05.mp3',
];

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onScrollToApps,
  onOpenThemeDrawer,
  onFocusSearch,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Monitor scroll for Back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(PLAYLIST[0]);
    audio.volume = 0.35;
    audio.loop = false;

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => {
        const next = (prev + 1) % PLAYLIST.length;
        audio.src = PLAYLIST[next];
        audio.play().catch(() => setIsPlaying(false));
        return next;
      });
    };

    audio.addEventListener('ended', handleEnded);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser may restrict autoplay until user gestures
          setIsPlaying(false);
        });
    }
  };

  const nextTrack = () => {
    if (!audioRef.current) return;
    const next = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(next);
    audioRef.current.src = PLAYLIST[next];
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Quick Navigation Dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full themed-dock backdrop-blur-2xl shadow-2xl flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
    >
      {/* 1. App Launcher shortcut */}
      <button
        onClick={onScrollToApps}
        className="p-2 sm:px-3 sm:py-2 rounded-full themed-btn flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Jump to App Showcase"
      >
        <LayoutGrid className="w-4 h-4" style={{ color: 'var(--accent)' }} />
        <span className="hidden sm:inline">Apps</span>
      </button>

      {/* 2. Search shortcut */}
      <button
        onClick={onFocusSearch}
        className="p-2 rounded-full themed-btn opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Find application"
        aria-label="Find application"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-current opacity-15 mx-0.5" />

      {/* 3. Theme Selector */}
      <button
        onClick={onOpenThemeDrawer}
        className="p-2 rounded-full themed-btn opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Change Theme Palette"
        aria-label="Change Theme Palette"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* 4. Ambient Soundtrack Audio Player */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95 ${
            isPlaying ? 'themed-send-btn shadow-sm' : 'themed-btn opacity-80 hover:opacity-100'
          }`}
          title={isPlaying ? `Playing Track 0${currentTrackIndex + 1} (Tap to pause)` : 'Play ambient audio'}
          aria-label={isPlaying ? 'Pause ambient audio' : 'Play ambient audio'}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {isPlaying && (
          <button
            onClick={nextTrack}
            className="p-1.5 rounded-full themed-btn opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            title="Next ambient track"
            aria-label="Next ambient track"
          >
            <SkipForward className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 5. Back to Top */}
      {showScrollTop && (
        <>
          <div className="w-px h-5 bg-current opacity-15 mx-0.5" />
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full themed-btn opacity-85 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Return to top"
            aria-label="Return to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </>
      )}
    </aside>
  );
};
