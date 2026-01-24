// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

// import { AuthService } from '../../../core/service/mocapi/auth';
// import { ProfileService } from '../../../core/service/mocapi/profile';

// const STRONG_PASSWORD_REGEX =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;

// @Component({
//     selector: 'app-change-password',
//     standalone: true,
//     imports: [CommonModule, ReactiveFormsModule],
//     templateUrl: './change-password.html',
// })
// export class ChangePasswordPage {

//     showCurrent = false;
//     showNew = false;
//     showConfirm = false;
    

//  form: any;

//     constructor(
//         private fb: FormBuilder,
//         private auth: AuthService,
//         private profile: ProfileService,
//         private toast: ToastrService
//     ) {
//         this.form = this.fb.group({
//             currentPassword: ['', Validators.required],

//             newPassword: [
//                 '',
//                 [
//                     Validators.required,
//                     Validators.minLength(8),
//                     Validators.maxLength(32),
//                     Validators.pattern(STRONG_PASSWORD_REGEX)
//                 ]
//             ],

//             confirmPassword: ['', Validators.required],
//         });

// }

//     submit() {
//         if (this.form.invalid) {
//             this.form.markAllAsTouched(); // ✅ SHOW ERRORS
//             return;
//         }

//         const { currentPassword, newPassword, confirmPassword } = this.form.value;

//         if (newPassword !== confirmPassword) {
//             this.toast.error('Passwords do not match');
//             return;
//         }

//         const user = this.auth.user();
//         if (!user) return;

//         this.profile
//             .changePassword(user.id, currentPassword!, newPassword!)
//             .subscribe({
//                 next: () => {
//                     this.toast.success('Password updated successfully');
//                     this.form.reset();
//                 },
//                 error: (err) => {
//                     this.toast.error(err.message || 'Current password is incorrect');
//                 }
//             });
//     }

// }

// import { Component } from '@angular/core';
// import {
//     FormBuilder,
//     Validators,
//     ReactiveFormsModule,
//     AbstractControl,
//     ValidationErrors,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

// import { AuthService } from '../../../core/service/mocapi/auth';
// import { ProfileService } from '../../../core/service/mocapi/profile';

// @Component({
//     selector: 'app-change-password',
//     standalone: true,
//     imports: [CommonModule, ReactiveFormsModule],
//     templateUrl: './change-password.html',
// })
// export class ChangePasswordPage {

//     showCurrent = false;
//     showNew = false;
//     showConfirm = false;

//     form;

//     constructor(
//         private fb: FormBuilder,
//         private auth: AuthService,
//         private profile: ProfileService,
//         private toast: ToastrService
//     ) {
//         this.form = this.fb.group(
//             {
//                 currentPassword: ['', Validators.required],

//                 newPassword: [
//                     '',
//                     [
//                         Validators.required,
//                         Validators.minLength(8),
//                         Validators.maxLength(32),
//                         Validators.pattern(/[A-Z]/),
//                         Validators.pattern(/[a-z]/),
//                         Validators.pattern(/\d/),
//                         Validators.pattern(/[@$!%*?&#]/),
//                     ],
//                 ],

//                 confirmPassword: ['', Validators.required],
//             },
//             { validators: this.passwordMatchValidator }
//         );
//     }

//     // 🔐 confirm password validator (same as register)
//     passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//         const newPassword = control.get('newPassword')?.value;
//         const confirm = control.get('confirmPassword')?.value;
//         return newPassword === confirm ? null : { passwordMismatch: true };
//     }

//     submit() {
//         if (this.form.invalid) {
//             this.form.markAllAsTouched();
//             this.toast.warning('Please fix password errors');
//             return;
//         }

//         const user = this.auth.user();
//         if (!user) return;

//         // ✅ SAFELY EXTRACT STRINGS
//         const currentPassword = this.form.get('currentPassword')!.value as string;
//         const newPassword = this.form.get('newPassword')!.value as string;

//         this.profile
//             .changePassword(user.id, currentPassword, newPassword)
//             .subscribe({
//                 next: () => {
//                     this.toast.success('Password updated successfully');
//                     this.form.reset();
//                 },
//                 error: (err) => {
//                     this.toast.error(err?.message || 'Current password is incorrect');
//                 },
//             });
//     }

