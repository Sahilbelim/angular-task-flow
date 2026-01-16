import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth.service';
import { UserService } from '../../../core/service/user';

@Component({
  selector: 'app-admin-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-user.html',
})
export class AdminAddUser {
  @Output() close = new EventEmitter<void>();

  loading = false;
  showPassword = false;

  adminForm;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private userService: UserService
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
      role: ['user'],
      create: [false],
      edit: [false],
      delete: [false],
    });

    this.adminForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'admin') {
        this.adminForm.patchValue({
          role: 'admin',
          create: true,
          edit: true,
          delete: true,
        });
      }
    });
  }

  submit() {
    this.adminForm.markAllAsTouched();
    if (this.adminForm.invalid) {
      this.toastr.warning('Please fill all fields correctly');
      return;
    }

    this.loading = true;

    const form = this.adminForm.value;

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      permissions: {
        create: form.create,
        edit: form.edit,
        delete: form.delete,
      },
    };
    console.log('Payload:', payload);
    this.authService.adminCreateUser(payload).subscribe({
 
      next: () => {
        this.toastr.success('User created successfully');
        this.close.emit()
        this.userService.triggerRefresh();
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
