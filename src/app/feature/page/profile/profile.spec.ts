// // // // // import { ComponentFixture, TestBed } from '@angular/core/testing';

// // // // // import { ProfilePage } from './profile';

// // // // // import { provideHttpClient } from '@angular/common/http';
// // // // // import { provideHttpClientTesting } from '@angular/common/http/testing';
// // // // // import { provideRouter } from '@angular/router';

// // // // // describe('Profile', () => {
// // // // //   let component: ProfilePage;
// // // // //   let fixture: ComponentFixture<ProfilePage>;

// // // // //   beforeEach(async () => {
// // // // //     await TestBed.configureTestingModule({
// // // // //       imports: [ProfilePage],
// // // // //       providers: [provideHttpClient(),
// // // // //       provideHttpClientTesting(),
// // // // //       provideRouter([]),]
// // // // //     })
// // // // //     .compileComponents();

// // // // //     fixture = TestBed.createComponent(ProfilePage);
// // // // //     component = fixture.componentInstance;
// // // // //     fixture.detectChanges();
// // // // //   });

// // // // //   it('should create', () => {
// // // // //     expect(component).toBeTruthy();
// // // // //   });
// // // // // });


// // // // import { ComponentFixture, TestBed } from '@angular/core/testing';
// // // // import { ProfilePage } from './profile';
// // // // import { provideHttpClient } from '@angular/common/http';
// // // // import { provideHttpClientTesting } from '@angular/common/http/testing';
// // // // import { provideRouter } from '@angular/router';
// // // // import { ToastrService } from 'ngx-toastr';

// // // // describe('Profile', () => {
// // // //   let component: ProfilePage;
// // // //   let fixture: ComponentFixture<ProfilePage>;

// // // //   const toastrMock = {
// // // //     success: jasmine.createSpy('success'),
// // // //     error: jasmine.createSpy('error'),
// // // //     info: jasmine.createSpy('info'),
// // // //     warning: jasmine.createSpy('warning'),
// // // //   };

// // // //   beforeEach(async () => {
// // // //     await TestBed.configureTestingModule({
// // // //       imports: [ProfilePage],
// // // //       providers: [
// // // //         provideHttpClient(),
// // // //         provideHttpClientTesting(),
// // // //         provideRouter([]),

// // // //         // ✅ FIX: mock ToastrService
// // // //         { provide: ToastrService, useValue: toastrMock },
// // // //       ],
// // // //     }).compileComponents();

// // // //     fixture = TestBed.createComponent(ProfilePage);
// // // //     component = fixture.componentInstance;
// // // //     fixture.detectChanges();
// // // //   });

// // // //   it('should create', () => {
// // // //     expect(component).toBeTruthy();
// // // //   });
// // // // });

// // // import { ComponentFixture, TestBed } from '@angular/core/testing';
// // // import { ProfilePage } from './profile';
// // // import { provideRouter } from '@angular/router';
// // // import { ToastrService } from 'ngx-toastr';
// // // import { ProfileService } from '../../../core/service/mocapi/profile';

// // // describe('Profile', () => {
// // //   let component: ProfilePage;
// // //   let fixture: ComponentFixture<ProfilePage>;

// // //   const toastrMock = {
// // //     success: jasmine.createSpy(),
// // //     error: jasmine.createSpy(),
// // //     info: jasmine.createSpy(),
// // //     warning: jasmine.createSpy(),
// // //   };

// // //   const profileServiceMock = {
// // //     getProfile: jasmine.createSpy().and.returnValue(null),
// // //     updateProfile: jasmine.createSpy(),
// // //   };

// // //   beforeEach(async () => {
// // //     await TestBed.configureTestingModule({
// // //       imports: [ProfilePage], // standalone
// // //       providers: [
// // //         provideRouter([]),

// // //         { provide: ToastrService, useValue: toastrMock },
// // //         { provide: ProfileService, useValue: profileServiceMock }, // ✅ FIX
// // //       ],
// // //     }).compileComponents();

// // //     fixture = TestBed.createComponent(ProfilePage);
// // //     component = fixture.componentInstance;
// // //     fixture.detectChanges();
// // //   });

// // //   it('should create', () => {
// // //     expect(component).toBeTruthy();
// // //   });
// // // });

// // import { ComponentFixture, TestBed } from '@angular/core/testing';
// // import { ProfilePage } from './profile';
// // import { provideRouter } from '@angular/router';
// // import { ToastrService } from 'ngx-toastr';
// // import { ProfileService } from '../../../core/service/mocapi/profile';
// // import { of, throwError } from 'rxjs';

