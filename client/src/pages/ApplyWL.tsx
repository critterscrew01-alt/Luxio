import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { submitApplication } from '../lib/supabase';
import { useUser } from '../App';

type TaskKey = 'follow' | 'quote' | 'like' | 'tag' | 'wallet';

const TASKS: {
  key: TaskKey;
  label: string;
  placeholder: string;
  isWallet?: boolean;
}[] = [
  {
    key: 'follow',
    label: 'FOLLOW LUXIO',
    placeholder: 'Paste your profile/follow link',
  },
  {
    key: 'quote',
    label: 'QT PINNED POST WITH BULLISH',
    placeholder: 'Paste your quote tweet link',
  },
  {
    key: 'like',
    label: 'LIKE PINNED POST',
    placeholder: 'Paste the post link you liked',
  },
  {
    key: 'tag',
    label: 'TAG 2 FRIENDS IN PINNED POST',
    placeholder: 'Paste your comment link',
  },
  {
    key: 'wallet',
    label: 'SUBMIT YOUR EVM WALLET',
    placeholder: '0x…',
    isWallet: true,
  },
];

const EVM_REGEX = /^0x[a-fA-F0-9]{40}$/;

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.7)',
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 700,
  fontSize: '0.82rem',
  color: '#333',
  outline: 'none',
  boxSizing: 'border-box',
  marginTop: '8px',
};

const walletInputStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
};

export default function ApplyWL() {
  const [inputs, setInputs] = useState<Partial<Record<TaskKey, string>>>({});
  const [errors, setErrors] = useState<Partial<Record<TaskKey | 'submit', string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { xUsername } = useUser();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (xUsername && localStorage.getItem(`wl_submitted_${xUsername}`)) {
      setSuccess(true);
    }
  }, [xUsername]);

  const setField = (key: TaskKey, value: string) => {
    setInputs(p => ({ ...p, [key]: value }));
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const submit = async () => {
    const errs: Partial<Record<TaskKey | 'submit', string>> = {};

    // All link fields required
    for (const t of TASKS) {
      if (!t.isWallet && !inputs[t.key]?.trim()) {
        errs[t.key] = 'This field is required';
      }
    }

    // Wallet validation
    const wallet = inputs.wallet?.trim();
    if (!wallet) {
      errs.wallet = 'Wallet address required';
    } else if (!EVM_REGEX.test(wallet)) {
      errs.wallet = 'Invalid EVM address (must be 0x + 40 hex chars)';
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication({
        x_username: xUsername,
        wallet: wallet!,
        x_link: inputs.follow?.trim() ?? '',
        quote_link: inputs.quote?.trim(),
        tag_link: inputs.tag?.trim(),
        tasks_done: TASKS.map(t => t.key),
      });
      localStorage.setItem(`wl_submitted_${xUsername}`, 'true');
      setSuccess(true);
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
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
        paddingTop: '5rem',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{
          background: 'rgba(220, 210, 205, 0.95)',
          borderRadius: '24px',
          padding: '2rem 1.75rem',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
        }}
      >
        <h2
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: '1.6rem',
            letterSpacing: '0.1em',
            color: '#1a1a1a',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          APPLY FOR WHITELIST
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {TASKS.map(task => (
            <div key={task.key}>
              <div
                style={{
                  background: 'rgba(240,234,228,0.9)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: '0.95rem',
                    letterSpacing: '0.06em',
                    color: '#1a1a1a',
                    display: 'block',
                    marginBottom: '2px',
                  }}
                >
                  {task.label}
                </span>

                <input
                  value={inputs[task.key] ?? ''}
                  onChange={e => setField(task.key, e.target.value)}
                  placeholder={task.placeholder}
                  style={task.isWallet ? walletInputStyle : inputStyle}
                />
              </div>

              {errors[task.key] && (
                <p style={{ fontSize: '0.7rem', color: '#c0392b', marginTop: '3px', paddingLeft: '8px', fontWeight: 700 }}>
                  {errors[task.key]}
                </p>
              )}
            </div>
          ))}
        </div>

        {errors.submit && (
          <p style={{ fontSize: '0.75rem', color: '#c0392b', textAlign: 'center', marginTop: '1rem', fontWeight: 700 }}>
            {errors.submit}
          </p>
        )}

        <button
          onClick={submit}
          disabled={submitting}
          style={{
            width: '100%',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            padding: '1rem',
            fontFamily: "'Bangers', cursive",
            fontSize: '1.1rem',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            marginTop: '1.5rem',
            opacity: submitting ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {submitting ? 'SUBMITTING…' : 'SUBMIT APPLICATION'}
        </button>

        <p
          style={{
            fontSize: '0.65rem',
            color: '#999',
            textAlign: 'center',
            marginTop: '0.75rem',
            lineHeight: 1.5,
            fontWeight: 700,
          }}
        >
          All links are manually reviewed.
        </p>
      </motion.div>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              padding: '1.25rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              style={{
                background: 'rgba(220,210,205,0.97)',
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                maxWidth: '320px',
                width: '100%',
              }}
            >
              <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉</p>
              <h2
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: '1.6rem',
                  letterSpacing: '0.1em',
                  color: '#1a1a1a',
                  marginBottom: '0.75rem',
                }}
              >
                APPLICATION RECEIVED
              </h2>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#666',
                  lineHeight: 1.7,
                  marginBottom: '1.75rem',
                  fontWeight: 700,
                }}
              >
                We'll review your submission and whitelist approved Outworlders. Turn notifs on!
              </p>
              <button
                onClick={() => navigate('/home')}
                style={{
                  width: '100%',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.9rem',
                  fontFamily: "'Bangers', cursive",
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                BACK TO HOME
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
