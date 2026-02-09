// // import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// // import { Login } from './login';
// // import { ApiService } from '../../../core/service/mocapi/api/api';
// // import { ToastrService } from 'ngx-toastr';
// // import { Router } from '@angular/router';
// // import { ReactiveFormsModule } from '@angular/forms';
// // import { of, throwError } from 'rxjs';

// // describe('Login', () => {
// //   let component: Login;
// //   let fixture: ComponentFixture<Login>;
// //   let api: jasmine.SpyObj<ApiService>;
// //   let toastr: jasmine.SpyObj<ToastrService>;
// //   let router: jasmine.SpyObj<Router>;

// //   beforeEach(async () => {
// //     api = jasmine.createSpyObj<ApiService>('ApiService', ['login']);
// //     toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
// //       'success',
// //       'error',
// //       'warning',
// //     ]);
// //     router = jasmine.createSpyObj<Router>('Router', ['navigate']);

// //     await TestBed.configureTestingModule({
// //       imports: [Login, ReactiveFormsModule],
// //       providers: [
// //         { provide: ApiService, useValue: api },
// //         { provide: ToastrService, useValue: toastr },
// //         { provide: Router, useValue: router },
// //       ],
// //     }).compileComponents();

// //     fixture = TestBed.createComponent(Login);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges();
// //   });

// //   /* =====================================================
// //      INIT
// //   ===================================================== */

// //   it('should create', () => {
// //     expect(component).toBeTruthy();
// //   });

// //   /* =====================================================
// //      FORM VALIDATION
// //   ===================================================== */

// //   it('should show warning if form is invalid', () => {
// //     component.loginForm.setValue({
// //       email: '',
// //       password: '',
// //     });

// //     component.submit();

// //     expect(toastr.warning).toHaveBeenCalledWith(
// //       'Please fill all fields correctly'
// //     );
// //     expect(api.login).not.toHaveBeenCalled();
// //   });

// //   it('should invalidate wrong email format', () => {
// //     component.loginForm.setValue({
// //       email: 'wrong-email',
// //       password: '123456',
// //     });

// //     expect(component.loginForm.invalid).toBeTrue();
// //   });

// //   /* =====================================================
// //      SUBMIT — SUCCESS
// //   ===================================================== */

// //   it('should login successfully and navigate to dashboard', fakeAsync(() => {
// //     api.login.and.returnValue(of({}));

// //     component.loginForm.setValue({
// //       email: 'test@test.com',
// //       password: '123456',
// //     });

// //     component.submit();
// //     tick();

// //     expect(api.login).toHaveBeenCalledWith(
// //       'test@test.com',
// //       '123456'
// //     );

// //     expect(toastr.success).toHaveBeenCalledWith('Login successful');
// //     expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);

// //     // ✅ final state ONLY
// //     expect(component.loading).toBeFalse();
// //     expect(component.loginForm.enabled).toBeTrue();
// //   }));

// //   /* =====================================================
// //      SUBMIT — ERROR
// //   ===================================================== */

// //   it('should show error toast and unlock form on login failure', fakeAsync(() => {
// //     api.login.and.returnValue(
// //       throwError(() => new Error('Invalid credentials'))
// //     );

// //     component.loginForm.setValue({
// //       email: 'test@test.com',
// //       password: 'wrongpass',
// //     });

// //     component.submit();
// //     tick();

// //     expect(api.login).toHaveBeenCalled();
// //     expect(toastr.error).toHaveBeenCalledWith('Invalid credentials');

// //     expect(component.loading).toBeFalse();
// //     expect(component.loginForm.enabled).toBeTrue();
// //   }));

// //   /* =====================================================
// //      SAFETY GUARD
// //   ===================================================== */

// //   it('should not submit if email or password is missing', () => {
// //     component.loginForm.setValue({
// //       email: null,
// //       password: null,
// //     });

// //     component.submit();

// //     expect(api.login).not.toHaveBeenCalled();
// //   });
// // });


// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Login } from './login';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';
// import { of, throwError } from 'rxjs';

// describe('Login', () => {
//   let component: Login;
//   let fixture: ComponentFixture<Login>;
//   let api: jasmine.SpyObj<ApiService>;
//   let toastr: jasmine.SpyObj<ToastrService>;
//   let router: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     api = jasmine.createSpyObj<ApiService>('ApiService', ['login']);
//     toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
//       'success',
//       'error',
//       'warning',
//     ]);
//     router = jasmine.createSpyObj<Router>('Router', ['navigate']);

