import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Register } from './register';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { defer, of, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { Routes, Router } from '@angular/router';

@Component({ template: '' })
class DummyLogin { }

const routes: Routes = [
  { path: 'login', component: DummyLogin }
];


describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let api: jasmine.SpyObj<ApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  let router: Router;

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', ['register']);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
      'success',
      'error',
      'warning',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        Register,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes), // ✅ FIX
      ],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true)); // ✅ KEY

    fixture.detectChanges();
  });

  /* =====================================================
     INIT
  ===================================================== */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     EMAIL VALIDATION
  ===================================================== */

  it('should invalidate incorrect email format', () => {
    component.registerForm.patchValue({
      email: 'wrong-email',
    });

    expect(component.registerForm.get('email')?.invalid).toBeTrue();
  });

  /* =====================================================
     PASSWORD VALIDATION
  ===================================================== */

  it('should validate password strength helpers', () => {
    component.registerForm.patchValue({
      password: 'Abc@1234',
    });

    expect(component.hasUppercase).toBeTrue();
    expect(component.hasLowercase).toBeTrue();
    expect(component.hasNumber).toBeTrue();
    expect(component.hasSpecialChar).toBeTrue();
    expect(component.hasMinLength).toBeTrue();
    expect(component.hasMaxLength).toBeTrue();
  });

  /* =====================================================
     CONFIRM PASSWORD
  ===================================================== */

  it('should invalidate if passwords do not match', () => {
    component.registerForm.patchValue({
      password: 'Abc@1234',
      confrimpassword: 'Wrong@1234',
    });

    expect(component.registerForm.errors).toEqual({
      passwordMismatch: true,
    });
  });

  it('should validate if passwords match', () => {
    component.registerForm.patchValue({
      password: 'Abc@1234',
      confrimpassword: 'Abc@1234',
    });

    expect(component.registerForm.errors).toBeNull();
  });

  /* =====================================================
     SUBMIT — INVALID FORM
  ===================================================== */

  // it('should show warning if form is invalid', () => {
  //   component.registerForm.patchValue({
  //     name: '',
  //     email: '',
  //   });

  //   component.submit();

  //   expect(toastr.warning).toHaveBeenCalledWith('Please fix form errors');
  //   expect(api.register).not.toHaveBeenCalled();
  // });

  // it('should not submit when form is invalid and should scroll to error', () => {

  //   spyOn<any>(component, 'scrollToFirstError');

  //   component.registerForm.patchValue({
  //     name: '',
  //     email: '',
  //   });

  //   component.submit();

  //   expect(api.register).not.toHaveBeenCalled();
  //   expect(component['scrollToFirstError']).toHaveBeenCalled();
  // });

  it('should not submit when form is invalid and should scroll to error', fakeAsync(() => {

    spyOn<any>(component, 'scrollToFirstError');

    component.registerForm.patchValue({
      name: '',
      email: '',
    });

    component.submit();

    tick(); // 🔥 executes setTimeout()

    expect(api.register).not.toHaveBeenCalled();
    expect(component['scrollToFirstError']).toHaveBeenCalled();
  }));

  /* =====================================================
     SUBMIT — SUCCESS
  ===================================================== */

  it('should register successfully and reset loading', fakeAsync(() => {
    api.register.and.returnValue(defer(() => of({})));

    component.registerForm.patchValue({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'Abc@1234',
      confrimpassword: 'Abc@1234',
    });

    component.submit();

    tick(); // flush observable
    fixture.detectChanges();

    expect(api.register).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Registration successful');

    // ✅ FINAL STABLE STATE (THIS IS CORRECT)
    expect(component.loading).toBeFalse();
    expect(component.registerForm.enabled).toBeTrue();

    // ✅ navigation verified
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  /* =====================================================
     SUBMIT — ERROR
  ===================================================== */

  it('should handle registration error and unlock form', fakeAsync(() => {
    api.register.and.returnValue(
      throwError(() => new Error('Email already exists'))
    );

    component.registerForm.patchValue({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'Abc@1234',
      confrimpassword: 'Abc@1234',
    });

    component.submit();

    tick();
    fixture.detectChanges();

    expect(api.register).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Email already exists');

    expect(component.loading).toBeFalse();
    expect(component.registerForm.enabled).toBeTrue();
  }));
});
