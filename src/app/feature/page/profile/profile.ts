// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';

// import { AuthService } from '../../../core/service/mocapi/auth';
// import { ProfileService } from '../../../core/service/mocapi/profile';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './profile.html',
// })
// export class ProfilePage implements OnInit {
//   loading = true;
//   user: any;

//   profileForm: any;
//   passwordForm: any;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private profileService: ProfileService,
//     private toastr: ToastrService
//   ) {
//     this.profileForm = this.fb.group({
//       name: ['', Validators.required],
//       email: [{ value: '', disabled: true }],
//       phone: [''],
//       bio: [''],
//       address: [''],
//     });

//     this.passwordForm = this.fb.group({
//       newPassword: ['', [Validators.required, Validators.minLength(8)]],
//     });
//   }

//   ngOnInit() {
//     const currentUser = this.auth.user();
//     if (!currentUser) return;

//     this.profileService.getProfile(currentUser.id).subscribe(user => {
//       this.user = user;

//       this.profileForm.patchValue({
//         name: user.name,
//         email: user.email,
//         phone: user.phone || '',
//         bio: user.bio || '',
//         address: user.address || '',
//       });

//       this.loading = false;
//     });
//   }

//   /** ✏️ UPDATE PROFILE */
//   saveProfile() {
//     if (this.profileForm.invalid) return;

//     this.profileService
//       .updateProfile(this.user.id, this.profileForm.getRawValue())
//       .subscribe(updated => {
//         this.toastr.success('Profile updated');
//         this.auth.setUser(updated); // ✅ instant update
//       });
//   }

//   /** 🔐 CHANGE PASSWORD */
//   changePassword() {
//     if (this.passwordForm.invalid) return;

//     this.profileService
//       .changePassword(this.user.id, this.passwordForm.value.newPassword)
//       .subscribe(() => {
//         this.toastr.success('Password changed');
//         this.passwordForm.reset();
//       });
//   }

//   /** 🧠 AVATAR INITIALS */
//   get initials(): string {
//     if (!this.user?.name) return '';
//     return this.user.name
//       .split(' ')
//       .map((n: string) => n[0])
//       .join('')
//       .toUpperCase();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/service/mocapi/auth';
import { ProfileService } from '../../../core/service/mocapi/profile';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,          // ✅ REQUIRED for @if, pipes, etc.
    ReactiveFormsModule    // ✅ REQUIRED for formGroup
  ],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnInit {

  user: any;
  flipped = false;
  showPassword = false;
  profileForm: any;
  showFullBio = false;




  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private profile: ProfileService,
    private toast: ToastrService
  ) { 
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      avatar: [''],
      bio: [''],
      password: ['']
    });
  }

  ngOnInit() {
    const u = this.auth.user();
    if (!u) return;

    this.profile.getProfile(u.id).subscribe(res => {
      this.user = res;
      this.profileForm.patchValue({
        name: res.name,
        avatar: res.avatar,
        bio: res.bio
      });
    });
  }
  get joinedDate(): string {
    if (!this.user?.createdAt) return '';
    const d = new Date(this.user.createdAt);
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  }
  flipCard() {
    console.log('Flipping card. Current state:', this.flipped);
    this.flipped = !this.flipped;
    if (!this.flipped) {
      this.profileForm.patchValue(this.user);
      this.profileForm.get('password')?.reset();
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    const payload: any = {
      name: this.profileForm.value.name,
      bio: this.profileForm.value.bio,
      avatar: this.profileForm.value.avatar
    };

    if (this.profileForm.value.password) {
      payload.password = this.profileForm.value.password;
    }

    this.profile.updateProfile(this.user.id, payload).subscribe(updated => {
      this.user = updated;
      this.auth.setUser(updated); // 🔥 live update
      this.toast.success('Profile updated');
      this.flipCard();
    });
  }

  get initials() {
    return this.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  }
  logout() {
   console.log('Logging out user:', this.user);
    // this.auth.logout();
  }
}
