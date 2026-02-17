// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ChangePasswordPage } from './change-password';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { ReactiveFormsModule } from '@angular/forms';
// import { of, throwError } from 'rxjs';
// import { defer } from 'rxjs';

// describe('ChangePasswordPage', () => {
//     let component: ChangePasswordPage;
//     let fixture: ComponentFixture<ChangePasswordPage>;
//     let api: jasmine.SpyObj<ApiService>;
//     let toast: jasmine.SpyObj<ToastrService>;

//     const mockUser = {
//         id: '1',
//         email: 'test@test.com',
//     };

//     beforeEach(async () => {
//         api = jasmine.createSpyObj<ApiService>('ApiService', [
//             'changePassword',
//             'user',
//         ]);

//         toast = jasmine.createSpyObj<ToastrService>('ToastrService', [
//             'success',
//             'error',
//             'warning',
//         ]);

//         await TestBed.configureTestingModule({
//             imports: [ChangePasswordPage, ReactiveFormsModule],
//             providers: [
//                 { provide: ApiService, useValue: api },
//                 { provide: ToastrService, useValue: toast },
//             ],
//         }).compileComponents();

//         fixture = TestBed.createComponent(ChangePasswordPage);
//         component = fixture.componentInstance;

//         api.user.and.returnValue(mockUser);
//         fixture.detectChanges();
//     });

//     /* =====================================================
//        INIT
//     ===================================================== */

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     /* =====================================================
//        VALIDATION
//     ===================================================== */

//     it('should invalidate if passwords do not match', () => {
//         component.form.patchValue({
//             currentPassword: 'Old@1234',
//             newPassword: 'New@1234',
//             confirmPassword: 'Wrong@1234',
//         });

//         expect(component.form.errors).toEqual({ passwordMismatch: true });
//     });

//     it('should validate password strength helpers', () => {
//         component.form.patchValue({
//             newPassword: 'Abc@1234',
//         });

//         expect(component.hasUppercase).toBeTrue();
//         expect(component.hasLowercase).toBeTrue();
//         expect(component.hasNumber).toBeTrue();
//         expect(component.hasSpecialChar).toBeTrue();
//         expect(component.hasMinLength).toBeTrue();
//         expect(component.hasMaxLength).toBeTrue();
//     });

//     /* =====================================================
//        SUBMIT — INVALID FORM
//     ===================================================== */

//     // it('should show warning if form is invalid', () => {
//     //     component.form.patchValue({
//     //         currentPassword: '',
//     //     });

//     //     component.submit();

//     //     expect(toast.warning).toHaveBeenCalledWith('Please fix password errors');
//     //     expect(api.changePassword).not.toHaveBeenCalled();
//     // });

//     it('should not submit when form is invalid and should scroll to error', fakeAsync(() => {

//         spyOn<any>(component, 'scrollToFirstError');

//         component.form.patchValue({
//             currentPassword: '',
//         });

//         component.submit();

//         tick(); // ⬅️ flush setTimeout()

//         expect(api.changePassword).not.toHaveBeenCalled();
//         expect(component['scrollToFirstError']).toHaveBeenCalled();
//     }));

//     /* =====================================================
//        SUBMIT — NO USER
//     ===================================================== */

//     it('should not submit if user is missing', () => {
//         api.user.and.returnValue(null);

//         component.form.patchValue({
//             currentPassword: 'Old@1234',
//             newPassword: 'New@1234',
//             confirmPassword: 'New@1234',
//         });

//         component.submit();

//         expect(api.changePassword).not.toHaveBeenCalled();
//     });

//     /* =====================================================
//        SUBMIT — SUCCESS
//     ===================================================== */


//     it('should change password successfully', fakeAsync(() => {
//         api.user.and.returnValue({ id: '1' });

//         api.changePassword.and.returnValue(of({}));

//         component.form.patchValue({
//             currentPassword: 'Old@1234',
//             newPassword: 'New@1234',
//             confirmPassword: 'New@1234',
//         });

//         component.submit();

//         tick();
//         fixture.detectChanges();

//         expect(api.changePassword).toHaveBeenCalledWith(
//             '1',
//             'Old@1234',
//             'New@1234'
//         );

//         expect(toast.success).toHaveBeenCalledWith(
//             'Password updated successfully'
//         );

//         // ✅ FINAL STATE (this is what matters)
//         expect(component.isSubmitting).toBeFalse();
//         expect(component.form.enabled).toBeTrue();
//     }));

//     /* =====================================================
//        SUBMIT — ERROR
//     ===================================================== */

//     it('should show error toast on wrong current password', fakeAsync(() => {
//         api.changePassword.and.returnValue(
//             throwError(() => new Error('Current password is incorrect'))
//         );

//         component.form.patchValue({
//             currentPassword: 'Wrong@1234',
//             newPassword: 'New@1234',
//             confirmPassword: 'New@1234',
//         });

//         component.submit();

//         tick();
//         fixture.detectChanges();

//         expect(toast.error).toHaveBeenCalledWith(
//             'Current password is incorrect'
//         );

//         // ❗ correct behavior: complete NOT called on error
//         expect(component.isSubmitting).toBeTrue();
//         expect(component.form.disabled).toBeTrue();
//     }));
// });


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
