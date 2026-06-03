import { useRef, useState } from 'react';
import type { ChatMessage } from '@m2s2/models';
import './Chat.scss';

interface ChatProps {
  sendMessage: (messages: ChatMessage[]) => Promise<string>;
  title?:              string;
  subtitle?:           string;
  placeholder?:        string;
  maxMessages?:        number;
  ctaLabel?:           string;
  ctaUrl?:             string;
  userAvatarUrl?:      string;
  assistantAvatarUrl?: string;
}

type SendState = 'idle' | 'sending' | 'error';

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const AssistantIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Chat({
  sendMessage,
  title              = 'Architecture Advisor',
  subtitle           = 'Ask anything about software architecture, cloud design, or engineering decisions.',
  placeholder        = 'Ask a question...',
  maxMessages        = 6,
  ctaLabel           = 'Start a Conversation',
  ctaUrl             = '/contact',
  userAvatarUrl,
  assistantAvatarUrl,
}: ChatProps) {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [sendState, setSendState] = useState<SendState>('idle');
  const [draft, setDraft]         = useState('');
  const listRef                   = useRef<HTMLDivElement>(null);

  const userCount    = messages.filter(m => m.role === 'user').length;
  const limitReached = userCount >= maxMessages;

  function scrollToBottom() {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, 0);
  }

  async function submit() {
    const text = draft.trim();
    if (!text || sendState === 'sending' || limitReached) return;

    setDraft('');
    const updated: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setSendState('sending');
    scrollToBottom();

    try {
      const reply = await sendMessage(updated);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setSendState('idle');
      scrollToBottom();
    } catch {
      setSendState('error');
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="m2s2-chat">
      <button
        className="chat-toggle"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={title}>

          <div className="chat-header">
            {assistantAvatarUrl && (
              <img className="chat-header__avatar" src={assistantAvatarUrl} alt="" aria-hidden="true" />
            )}
            <div className="chat-header__text">
              <p className="chat-header__title">{title}</p>
              {messages.length === 0 && (
                <p className="chat-header__subtitle">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.length === 0 && (
              <p className="chat-empty">Send a message to get started.</p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message chat-message--${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <span className="chat-avatar chat-avatar--assistant">
                    {assistantAvatarUrl
                      ? <img src={assistantAvatarUrl} alt="" aria-hidden="true" />
                      : <AssistantIcon />}
                  </span>
                )}
                <p className="chat-message__text">{msg.content}</p>
                {msg.role === 'user' && (
                  <span className="chat-avatar chat-avatar--user">
                    {userAvatarUrl
                      ? <img src={userAvatarUrl} alt="" aria-hidden="true" />
                      : <UserIcon />}
                  </span>
                )}
              </div>
            ))}

            {sendState === 'sending' && (
              <div className="chat-message chat-message--assistant">
                <span className="chat-avatar chat-avatar--assistant">
                  {assistantAvatarUrl
                    ? <img src={assistantAvatarUrl} alt="" aria-hidden="true" />
                    : <AssistantIcon />}
                </span>
                <span className="chat-typing">
                  <span /><span /><span />
                </span>
              </div>
            )}
          </div>

          {limitReached && (
            <div className="chat-cta">
              <p className="chat-cta__text">Ready to go deeper? Let's talk through your specific situation.</p>
              <a className="chat-cta__btn" href={ctaUrl}>{ctaLabel}</a>
            </div>
          )}

          {!limitReached && (
            <>
              <div className="chat-input-row">
                <textarea
                  className="chat-input"
                  rows={1}
                  placeholder={placeholder}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  disabled={sendState === 'sending'}
                  onKeyDown={onKeyDown}
                />
                <button
                  className="chat-send"
                  disabled={!draft.trim() || sendState === 'sending'}
                  onClick={submit}
                  aria-label="Send"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {sendState === 'error' && (
                <p className="chat-error">Something went wrong — please try again.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