//     // submit() {
//     //     if (this.form.invalid) {
//     //         this.form.markAllAsTouched();
//     //         this.toast.warning('Please fix password errors');
//     //         return;
//     //     }

//     //     const { currentPassword, newPassword } = this.form.getRawValue();
//     //     const user = this.auth.user();
//     //     if (!user) return;

//     //     this.profile.changePassword(user.id, currentPassword, newPassword).subscribe({
//     //         next: () => {
//     //             this.toast.success('Password updated successfully');
//     //             this.form.reset();
//     //         },
//     //         error: (err) => {
//     //             this.toast.error(err?.message || 'Current password is incorrect');
//     //         },
//     //     });
//     // }

//     // 🔍 helpers (same UX as register)
//     get newPassword() {
//         return this.form.get('newPassword');
//     }
//     get confirmPassword() {
//         return this.form.get('confirmPassword');
//     }

//     get hasUppercase() {
//         return /[A-Z]/.test(this.newPassword?.value || '');
//     }
//     get hasLowercase() {
//         return /[a-z]/.test(this.newPassword?.value || '');
//     }
//     get hasNumber() {
//         return /\d/.test(this.newPassword?.value || '');
//     }
//     get hasSpecialChar() {
//         return /[@$!%*?&#]/.test(this.newPassword?.value || '');
//     }
//     get hasMinLength() {
//         return (this.newPassword?.value || '').length >= 8;
//     }
//     get hasMaxLength() {
//         return (this.newPassword?.value || '').length <= 32;
//     }
// }

import { Component } from '@angular/core';
import {
    FormBuilder,
    Validators,
    ReactiveFormsModule,
    AbstractControl,
    ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from '../../../core/service/mocapi/api/api';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password.html',
})
export class ChangePasswordPage {

    showCurrent = false;
    showNew = false;
    showConfirm = false;

    form;

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private toast: ToastrService
    ) {
        this.form = this.fb.group(
            {
                currentPassword: ['', Validators.required],

                newPassword: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(32),
                        Validators.pattern(/[A-Z]/),
                        Validators.pattern(/[a-z]/),
                        Validators.pattern(/\d/),
                        Validators.pattern(/[@$!%*?&#]/),
                    ],
                ],

                confirmPassword: ['', Validators.required],
            },
            { validators: this.passwordMatchValidator }
        );
    }

    /* ============================
       🔐 VALIDATORS
    ============================ */
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword')?.value;
        const confirm = control.get('confirmPassword')?.value;
        return newPassword === confirm ? null : { passwordMismatch: true };
    }

    /* ============================
       🔁 SUBMIT
    ============================ */
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.toast.warning('Please fix password errors');
            return;
        }

        const user = this.api.user();
        if (!user) return;

        const currentPassword = this.form.get('currentPassword')!.value as string;
        const newPassword = this.form.get('newPassword')!.value as string;

        this.api
            .changePassword(user.id, currentPassword, newPassword)
            .subscribe({
                next: () => {
                    this.toast.success('Password updated successfully');
                    this.form.reset();
                },
                error: (err: Error) => {
                    this.toast.error(err?.message || 'Current password is incorrect');
                },
            });
    }

    /* ============================
       🔍 PASSWORD HELPERS
    ============================ */
    get newPassword() {
        return this.form.get('newPassword');
    }

    get confirmPassword() {
        return this.form.get('confirmPassword');
    }

    get hasUppercase() {
        return /[A-Z]/.test(this.newPassword?.value || '');
    }
    get hasLowercase() {
        return /[a-z]/.test(this.newPassword?.value || '');
    }
    get hasNumber() {
        return /\d/.test(this.newPassword?.value || '');
    }
    get hasSpecialChar() {
        return /[@$!%*?&#]/.test(this.newPassword?.value || '');
    }
    get hasMinLength() {
        return (this.newPassword?.value || '').length >= 8;
    }
    get hasMaxLength() {
        return (this.newPassword?.value || '').length <= 32;
    }
}
