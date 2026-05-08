import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

type SubmitState = 'idle' | 'submitting' | 'done' | 'error';

@Component({
  selector: 'm2s2-subscribe-form',
  templateUrl: './subscribe-form.component.html',
  styleUrls: ['./subscribe-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class SubscribeFormComponent implements OnInit {
  /** 'anon' shows email+name inputs. 'auth' shows a one-click subscribe/unsubscribe toggle. */
  mode = input<'anon' | 'auth'>('anon');

  /** Called in anon mode when the user submits their email/name. */
  subscribeAnon = input<(email: string, name: string) => Observable<unknown>>();

  /** Called in auth mode when the user clicks Subscribe. */
  subscribeAuth = input<() => Observable<unknown>>();

  /** Called in auth mode when the user clicks Unsubscribe. */
  unsubscribeAuth = input<() => Observable<unknown>>();

  initialState = input<SubmitState>('idle');

  email = '';
  name  = '';
  readonly state      = signal<SubmitState>('idle');
  readonly subscribed = signal(false);

  ngOnInit(): void {
    this.state.set(this.initialState());
  }

  get emailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
  }

  submit(): void {
    if (this.state() === 'submitting') return;

    if (this.mode() === 'auth') {
      if (this.subscribed()) {
        const fn = this.unsubscribeAuth();
        if (!fn) return;
        this.state.set('submitting');
        fn().subscribe({
          next:  () => { this.subscribed.set(false); this.state.set('idle'); },
          error: () => this.state.set('error'),
        });
      } else {
        const fn = this.subscribeAuth();
        if (!fn) return;
        this.state.set('submitting');
        fn().subscribe({
          next:  () => { this.subscribed.set(true); this.state.set('done'); },
          error: () => this.state.set('error'),
        });
      }
    } else {
      if (!this.emailValid) return;
      const fn = this.subscribeAnon();
      if (!fn) return;
      this.state.set('submitting');
      fn(this.email.trim(), this.name.trim()).subscribe({
        next:  () => this.state.set('done'),
        error: () => this.state.set('error'),
      });
    }
  }
}
