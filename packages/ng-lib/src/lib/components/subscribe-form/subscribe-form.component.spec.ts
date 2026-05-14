import { render, screen, fireEvent } from '@testing-library/angular';
import { of, throwError } from 'rxjs';
import { SubscribeFormComponent } from './subscribe-form.component';

describe('SubscribeFormComponent — anon mode', () => {
  it('renders email and name inputs', async () => {
    await render(SubscribeFormComponent);
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name (optional)')).toBeInTheDocument();
  });

  it('disables the submit button when email is empty', async () => {
    await render(SubscribeFormComponent);
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
  });

  it('enables the button when a valid email is entered', async () => {
    const { fixture } = await render(SubscribeFormComponent);
    fireEvent.input(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } });
    fixture.detectChanges();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
  });

  it('keeps the button disabled for an invalid email', async () => {
    const { fixture } = await render(SubscribeFormComponent);
    fireEvent.input(screen.getByPlaceholderText('your@email.com'), { target: { value: 'not-an-email' } });
    fixture.detectChanges();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeDisabled();
  });

  it('calls subscribeAnon with trimmed email and name on submit', async () => {
    const subscribeAnon = jest.fn().mockReturnValue(of(undefined));
    const { fixture } = await render(SubscribeFormComponent, {
      inputs: { subscribeAnon },
    });
    fireEvent.input(screen.getByPlaceholderText('Your name (optional)'), { target: { value: 'Jane' } });
    fireEvent.input(screen.getByPlaceholderText('your@email.com'), { target: { value: 'jane@example.com' } });
    fixture.detectChanges();
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(subscribeAnon).toHaveBeenCalledWith('jane@example.com', 'Jane');
  });

  it('shows a success message after a successful submit', async () => {
    const subscribeAnon = jest.fn().mockReturnValue(of(undefined));
    const { fixture } = await render(SubscribeFormComponent, {
      inputs: { subscribeAnon },
    });
    fireEvent.input(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } });
    fixture.detectChanges();
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    fixture.detectChanges();
    expect(screen.getByText(/check your email/i)).toBeInTheDocument();
  });

  it('shows an error message when subscribeAnon errors', async () => {
    const subscribeAnon = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
    const { fixture } = await render(SubscribeFormComponent, {
      inputs: { subscribeAnon },
    });
    fireEvent.input(screen.getByPlaceholderText('your@email.com'), { target: { value: 'test@example.com' } });
    fixture.detectChanges();
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    fixture.detectChanges();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});

describe('SubscribeFormComponent — auth mode', () => {
  it('renders a subscribe button', async () => {
    await render(SubscribeFormComponent, { inputs: { mode: 'auth' } });
    expect(screen.getByRole('button', { name: /subscribe to blog updates/i })).toBeInTheDocument();
  });

  it('does not render email or name inputs', async () => {
    await render(SubscribeFormComponent, { inputs: { mode: 'auth' } });
    expect(screen.queryByPlaceholderText('your@email.com')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Your name (optional)')).not.toBeInTheDocument();
  });

  it('calls subscribeAuth when subscribe is clicked', async () => {
    const subscribeAuth = jest.fn().mockReturnValue(of(undefined));
    await render(SubscribeFormComponent, { inputs: { mode: 'auth', subscribeAuth } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe to blog updates/i }));
    expect(subscribeAuth).toHaveBeenCalledTimes(1);
  });

  it('shows subscribed label after successful subscribe', async () => {
    const subscribeAuth = jest.fn().mockReturnValue(of(undefined));
    const { fixture } = await render(SubscribeFormComponent, { inputs: { mode: 'auth', subscribeAuth } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe to blog updates/i }));
    fixture.detectChanges();
    expect(screen.getByText(/subscribed to blog updates/i)).toBeInTheDocument();
  });

  it('shows an unsubscribe button after subscribing', async () => {
    const subscribeAuth = jest.fn().mockReturnValue(of(undefined));
    const { fixture } = await render(SubscribeFormComponent, { inputs: { mode: 'auth', subscribeAuth } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe to blog updates/i }));
    fixture.detectChanges();
    expect(screen.getByRole('button', { name: /unsubscribe/i })).toBeInTheDocument();
  });

  it('calls unsubscribeAuth after subscribing and clicking unsubscribe', async () => {
    const subscribeAuth = jest.fn().mockReturnValue(of(undefined));
    const unsubscribeAuth = jest.fn().mockReturnValue(of(undefined));
    const { fixture } = await render(SubscribeFormComponent, {
      inputs: { mode: 'auth', subscribeAuth, unsubscribeAuth },
    });
    fireEvent.click(screen.getByRole('button', { name: /subscribe to blog updates/i }));
    fixture.detectChanges();
    fireEvent.click(screen.getByRole('button', { name: /unsubscribe/i }));
    expect(unsubscribeAuth).toHaveBeenCalledTimes(1);
  });

  it('shows an error message when subscribeAuth errors', async () => {
    const subscribeAuth = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
    const { fixture } = await render(SubscribeFormComponent, { inputs: { mode: 'auth', subscribeAuth } });
    fireEvent.click(screen.getByRole('button', { name: /subscribe to blog updates/i }));
    fixture.detectChanges();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