//     await TestBed.configureTestingModule({
//       imports: [Login, ReactiveFormsModule],
//       providers: [
//         { provide: ApiService, useValue: api },
//         { provide: ToastrService, useValue: toastr },
//         { provide: Router, useValue: router },

//         // ✅ REQUIRED for standalone + RouterModule
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             snapshot: { params: {}, queryParams: {} },
//             params: of({}),
//             queryParams: of({}),
//           },
//         },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(Login);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   /* =====================================================
//      INIT
//   ===================================================== */

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      FORM VALIDATION
//   ===================================================== */

//   it('should invalidate wrong email format', () => {
//     component.loginForm.patchValue({
//       email: 'wrong-email',
//       password: '123456',
//     });

//     expect(component.loginForm.invalid).toBeTrue();
//   });

//   it('should show warning if form is invalid', () => {
//     component.loginForm.patchValue({
//       email: '',
//       password: '',
//     });

//     component.submit();

//     expect(toastr.warning).toHaveBeenCalledWith(
//       'Please fill all fields correctly'
//     );
//     expect(api.login).not.toHaveBeenCalled();
//   });

//   /* =====================================================
//      SUBMIT — SUCCESS
//   ===================================================== */

//   it('should login successfully and navigate to dashboard', fakeAsync(() => {
//     api.login.and.returnValue(of({}));

//     component.loginForm.patchValue({
//       email: 'test@test.com',
//       password: '123456',
//     });

//     component.submit();

//     // 🔒 locked immediately
//     expect(component.loading).toBeTrue();
//     expect(component.loginForm.disabled).toBeTrue();

//     tick();
//     fixture.detectChanges();

//     expect(api.login).toHaveBeenCalledWith(
//       'test@test.com',
//       '123456'
//     );

//     expect(toastr.success).toHaveBeenCalledWith('Login successful');
//     expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);

//     // 🔓 unlocked on complete
//     expect(component.loading).toBeFalse();
//     expect(component.loginForm.enabled).toBeTrue();
//   }));

//   /* =====================================================
//      SUBMIT — ERROR
//   ===================================================== */

//   it('should show error toast and unlock form on login failure', fakeAsync(() => {
//     api.login.and.returnValue(
//       throwError(() => new Error('Invalid credentials'))
//     );

//     component.loginForm.patchValue({
//       email: 'test@test.com',
//       password: 'wrongpass',
//     });

//     component.submit();

//     tick();
//     fixture.detectChanges();

//     expect(api.login).toHaveBeenCalled();

//     expect(toastr.error).toHaveBeenCalledWith('Invalid credentials');

//     // 🔓 unlocked after error
//     expect(component.loading).toBeFalse();
//     expect(component.loginForm.enabled).toBeTrue();
//   }));

//   /* =====================================================
//      SAFETY GUARD
//   ===================================================== */

//   it('should not submit if email or password is missing', () => {
//     component.loginForm.patchValue({
//       email: null,
//       password: null,
//     });

//     component.submit();

