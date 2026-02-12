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
        // if (this.form.invalid) {
        //     this.form.markAllAsTouched();
        //     this.toast.warning('Please fix password errors');
        //     return;
        // }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            // this.toast.warning('Please fix password errors');

            setTimeout(() => {
                this.scrollToFirstError();
            });

            return;
        }
        

        const user = this.api.user();
        if (!user) return;

        this.isSubmitting = true;     // 🔒 lock
        this.form.disable();          // 🔒 lock inputs

        const currentPassword = this.form.get('currentPassword')!.value as string;
        const newPassword = this.form.get('newPassword')!.value as string;

        this.api.changePassword(user.id, currentPassword, newPassword).subscribe({
            next: () => {
                this.toast.success('Password updated successfully');
                this.form.reset();
            },
            error: (err: Error) => {
                this.toast.error(err?.message || 'Current password is incorrect');
            },
            complete: () => {
                this.isSubmitting = false; // 🔓 unlock
                this.form.enable();        // 🔓 enable inputs
            }
        });
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
