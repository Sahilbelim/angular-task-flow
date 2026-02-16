 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnInit {

  user: any;
  flipped = false;
  showFullBio = false;
  profileForm: any;
  countries: string[] = [];
  saving = false;



  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private http: CommonApiService,
    private toast: ToastrService,
    private httpClient: HttpClient, 
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
  

  // ngOnInit() {
  //   // 1️⃣ Load cached user immediately
  //   this.api.loadUserFromStorage();

  //   // 2️⃣ Subscribe once for reactive updates
  //   this.api.currentUser$.subscribe(user => {
  //     if (!user) return;
  //     this.user = user;
  //     this.patchForm(user);
  //   });

  //   // 3️⃣ Fetch from backend ONLY ONCE
  //   this.api.getCurrentUser()?.subscribe();


  //   // ✅ COUNTRIES FROM SERVICE
  //   this.api.getCountries$().subscribe(list => {
  //     this.countries = list;
  //   });
  // }

  // ngOnInit() {

  //   // reactive user
  //   this.api.currentUser$.subscribe(user => {
  //     if (!user) return;

  //     this.user = user;
  //     this.patchForm(user);
  //   });

  //   // countries cache
  //   this.api.getCountries$().subscribe(list => {
  //     this.countries = list;
  //   });

  // }

  // ngOnInit() {
  //   this.api.currentUser$.subscribe(user => {
  //     if (!user) return;
  //     this.user = user;
  //     this.patchForm(user);
  //   });
  // }


  ngOnInit() {

    // load user
    this.api.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      this.patchForm(user);
    });

    // load countries directly
    this.loadCountries();
  }
  // private loadCountries() {

  //   this.http.get<any[]>('countries').subscribe({
  //     next: (res: any[]) => {

  //       // API may return ["India","USA"]
  //       if (typeof res[0] === 'string') {
  //         this.countries = res;
  //         return;
  //       }

  //       // API may return [{name:"India"}]
  //       this.countries = res.map(c => c.name || c.country || '');

  //     },
  //     error: () => {
  //       this.toast.error('Failed to load countries');
  //       this.countries = [];
  //     }
  //   });
  // }
  private loadCountries() {

    this.httpClient
      .get<any[]>('https://restcountries.com/v3.1/all?fields=name')
      .pipe(
        map(res =>
          res
            .map(c => c?.name?.common)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
        )
      )
      .subscribe({
        next: (countries: string[]) => {
          this.countries = countries;
        },
        error: () => {
          this.toast.error('Failed to load country list');
          this.countries = [];
        }
      });
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
  // saveProfile() {
  //   if (this.profileForm.invalid || !this.user) return;

  //   const payload = this.profileForm.value;

  //   this.api.updateProfile(this.user.id, payload).subscribe(updated => {
  //     this.user = updated;               // local
  //     this.toast.success('Profile updated');
  //     this.flipCard();                   // close edit mode
  //   });
  // }

  // saveProfile() {
  //   if (this.profileForm.invalid || !this.user || this.saving) {
  //     return;
  //   }

  //   this.saving = true; // 🔒 lock immediately
  //   this.profileForm.disable();

  //   const payload = this.profileForm.value;

  //   this.api.updateProfile(this.user.id, payload).subscribe({
  //     next: updated => {
  //       this.user = updated;               // update local state
  //       this.toast.success('Profile updated');
  //       this.flipCard();                   // close edit mode
  //     },
  //     error: () => {
  //       this.toast.error('Failed to update profile');
  //     },
  //     complete: () => {
  //       this.profileForm.enable();
  //       this.saving = false;               // 🔓 unlock
  //     }
  //   });
  // }

  // saveProfile() {

  //   if (this.profileForm.invalid || !this.user || this.saving) return;

  //   this.saving = true;
  //   this.profileForm.disable();

  //   const payload = this.profileForm.value;

  //   this.api.updateProfile(this.user.id, payload).subscribe({
  //     next: () => {
  //       this.toast.success('Profile updated');
  //       this.flipCard();
  //     },
  //     error: () => {
  //       this.toast.error('Failed to update profile');
  //     },
  //     complete: () => {
  //       this.profileForm.enable();
  //       this.saving = false;
  //     }
  //   });
  // }

  // saveProfile() {

  //   if (this.profileForm.invalid || !this.user || this.saving) return;

  //   this.saving = true;
  //   this.profileForm.disable();

  //   const payload = this.profileForm.value;

  //   this.http.put('user', this.user.id, payload).subscribe({
  //     next: (updated: any) => {

  //       // 🔥 VERY IMPORTANT — update global logged-in user
  //       this.api.setSession(updated);

  //       this.toast.success('Profile updated');
  //       this.flipCard();
  //     },
  //     error: () => {
  //       this.toast.error('Failed to update profile');
  //     },
  //     complete: () => {
  //       this.profileForm.enable();
  //       this.saving = false;
  //     }
  //   });
  // }


  // saveProfile() {

  //   if (this.profileForm.invalid || !this.user || this.saving) return;

  //   this.saving = true;
  //   this.profileForm.disable();

  //   const payload = this.profileForm.value;

  //   this.http.put('user', this.user.id, payload).subscribe({
  //     next: (updated: any) => {

  //       // update session
  //       // this.api.setSession(updated);

  //       this.api.updateCurrentUser(updated);


  //       // also update user inside users store (if list already loaded)
  //       this.api.updateUser(updated.id, updated);

  //       this.toast.success('Profile updated');
  //       this.flipCard();
  //     },
  //     error: () => {
  //       this.toast.error('Failed to update profile');
  //     },
  //     complete: () => {
  //       this.profileForm.enable();
  //       this.saving = false;
  //     }
  //   });
  // }

  saveProfile() {

    if (this.profileForm.invalid || !this.user || this.saving) return;

    this.saving = true;
    this.profileForm.disable();

    const payload = this.profileForm.value;

    this.http.put('user', this.user.id, payload).subscribe({
      next: (updated: any) => {

        // ✔ ONLY update logged in user
        this.api.updateCurrentUser(updated);

        // ✔ update user list locally
        this.api.updateUser(updated.id, updated);

        this.toast.success('Profile updated');
        this.flipCard();
      },
      error: () => {
        this.toast.error('Failed to update profile');
      },
      complete: () => {
        this.profileForm.enable();
        this.saving = false;
      }
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
    return this.user?.name[0]
      .toUpperCase();
  }

  /* =====================
     LOGOUT
  ===================== */
  logout() {
    this.api.logout();
  }
}