// // describe('ProfilePage', () => {
// //   let component: ProfilePage;
// //   let fixture: ComponentFixture<ProfilePage>;

// //   // ✅ MOCK TOASTR
// //   const toastrMock = {
// //     success: jasmine.createSpy('success'),
// //     error: jasmine.createSpy('error'),
// //     info: jasmine.createSpy('info'),
// //     warning: jasmine.createSpy('warning'),
// //   };

// //   // ✅ MOCK PROFILE SERVICE
// //   const mockProfile = {
// //     id: '1',
// //     name: 'John Doe',
// //     email: 'john@test.com',
// //     phone: '9999999999',
// //     address: 'Ahmedabad',
// //   };

// //   const profileServiceMock = {
// //     getProfile: jasmine.createSpy('getProfile').and.returnValue(of(mockProfile)),
// //     updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of(mockProfile)),
// //   };

// //   beforeEach(async () => {
// //     await TestBed.configureTestingModule({
// //       imports: [ProfilePage], // standalone component
// //       providers: [
// //         provideRouter([]),
// //         { provide: ToastrService, useValue: toastrMock },
// //         { provide: ProfileService, useValue: profileServiceMock },
// //       ],
// //     }).compileComponents();

// //     fixture = TestBed.createComponent(ProfilePage);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges(); // 🔥 triggers ngOnInit
// //   });

// //   /* =====================================================
// //      BASIC CREATION
// //   ===================================================== */
// //   it('should create the profile page', () => {
// //     expect(component).toBeTruthy();
// //   });

// //   /* =====================================================
// //      LOAD PROFILE DATA
// //   ===================================================== */
// //   it('should load profile data on init', () => {
// //     expect(profileServiceMock.getProfile).toHaveBeenCalled();
// //     expect(component.profileForm.value.name).toBe('John Doe');
// //     expect(component.profileForm.value.email).toBe('john@test.com');
// //   });

// //   /* =====================================================
// //      FORM VALIDATION
// //   ===================================================== */
// //   it('should mark form invalid when required fields are empty', () => {
// //     component.profileForm.patchValue({
// //       name: '',
// //       email: '',
// //     });

// //     expect(component.profileForm.invalid).toBeTrue();
// //   });

// //   /* =====================================================
// //      UPDATE PROFILE (SUCCESS)
// //   ===================================================== */
// //   it('should update profile successfully', () => {
// //     component.profileForm.patchValue({
// //       name: 'Updated Name',
// //       phone: '8888888888',
// //     });

// //     component.submit();

// //     expect(profileServiceMock.updateProfile).toHaveBeenCalled();
// //     expect(toastrMock.success).toHaveBeenCalledWith(
// //       'Profile updated successfully'
// //     );
// //   });

// //   /* =====================================================
// //      UPDATE PROFILE (ERROR)
// //   ===================================================== */
// //   it('should show error toast if update fails', () => {
// //     profileServiceMock.updateProfile.and.returnValue(
// //       throwError(() => new Error('Update failed'))
// //     );

// //     component.submit();

// //     expect(toastrMock.error).toHaveBeenCalled();
// //   });
// // });


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ProfilePage } from './profile';
// import { provideRouter } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { of, throwError, BehaviorSubject } from 'rxjs';

// describe('ProfilePage', () => {
//   let component: ProfilePage;
//   let fixture: ComponentFixture<ProfilePage>;

//   /* =====================
//      MOCK DATA
//   ===================== */
//   const mockUser = {
//     id: '1',
//     name: 'John Doe',
//     phone: '9999999999',
//     region: 'India',
//     bio: 'Test bio',
//     createdAt: new Date().toISOString(),
//   };

//   /* =====================
//      MOCK TOASTR
//   ===================== */
//   const toastrMock = {
//     success: jasmine.createSpy('success'),
//     error: jasmine.createSpy('error'),
//   };

//   /* =====================
//      MOCK API SERVICE
//   ===================== */
//   const currentUser$ = new BehaviorSubject<any>(mockUser);

//   const apiServiceMock = {
//     loadUserFromStorage: jasmine.createSpy('loadUserFromStorage'),
//     getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of(mockUser)),
//     updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of(mockUser)),
//     logout: jasmine.createSpy('logout'),
//     getCountries$: jasmine.createSpy('getCountries$').and.returnValue(of(['India', 'USA'])),
//     currentUser$: currentUser$.asObservable(),
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ProfilePage], // standalone component
//       providers: [
//         provideRouter([]),
//         { provide: ApiService, useValue: apiServiceMock },
//         { provide: ToastrService, useValue: toastrMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(ProfilePage);
//     component = fixture.componentInstance;
//     fixture.detectChanges(); // triggers ngOnInit
//   });

