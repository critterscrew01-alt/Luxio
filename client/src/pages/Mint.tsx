import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Set your target date here
const TARGET_DATE = new Date('2026-06-05T00:00:00Z');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      done:    diff === 0,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      key={value}
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        minWidth: '60px',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: '14px',
          padding: '14px 10px',
          fontFamily: "'Bangers', cursive",
          fontSize: 'clamp(1.8rem, 6vw, 2.4rem)',
          letterSpacing: '0.05em',
          color: '#fff',
          minWidth: '64px',
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function Mint() {
  const [, navigate] = useLocation();
  const { days, hours, minutes, seconds, done } = useCountdown(TARGET_DATE);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#7d4a55',
        fontFamily: "'Nunito', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2rem',
        position: 'relative',
      }}
    >
      {/* Back */}
      <button
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(255,255,255,0.12)',
          border: 'none',
          borderRadius: '100px',
          padding: '8px 18px',
          fontFamily: "'Bangers', cursive",
          fontSize: '0.95rem',
          letterSpacing: '0.08em',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        ← BACK
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(220,210,205,0.1)',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '28px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Lock icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ fontSize: '3.5rem', filter: 'grayscale(0.3)' }}
        >
          {done ? '🔓' : '🔒'}
        </motion.div>

        <h2
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            letterSpacing: '0.1em',
            color: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
            margin: 0,
            transition: 'color 0.5s',
          }}
        >
          MINT
        </h2>

        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {done
            ? 'The mint is now live for whitelisted Outworlders.'
            : 'Mint unlocks for whitelisted Outworlders in:'}
        </p>

        {/* Countdown */}
        {!done && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <TimeBlock value={days}    label="days"    />
            <Colon />
            <TimeBlock value={hours}   label="hours"   />
            <Colon />
            <TimeBlock value={minutes} label="mins"    />
            <Colon />
            <TimeBlock value={seconds} label="secs"    />
          </div>
        )}

        <div
          style={{
            display: 'inline-block',
            background: done ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '100px',
            padding: '8px 24px',
            fontFamily: "'Bangers', cursive",
            fontSize: '0.9rem',
            letterSpacing: '0.15em',
            color: done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.5s',
          }}
        >
          {done ? 'MINT IS LIVE' : 'COMING SOON'}
        </div>
      </motion.div>
    </div>
  );
}

function Colon() {
  return (
    <span
      style={{
        fontFamily: "'Bangers', cursive",
        fontSize: '2rem',
        color: 'rgba(255,255,255,0.25)',
        lineHeight: 1,
        paddingTop: '10px',
      }}
    >
      :
    </span>
  );
}
