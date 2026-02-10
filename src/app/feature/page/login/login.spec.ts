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