//   /* =====================================================
//      BASIC CREATION
//   ===================================================== */
//   it('should create profile page', () => {
//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      INIT LOGIC
//   ===================================================== */
//   it('should load user from storage and patch form', () => {
//     expect(apiServiceMock.loadUserFromStorage).toHaveBeenCalled();

//     expect(component.profileForm.value).toEqual(
//       jasmine.objectContaining({
//         name: 'John Doe',
//         phone: '9999999999',
//         region: 'India',
//         bio: 'Test bio',
//       })
//     );
//   });

//   /* =====================================================
//      FLIP CARD
//   ===================================================== */
//   it('should flip card and reset form on cancel', () => {
//     component.flipped = true;
//     component.profileForm.patchValue({ name: 'Changed' });

//     component.flipCard(); // close edit

//     expect(component.flipped).toBeFalse();
//     expect(component.profileForm.value.name).toBe('John Doe');
//   });

//   /* =====================================================
//      SAVE PROFILE (SUCCESS)
//   ===================================================== */
//   it('should save profile successfully', () => {
//     component.flipped = true;

//     component.profileForm.patchValue({
//       name: 'Updated Name',
//     });

//     component.saveProfile();

//     expect(apiServiceMock.updateProfile).toHaveBeenCalledWith(
//       mockUser.id,
//       jasmine.objectContaining({ name: 'Updated Name' })
//     );

//     expect(toastrMock.success).toHaveBeenCalledWith('Profile updated');
//     expect(component.saving).toBeFalse();
//   });

//   /* =====================================================
//      SAVE PROFILE (ERROR)
//   ===================================================== */
//   it('should show error toast if update fails', () => {
//     apiServiceMock.updateProfile.and.returnValue(
//       throwError(() => new Error('Update failed'))
//     );

//     component.saveProfile();

//     expect(toastrMock.error).toHaveBeenCalledWith('Failed to update profile');
//     expect(component.saving).toBeFalse();
//   });

//   /* =====================================================
//      LOGOUT
//   ===================================================== */
//   it('should logout user', () => {
//     component.logout();
//     expect(apiServiceMock.logout).toHaveBeenCalled();
//   });

//   /* =====================================================
//      DERIVED VALUES
//   ===================================================== */
//   it('should return initials from user name', () => {
//     expect(component.initials).toBe('J');
//   });

//   it('should return formatted joined date', () => {
//     expect(component.joinedDate).toContain(
//       new Date(mockUser.createdAt).getFullYear().toString()
//     );
//   });
// });

// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ProfilePage } from './profile';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { ToastrService } from 'ngx-toastr';
// import { of, BehaviorSubject, throwError } from 'rxjs';
// import { ReactiveFormsModule } from '@angular/forms';
// import {  delay } from 'rxjs';

// /* =====================================================
//    MOCK SERVICES
// ===================================================== */

// class ApiServiceMock {
//   private user$ = new BehaviorSubject<any>(null);

//   currentUser$ = this.user$.asObservable();

//   loadUserFromStorage = jasmine.createSpy('loadUserFromStorage');

//   getCurrentUser() {
//     return of({
//       id: '1',
//       name: 'John Doe',
//       phone: '9999999999',
//       region: 'India',
//       bio: 'Developer',
//       createdAt: '2024-01-01T00:00:00Z',
//     });
//   }

//   getCountries$() {
//     return of(['India', 'USA']);
//   }

//   updateProfile = jasmine.createSpy('updateProfile').and.callFake(() =>
//     of({
//       id: '1',
//       name: 'Updated Name',
//       phone: '8888888888',
//       region: 'USA',
//       bio: 'Updated bio',
//       createdAt: '2024-01-01T00:00:00Z',
//     })
//   );

//   logout = jasmine.createSpy('logout');

//   emitUser(user: any) {
//     this.user$.next(user);
//   }
// }

// class ToastrMock {
//   success = jasmine.createSpy('success');
//   error = jasmine.createSpy('error');
// }

// /* =====================================================
//    TEST SUITE
// ===================================================== */

