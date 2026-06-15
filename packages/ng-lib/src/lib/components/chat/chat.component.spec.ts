import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
import { ChatComponent } from './chat.component';
import { ChatMessage } from '../../models/chat';

const noopSend = () => of('Response from assistant');
const renderChat = (inputs: Record<string, unknown> = {}) =>
  render(ChatComponent, {
    inputs: { sendMessage: noopSend, ...inputs },
  });

describe('ChatComponent', () => {
  describe('open / close toggle', () => {
    it('does not render the chat panel initially', async () => {
      await renderChat();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens the chat panel when the toggle button is clicked', async () => {
      await renderChat();
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('closes the chat panel when the toggle button is clicked again', async () => {
      const { fixture } = await renderChat();
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));
      fixture.detectChanges();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders the custom title in the panel header', async () => {
      await renderChat({ title: 'My Assistant' });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      expect(screen.getByText('My Assistant')).toBeInTheDocument();
    });

    it('shows the subtitle when no messages exist', async () => {
      await renderChat({ subtitle: 'Ask me anything' });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      expect(screen.getByText('Ask me anything')).toBeInTheDocument();
    });

    it('shows the welcome message when provided and chat is opened', async () => {
      const { fixture } = await renderChat({ welcomeMessage: 'Hi there! How can I help?' });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      expect(screen.getByText('Hi there! How can I help?')).toBeInTheDocument();
    });
  });

  describe('sending messages', () => {
    it('adds the user message to the conversation after submit', async () => {
      const { fixture } = await renderChat();
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      const textarea = screen.getByPlaceholderText('Ask a question...');
      fireEvent.input(textarea, { target: { value: 'What is CQRS?' } });
      fixture.componentInstance.draft = 'What is CQRS?';
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      fixture.detectChanges();
      expect(screen.getByText('What is CQRS?')).toBeInTheDocument();
    });

    it('appends the assistant reply to the conversation', async () => {
      const { fixture } = await renderChat({
        sendMessage: () => of('CQRS stands for Command Query Responsibility Segregation.'),
      });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.draft = 'What is CQRS?';
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      fixture.detectChanges();
      await waitFor(() =>
        expect(
          screen.getByText('CQRS stands for Command Query Responsibility Segregation.'),
        ).toBeInTheDocument(),
      );
    });

    it('clears the draft after sending', async () => {
      const { fixture } = await renderChat();
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.draft = 'Hello?';
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      fixture.detectChanges();
      expect(fixture.componentInstance.draft).toBe('');
    });

    it('submits on Enter without Shift', async () => {
      const { fixture } = await renderChat();
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      const spy = jest.spyOn(fixture.componentInstance, 'submit');
      fixture.componentInstance.draft = 'Hello?';
      const textarea = screen.getByPlaceholderText('Ask a question...');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      expect(spy).toHaveBeenCalled();
    });

    it('does not submit on Shift+Enter', async () => {
      const { fixture } = await renderChat();
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      const spy = jest.spyOn(fixture.componentInstance, 'submit');
      fixture.componentInstance.draft = 'Hello?';
      const textarea = screen.getByPlaceholderText('Ask a question...');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('shows an error message when the send fails', async () => {
      const { fixture } = await renderChat({
        sendMessage: () => throwError(() => new Error('Network error')),
      });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.draft = 'Will this fail?';
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      fixture.detectChanges();
      expect(screen.getByText('Something went wrong — please try again.')).toBeInTheDocument();
    });
  });

  describe('typing indicator', () => {
    it('shows the typing indicator while waiting for a reply', async () => {
      const { fixture } = await renderChat({
        sendMessage: () => of('reply'),
      });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.sendState.set('sending');
      fixture.detectChanges();
      expect(document.querySelector('.chat-typing')).toBeInTheDocument();
    });

    it('hides the typing indicator after the reply arrives', async () => {
      const { fixture } = await renderChat({ sendMessage: () => of('Done') });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.draft = 'Hello?';
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
      fixture.detectChanges();
      await waitFor(() =>
        expect(document.querySelector('.chat-typing')).not.toBeInTheDocument(),
      );
    });
  });

  describe('message limit CTA', () => {
    it('shows the CTA when the message limit is reached', async () => {
      const { fixture } = await renderChat({ maxMessages: 1 });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      const messages: ChatMessage[] = [{ role: 'user', content: 'first' }];
      fixture.componentInstance.messages.set(messages);
      fixture.detectChanges();
      expect(document.querySelector('.chat-cta')).toBeInTheDocument();
    });

    it('hides the input area when the message limit is reached', async () => {
      const { fixture } = await renderChat({ maxMessages: 1 });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.messages.set([{ role: 'user', content: 'first' }]);
      fixture.detectChanges();
      expect(document.querySelector('.chat-input-row')).not.toBeInTheDocument();
    });

    it('renders the custom CTA label and URL', async () => {
      const { fixture } = await renderChat({
        maxMessages: 1,
        ctaLabel: 'Talk to an expert',
        ctaUrl: '/consult',
      });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      fixture.componentInstance.messages.set([{ role: 'user', content: 'first' }]);
      fixture.detectChanges();
      const link = screen.getByRole('link', { name: 'Talk to an expert' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/consult');
    });

    it('does not show the CTA when the limit has not been reached', async () => {
      const { fixture } = await renderChat({ maxMessages: 5 });
      fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
      fixture.detectChanges();
      expect(document.querySelector('.chat-cta')).not.toBeInTheDocument();
    });
  });
});
