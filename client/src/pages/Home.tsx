import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useUser } from '../App';
import { BACKGROUND_IMAGES } from '../lib/assets';

const menuItems = [
  { label: 'GALLERY', path: '/gallery' },
  { label: 'APPLY WL', path: '/apply' },
  { label: 'CHECK ROLE', path: '/check-role' },
  { label: 'MINT', path: '/mint' },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { xUsername } = useUser();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#6b2d2d',
        fontFamily: "'Nunito', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        paddingTop: '5rem',
      }}
    >
      <img
        src={BACKGROUND_IMAGES.image2}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(60, 20, 20, 0.45)',
        }}
      />

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
          padding: '2rem 1.5rem',
        }}
      >
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35 }}
            onClick={() => navigate(item.path)}
            style={{
              background: 'rgba(235, 228, 220, 0.92)',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 28px',
              fontFamily: "'Bangers', cursive",
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              color: '#1a1a1a',
              cursor: 'pointer',
              minWidth: '160px',
              textAlign: 'left',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s, background 0.15s',
              ...(item.label === 'MINT' ? { color: '#999', background: 'rgba(200,195,190,0.7)' } : {}),
            }}
            onMouseEnter={e => {
              if (item.label !== 'MINT')
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(6px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)';
            }}
          >
            {item.label}
            {item.label === 'MINT' && (
              <span
                style={{
                  display: 'block',
                  fontSize: '0.55rem',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: '#aaa',
                  marginTop: '2px',
                }}
              >
                COMING SOON
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      <div
        style={{
          position: 'absolute',
          top: '5.5rem',
          right: '1.5rem',
          zIndex: 10,
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.05em',
        }}
      >
        @{xUsername}
      </div>
    </div>
  );
}
