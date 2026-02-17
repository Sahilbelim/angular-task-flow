// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Register } from './register';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { defer, of, throwError } from 'rxjs';

// import { Component } from '@angular/core';
// import { Routes, Router } from '@angular/router';

// @Component({ template: '' })
// class DummyLogin { }

// const routes: Routes = [
//   { path: 'login', component: DummyLogin }
// ];


// describe('Register', () => {
//   let component: Register;
//   let fixture: ComponentFixture<Register>;
//   let api: jasmine.SpyObj<ApiService>;
//   let toastr: jasmine.SpyObj<ToastrService>;

//   let router: Router;

//   beforeEach(async () => {
//     api = jasmine.createSpyObj<ApiService>('ApiService', ['register']);
//     toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
//       'success',
//       'error',
//       'warning',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [
//         Register,
//         ReactiveFormsModule,
//         RouterTestingModule.withRoutes(routes), // ✅ FIX
//       ],
//       providers: [
//         { provide: ApiService, useValue: api },
//         { provide: ToastrService, useValue: toastr },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(Register);
//     component = fixture.componentInstance;

//     router = TestBed.inject(Router);
//     spyOn(router, 'navigate').and.returnValue(Promise.resolve(true)); // ✅ KEY

//     fixture.detectChanges();
//   });

//   /* =====================================================
//      INIT
//   ===================================================== */

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      EMAIL VALIDATION
//   ===================================================== */

//   it('should invalidate incorrect email format', () => {
//     component.registerForm.patchValue({
//       email: 'wrong-email',
//     });

//     expect(component.registerForm.get('email')?.invalid).toBeTrue();
//   });

//   /* =====================================================
//      PASSWORD VALIDATION
//   ===================================================== */

//   it('should validate password strength helpers', () => {
//     component.registerForm.patchValue({
//       password: 'Abc@1234',
//     });

//     expect(component.hasUppercase).toBeTrue();
//     expect(component.hasLowercase).toBeTrue();
//     expect(component.hasNumber).toBeTrue();
//     expect(component.hasSpecialChar).toBeTrue();
//     expect(component.hasMinLength).toBeTrue();
//     expect(component.hasMaxLength).toBeTrue();
//   });

//   /* =====================================================
//      CONFIRM PASSWORD
//   ===================================================== */

//   it('should invalidate if passwords do not match', () => {
//     component.registerForm.patchValue({
//       password: 'Abc@1234',
//       confrimpassword: 'Wrong@1234',
//     });

//     expect(component.registerForm.errors).toEqual({
//       passwordMismatch: true,
//     });
//   });

//   it('should validate if passwords match', () => {
//     component.registerForm.patchValue({
//       password: 'Abc@1234',
//       confrimpassword: 'Abc@1234',
//     });

//     expect(component.registerForm.errors).toBeNull();
//   });

//   /* =====================================================
//      SUBMIT — INVALID FORM
//   ===================================================== */

//   // it('should show warning if form is invalid', () => {
//   //   component.registerForm.patchValue({
//   //     name: '',
//   //     email: '',
//   //   });

//   //   component.submit();

//   //   expect(toastr.warning).toHaveBeenCalledWith('Please fix form errors');
//   //   expect(api.register).not.toHaveBeenCalled();
//   // });

//   // it('should not submit when form is invalid and should scroll to error', () => {

//   //   spyOn<any>(component, 'scrollToFirstError');

//   //   component.registerForm.patchValue({
//   //     name: '',
//   //     email: '',
//   //   });

//   //   component.submit();

//   //   expect(api.register).not.toHaveBeenCalled();
//   //   expect(component['scrollToFirstError']).toHaveBeenCalled();
//   // });

//   it('should not submit when form is invalid and should scroll to error', fakeAsync(() => {

//     spyOn<any>(component, 'scrollToFirstError');

//     component.registerForm.patchValue({
//       name: '',
//       email: '',
//     });

//     component.submit();

//     tick(); // 🔥 executes setTimeout()

//     expect(api.register).not.toHaveBeenCalled();
//     expect(component['scrollToFirstError']).toHaveBeenCalled();
//   }));

//   /* =====================================================
//      SUBMIT — SUCCESS
//   ===================================================== */

//   it('should register successfully and reset loading', fakeAsync(() => {
//     api.register.and.returnValue(defer(() => of({})));

//     component.registerForm.patchValue({
//       name: 'John Doe',
//       email: 'john@test.com',
//       password: 'Abc@1234',
//       confrimpassword: 'Abc@1234',
//     });

//     component.submit();

//     tick(); // flush observable
//     fixture.detectChanges();

//     expect(api.register).toHaveBeenCalled();
//     expect(toastr.success).toHaveBeenCalledWith('Registration successful');

//     // ✅ FINAL STABLE STATE (THIS IS CORRECT)
//     expect(component.loading).toBeFalse();
//     expect(component.registerForm.enabled).toBeTrue();

//     // ✅ navigation verified
//     expect(router.navigate).toHaveBeenCalledWith(['/login']);
//   }));

