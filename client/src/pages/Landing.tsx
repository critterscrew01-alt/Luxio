import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useUser } from '../App';
import { BACKGROUND_IMAGES } from '../lib/assets';

export default function Landing() {
  const [username, setUsername] = useState('');
  const [err, setErr] = useState('');
  const { setXUsername } = useUser();
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400);
  }, []);

  const proceed = () => {
    const val = username.trim().replace(/^@/, '');
    if (!val) { setErr('Enter your X username'); return; }
    setXUsername(val);
    navigate('/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5c97a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image — covers full viewport on all screen sizes */}
      <img
        src={BACKGROUND_IMAGES.image1}
        alt=""
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          objectPosition: 'center top',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: '55vh',
        }}
      >
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            value={username}
            onChange={e => { setUsername(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && proceed()}
            placeholder="@username"
            style={{
              background: '#f0c97e',
              border: 'none',
              borderRadius: '100px',
              padding: '10px 24px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#333',
              outline: 'none',
              width: '200px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          {err && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                bottom: '-22px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.7rem',
                color: '#c0392b',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {err}
            </motion.p>
          )}
        </div>

        <button
          onClick={proceed}
          style={{
            background: '#e63946',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '12px 36px',
            fontFamily: "'Bangers', cursive",
            fontSize: '1.1rem',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(230,57,70,0.4)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          PROCEED
        </button>
      </motion.div>
    </div>
  );
}
