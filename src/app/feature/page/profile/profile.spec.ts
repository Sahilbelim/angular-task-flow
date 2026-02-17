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
