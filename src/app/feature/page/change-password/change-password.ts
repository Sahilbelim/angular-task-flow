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



/* =========================================================
   🧩 COMPONENT
   ========================================================= */

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './change-password.html',
})
export class ChangePasswordPage {



    /* =========================================================
       📍 VIEW REFERENCES (AUTO SCROLL TO ERROR)
       ========================================================= */

    @ViewChild('scrollContainer') scrollContainer!: ElementRef;
    @ViewChild('currentPasswordInput') currentPasswordInput!: ElementRef;
    @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
    @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;



    /* =========================================================
       🧠 UI STATE
       ========================================================= */

    showCurrent = false;
    showNew = false;
    showConfirm = false;
    isSubmitting = false;



    /* =========================================================
       📋 FORM
       ========================================================= */

    form;



    /* =========================================================
       🧱 CONSTRUCTOR — BUILD FORM
       ========================================================= */

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



    /* =========================================================
       🔐 VALIDATORS
       ========================================================= */

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const newPassword = control.get('newPassword')?.value;
        const confirm = control.get('confirmPassword')?.value;
        return newPassword === confirm ? null : { passwordMismatch: true };
    }



    /* =========================================================
       🚀 SUBMIT PASSWORD CHANGE
       ========================================================= */

    submit() {

        // Validate form
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



        /* STEP 1 — VERIFY CURRENT PASSWORD */
        this.http.get<any>('user', { id: user.id }).subscribe({

            next: (dbUser) => {

                if (dbUser.password !== currentPassword) {
                    this.toast.error('Current password is incorrect');
                    this.unlockForm();
                    return;
                }

                /* STEP 2 — UPDATE PASSWORD */
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



    /* =========================================================
       🔓 UNLOCK FORM
       ========================================================= */

    private unlockForm() {
        this.isSubmitting = false;
        this.form.enable();
    }



    /* =========================================================
       📍 SCROLL TO FIRST ERROR
       ========================================================= */

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

        element.nativeElement.focus();
    }



    /* =========================================================
       🔍 PASSWORD STRENGTH HELPERS (UI)
       ========================================================= */

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
