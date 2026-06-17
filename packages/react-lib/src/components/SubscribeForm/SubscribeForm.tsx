import { useState } from 'react';
import { validateEmail } from '@m2s2/utils';
import './SubscribeForm.scss';

type SubmitState = 'idle' | 'submitting' | 'done' | 'error';

interface SubscribeFormProps {
  mode?: 'anon' | 'auth';
  subscribeAnon?: (email: string, name: string) => Promise<unknown>;
  subscribeAuth?: () => Promise<unknown>;
  unsubscribeAuth?: () => Promise<unknown>;
  initialState?: SubmitState;
}

export function SubscribeForm({
  mode = 'anon',
  subscribeAnon,
  subscribeAuth,
  unsubscribeAuth,
  initialState = 'idle',
}: SubscribeFormProps) {
  const [email, setEmail]         = useState('');
  const [name, setName]           = useState('');
  const [state, setState]         = useState<SubmitState>(initialState);
  const [subscribed, setSubscribed] = useState(false);

  const emailValid = validateEmail(email);

  async function submit() {
    if (state === 'submitting') return;

    if (mode === 'auth') {
      if (subscribed) {
        if (!unsubscribeAuth) return;
        setState('submitting');
        try {
          await unsubscribeAuth();
          setSubscribed(false);
          setState('idle');
        } catch {
          setState('error');
        }
      } else {
        if (!subscribeAuth) return;
        setState('submitting');
        try {
          await subscribeAuth();
          setSubscribed(true);
          setState('done');
        } catch {
          setState('error');
        }
      }
    } else {
      if (!emailValid || !subscribeAnon) return;
      setState('submitting');
      try {
        await subscribeAnon(email.trim(), name.trim());
        setState('done');
      } catch {
        setState('error');
      }
    }
  }

  if (mode === 'anon') {
    if (state === 'done') {
      return (
        <div className="sub-success">
          <span className="sub-success-icon">✓</span>
          <p className="sub-success-text">Check your email to confirm your subscription.</p>
        </div>
      );
    }
    return (
      <div className="sub-form">
        <input
          className="sub-input"
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={state === 'submitting'}
        />
        <input
          className="sub-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={state === 'submitting'}
        />
        <button
          className="sub-btn"
          disabled={!emailValid || state === 'submitting'}
          onClick={submit}
        >
          {state === 'submitting' ? 'Submitting…' : 'Subscribe'}
        </button>
        {state === 'error' && (
          <p className="sub-feedback sub-feedback--error">
            Something went wrong — please try again.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="sub-auth">
      {!subscribed ? (
        <>
          <button
            className="sub-btn"
            disabled={state === 'submitting'}
            onClick={submit}
          >
            {state === 'submitting' ? 'Subscribing…' : 'Subscribe to Blog Updates'}
          </button>
          {state === 'done' && (
            <p className="sub-feedback sub-feedback--success">You&apos;re subscribed!</p>
          )}
        </>
      ) : (
        <>
          <span className="sub-subscribed-label">✓ Subscribed to blog updates</span>
          <button
            className="sub-btn sub-btn--unsub"
            disabled={state === 'submitting'}
            onClick={submit}
          >
            {state === 'submitting' ? 'Unsubscribing…' : 'Unsubscribe'}
          </button>
        </>
      )}
      {state === 'error' && (
        <p className="sub-feedback sub-feedback--error">
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}
