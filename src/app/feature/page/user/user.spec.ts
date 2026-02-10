import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersPage } from './user';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';
describe('UsersPage', () => {
  let component: UsersPage;
  let fixture: ComponentFixture<UsersPage>;
  let api: jasmine.SpyObj<ApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  const users$ = new BehaviorSubject<any[]>([]);

  const mockUsers = [
    {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      permissions: { createUser: true, createTask: true, editTask: true, deleteTask: true },
    },
    {
      id: '2',
      name: 'User',
      email: 'user@test.com',
      permissions: { createUser: false, createTask: true, editTask: false, deleteTask: false },
    },
  ];

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', [
      'getUsers$',
      'hasPermission',
      'createUser',
      'updateUser',
      'deleteUser',
      'ensureTasksLoaded$',
      'setTaskFilterUser',
      'user',
    ]);

    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    api.getUsers$.and.returnValue(users$.asObservable());
    api.user.and.returnValue({ id: '999' }); // current user excluded
    api.hasPermission.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        UsersPage,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ToastrService, useValue: toastr },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPage);
    component = fixture.componentInstance;
  });

  /* =====================================================
     INIT / LOAD
  ===================================================== */

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users and exclude current user', fakeAsync(() => {
    fixture.detectChanges();
    users$.next(mockUsers);
    tick();

    expect(component.users.length).toBe(2);
    expect(component.loading).toBeFalse();
    expect(component.dataLoaded).toBeTrue();
  }));

  /* =====================================================
     SEARCH & FILTER
  ===================================================== */

  it('should filter users by search text', fakeAsync(() => {
    fixture.detectChanges();
    users$.next(mockUsers);
    tick();

    component.searchText = 'admin';
    component.filterBySearch();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Admin');
  }));

  /* =====================================================
     PERMISSIONS
  ===================================================== */

  it('should block add user if permission denied', () => {
    api.hasPermission.and.returnValue(false);

    component.openAdd();

    expect(toastr.warning).toHaveBeenCalledWith('You do not have permission');
    expect(component.sidebarOpen).toBeFalse();
  });

  /* =====================================================
     ADD USER
  ===================================================== */

  it('should open add user sidebar', () => {
    component.openAdd();

    expect(component.sidebarOpen).toBeTrue();
    expect(component.isEditMode).toBeFalse();
  });

  it('should create user successfully', fakeAsync(() => {
    api.createUser.and.returnValue(of({}));

    component.openAdd();
    component.adminForm.patchValue({
      name: 'New User',
      email: 'new@test.com',
      password: 'Abc@1234',
      createUser: true,
    });

    component.submitAdminForm();
    tick();

    expect(api.createUser).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('User created');
    expect(component.userSaving).toBeFalse();
  }));

  /* =====================================================
     EDIT USER
  ===================================================== */

  it('should open edit mode and disable fields', () => {
    component.openEdit(mockUsers[0]);

    expect(component.isEditMode).toBeTrue();
    expect(component.adminForm.get('name')?.disabled).toBeTrue();
    expect(component.adminForm.get('email')?.disabled).toBeTrue();
  });

  it('should update user permissions', fakeAsync(() => {
    api.updateUser.and.returnValue(of({}));

    component.openEdit(mockUsers[0]);
    component.adminForm.patchValue({ createTask: false });

    component.submitAdminForm();
    tick();

    expect(api.updateUser).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('User updated');
  }));

  /* =====================================================
     DELETE USER
  ===================================================== */

  it('should show task block popup if user has assigned tasks', fakeAsync(() => {
    api.ensureTasksLoaded$.and.returnValue(
      of([{ assignedUsers: ['1'] }])
    );

    component.deleteUser(mockUsers[0]);
    tick();

    expect(component.showTaskBlockPopup).toBeTrue();
  }));

  it('should confirm and delete user', fakeAsync(() => {
    api.ensureTasksLoaded$.and.returnValue(of([]));
    api.deleteUser.and.returnValue(of({}));

    component.deleteUser(mockUsers[0]);
    tick();

    component.confirmFinalDelete();
    tick();

    expect(api.deleteUser).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('User deleted successfully');
  }));

  /* =====================================================
     STATS
  ===================================================== */

  it('should compute permission statistics correctly', fakeAsync(() => {
    fixture.detectChanges();
    users$.next(mockUsers);
    tick();

    expect(component.totalUsers).toBe(2);
    expect(component.manageUserCount).toBe(1);
    expect(component.createEditTaskCount).toBe(2);
    expect(component.deleteTaskCount).toBe(1);
  }));

  /* =====================================================
     NAVIGATION
  ===================================================== */

  it('should navigate to user tasks', () => {
    component.userToDelete = mockUsers[0];

    component.goToUserTasks();

    expect(api.setTaskFilterUser).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  /* =====================================================
     CLEANUP
  ===================================================== */

 



  it('should unsubscribe on destroy', () => {
    const sub = new Subscription();
    spyOn(sub, 'unsubscribe');

    // 🔑 Manually assign subscription
    (component as any).sub = sub;

    component.ngOnDestroy();

    expect(sub.unsubscribe).toHaveBeenCalled();
  });


});