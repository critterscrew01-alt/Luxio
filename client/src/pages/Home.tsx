import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useUser } from '../App';
import { BACKGROUND_IMAGES } from '../lib/assets';
import { StaticMenu } from '../components/FloatingMenu';

export default function Home() {
  const [, navigate] = useLocation();
  const { xUsername } = useUser();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#6b2d2d',
      fontFamily: "'Nunito', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      <img
        src={BACKGROUND_IMAGES.image2}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(60,20,20,0.45)' }} />

      <StaticMenu onNavigate={navigate} />

      <div style={{
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 10,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 800,
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.05em',
      }}>
        @{xUsername}
      </div>
    </div>
  );
}
