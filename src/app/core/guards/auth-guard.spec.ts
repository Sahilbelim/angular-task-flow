import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../auth/auth';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth-guard';
import { inject } from '@angular/core';

class MockAuth {
  isLoggedIn() {
    return true;
  }
}

describe('authGuard', () => {

  let auth: Auth;
  let router: Router;
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Auth, useClass: MockAuth },
      ]
    });
  });

  router = inject(Router);
  auth = inject(Auth);

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });


  it('should block access and redirect when user is not logged in', () => {
    spyOn(auth, 'isLoggedIn').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');

    const result = authGuard(null as any, null as any);

    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
 
  
});
