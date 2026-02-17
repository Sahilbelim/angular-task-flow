import { TestBed } from '@angular/core/testing';
import {
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { authGuard } from './auth-guard';
import { ApiService } from '../service/mocapi/api/api';

describe('authGuard', () => {

  let api: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  /* -----------------------------------------------------
     Helper: create fake route with path
     ----------------------------------------------------- */
  const createRoute = (path: string): ActivatedRouteSnapshot =>
    ({ routeConfig: { path } } as any);

  /* -----------------------------------------------------
     Required second argument for CanActivateFn
     Angular always passes RouterStateSnapshot
     ----------------------------------------------------- */
  const dummyState = {} as RouterStateSnapshot;

  beforeEach(() => {

    api = jasmine.createSpyObj<ApiService>('ApiService', ['currentUser']);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: api },
        { provide: Router, useValue: router },
      ],
    });
  });

  /* =====================================================
     LOGIN PAGE — NOT LOGGED IN → ALLOW ACCESS
  ===================================================== */
  it('should allow access to login when not logged in', () => {

    api.currentUser.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRoute('login'), dummyState)
    );

    expect(result).toBeTrue();
  });

  /* =====================================================
     LOGIN PAGE — LOGGED IN → REDIRECT DASHBOARD
  ===================================================== */
  it('should redirect to dashboard if already logged in', () => {

    const tree = {} as UrlTree;
    router.createUrlTree.and.returnValue(tree);
    api.currentUser.and.returnValue({ id: 1 });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRoute('login'), dummyState)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBe(tree);
  });

  /* =====================================================
     REGISTER PAGE — LOGGED IN → REDIRECT DASHBOARD
  ===================================================== */
  it('should redirect register to dashboard if logged in', () => {

    const tree = {} as UrlTree;
    router.createUrlTree.and.returnValue(tree);
    api.currentUser.and.returnValue({ id: 1 });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRoute('register'), dummyState)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBe(tree);
  });

  /* =====================================================
     PRIVATE PAGE — NOT LOGGED IN → REDIRECT LOGIN
  ===================================================== */
  it('should redirect private page to login when not logged in', () => {

    const tree = {} as UrlTree;
    router.createUrlTree.and.returnValue(tree);
    api.currentUser.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRoute('dashboard'), dummyState)
    );

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(tree);
  });

  /* =====================================================
     PRIVATE PAGE — LOGGED IN → ALLOW ACCESS
  ===================================================== */
  it('should allow private page when logged in', () => {

    api.currentUser.and.returnValue({ id: 1 });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(createRoute('dashboard'), dummyState)
    );

    expect(result).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

});
