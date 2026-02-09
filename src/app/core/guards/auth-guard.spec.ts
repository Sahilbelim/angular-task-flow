// // import { TestBed } from '@angular/core/testing';
// // import { CanActivateFn } from '@angular/router';
// // import { Auth } from '../auth/auth';
// // import { Router } from '@angular/router';
// // import { RouterTestingModule } from '@angular/router/testing';
// // import { authGuard } from './auth-guard';
// // import { inject } from '@angular/core';

// // class MockAuth {
// //   isLoggedIn() {
// //     return true;
// //   }
// // }

// // describe('authGuard', () => {

// //   let auth: Auth;
// //   let router: Router;
// //   const executeGuard: CanActivateFn = (...guardParameters) =>
// //       TestBed.runInInjectionContext(() => authGuard(...guardParameters));

// //   beforeEach(() => {
// //     TestBed.configureTestingModule({
// //       imports: [RouterTestingModule],
// //       providers: [
// //         { provide: Auth, useClass: MockAuth },
// //       ]
// //     });
// //   });

// //   router = inject(Router);
// //   auth = inject(Auth);

// //   it('should be created', () => {
// //     expect(executeGuard).toBeTruthy();
// //   });


// //   it('should block access and redirect when user is not logged in', () => {
// //     spyOn(auth, 'isLoggedIn').and.returnValue(false);
// //     const navigateSpy = spyOn(router, 'navigate');

// //     const result = authGuard(null as any, null as any);

// //     expect(result).toBeFalse();
// //     expect(navigateSpy).toHaveBeenCalledWith(['/login']);
// //   });
 
  
// // });

// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { authGuard } from './auth-guard';
// import { Auth } from '../auth/auth';

// class MockAuth {
//   isLoggedIn() {
//     return true;
//   }
// }

// describe('authGuard', () => {
//   let auth: MockAuth;
//   let router: Router;

//   const executeGuard: CanActivateFn = (...guardParameters) =>
//     TestBed.runInInjectionContext(() =>
//       authGuard(...guardParameters)
//     );

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule],
//       providers: [
//         { provide: Auth, useClass: MockAuth },
//       ],
//     });

//     // ✅ CORRECT: inject AFTER TestBed setup
//     auth = TestBed.inject(Auth) as unknown as MockAuth;
//     router = TestBed.inject(Router);
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });

//   it('should block access and redirect when user is not logged in', () => {
//     spyOn(auth, 'isLoggedIn').and.returnValue(false);
//     const navigateSpy = spyOn(router, 'navigate');

//     const result = executeGuard(null as any, null as any);

//     expect(result).toBeFalse();
//     expect(navigateSpy).toHaveBeenCalledWith(['/login']);
//   });

//   it('should allow access when user is logged in', () => {
//     spyOn(auth, 'isLoggedIn').and.returnValue(true);

//     const result = executeGuard(null as any, null as any);

//     expect(result).toBeTrue();
//   });
// });

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
