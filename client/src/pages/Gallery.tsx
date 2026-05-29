import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_IMAGES } from '../lib/assets';

function GalleryCell({ index }: { index: number }) {
  const [imgIndex, setImgIndex] = useState(() => (index * 3) % GALLERY_IMAGES.length);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const delay = index * 600;
    const interval = 3000 + index * 300;

    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        setVisible(false);
        setTimeout(() => {
          setImgIndex(i => (i + 1) % GALLERY_IMAGES.length);
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
            src={GALLERY_IMAGES[imgIndex]}
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
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </AnimatePresence>

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
        paddingTop: '5rem',
        position: 'relative',
      }}
    >
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
