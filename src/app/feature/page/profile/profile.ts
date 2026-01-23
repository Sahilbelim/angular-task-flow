// //  import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { AuthService } from '../../../core/service/mocapi/auth';
// // import { ProfileService } from '../../../core/service/mocapi/profile';
// // import { ToastrService } from 'ngx-toastr';
// // import { CommonModule } from '@angular/common';

// // @Component({
// //   selector: 'app-profile',
// //   standalone: true,
// //   imports: [
// //     CommonModule,          // ✅ REQUIRED for @if, pipes, etc.
// //     ReactiveFormsModule    // ✅ REQUIRED for formGroup
// //   ],
// //   templateUrl: './profile.html',
// // })
// // export class ProfilePage implements OnInit {

// //   user: any;
// //   flipped = false;
// //   showPassword = false;
// //   profileForm: any;
// //   showFullBio = false;




// //   constructor(
// //     private fb: FormBuilder,
// //     private auth: AuthService,
// //     private profile: ProfileService,
// //     private toast: ToastrService
// //   ) {
// //     this.profileForm = this.fb.group({
// //       name: ['', Validators.required],
// //       avatar: [''],
// //       bio: [''],
// //       password: ['']
// //     });
// //   }

// //   ngOnInit() {
// //     const u = this.auth.user();
// //     if (!u) return;

// //     this.profile.getProfile(u.id).subscribe(res => {
// //       this.user = res;
// //       this.profileForm.patchValue({
// //         name: res.name,
// //         avatar: res.avatar,
// //         bio: res.bio
// //       });
// //     });
// //   }
// //   get joinedDate(): string {
// //     if (!this.user?.createdAt) return '';
// //     const d = new Date(this.user.createdAt);
// //     return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
// //   }
// //   flipCard() {
// //     console.log('Flipping card. Current state:', this.flipped);
// //     this.flipped = !this.flipped;
// //     if (!this.flipped) {
// //       this.profileForm.patchValue(this.user);
// //       this.profileForm.get('password')?.reset();
// //     }
// //   }

// //   saveProfile() {
// //     if (this.profileForm.invalid) return;

// //     const payload: any = {
// //       name: this.profileForm.value.name,
// //       bio: this.profileForm.value.bio,
// //       avatar: this.profileForm.value.avatar
// //     };

// //     if (this.profileForm.value.password) {
// //       payload.password = this.profileForm.value.password;
// //     }

// //     this.profile.updateProfile(this.user.id, payload).subscribe(updated => {
// //       this.user = updated;
// //       this.auth.setUser(updated); // 🔥 live update
// //       this.toast.success('Profile updated');
// //       this.flipCard();
// //     });
// //   }

// //   get initials() {
// //     return this.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase();
// //   }
// //   logout() {
// //    console.log('Logging out user:', this.user);
// //     // this.auth.logout();
// //   }
// // }

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

// import { AuthService } from '../../../core/service/mocapi/auth';
// import { ProfileService } from '../../../core/service/mocapi/profile';
// import { RouterLink } from "@angular/router";

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './profile.html',
// })
// export class ProfilePage implements OnInit {

//   user: any;
//   flipped = false;
//   showFullBio = false;
//   profileForm: any;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private profile: ProfileService,
//     private toast: ToastrService
//   ) {
//     this.profileForm = this.fb.group({
//       name: ['', Validators.required],
//       phone: [''],
//       region: [''],
//       bio: ['', Validators.maxLength(250)],
//     });
// }

//   ngOnInit() {
//     const u = this.auth.user();
//     if (!u) return;

//     this.profile.getProfile(u.id).subscribe(res => {
//       this.user = res;
//       this.profileForm.patchValue({
//         name: res.name,
//         phone: res.phone || '',
//         region: res.region || '',
//         bio: res.bio || ''
//       });
//     });
//   }

//   flipCard() {
//     this.flipped = !this.flipped;
//     if (!this.flipped && this.user) {
//       this.profileForm.patchValue(this.user);
//     }
//   }

//   saveProfile() {
//     if (this.profileForm.invalid) return;

//     const payload = { ...this.profileForm.value };

//     this.profile.updateProfile(this.user.id, payload).subscribe(updated => {
//       this.user = updated;
//       this.auth.setUser(updated);
//       this.toast.success('Profile updated');
//       this.flipCard();
//     });
//   }

//   get joinedDate(): string {
//     if (!this.user?.createdAt) return '';
//     return new Date(this.user.createdAt).toLocaleString('en-US', {
//       month: 'short',
//       year: 'numeric'
//     });
//   }

//   get initials(): string {
//     return this.user?.name
//       ?.split(' ')
//       .map((n: string) => n[0])
//       .join('')
//       .toUpperCase();
//   }

//   logout() {
//     // this.auth.logout();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../../core/service/mocapi/api/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnInit {

  user: any;
  flipped = false;
  showFullBio = false;
  profileForm: any;
  

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toast: ToastrService
  ) { 
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      region: [''],
      bio: ['', Validators.maxLength(250)],
    });
  }

  /* =====================
     INIT (NO API CALL)
  ===================== */
  ngOnInit() {
    const u = this.api.currentUser();
    if (!u) return;

    this.user = u;
    this.patchForm(u);
  }

  /* =====================
     FORM HELPERS
  ===================== */
  private patchForm(user: any) {
    this.profileForm.patchValue({
      name: user.name || '',
      phone: user.phone || '',
      region: user.region || '',
      bio: user.bio || '',
    });
  }

  /* =====================
     UI
  ===================== */
  flipCard() {
    this.flipped = !this.flipped;

    // reset form on cancel
    if (!this.flipped && this.user) {
      this.patchForm(this.user);
    }
  }

  /* =====================
     SAVE (OPTIMISTIC)
  ===================== */
  saveProfile() {
    if (this.profileForm.invalid || !this.user) return;

    const payload = this.profileForm.value;

    this.api.updateProfile(this.user.id, payload).subscribe(updated => {
      this.user = updated;               // local
      this.toast.success('Profile updated');
      this.flipCard();                   // close edit mode
    });
  }

  /* =====================
     DERIVED UI DATA
  ===================== */
  get joinedDate(): string {
    if (!this.user?.createdAt) return '';
    return new Date(this.user.createdAt).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  get initials(): string {
    return this.user?.name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }

  /* =====================
     LOGOUT
  ===================== */
  logout() {
    this.api.logout();
  }
}
