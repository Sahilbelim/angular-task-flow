import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-admin-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-user.html',
})
export class AdminAddUser {

  loading = false;
  showPassword = false;

  adminForm;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) { 

    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(/[A-Z]/),      // uppercase
        Validators.pattern(/[a-z]/),      // lowercase
        Validators.pattern(/\d/),         // number
        Validators.pattern(/[@$!%*?&#]/), // special char
      ]],
      create: [false],
      edit: [false],
      delete: [false],
    });

  }

  submit() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      this.toastr.warning('Please fill all fields correctly');
      return;
    }

    this.loading = true;

    const form = this.adminForm.value;

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      permissions: {
        create: form.create,
        edit: form.edit,
        delete: form.delete,
      },
    };

    this.authService.adminCreateUser(payload).subscribe({
      next: () => {
        this.toastr.success('User created successfully');
        this.adminForm.reset({
          create: false,
          edit: false,
          delete: false,
        });
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Something went wrong');
        this.loading = false;
      },
    });
  }

  // ===== Password helpers (UI validation) =====
  get passwordValue(): string {
    return this.adminForm.get('password')?.value || '';
  }

  get hasUppercase() { return /[A-Z]/.test(this.passwordValue); }
  get hasLowercase() { return /[a-z]/.test(this.passwordValue); }
  get hasNumber() { return /\d/.test(this.passwordValue); }
  get hasSpecialChar() { return /[@$!%*?&#]/.test(this.passwordValue); }
  get hasMinLength() { return this.passwordValue.length >= 8; }
  get hasMaxLength() { return this.passwordValue.length <= 32; }
}
