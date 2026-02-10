import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth-guard';
import { ApiService } from '../service/mocapi/api/api';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('authGuard', () => {
  let apiMock: jasmine.SpyObj<ApiService>;
  let routerMock: jasmine.SpyObj<Router>;

  // 🔹 dummy route & state (required by CanActivateFn typing)
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    apiMock = jasmine.createSpyObj<ApiService>('ApiService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  /* =====================================================
     ✅ ALLOW ACCESS
  ===================================================== */

  it('should allow navigation when user is logged in', () => {
    apiMock.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    );

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  /* =====================================================
     ❌ REDIRECT TO LOGIN
  ===================================================== */

  it('should redirect to /login when user is not logged in', () => {
    apiMock.isLoggedIn.and.returnValue(false);

    const fakeTree = {} as UrlTree;
    routerMock.createUrlTree.and.returnValue(fakeTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(route, state)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(fakeTree);
  });
});
