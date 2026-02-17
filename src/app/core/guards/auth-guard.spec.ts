// import { TestBed } from '@angular/core/testing';
// import { Router, UrlTree } from '@angular/router';
// import { authGuard } from './auth-guard';
// import { ApiService } from '../service/mocapi/api/api';
// import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// describe('authGuard', () => {
//   let apiMock: jasmine.SpyObj<ApiService>;
//   let routerMock: jasmine.SpyObj<Router>;

//   // 🔹 dummy route & state (required by CanActivateFn typing)
//   const route = {} as ActivatedRouteSnapshot;
//   const state = {} as RouterStateSnapshot;

//   beforeEach(() => {
//     apiMock = jasmine.createSpyObj<ApiService>('ApiService', ['isLoggedIn']);
//     routerMock = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: ApiService, useValue: apiMock },
//         { provide: Router, useValue: routerMock },
//       ],
//     });
//   });

//   /* =====================================================
//      ✅ ALLOW ACCESS
//   ===================================================== */

//   it('should allow navigation when user is logged in', () => {
//     apiMock.isLoggedIn.and.returnValue(true);

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(route, state)
//     );

//     expect(result).toBeTrue();
//     expect(routerMock.createUrlTree).not.toHaveBeenCalled();
//   });

//   /* =====================================================
//      ❌ REDIRECT TO LOGIN
//   ===================================================== */

//   it('should redirect to /login when user is not logged in', () => {
//     apiMock.isLoggedIn.and.returnValue(false);

//     const fakeTree = {} as UrlTree;
//     routerMock.createUrlTree.and.returnValue(fakeTree);

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(route, state)
//     );

//     expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
//     expect(result).toBe(fakeTree);
//   });
// });


// import { TestBed } from '@angular/core/testing';
// import { Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
// import { authGuard } from './auth-guard';
// import { ApiService } from '../service/mocapi/api/api';

// describe('authGuard', () => {

//   let api: jasmine.SpyObj<ApiService>;
//   let router: jasmine.SpyObj<Router>;

//   const createRoute = (path: string): ActivatedRouteSnapshot =>
//     ({ routeConfig: { path } } as any);

//   beforeEach(() => {

//     api = jasmine.createSpyObj<ApiService>('ApiService', ['currentUser']);
//     router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: ApiService, useValue: api },
//         { provide: Router, useValue: router },
//       ],
//     });
//   });

//   /* =====================================================
//      LOGIN PAGE — NOT LOGGED IN → ALLOW
//   ===================================================== */
//   it('should allow access to login when not logged in', () => {

//     api.currentUser.and.returnValue(null);

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(createRoute('login'))
//     );

//     expect(result).toBeTrue();
//   });

//   /* =====================================================
//      LOGIN PAGE — LOGGED IN → REDIRECT DASHBOARD
//   ===================================================== */
//   it('should redirect to dashboard if already logged in', () => {

//     const tree = {} as UrlTree;
//     router.createUrlTree.and.returnValue(tree);
//     api.currentUser.and.returnValue({ id: 1 });

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(createRoute('login'))
//     );

//     expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
//     expect(result).toBe(tree);
//   });

//   /* =====================================================
//      REGISTER PAGE — LOGGED IN → REDIRECT DASHBOARD
//   ===================================================== */
//   it('should redirect register to dashboard if logged in', () => {

//     const tree = {} as UrlTree;
//     router.createUrlTree.and.returnValue(tree);
//     api.currentUser.and.returnValue({ id: 1 });

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(createRoute('register'))
//     );

//     expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
//     expect(result).toBe(tree);
//   });

//   /* =====================================================
//      PRIVATE PAGE — NOT LOGGED IN → REDIRECT LOGIN
//   ===================================================== */
//   it('should redirect private page to login when not logged in', () => {

//     const tree = {} as UrlTree;
//     router.createUrlTree.and.returnValue(tree);
//     api.currentUser.and.returnValue(null);

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(createRoute('dashboard'))
//     );

//     expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
//     expect(result).toBe(tree);
//   });

//   /* =====================================================
//      PRIVATE PAGE — LOGGED IN → ALLOW
//   ===================================================== */
//   it('should allow private page when logged in', () => {

//     api.currentUser.and.returnValue({ id: 1 });

//     const result = TestBed.runInInjectionContext(() =>
//       authGuard(createRoute('dashboard'))
//     );

//     expect(result).toBeTrue();
//     expect(router.createUrlTree).not.toHaveBeenCalled();
//   });

// });

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
