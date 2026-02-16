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
import { ViewChild, ElementRef } from '@angular/core';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password.html',
})
export class ChangePasswordPage {


    @ViewChild('scrollContainer') scrollContainer!: ElementRef;
    @ViewChild('currentPasswordInput') currentPasswordInput!: ElementRef;
    @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
    @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

    showCurrent = false;
    showNew = false;
    showConfirm = false;
    isSubmitting = false;
    form;
    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private http: CommonApiService, 
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
    // ============================ */
    // submit() {
    //     // if (this.form.invalid) {
    //     //     this.form.markAllAsTouched();
    //     //     this.toast.warning('Please fix password errors');
    //     //     return;
    //     // }

    //     if (this.form.invalid) {
    //         this.form.markAllAsTouched();
    //         // this.toast.warning('Please fix password errors');

    //         setTimeout(() => {
    //             this.scrollToFirstError();
    //         });

    //         return;
    //     }
        

    //     const user = this.api.user();
    //     if (!user) return;

    //     this.isSubmitting = true;     // 🔒 lock
    //     this.form.disable();          // 🔒 lock inputs

    //     const currentPassword = this.form.get('currentPassword')!.value as string;
    //     const newPassword = this.form.get('newPassword')!.value as string;

    //     this.api.changePassword(user.id, currentPassword, newPassword).subscribe({
    //         next: () => {
    //             this.toast.success('Password updated successfully');
    //             this.form.reset();
    //         },
    //         error: (err: Error) => {
    //             this.toast.error(err?.message || 'Current password is incorrect');
    //         },
    //         complete: () => {
    //             this.isSubmitting = false; // 🔓 unlock
    //             this.form.enable();        // 🔓 enable inputs
    //         }
    //     });
    // }

    // submit() {

    //     if (this.form.invalid) {
    //         this.form.markAllAsTouched();
    //         setTimeout(() => this.scrollToFirstError());
    //         return;
    //     }

    //     const user = this.api.currentUser();
    //     if (!user) return;

    //     this.isSubmitting = true;
    //     this.form.disable();

    //     const currentPassword: any = this.form.get('currentPassword')!.value;
    //     const newPassword: any = this.form.get('newPassword')!.value;

    //     this.api.changePassword(user.id, currentPassword, newPassword).subscribe({
    //         next: () => {
    //             this.toast.success('Password updated successfully');

    //             // clear only password fields (better UX)
    //             this.form.patchValue({
    //                 currentPassword: '',
    //                 newPassword: '',
    //                 confirmPassword: '',
    //             });
    //             this.form.markAsPristine();
    //         },
    //         error: (err: Error) => {
    //             this.toast.error(err?.message || 'Current password is incorrect');
    //         },
    //         complete: () => {
    //             this.isSubmitting = false;
    //             this.form.enable();
    //         }
    //     });
    // }

    submit() {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            setTimeout(() => this.scrollToFirstError());
            return;
        }

        const user = this.api.currentUser();
        if (!user) return;

        this.isSubmitting = true;
        this.form.disable();

        const currentPassword = this.form.get('currentPassword')!.value;
        const newPassword = this.form.get('newPassword')!.value;

        /* STEP 1 — verify password from backend */
        this.http.get<any>('user', { id: user.id }).subscribe({

            next: (dbUser) => {

                if (dbUser.password !== currentPassword) {
                    this.toast.error('Current password is incorrect');
                    this.unlockForm();
                    return;
                }

                /* STEP 2 — update password */
                this.http.put('user', user.id, { password: newPassword }).subscribe({

                    next: () => {
                        this.toast.success('Password updated successfully');

                        this.form.reset();
                    },

                    error: () => {
                        this.toast.error('Failed to update password');
                        this.unlockForm();
                    },

                    complete: () => this.unlockForm()
                });
            },

            error: () => {
                this.toast.error('User verification failed');
                this.unlockForm();
            }
        });
    }
    private unlockForm() {
        this.isSubmitting = false;
        this.form.enable();
    }


    private scrollToFirstError() {

        if (this.form.get('currentPassword')?.invalid) {
            this.scrollTo(this.currentPasswordInput);
            return;
        }

        if (this.form.get('newPassword')?.invalid) {
            this.scrollTo(this.newPasswordInput);
            return;
        }

        if (
            this.form.get('confirmPassword')?.invalid ||
            this.form.errors?.['passwordMismatch']
        ) {
            this.scrollTo(this.confirmPasswordInput);
            return;
        }
    }

    private scrollTo(element: ElementRef) {
        element.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        element.nativeElement.focus(); // 🔥 optional but recommended
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
