import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../../core/service/mocapi/auth';
import { ProfileService } from '../../../core/service/mocapi/profile';

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

 form: any;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private profile: ProfileService,
        private toast: ToastrService
    ) {
        this.form = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        });
}

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched(); // ✅ SHOW ERRORS
            return;
        }

        const { currentPassword, newPassword, confirmPassword } = this.form.value;

        if (newPassword !== confirmPassword) {
            this.toast.error('Passwords do not match');
            return;
        }

        const user = this.auth.user();
        if (!user) return;

        this.profile
            .changePassword(user.id, currentPassword!, newPassword!)
            .subscribe({
                next: () => {
                    this.toast.success('Password updated successfully');
                    this.form.reset();
                },
                error: (err) => {
                    this.toast.error(err.message || 'Current password is incorrect');
                }
            });
    }

}