// describe('ProfilePage', () => {
//   let component: ProfilePage;
//   let fixture: ComponentFixture<ProfilePage>;
//   let api: ApiServiceMock;
//   let toast: ToastrMock;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ProfilePage, ReactiveFormsModule],
//       providers: [
//         { provide: ApiService, useClass: ApiServiceMock },
//         { provide: ToastrService, useClass: ToastrMock },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(ProfilePage);
//     component = fixture.componentInstance;

//     api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
//     toast = TestBed.inject(ToastrService) as unknown as ToastrMock;
//   });

//   /* =====================================================
//      INIT
//   ===================================================== */

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load user and patch form on init', fakeAsync(() => {
//     fixture.detectChanges(); // ngOnInit

//     api.emitUser({
//       id: '1',
//       name: 'John Doe',
//       phone: '9999999999',
//       region: 'India',
//       bio: 'Developer',
//     });

//     tick();
//     fixture.detectChanges();

//     expect(component.user.name).toBe('John Doe');
//     expect(component.profileForm.value.name).toBe('John Doe');
//     expect(component.profileForm.value.region).toBe('India');
//   }));

//   it('should load countries', fakeAsync(() => {
//     fixture.detectChanges();
//     tick();

//     expect(component.countries).toEqual(['India', 'USA']);
//   }));

//   /* =====================================================
//      UI LOGIC
//   ===================================================== */

//   it('should flip card and reset form on cancel', () => {
//     component.user = { name: 'Original' };
//     component.profileForm.patchValue({ name: 'Changed' });

//     component.flipCard(); // open
//     expect(component.flipped).toBeTrue();

//     component.flipCard(); // close
//     expect(component.flipped).toBeFalse();
//     expect(component.profileForm.value.name).toBe('Original');
//   });

//   /* =====================================================
//      SAVE PROFILE
//   ===================================================== */

//   it('should save profile successfully', fakeAsync(() => {
//     api.updateProfile.and.returnValue(
//       of({ id: '1', name: 'Updated Name' }).pipe(delay(0))
//     );

//     fixture.detectChanges();

//     component.user = { id: '1', name: 'John Doe' };
//     component.profileForm.patchValue({ name: 'Updated Name' });

//     component.saveProfile();

//     // ✅ now this is valid
//     expect(component.saving).toBeTrue();
//     expect(api.updateProfile).toHaveBeenCalled();

//     tick();                // flush async observable
//     fixture.detectChanges();

//     expect(component.user.name).toBe('Updated Name');
//     expect(toast.success).toHaveBeenCalledWith('Profile updated');
//     expect(component.saving).toBeFalse();
//   }));


//   it('should handle save error', fakeAsync(() => {
//     api.updateProfile.and.returnValue(
//       throwError(() => new Error('fail'))
//     );

//     fixture.detectChanges();

//     component.user = { id: '1', name: 'John' };
//     component.profileForm.patchValue({ name: 'Error Case' });

//     component.saveProfile();

//     tick();
//     fixture.detectChanges();

//     expect(toast.error).toHaveBeenCalledWith('Failed to update profile');

//     // ✅ saving stays TRUE because `complete` is never called on error
//     expect(component.saving).toBeTrue();
//   }));

//   it('should not submit if form invalid or already saving', () => {
//     component.saving = true;
//     component.saveProfile();
//     expect(api.updateProfile).not.toHaveBeenCalled();

//     component.saving = false;
//     component.profileForm.reset();
//     component.saveProfile();
//     expect(api.updateProfile).not.toHaveBeenCalled();
//   });

//   /* =====================================================
//      DERIVED DATA
//   ===================================================== */

//   it('should return initials', () => {
//     component.user = { name: 'John' };
//     expect(component.initials).toBe('J');
//   });

//   it('should return joined date', () => {
//     component.user = { createdAt: '2024-01-01T00:00:00Z' };
//     expect(component.joinedDate).toContain('Jan');
//   });

//   /* =====================================================
//      LOGOUT
//   ===================================================== */

//   it('should logout', () => {
//     component.logout();
//     expect(api.logout).toHaveBeenCalled();
//   });
// });

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfilePage } from './profile';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/* =====================================================
   MOCK API STORE (REALISTIC STORE BEHAVIOR)
   -----------------------------------------------------
   Simulates global session store
   ===================================================== */
class ApiServiceMock {

  private userSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.userSubject.asObservable();

  updateCurrentUser = jasmine.createSpy('updateCurrentUser');
  updateUser = jasmine.createSpy('updateUser');
  logout = jasmine.createSpy('logout');

