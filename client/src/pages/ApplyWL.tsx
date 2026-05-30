import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { submitApplication } from '../lib/supabase';
import { useUser } from '../App';

type TaskKey = 'follow' | 'quote' | 'like' | 'tag' | 'wallet';

const TASKS: {
  key: TaskKey;
  label: string;
  url?: string;
  needsInput?: boolean;
  inputPlaceholder?: string;
  isWallet?: boolean;
}[] = [
  {
    key: 'follow',
    label: 'FOLLOW LUXIO',
    url: 'https://x.com/luxioart',
  },
  {
    key: 'quote',
    label: 'QT PINNED POST WITH BULLISH',
    url: 'https://x.com/luxioart',
    needsInput: true,
    inputPlaceholder: 'Paste your quote tweet link',
  },
  {
    key: 'like',
    label: 'LIKE PINNED POST',
    url: 'https://x.com/luxioart',
  },
  {
    key: 'tag',
    label: 'TAG 2 FRIENDS IN PINNED POST',
    url: 'https://x.com/luxioart',
    needsInput: true,
    inputPlaceholder: 'Paste the comment link',
  },
  {
    key: 'wallet',
    label: 'SUBMIT YOUR EVM WALLET',
    isWallet: true,
    inputPlaceholder: '0x…',
  },
];

// Basic EVM address regex: 0x followed by 40 hex chars
const EVM_REGEX = /^0x[a-fA-F0-9]{40}$/;

export default function ApplyWL() {
  const [done, setDone] = useState<Set<TaskKey>>(new Set());
  const [inputs, setInputs] = useState<Partial<Record<TaskKey, string>>>({
    wallet: '', // always start empty
  });
  const [errors, setErrors] = useState<Partial<Record<TaskKey | 'submit', string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { xUsername } = useUser();
  const [, navigate] = useLocation();

  // Remember submission across refreshes
  useEffect(() => {
    if (xUsername && localStorage.getItem(`wl_submitted_${xUsername}`)) {
      setSuccess(true);
    }
  }, [xUsername]);

  const openTask = (task: (typeof TASKS)[0]) => {
    if (task.url) window.open(task.url, '_blank');
    if (!task.needsInput && !task.isWallet) {
      setTimeout(() => markDone(task.key), 1200);
    }
  };

  const markDone = (key: TaskKey) => {
    setDone(p => new Set([...p, key]));
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const submit = async () => {
    const errs: Partial<Record<TaskKey | 'submit', string>> = {};

    // 1. Every task must be marked done
    for (const t of TASKS) {
      if (!done.has(t.key)) {
        errs[t.key] = 'Required — complete this task';
      }
    }

    // 2. Wallet must be present AND a valid EVM address
    const wallet = inputs.wallet?.trim();
    if (!wallet) {
      errs.wallet = 'Wallet address required';
    } else if (!EVM_REGEX.test(wallet)) {
      errs.wallet = 'Invalid EVM address (must be 0x + 40 hex chars)';
    }

    // 3. Link inputs must be filled when their task is done
    if (done.has('quote') && !inputs.quote?.trim()) errs.quote = 'Paste your quote tweet link';
    if (done.has('tag') && !inputs.tag?.trim()) errs.tag = 'Paste your comment link';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication({
        x_username: xUsername,
        wallet: wallet!,
        x_link: `https://x.com/${xUsername}`,
        quote_link: inputs.quote?.trim(),
        tag_link: inputs.tag?.trim(),
        tasks_done: [...done],
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
      {/* Card */}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {TASKS.map(task => {
            const isDone = done.has(task.key);
            return (
              <div key={task.key}>
                {/* Task row */}
                <div
                  style={{
                    background: 'rgba(240,234,228,0.9)',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Bangers', cursive",
                      fontSize: '0.95rem',
                      letterSpacing: '0.06em',
                      color: isDone ? '#888' : '#1a1a1a',
                      textDecoration: isDone ? 'line-through' : 'none',
                      flex: 1,
                    }}
                  >
                    {task.label}
                  </span>

                  {task.isWallet ? (
                    <input
                      value={inputs.wallet ?? ''}
                      onChange={e => {
                        setInputs(p => ({ ...p, wallet: e.target.value }));
                        setErrors(p => { const n = { ...p }; delete n.wallet; return n; });
                        if (e.target.value.trim()) markDone('wallet');
                        else setDone(p => { const n = new Set(p); n.delete('wallet'); return n; });
                      }}
                      placeholder="0x…"
                      style={{
                        background: '#1a1a1a',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '8px 16px',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        color: '#fff',
                        outline: 'none',
                        width: '130px',
                        textAlign: 'center',
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => {
                        if (!isDone) openTask(task);
                      }}
                      style={{
                        background: '#1a1a1a',
                        border: 'none',
                        borderRadius: '100px',
                        padding: '8px 20px',
                        fontFamily: "'Bangers', cursive",
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        color: '#fff',
                        cursor: isDone ? 'default' : 'pointer',
                        whiteSpace: 'nowrap',
                        minWidth: '80px',
                      }}
                    >
                      {isDone ? 'DONE ✓' : 'GO →'}
                    </button>
                  )}
                </div>

                {/* Input field for tasks needing a link */}
                {task.needsInput && isDone && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '6px', paddingLeft: '8px', paddingRight: '8px' }}
                  >
                    <input
                      value={inputs[task.key] || ''}
                      onChange={e => {
                        setInputs(p => ({ ...p, [task.key]: e.target.value }));
                        setErrors(p => { const n = { ...p }; delete n[task.key]; return n; });
                      }}
                      placeholder={task.inputPlaceholder}
                      style={{
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
                      }}
                    />
                  </motion.div>
                )}

                {/* For link tasks not yet marked done, show a "Mark done" helper after clicking */}
                {task.needsInput && !isDone && task.url && (
                  <div style={{ paddingLeft: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => markDone(task.key)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '0.7rem',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        color: '#888',
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                    >
                      ✓ I've done this
                    </button>
                  </div>
                )}

                {/* Unified error display for this task */}
                {errors[task.key] && (
                  <p style={{ fontSize: '0.7rem', color: '#c0392b', marginTop: '3px', paddingLeft: '8px', fontWeight: 700 }}>
                    {errors[task.key]}
                  </p>
                )}
              </div>
            );
          })}
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
          Quote & tag links are manually reviewed.
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
