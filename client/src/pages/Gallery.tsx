import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

// All gallery images from attached_assets
const ALL_IMAGES = [
  '/attached_assets/1.jpg',
  '/attached_assets/(3)1.jpg',
  '/attached_assets/(4)1.jpg',
  '/attached_assets/(5)1.jpg',
  '/attached_assets/(6)1.jpg',
  '/attached_assets/(7)1.jpg',
  '/attached_assets/(8)1.jpg',
  '/attached_assets/(9)1.jpg',
  '/attached_assets/(20)1.jpg',
  '/attached_assets/(21)1.jpg',
  '/attached_assets/(22)1.jpg',
  '/attached_assets/(23)1.jpg',
  '/attached_assets/(24)1.jpg',
  '/attached_assets/(25)1.jpg',
  '/attached_assets/(26)1.jpg',
  '/attached_assets/(27)1.jpg',
  '/attached_assets/Image1.JPG',
  '/attached_assets/image2.jpg',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GalleryCell({ index }: { index: number }) {
  const [imgIndex, setImgIndex] = useState(() => (index * 3) % ALL_IMAGES.length);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Stagger each cell so they don't all swap at the same time
    const delay = index * 600;
    const interval = 3000 + index * 300;

    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setImgIndex(i => (i + 1) % ALL_IMAGES.length);
          setVisible(true);
        }, 350);
      }, interval);
      return () => clearInterval(id);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div
      style={{
        aspectRatio: '1',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#1a1a2e',
        position: 'relative',
        border: '3px solid rgba(255,255,255,0.08)',
      }}
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.img
            key={imgIndex}
            src={ALL_IMAGES[imgIndex]}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={e => {
              // Show silhouette placeholder on error
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </AnimatePresence>

      {/* Silhouette fallback overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111',
          zIndex: -1,
        }}
      >
        {/* Person silhouette like in the design */}
        <svg width="50%" height="50%" viewBox="0 0 100 120" fill="none">
          <ellipse cx="50" cy="30" rx="22" ry="25" fill="#2a2a2a" />
          <path d="M10 120 Q10 70 50 70 Q90 70 90 120Z" fill="#2a2a2a" />
          <ellipse cx="50" cy="30" rx="20" ry="22" fill="#1a1a1a" />
          <radialGradient id={`g${index}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b2020" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <ellipse cx="50" cy="60" rx="45" ry="45" fill={`url(#g${index})`} />
        </svg>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [, navigate] = useLocation();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5c040',
        fontFamily: "'Nunito', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(0,0,0,0.15)',
          border: 'none',
          borderRadius: '100px',
          padding: '8px 18px',
          fontFamily: "'Bangers', cursive",
          fontSize: '0.95rem',
          letterSpacing: '0.08em',
          color: '#333',
          cursor: 'pointer',
        }}
      >
        ← BACK
      </button>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: "'Bangers', cursive",
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          letterSpacing: '0.1em',
          color: '#1a1a1a',
          marginBottom: '1.5rem',
          textShadow: '2px 2px 0 rgba(0,0,0,0.08)',
        }}
      >
        GALLERY
      </motion.h1>

      {/* 3×3 grid in a rounded blue container like the design */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: '#7ec8e3',
          borderRadius: '28px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '520px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
          }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <GalleryCell key={i} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
          
