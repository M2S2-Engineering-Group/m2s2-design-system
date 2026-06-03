import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../models/chat';

@Component({
  selector: 'm2s2-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class ChatComponent {
  sendMessage        = input.required<(messages: ChatMessage[]) => Observable<string>>();
  title              = input('Architecture Advisor');
  subtitle           = input('Ask anything about software architecture, cloud design, or engineering decisions.');
  placeholder        = input('Ask a question...');
  maxMessages        = input(6);
  ctaLabel           = input('Start a Conversation');
  ctaUrl             = input('/contact');
  userAvatarUrl      = input<string>();
  assistantAvatarUrl = input<string>();

  readonly open      = signal(false);
  readonly messages  = signal<ChatMessage[]>([]);
  readonly sendState = signal<'idle' | 'sending' | 'error'>('idle');

  draft = '';

  readonly userCount    = computed(() => this.messages().filter(m => m.role === 'user').length);
  readonly limitReached = computed(() => this.userCount() >= this.maxMessages());

  @ViewChild('messageList') private messageList?: ElementRef<HTMLElement>;

  toggle(): void {
    this.open.update(v => !v);
  }

  submit(): void {
    const text = this.draft.trim();
    if (!text || this.sendState() === 'sending' || this.limitReached()) return;

    this.draft = '';
    const updated: ChatMessage[] = [...this.messages(), { role: 'user', content: text }];
    this.messages.set(updated);
    this.sendState.set('sending');
    this.scrollToBottom();

    this.sendMessage()(updated).subscribe({
      next: reply => {
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: reply }]);
        this.sendState.set('idle');
        this.scrollToBottom();
      },
      error: () => this.sendState.set('error'),
    });
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageList) {
        this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
