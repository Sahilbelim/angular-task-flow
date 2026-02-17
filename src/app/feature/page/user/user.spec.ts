import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersPage } from './user';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';

/* =====================================================
   MOCK SERVICES
===================================================== */

class ApiServiceMock {

  users$ = new BehaviorSubject<any[]>([]);
  tasks$ = new BehaviorSubject<any[]>([]);
  initialDataResolved$ = new BehaviorSubject<boolean>(true);

  currentUser = jasmine.createSpy().and.returnValue({ id: '999' });
  hasPermission = jasmine.createSpy().and.returnValue(true);

  addUser = jasmine.createSpy();
  updateUser = jasmine.createSpy();
  deleteUser = jasmine.createSpy();
  setTaskFilterUser = jasmine.createSpy();
}

class CommonApiMock {
  post = jasmine.createSpy().and.returnValue(of({ id: '10' }));
  put = jasmine.createSpy().and.returnValue(of({ id: '1' }));
  delete = jasmine.createSpy().and.returnValue(of({}));
}

class ToastrMock {
  success = jasmine.createSpy();
  error = jasmine.createSpy();
  warning = jasmine.createSpy();
}

class RouterMock {
  navigate = jasmine.createSpy().and.returnValue(Promise.resolve(true));
}

describe('UsersPage', () => {

  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;
  let api: ApiServiceMock;
  let http: CommonApiMock;
  let toast: ToastrMock;
  let router: RouterMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [
        { provide: ApiService, useClass: ApiServiceMock },
        { provide: CommonApiService, useClass: CommonApiMock },
        { provide: ToastrService, useClass: ToastrMock },
        { provide: Router, useClass: RouterMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;

    api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
    http = TestBed.inject(CommonApiService) as unknown as CommonApiMock;
    toast = TestBed.inject(ToastrService) as unknown as ToastrMock;
    router = TestBed.inject(Router) as unknown as RouterMock;

    fixture.detectChanges();
  });

  /* =====================================================
     LOAD USERS FROM STORE
  ===================================================== */
  it('should load users after hydration', fakeAsync(() => {

    api.users$.next([
      { id: '1', name: 'Admin' },
      { id: '999', name: 'Me' } // current user removed
    ]);

    tick();

    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('Admin');
    expect(component.loading).toBeFalse();
  }));

  /* =====================================================
     SEARCH FILTER
  ===================================================== */
  it('should filter users by search', () => {
    component.users = [
      { name: 'John', email: 'john@test.com' },
      { name: 'Jane', email: 'jane@test.com' }
    ];

    component.searchText = 'john';
    component['applyFilter']();

    expect(component.filteredUsers.length).toBe(1);
  });

  /* =====================================================
     CREATE USER
  ===================================================== */
  it('should create user and update store', fakeAsync(() => {

    component.openAdd();

    component.adminForm.patchValue({
      name: 'New',
      email: 'new@test.com',
      password: 'Abc@1234',
      createUser: true
    });

    component.submitAdminForm();
    tick();

    expect(http.post).toHaveBeenCalled();
    expect(api.addUser).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
  }));

  /* =====================================================
     EDIT USER
  ===================================================== */
  it('should update user permissions', fakeAsync(() => {

    component.openEdit({
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      permissions: { createUser: true }
    });

    component.adminForm.patchValue({ deleteTask: true });

    component.submitAdminForm();
    tick();

    expect(http.put).toHaveBeenCalled();
    expect(api.updateUser).toHaveBeenCalled();
  }));

  /* =====================================================
     DELETE USER
  ===================================================== */
  it('should block delete if user has tasks', fakeAsync(() => {

    api.tasks$.next([{ assignedUsers: ['1'] }]);

    component.deleteUser({ id: '1' });
    tick();

    expect(component.showTaskBlockPopup).toBeTrue();
  }));

  it('should delete user if no tasks', fakeAsync(() => {

    api.tasks$.next([]);

    component.deleteUser({ id: '1' });
    tick();

    component.confirmFinalDelete();
    tick();

    expect(http.delete).toHaveBeenCalled();
    expect(api.deleteUser).toHaveBeenCalled();
  }));

  /* =====================================================
     NAVIGATION
  ===================================================== */
  it('should navigate to tasks with filter', fakeAsync(() => {

    component.userToDelete = { id: '5' };

    component.goToUserTasks();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    expect(api.setTaskFilterUser).toHaveBeenCalledWith('5');
  }));

});
