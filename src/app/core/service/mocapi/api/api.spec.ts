import { TestBed } from '@angular/core/testing';
import { ApiService } from './api';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommonApiService } from './common-api.service';

describe('ApiService (STORE)', () => {

  let service: ApiService;
  let router: jasmine.SpyObj<Router>;
  let http: jasmine.SpyObj<CommonApiService>;

  const mockUser = {
    id: '1',
    parentId: null,
    permissions: { createUser: true }
  };

  beforeEach(() => {

    router = jasmine.createSpyObj('Router', ['navigate']);
    http = jasmine.createSpyObj('CommonApiService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: Router, useValue: router },
        { provide: CommonApiService, useValue: http }
      ]
    });

    service = TestBed.inject(ApiService);
    localStorage.clear();
  });

  /* =====================================================
     SESSION
  ===================================================== */

  it('should set session and store user', () => {
    service.setSession(mockUser);

    expect(service.currentUser()).toEqual(mockUser);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
  });

  it('should logout and clear state', () => {
    service.setSession(mockUser);
    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update current user', () => {
    service.setSession(mockUser);

    service.updateCurrentUser({ ...mockUser, name: 'Updated' });

    expect(service.currentUser()?.name).toBe('Updated');
  });

  /* =====================================================
     USERS STORE
  ===================================================== */

  it('should add user to store', (done) => {
    service.setUsers([]);
    service.addUser({ id: '2' });

    service.users$.subscribe(users => {
      expect(users.length).toBe(1);
      done();
    });
  });

  it('should update user in store', (done) => {
    service.setUsers([{ id: '2', name: 'Old' }]);
    service.updateUser('2', { name: 'New' });

    service.users$.subscribe(users => {
      expect(users[0].name).toBe('New');
      done();
    });
  });

  it('should delete user from store', (done) => {
    service.setUsers([{ id: '2' }]);
    service.deleteUser('2');

    service.users$.subscribe(users => {
      expect(users.length).toBe(0);
      done();
    });
  });

  /* =====================================================
     TASK STORE
  ===================================================== */

  it('should add task', (done) => {
    service.setTasks([]);
    service.addTask({ id: '1' });

    service.tasks$.subscribe(tasks => {
      expect(tasks.length).toBe(1);
      done();
    });
  });

  it('should update task', (done) => {
    service.setTasks([{ id: '1', title: 'Old' }]);
    service.updateTask('1', { title: 'New' });

    service.tasks$.subscribe(tasks => {
      expect(tasks[0].title).toBe('New');
      done();
    });
  });

  it('should delete task', (done) => {
    service.setTasks([{ id: '1' }]);
    service.deleteTask('1');

    service.tasks$.subscribe(tasks => {
      expect(tasks.length).toBe(0);
      done();
    });
  });

  /* =====================================================
     PERMISSIONS
  ===================================================== */

  it('should allow admin all permissions', () => {
    service.setSession({ id: '1', parentId: null });

    expect(service.hasPermission('anything')).toBeTrue();
  });

  it('should deny permission for child user', () => {
    service.setSession({
      id: '2',
      parentId: '1',
      permissions: { createTask: false }
    });

    expect(service.hasPermission('createTask')).toBeFalse();
  });

  /* =====================================================
     CACHE LOADING
  ===================================================== */

  it('should load users once', () => {
    http.get.and.returnValue(of([mockUser]));

    service.setSession(mockUser);
    service.getUsers$().subscribe();
    service.getUsers$().subscribe();

    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('should load tasks once', () => {
    http.get.and.returnValue(of([{ id: 't1', createdBy: '1' }]));

    service.setSession(mockUser);
    service.getTasks$().subscribe();
    service.getTasks$().subscribe();

    expect(http.get).toHaveBeenCalledTimes(1);
  });

});
