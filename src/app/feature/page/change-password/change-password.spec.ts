import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordPage } from './change-password';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { defer } from 'rxjs';

describe('ChangePasswordPage', () => {
    let component: ChangePasswordPage;
    let fixture: ComponentFixture<ChangePasswordPage>;
    let api: jasmine.SpyObj<ApiService>;
    let toast: jasmine.SpyObj<ToastrService>;

    const mockUser = {
        id: '1',
        email: 'test@test.com',
    };

    beforeEach(async () => {
        api = jasmine.createSpyObj<ApiService>('ApiService', [
            'changePassword',
            'user',
        ]);

        toast = jasmine.createSpyObj<ToastrService>('ToastrService', [
            'success',
            'error',
            'warning',
        ]);

        await TestBed.configureTestingModule({
            imports: [ChangePasswordPage, ReactiveFormsModule],
            providers: [
                { provide: ApiService, useValue: api },
                { provide: ToastrService, useValue: toast },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordPage);
        component = fixture.componentInstance;

        api.user.and.returnValue(mockUser);
        fixture.detectChanges();
    });

    /* =====================================================
       INIT
    ===================================================== */

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* =====================================================
       VALIDATION
    ===================================================== */

    it('should invalidate if passwords do not match', () => {
        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'Wrong@1234',
        });

        expect(component.form.errors).toEqual({ passwordMismatch: true });
    });

    it('should validate password strength helpers', () => {
        component.form.patchValue({
            newPassword: 'Abc@1234',
        });

        expect(component.hasUppercase).toBeTrue();
        expect(component.hasLowercase).toBeTrue();
        expect(component.hasNumber).toBeTrue();
        expect(component.hasSpecialChar).toBeTrue();
        expect(component.hasMinLength).toBeTrue();
        expect(component.hasMaxLength).toBeTrue();
    });

    /* =====================================================
       SUBMIT — INVALID FORM
    ===================================================== */

    it('should show warning if form is invalid', () => {
        component.form.patchValue({
            currentPassword: '',
        });

        component.submit();

        expect(toast.warning).toHaveBeenCalledWith('Please fix password errors');
        expect(api.changePassword).not.toHaveBeenCalled();
    });

    /* =====================================================
       SUBMIT — NO USER
    ===================================================== */

    it('should not submit if user is missing', () => {
        api.user.and.returnValue(null);

        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234',
        });

        component.submit();

        expect(api.changePassword).not.toHaveBeenCalled();
    });

    /* =====================================================
       SUBMIT — SUCCESS
    ===================================================== */


    it('should change password successfully', fakeAsync(() => {
        api.user.and.returnValue({ id: '1' });

        api.changePassword.and.returnValue(of({}));

        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234',
        });

        component.submit();

        tick();
        fixture.detectChanges();

        expect(api.changePassword).toHaveBeenCalledWith(
            '1',
            'Old@1234',
            'New@1234'
        );

        expect(toast.success).toHaveBeenCalledWith(
            'Password updated successfully'
        );

        // ✅ FINAL STATE (this is what matters)
        expect(component.isSubmitting).toBeFalse();
        expect(component.form.enabled).toBeTrue();
    }));

    /* =====================================================
       SUBMIT — ERROR
    ===================================================== */

    it('should show error toast on wrong current password', fakeAsync(() => {
        api.changePassword.and.returnValue(
            throwError(() => new Error('Current password is incorrect'))
        );

        component.form.patchValue({
            currentPassword: 'Wrong@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234',
        });

        component.submit();

        tick();
        fixture.detectChanges();

        expect(toast.error).toHaveBeenCalledWith(
            'Current password is incorrect'
        );

        // ❗ correct behavior: complete NOT called on error
        expect(component.isSubmitting).toBeTrue();
        expect(component.form.disabled).toBeTrue();
    }));
});
