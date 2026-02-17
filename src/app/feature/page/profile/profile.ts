import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { finalize } from 'rxjs/operators';


/* =========================================================
   🧩 COMPONENT
   ========================================================= */

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
})
export class ProfilePage implements OnInit {



  /* =========================================================
     🧾 USER STATE
     ========================================================= */
  user: any;
  flipped = false;
  showFullBio = false;
  saving = false;



  /* =========================================================
     📋 FORM & DATA
     ========================================================= */
  profileForm: any;
  countries: string[] = [];



  /* =========================================================
     🧱 CONSTRUCTOR — CREATE FORM
     ========================================================= */
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private http: CommonApiService,
    private toast: ToastrService,
    private httpClient: HttpClient,
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['' ],
      region: [''],
      bio: ['', Validators.maxLength(250)],
    });
  }



  /* =========================================================
     🚀 INIT (NO EXTRA API CALLS)
     ========================================================= */
  ngOnInit() {

    // Subscribe to logged-in user from store
    this.api.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      this.patchForm(user);
    });

    // Load country list from public API
    this.loadCountries();
  }



  /* =========================================================
     🌍 LOAD COUNTRIES
     ========================================================= */
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



  /* =========================================================
     🧩 FORM HELPERS
     ========================================================= */
  private patchForm(user: any) {
    this.profileForm.patchValue({
      name: user.name || '',
      phone: user.phone || '',
      region: user.region || '',
      bio: user.bio || '',
    });
  }



  /* =========================================================
     🎨 UI INTERACTION
     ========================================================= */
  flipCard() {
    this.flipped = !this.flipped;

    // Restore original values if cancelled
    if (!this.flipped && this.user) {
      this.patchForm(this.user);
    }
  }



  /* =========================================================
     💾 SAVE PROFILE
     ========================================================= */
  // saveProfile() {

  //   if (this.profileForm.invalid || !this.user || this.saving) return;

  //   this.saving = true;
  //   this.profileForm.disable();

  //   const payload = this.profileForm.value;

  //   this.http.put('user', this.user.id, payload).subscribe({
  //     next: (updated: any) => {

  //       // Update session user
  //       this.api.updateCurrentUser(updated);

  //       // Update user list cache
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

  this.http.put('user', this.user.id, payload)
    .pipe(
      finalize(() => {
        // ALWAYS runs (success OR error)
        this.profileForm.enable();
        this.saving = false;
      })
    )
    .subscribe({
      next: (updated: any) => {

        // Update session user
        this.api.updateCurrentUser(updated);

        // Update user list cache
        this.api.updateUser(updated.id, updated);

        this.toast.success('Profile updated');
        this.flipCard();
      },
      error: () => {
        this.toast.error('Failed to update profile');
      }
    });
}



  /* =========================================================
     📊 DERIVED UI DATA
     ========================================================= */
  get joinedDate(): string {
    if (!this.user?.createdAt) return '';
    return new Date(this.user.createdAt).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  get initials(): string {
    return this.user?.name[0].toUpperCase();
  }



  /* =========================================================
     🔓 LOGOUT
     ========================================================= */
  logout() {
    this.api.logout();
  }

}