//   /* =====================================================
//      SUBMIT — ERROR
//   ===================================================== */

//   it('should handle registration error and unlock form', fakeAsync(() => {
//     api.register.and.returnValue(
//       throwError(() => new Error('Email already exists'))
//     );

//     component.registerForm.patchValue({
//       name: 'John Doe',
//       email: 'john@test.com',
//       password: 'Abc@1234',
//       confrimpassword: 'Abc@1234',
//     });

//     component.submit();

//     tick();
//     fixture.detectChanges();

//     expect(api.register).toHaveBeenCalled();
//     expect(toastr.error).toHaveBeenCalledWith('Email already exists');

//     expect(component.loading).toBeFalse();
//     expect(component.registerForm.enabled).toBeTrue();
//   }));
// });

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Register } from './register';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';

/* Dummy dashboard for navigation */
@Component({ template: '' })
class DummyDashboard { }

const routes: Routes = [
  { path: 'dashboard', component: DummyDashboard }
];

describe('Register Component', () => {

  let component: Register;
  let fixture: ComponentFixture<Register>;

  let api: jasmine.SpyObj<ApiService>;
  let commonApi: jasmine.SpyObj<CommonApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let router: Router;

  beforeEach(async () => {

    api = jasmine.createSpyObj<ApiService>('ApiService', ['setSession']);
    commonApi = jasmine.createSpyObj<CommonApiService>('CommonApiService', ['get', 'post']);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        Register,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: CommonApiService, useValue: commonApi },
        { provide: ToastrService, useValue: toastr }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  /* =====================================================
     COMPONENT CREATION
  ===================================================== */
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     EMAIL VALIDATION
  ===================================================== */
  it('should invalidate incorrect email format', () => {
    component.registerForm.patchValue({ email: 'wrong-email' });
    expect(component.registerForm.get('email')?.invalid).toBeTrue();
  });

  /* =====================================================
     PASSWORD MATCH VALIDATOR
  ===================================================== */
  it('should invalidate if passwords do not match', () => {
    component.registerForm.patchValue({
      password: 'Abc@1234',
      confrimpassword: 'Wrong@1234',
    });

    expect(component.registerForm.errors).toEqual({ passwordMismatch: true });
  });

  /* =====================================================
     INVALID FORM SUBMIT
     Should not call backend
  ===================================================== */
  it('should not submit invalid form', fakeAsync(() => {

    spyOn<any>(component, 'scrollToFirstError');

    component.registerForm.patchValue({
      name: '',
      email: ''
    });

    component.submit();
    tick();

    expect(commonApi.get).not.toHaveBeenCalled();
    expect(component['scrollToFirstError']).toHaveBeenCalled();
  }));

  /* =====================================================
     DUPLICATE EMAIL
     Backend returns existing user
  ===================================================== */
  it('should show error if email already registered', fakeAsync(() => {

    commonApi.get.and.returnValue(of([
      { email: 'john@test.com' }
    ]));

    component.registerForm.setValue({
      name: 'John',
      email: 'john@test.com',
      password: 'Abc@1234',
      confrimpassword: 'Abc@1234'
    });

    component.submit();
    tick();

    expect(toastr.error).toHaveBeenCalledWith('Email already registered');
    expect(commonApi.post).not.toHaveBeenCalled();
  }));

  /* =====================================================
     SUCCESS REGISTRATION
     Should create user + login + navigate
  ===================================================== */
  it('should register and login successfully', fakeAsync(() => {

    const newUser = { id: '1', name: 'John', email: 'john@test.com' };

    /* Step 1 → no duplicate */
    commonApi.get.and.returnValue(of([]));

    /* Step 2 → user created */
    commonApi.post.and.returnValue(of(newUser));

    component.registerForm.setValue({
      name: 'John',
      email: 'john@test.com',
      password: 'Abc@1234',
      confrimpassword: 'Abc@1234'
    });

    component.submit();
    tick();

    /* backend calls */
    expect(commonApi.get).toHaveBeenCalledWith('user');
    expect(commonApi.post).toHaveBeenCalled();

    /* session stored */
    expect(api.setSession).toHaveBeenCalledWith(newUser);

    /* feedback */
    expect(toastr.success).toHaveBeenCalledWith('Registration successful');

    /* navigation */
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);

    /* UI unlocked */
    expect(component.loading).toBeFalse();
    expect(component.registerForm.enabled).toBeTrue();
  }));

  /* =====================================================
     SERVER ERROR
     Should unlock form and show error
  ===================================================== */
  it('should handle backend error', fakeAsync(() => {

    commonApi.get.and.returnValue(
      throwError(() => new Error('Server error'))
    );

    component.registerForm.setValue({
      name: 'John',
      email: 'john@test.com',
      password: 'Abc@1234',
      confrimpassword: 'Abc@1234'
    });

    component.submit();
    tick();

    expect(toastr.error).toHaveBeenCalledWith('Server error');
    expect(component.loading).toBeFalse();
    expect(component.registerForm.enabled).toBeTrue();
  }));

});
