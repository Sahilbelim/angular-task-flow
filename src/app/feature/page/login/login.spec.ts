// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Login } from './login';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { defer, of, throwError } from 'rxjs';

// import { Component } from '@angular/core';
// import { Router, Routes } from '@angular/router';

// @Component({ template: '' })
// class DummyDashboard { }

// const routes: Routes = [
//   { path: 'dashboard', component: DummyDashboard }
// ];

// // let routers = Router


// describe('Login', () => {

//   let component: Login;
//   let fixture: ComponentFixture<Login>;
//   let api: jasmine.SpyObj<ApiService>;
//   let toastr: jasmine.SpyObj<ToastrService>;
//   let router: Router; // ✅ REQUIRED

//   beforeEach(async () => {
//     api = jasmine.createSpyObj<ApiService>('ApiService', ['login']);
//     toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
//       'success',
//       'error',
//       'warning',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [
//         Login,
//         ReactiveFormsModule,
//         RouterTestingModule.withRoutes(routes),
//       ],
//       providers: [
//         { provide: ApiService, useValue: api },
//         { provide: ToastrService, useValue: toastr },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(Login);
//     component = fixture.componentInstance;
    

//     router = TestBed.inject(Router);
//     spyOn(router, 'navigate').and.returnValue(Promise.resolve(true)); // 🔥 KEY FIX

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

//   // it('should show warning if form is invalid', () => {
//   //   component.loginForm.patchValue({
//   //     email: '',
//   //     password: '',
//   //   });

//   //   component.submit();

//   //   expect(toastr.warning).toHaveBeenCalledWith(
//   //     'Please fill all fields correctly'
//   //   );
//   //   expect(api.login).not.toHaveBeenCalled();
//   // });


//   it('should not submit when form is invalid and should scroll to error', fakeAsync(() => {

//     spyOn<any>(component, 'scrollToFirstError');

//     component.loginForm.patchValue({
//       email: '',
//       password: '',
//     });

//     component.submit();
//     tick(); // flush setTimeout

//     expect(api.login).not.toHaveBeenCalled();
//     expect(component['scrollToFirstError']).toHaveBeenCalled();
//   }));

//   /* =====================================================
//      SUBMIT — SUCCESS
//   ===================================================== */

  
//   it('should login successfully and navigate to dashboard', fakeAsync(() => {
//     api.login.and.returnValue(of({})); // sync observable

//     component.loginForm.patchValue({
//       email: 'test@test.com',
//       password: '123456',
//     });

//     component.submit();

//     tick();
//     fixture.detectChanges();

//     expect(api.login).toHaveBeenCalledWith(
//       'test@test.com',
//       '123456'
//     );

//     expect(toastr.success).toHaveBeenCalledWith('Login successful');

//     // ✅ FINAL STABLE STATE (ONLY VALID ASSERTION)
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
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Router, Routes } from '@angular/router';
import { Component } from '@angular/core';

/* ---------------------------------------------------------
   Dummy component used for router navigation testing
--------------------------------------------------------- */
@Component({ template: '' })
class DummyDashboard { }

const routes: Routes = [
  { path: 'dashboard', component: DummyDashboard }
];

describe('Login Component', () => {

  let component: Login;
  let fixture: ComponentFixture<Login>;

  let api: jasmine.SpyObj<ApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let commonApi: jasmine.SpyObj<CommonApiService>;
  let router: Router;

  /* =====================================================
     TEST SETUP
     Creates testing module and spies for dependencies
  ===================================================== */
  beforeEach(async () => {

    api = jasmine.createSpyObj<ApiService>('ApiService', ['setSession', 'hydrateUserData']);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['success', 'error']);
    commonApi = jasmine.createSpyObj<CommonApiService>('CommonApiService', ['get']);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ToastrService, useValue: toastr },
        { provide: CommonApiService, useValue: commonApi }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  /* =====================================================
     COMPONENT CREATION
     Ensures Angular loads component correctly
  ===================================================== */
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     FORM VALIDATION
     Prevent API call if form invalid
  ===================================================== */
  it('should NOT submit when form is invalid', fakeAsync(() => {

    spyOn<any>(component, 'scrollToFirstError');

    component.loginForm.setValue({
      email: '',
      password: ''
    });

    component.submit();
    tick();

    expect(commonApi.get).not.toHaveBeenCalled();
    expect(component['scrollToFirstError']).toHaveBeenCalled();
  }));

  /* =====================================================
     USER NOT FOUND
     Backend returns empty array
  ===================================================== */
  it('should show error when user not found', fakeAsync(() => {

    commonApi.get.and.returnValue(of([]));

    component.loginForm.setValue({
      email: 'nouser@test.com',
      password: '123456'
    });

    component.submit();
    tick();

    expect(toastr.error).toHaveBeenCalledWith('User not found');
    expect(api.setSession).not.toHaveBeenCalled();
  }));

  /* =====================================================
     WRONG PASSWORD
     Email exists but password mismatch
  ===================================================== */
  it('should show error when password incorrect', fakeAsync(() => {

    commonApi.get.and.returnValue(of([
      { id: '1', email: 'test@test.com', password: 'correct' }
    ]));

    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'wrong'
    });

    component.submit();
    tick();

    expect(toastr.error).toHaveBeenCalledWith('Invalid password');
    expect(api.setSession).not.toHaveBeenCalled();
  }));

  /* =====================================================
     SUCCESS LOGIN
     Correct email + password
  ===================================================== */
  it('should login successfully and navigate to dashboard', fakeAsync(() => {

    const user = { id: '1', email: 'test@test.com', password: '123456' };

    commonApi.get.and.returnValue(of([user]));

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456'
    });

    component.submit();
    tick();

    /* --- verify session stored --- */
    expect(api.setSession).toHaveBeenCalledWith(user);

    /* --- success feedback --- */
    expect(toastr.success).toHaveBeenCalledWith('Login successful');

    /* --- navigation --- */
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);

    /* --- UI unlocked --- */
    expect(component.loading).toBeFalse();
    expect(component.loginForm.enabled).toBeTrue();
  }));

  /* =====================================================
     NETWORK ERROR
     Backend failure
  ===================================================== */
  it('should show error toast on server failure', fakeAsync(() => {

    commonApi.get.and.returnValue(
      throwError(() => new Error('Server error'))
    );

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '123456'
    });

    component.submit();
    tick();

    expect(toastr.error).toHaveBeenCalledWith('Server error');
    expect(component.loading).toBeFalse();
    expect(component.loginForm.enabled).toBeTrue();
  }));

});