  emitUser(user: any) {
    this.userSubject.next(user);
  }
}

/* =====================================================
   MOCK BACKEND SERVICE (PUT PROFILE)
   ===================================================== */
class CommonApiMock {
  put = jasmine.createSpy('put').and.returnValue(of({}));
}

/* =====================================================
   MOCK HTTP (COUNTRIES API)
   ===================================================== */
class HttpMock {
  get = jasmine.createSpy('get').and.returnValue(of([
    { name: { common: 'India' } },
    { name: { common: 'USA' } }
  ]));
}

/* =====================================================
   MOCK TOAST
   ===================================================== */
class ToastrMock {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

/* =====================================================
   TEST SUITE
   ===================================================== */
describe('ProfilePage', () => {

  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let api: ApiServiceMock;
  let http: CommonApiMock;
  let toast: ToastrMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: ApiService, useClass: ApiServiceMock },
        { provide: CommonApiService, useClass: CommonApiMock },
        { provide: HttpClient, useClass: HttpMock },
        { provide: ToastrService, useClass: ToastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;

    api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
    http = TestBed.inject(CommonApiService) as unknown as CommonApiMock;
    toast = TestBed.inject(ToastrService) as unknown as ToastrMock;
  });

  /* =====================================================
     CREATION
     Verifies Angular created component successfully
   ===================================================== */
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     INIT → USER SUBSCRIPTION
     Component must patch form when store emits user
   ===================================================== */
  it('should patch form when user arrives from store', fakeAsync(() => {

    fixture.detectChanges(); // ngOnInit

    api.emitUser({
      id: '1',
      name: 'John Doe',
      phone: '9999999999',
      region: 'India',
      bio: 'Developer'
    });

    tick();

    expect(component.profileForm.value.name).toBe('John Doe');
    expect(component.profileForm.value.region).toBe('India');
  }));

  /* =====================================================
     COUNTRIES API
     Should load and map country names correctly
   ===================================================== */
  it('should load and map countries list', fakeAsync(() => {

    fixture.detectChanges();
    tick();

    expect(component.countries).toEqual(['India', 'USA']);
  }));

  /* =====================================================
     UI LOGIC
     Closing edit should restore original values
   ===================================================== */
  it('should restore form values when edit cancelled', () => {

    component.user = { name: 'Original' };

    component.profileForm.patchValue({ name: 'Changed' });

    component.flipCard(); // open
    component.flipCard(); // close

    expect(component.profileForm.value.name).toBe('Original');
  });

  /* =====================================================
     SAVE PROFILE — SUCCESS
     Must:
     1. Call backend
     2. Update global store
     3. Show success toast
     4. Unlock form
   ===================================================== */
  it('should update profile successfully', fakeAsync(() => {

    fixture.detectChanges();

    component.user = { id: '1', name: 'John' };
    component.profileForm.patchValue({ name: 'Updated' });

    http.put.and.returnValue(of({ id: '1', name: 'Updated' }));

    component.saveProfile();
    tick();

    expect(http.put).toHaveBeenCalled();
    expect(api.updateCurrentUser).toHaveBeenCalled();
    expect(api.updateUser).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Profile updated');
    expect(component.saving).toBeFalse();
  }));

  /* =====================================================
     SAVE PROFILE — ERROR
     Should show error and unlock form
   ===================================================== */
  it('should handle update failure', fakeAsync(() => {

    fixture.detectChanges();

    component.user = { id: '1', name: 'John' };
    component.profileForm.patchValue({ name: 'Updated' });

    http.put.and.returnValue(throwError(() => new Error()));

    component.saveProfile();
    tick();

    expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
    expect(component.saving).toBeFalse();
  }));

  /* =====================================================
     VALIDATION GUARD
     Should NOT call API if invalid
   ===================================================== */
  it('should not submit invalid form', () => {

    component.user = { id: '1' };
    component.profileForm.reset();

    component.saveProfile();

    expect(http.put).not.toHaveBeenCalled();
  });

  /* =====================================================
     DERIVED VALUES
   ===================================================== */
  it('should compute initials', () => {
    component.user = { name: 'Alice' };
    expect(component.initials).toBe('A');
  });

  it('should format joined date', () => {
    component.user = { createdAt: '2024-01-01T00:00:00Z' };
    expect(component.joinedDate).toContain('Jan');
  });

  /* =====================================================
     LOGOUT
   ===================================================== */
  it('should logout user', () => {
    component.logout();
    expect(api.logout).toHaveBeenCalled();
  });

});
