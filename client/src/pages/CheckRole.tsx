import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { checkStatus, type ApplicationStatus } from '../lib/supabase';

const STATUS_MAP: Record<ApplicationStatus, { label: string; emoji: string; color: string; bg: string }> = {
  approved:  { label: 'WHITELISTED',   emoji: '✅', color: '#1a4a2a', bg: '#b8f5c8' },
  pending:   { label: 'UNDER REVIEW',  emoji: '⏳', color: '#4a3a0a', bg: '#fef3b0' },
  rejected:  { label: 'NOT SELECTED',  emoji: '❌', color: '#4a1a1a', bg: '#fbb0b0' },
  not_found: { label: 'NOT FOUND',     emoji: '🔍', color: '#3a3a3a', bg: '#e0e0e0' },
};

export default function CheckRole() {
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [, navigate] = useLocation();

  const check = async () => {
    if (!wallet.trim()) return;
    setLoading(true); setErr(''); setStatus(null);
    try { setStatus(await checkStatus(wallet.trim())); }
    catch { setErr('Connection failed. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#7d4a55',
        fontFamily: "'Nunito', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
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
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: 'rgba(220, 210, 205, 0.95)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: '1.6rem',
            letterSpacing: '0.1em',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          CHECK ROLE
        </h2>
        <p
          style={{
            fontSize: '0.8rem',
            color: '#888',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Enter your EVM wallet to check whitelist status
        </p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <input
            value={wallet}
            onChange={e => { setWallet(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="0x…"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.7)',
              border: '1.5px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#333',
              outline: 'none',
            }}
          />
          <button
            onClick={check}
            disabled={loading || !wallet.trim()}
            style={{
              background: '#1a1a1a',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontFamily: "'Bangers', cursive",
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              color: '#fff',
              cursor: 'pointer',
              opacity: (loading || !wallet.trim()) ? 0.5 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '…' : 'CHECK →'}
          </button>
        </div>

        {err && (
          <p style={{ fontSize: '0.75rem', color: '#c0392b', fontWeight: 700 }}>{err}</p>
        )}

        <AnimatePresence>
          {status && (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '1rem',
                background: STATUS_MAP[status].bg,
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '2rem' }}>{STATUS_MAP[status].emoji}</span>
              <div>
                <p
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: '1.1rem',
                    letterSpacing: '0.08em',
                    color: STATUS_MAP[status].color,
                    margin: 0,
                  }}
                >
                  {STATUS_MAP[status].label}
                </p>
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: STATUS_MAP[status].color,
                    opacity: 0.7,
                    fontWeight: 700,
                    margin: '2px 0 0',
                  }}
                >
                  {status === 'approved' && 'You\'re in! 🎉 Stay tuned for mint details.'}
                  {status === 'pending' && 'Hang tight — we\'re reviewing applications.'}
                  {status === 'rejected' && 'Unfortunately not selected this round.'}
                  {status === 'not_found' && 'No application found for this wallet.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
    