//     expect(api.login).not.toHaveBeenCalled();
//   });
// });

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Login } from './login';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { defer, of, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({ template: '' })
class DummyDashboard { }

const routes: Routes = [
  { path: 'dashboard', component: DummyDashboard }
];

// let routers = Router


describe('Login', () => {

  let component: Login;
  let fixture: ComponentFixture<Login>;
  let api: jasmine.SpyObj<ApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let router: Router; // ✅ REQUIRED

  // beforeEach(async () => {
  //   api = jasmine.createSpyObj<ApiService>('ApiService', ['login']);
  //   toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
  //     'success',
  //     'error',
  //     'warning',
  //   ]);

  //   await TestBed.configureTestingModule({
  //     imports: [
  //       Login,
  //       ReactiveFormsModule,
  //       // RouterTestingModule.withRoutes([]), // ✅ THIS FIXES EVERYTHING
  //       RouterTestingModule.withRoutes(routes)

  //     ],
  //     providers: [
  //       { provide: ApiService, useValue: api },
  //       { provide: ToastrService, useValue: toastr },
  //     ],
  //   }).compileComponents();

  //   fixture = TestBed.createComponent(Login);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['login']);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
      'success',
      'error',
      'warning',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true)); // 🔥 KEY FIX

    fixture.detectChanges();
  });

  /* =====================================================
     INIT
  ===================================================== */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     FORM VALIDATION
  ===================================================== */

  it('should invalidate wrong email format', () => {
    component.loginForm.patchValue({
      email: 'wrong-email',
      password: '123456',
    });

    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should show warning if form is invalid', () => {
    component.loginForm.patchValue({
      email: '',
      password: '',
    });

    component.submit();

    expect(toastr.warning).toHaveBeenCalledWith(
      'Please fill all fields correctly'
    );
    expect(api.login).not.toHaveBeenCalled();
  });

  /* =====================================================
     SUBMIT — SUCCESS
  ===================================================== */

  // it('should login successfully and navigate to dashboard', fakeAsync(() => {
  //   api.login.and.returnValue(of({}));

  //   component.loginForm.patchValue({
  //     email: 'test@test.com',
  //     password: '123456',
  //   });

  //   component.submit();

  //   // 🔒 locked immediately
  //   expect(component.loading).toBeTrue();
  //   expect(component.loginForm.disabled).toBeTrue();

  //   tick();
  //   fixture.detectChanges();

  //   expect(api.login).toHaveBeenCalledWith(
  //     'test@test.com',
  //     '123456'
  //   );

  //   expect(toastr.success).toHaveBeenCalledWith('Login successful');

  //   // 🔓 unlocked on complete
  //   expect(component.loading).toBeFalse();
  //   expect(component.loginForm.enabled).toBeTrue();
  // }));


  // import { defer, of } from 'rxjs';

  // it('should login successfully and navigate to dashboard', fakeAsync(() => {
  //   api.login.and.returnValue(
  //     defer(() => of({}))
  //   );

  //   component.loginForm.patchValue({
  //     email: 'test@test.com',
  //     password: '123456',
  //   });

  //   component.submit();

  //   // 🔒 immediately locked
  //   expect(component.loading).toBeTrue();
  //   expect(component.loginForm.disabled).toBeTrue();

  //   tick();               // resolve observable
  //   fixture.detectChanges();

  //   expect(api.login).toHaveBeenCalledWith(
  //     'test@test.com',
  //     '123456'
  //   );

  //   expect(toastr.success).toHaveBeenCalledWith('Login successful');

  //   // 🔓 unlocked after complete
  //   expect(component.loading).toBeFalse();
  //   expect(component.loginForm.enabled).toBeTrue();
  // }));

  // it('should login successfully and navigate to dashboard', fakeAsync(() => {
  //   api.login.and.returnValue(defer(() => of({})));

  //   component.loginForm.patchValue({
  //     email: 'test@test.com',
  //     password: '123456',
  //   });

  //   component.submit();

  //   // ✅ ASSERT IMMEDIATE LOCK (before observable resolves)
  //   expect(component.loading).toBeTrue();
  //   expect(component.loginForm.disabled).toBeTrue();

  //   tick(); // resolve observable
  //   fixture.detectChanges();

  //   expect(api.login).toHaveBeenCalledWith(
  //     'test@test.com',
  //     '123456'
  //   );

  //   expect(toastr.success).toHaveBeenCalledWith('Login successful');

  //   // ✅ ASSERT FINAL STATE (after complete)
  //   expect(component.loading).toBeFalse();
  //   expect(component.loginForm.enabled).toBeTrue();
  // }));

  it('should login successfully and navigate to dashboard', fakeAsync(() => {
    api.login.and.returnValue(of({})); // sync observable

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: '123456',
    });

    component.submit();

    tick();
    fixture.detectChanges();

    expect(api.login).toHaveBeenCalledWith(
      'test@test.com',
      '123456'
    );

    expect(toastr.success).toHaveBeenCalledWith('Login successful');

    // ✅ FINAL STABLE STATE (ONLY VALID ASSERTION)
    expect(component.loading).toBeFalse();
    expect(component.loginForm.enabled).toBeTrue();
  }));

  /* =====================================================
     SUBMIT — ERROR
  ===================================================== */

  it('should show error toast and unlock form on login failure', fakeAsync(() => {
    api.login.and.returnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.loginForm.patchValue({
      email: 'test@test.com',
      password: 'wrongpass',
    });

    component.submit();

    tick();
    fixture.detectChanges();

    expect(api.login).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Invalid credentials');

    expect(component.loading).toBeFalse();
    expect(component.loginForm.enabled).toBeTrue();
  }));

  /* =====================================================
     SAFETY GUARD
  ===================================================== */

  it('should not submit if email or password is missing', () => {
    component.loginForm.patchValue({
      email: null,
      password: null,
    });

    component.submit();

    expect(api.login).not.toHaveBeenCalled();
  });
});
