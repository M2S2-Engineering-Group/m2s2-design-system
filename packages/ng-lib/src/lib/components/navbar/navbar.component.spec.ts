import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth/auth.service';

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, configurable: true, value: IntersectionObserverStub });

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const authServiceStub = {
    loggedIn$: new Subject<boolean>(),
    getCurrentUser: () => Promise.resolve(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NavbarComponent ],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceStub },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
