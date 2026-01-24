 
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
    // 1️⃣ Load cached user immediately
    this.api.loadUserFromStorage();

    // 2️⃣ Subscribe once for reactive updates
    this.api.currentUser$.subscribe(user => {
      if (!user) return;
      this.user = user;
      this.patchForm(user);
    });

    // 3️⃣ Fetch from backend ONLY ONCE
    this.api.getCurrentUser()?.subscribe();
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
