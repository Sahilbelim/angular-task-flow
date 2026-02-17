import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordPage } from './change-password';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

/* =====================================================
   MOCK SERVICES
===================================================== */

class ApiServiceMock {
    currentUser = jasmine.createSpy().and.returnValue({ id: '1' });
}

class CommonApiMock {
    get = jasmine.createSpy();
    put = jasmine.createSpy();
}

class ToastrMock {
    success = jasmine.createSpy('success');
    error = jasmine.createSpy('error');
}

describe('ChangePasswordPage', () => {

    let component: ChangePasswordPage;
    let fixture: ComponentFixture<ChangePasswordPage>;
    let api: ApiServiceMock;
    let http: CommonApiMock;
    let toast: ToastrMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ChangePasswordPage, ReactiveFormsModule],
            providers: [
                { provide: ApiService, useClass: ApiServiceMock },
                { provide: CommonApiService, useClass: CommonApiMock },
                { provide: ToastrService, useClass: ToastrMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ChangePasswordPage);
        component = fixture.componentInstance;

        api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
        http = TestBed.inject(CommonApiService) as unknown as CommonApiMock;
        toast = TestBed.inject(ToastrService) as unknown as ToastrMock;

        fixture.detectChanges();
    });

    /* =====================================================
       CREATION
    ===================================================== */
    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    /* =====================================================
       VALIDATOR — PASSWORD MATCH
       Ensures confirmPassword matches newPassword
    ===================================================== */
    it('should invalidate when passwords do not match', () => {
        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'Wrong@1234'
        });

        expect(component.form.errors).toEqual({ passwordMismatch: true });
    });

    /* =====================================================
       INVALID FORM — BLOCK SUBMIT
       Must scroll instead of calling API
    ===================================================== */
    it('should not submit invalid form', fakeAsync(() => {

        spyOn<any>(component, 'scrollToFirstError');

        component.form.patchValue({ currentPassword: '' });

        component.submit();
        tick();

        expect(component['scrollToFirstError']).toHaveBeenCalled();
        expect(http.get).not.toHaveBeenCalled();
    }));

    /* =====================================================
       NO USER SESSION
       Prevent backend call if not logged in
    ===================================================== */
    it('should stop if no logged in user', () => {

        api.currentUser.and.returnValue(null);

        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234'
        });

        component.submit();

        expect(http.get).not.toHaveBeenCalled();
    });

    /* =====================================================
       WRONG CURRENT PASSWORD
       GET success but password mismatch
    ===================================================== */
    it('should show error if current password incorrect', fakeAsync(() => {

        http.get.and.returnValue(of({ password: 'Correct@123' }));

        component.form.patchValue({
            currentPassword: 'Wrong@123',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234'
        });

        component.submit();
        tick();

        expect(toast.error).toHaveBeenCalledWith('Current password is incorrect');
        expect(component.isSubmitting).toBeFalse();
        expect(component.form.enabled).toBeTrue();
    }));

    /* =====================================================
       SUCCESS FLOW
       GET ok → PUT ok
    ===================================================== */
    it('should update password successfully', fakeAsync(() => {

        http.get.and.returnValue(of({ password: 'Old@1234' }));
        http.put.and.returnValue(of({}));

        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234'
        });

        component.submit();
        tick();

        expect(http.put).toHaveBeenCalledWith('user', '1', { password: 'New@1234' });
        expect(toast.success).toHaveBeenCalledWith('Password updated successfully');
        expect(component.isSubmitting).toBeFalse();
        expect(component.form.enabled).toBeTrue();
    }));

    /* =====================================================
       UPDATE FAIL
       GET ok → PUT error
    ===================================================== */
    it('should handle update failure', fakeAsync(() => {

        http.get.and.returnValue(of({ password: 'Old@1234' }));
        http.put.and.returnValue(throwError(() => new Error()));

        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234'
        });

        component.submit();
        tick();

        expect(toast.error).toHaveBeenCalledWith('Failed to update password');
        expect(component.isSubmitting).toBeFalse();
    }));

    /* =====================================================
       VERIFY FAIL
       GET error
    ===================================================== */
    it('should handle verification failure', fakeAsync(() => {

        http.get.and.returnValue(throwError(() => new Error()));

        component.form.patchValue({
            currentPassword: 'Old@1234',
            newPassword: 'New@1234',
            confirmPassword: 'New@1234'
        });

        component.submit();
        tick();

        expect(toast.error).toHaveBeenCalledWith('User verification failed');
        expect(component.isSubmitting).toBeFalse();
    }));

});
