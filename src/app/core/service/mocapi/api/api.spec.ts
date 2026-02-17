// import { TestBed } from '@angular/core/testing';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';
// import { Router } from '@angular/router';
// import { ApiService } from './api';
// import { take } from 'rxjs';
// import { skip } from 'rxjs';


// describe('ApiService', () => {
//   let service: ApiService;
//   let httpMock: HttpTestingController;
//   let routerSpy: jasmine.SpyObj<Router>;

//   const API = 'https://696dca5ad7bacd2dd7148b1a.mockapi.io/task';

//   const mockUser = {
//     id: '1',
//     email: 'test@test.com',
//     password: '123456',
//     parentId: null,
//     permissions: {
//       createUser: true,
//       createTask: true,
//     },
//   };

//   beforeEach(() => {
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         ApiService,
//         { provide: Router, useValue: routerSpy },
//       ],
//     });

//     service = TestBed.inject(ApiService);
//     httpMock = TestBed.inject(HttpTestingController);

//     // 🔥 reset internal caches (IMPORTANT)
//     (service as any).usersLoaded = false;
//     (service as any).tasksLoaded = false;
//     (service as any).countriesLoaded = false;
//     (service as any).currentUserLoaded = false;

//     localStorage.clear();
//   });

//   afterEach(() => {
//     httpMock.verify();
//     localStorage.clear();
//   });

//   /* =====================================================
//      SERVICE INIT
//   ===================================================== */

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   /* =====================================================
//      AUTH / SESSION
//   ===================================================== */

//   it('should register a new user and auto login', () => {
//     service.register({ email: 'new@test.com' }).subscribe(user => {
//       expect(user.email).toBe('new@test.com');
//       expect(service.isLoggedIn()).toBeTrue();
//     });

//     const getReq = httpMock.expectOne(`${API}/user`);
//     getReq.flush([]);

//     const postReq = httpMock.expectOne(`${API}/user`);
//     postReq.flush({ id: '10', email: 'new@test.com' });
//   });

//   it('should fail register if email already exists', (done) => {
//     service.register({ email: 'test@test.com' }).subscribe({
//       error: err => {
//         expect(err.message).toContain('Email already registered');
//         done();
//       },
//     });

//     const req = httpMock.expectOne(`${API}/user`);
//     req.flush([{ email: 'test@test.com' }]);
//   });

//   it('should login successfully', () => {
//     service.login('test@test.com', '123456').subscribe(user => {
//       expect(user.email).toBe('test@test.com');
//       expect(service.isLoggedIn()).toBeTrue();
//     });

//     const req = httpMock.expectOne(`${API}/user?email=test@test.com`);
//     req.flush([mockUser]);
//   });

//   it('should logout and clear cache', () => {
//     localStorage.setItem('user', JSON.stringify(mockUser));
//     service.user.set(mockUser);

//     service.logout();

//     expect(service.isLoggedIn()).toBeFalse();
//     expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
//   });

//   /* =====================================================
//      USERS
//   ===================================================== */
 
//   it('should load users once and cache them', () => {
//     service.user.set(mockUser);
//     (service as any).usersLoaded = false;

//     service.getUsers$()
//       .pipe(
//         skip(1), // 🚀 skip initial empty []
//         take(1)
//       )
//       .subscribe(users => {
//         expect(users.length).toBe(1);
//       });

//     const req = httpMock.expectOne(`${API}/user`);
//     req.flush([mockUser]);

//     // second call → cached → no HTTP
//     service.getUsers$().pipe(take(1)).subscribe();
//     httpMock.expectNone(`${API}/user`);
//   });

//   it('should deny create user without permission', () => {
//     // 🔥 FULL RESET
//     service.user.set(null);
//     localStorage.clear();

//     const childUser = {
//       id: '2',
//       email: 'child@test.com',
//       password: '123456',
//       parentId: '1',   // ✅ NOT admin
//       permissions: {}, // ❌ no permissions
//     };

//     service.user.set(childUser);

//     service.createUser({}).subscribe({
//       next: () => fail('should not succeed'),
//       error: err => {
//         expect(err.message).toBe('Permission denied');
//       },
//     });

//     // ✅ NO HTTP CALL MUST HAPPEN
//     httpMock.expectNone(`${API}/user`);
//   });


  
//   /* =====================================================
//      TASKS
//   ===================================================== */

//   it('should load tasks and cache them', () => {
//     service.user.set(mockUser);
//     (service as any).tasksLoaded = false;

//     service.getTasks$()
//       .pipe(
//         skip(1), // 🚀 skip initial empty emission
//         take(1)
//       )
//       .subscribe(tasks => {
//         expect(tasks.length).toBe(1);
//       });

//     const req = httpMock.expectOne(`${API}/tasks`);
//     req.flush([{ id: '1', createdBy: '1' }]);

//     // second call → cached
//     service.getTasks$().pipe(take(1)).subscribe();
//     httpMock.expectNone(`${API}/tasks`);
//   });


//   it('should create task when permitted', () => {
//     service.user.set(mockUser);

//     service.createTask({ title: 'Task 1' }).subscribe(task => {
//       expect(task.title).toBe('Task 1');
//     });

//     const req = httpMock.expectOne(`${API}/tasks`);
//     req.flush({ id: '1', title: 'Task 1' });
//   });

//   it('should update task and update cache', () => {
//     service['tasksSubject'].next([{ id: '1', title: 'Old' }]);

//     service.updateTask('1', { title: 'New' }).subscribe();

//     const req = httpMock.expectOne(`${API}/tasks/1`);
//     req.flush({ id: '1', title: 'New' });

//     expect(service.tasksSnapshot[0].title).toBe('New');
//   });

//   it('should delete task and update cache', () => {
//     service['tasksSubject'].next([{ id: '1' }]);

//     service.deleteTask('1').subscribe();

//     const req = httpMock.expectOne(`${API}/tasks/1`);
//     req.flush({});

//     expect(service.tasksSnapshot.length).toBe(0);
//   });

//   /* =====================================================
//      OPTIMISTIC UPDATES
//   ===================================================== */

//   it('should optimistically update task', () => {
//     service['tasksSubject'].next([{ id: '1', title: 'Old' }]);

//     service.updateTaskOptimistic('1', { title: 'New' }).subscribe();

//     expect(service.tasksSnapshot[0].title).toBe('New');

//     const req = httpMock.expectOne(`${API}/tasks/1`);
//     req.flush({});
//   });

//   it('should optimistically create task and replace temp id', () => {
//     service.user.set(mockUser);

//     service.createTaskOptimistic({ title: 'Temp' }).subscribe();

//     expect(service.tasksSnapshot[0].id.startsWith('tmp-')).toBeTrue();

//     const req = httpMock.expectOne(`${API}/tasks`);
//     req.flush({ id: '99', title: 'Temp' });

//     expect(service.tasksSnapshot[0].id).toBe('99');
//   });

//   /* =====================================================
//      PROFILE / PASSWORD
//   ===================================================== */

//   it('should update profile and sync user', () => {
//     service.user.set(mockUser);

//     service.updateProfile('1', { name: 'Updated' }).subscribe();

//     const req = httpMock.expectOne(`${API}/user/1`);
//     req.flush({ ...mockUser, name: 'Updated' });

//     expect(service.currentUser()?.name).toBe('Updated');
//   });

//   it('should change password when current password matches', () => {
//     service.user.set(mockUser);

//     service.changePassword('1', '123456', 'newpass').subscribe();

//     const getReq = httpMock.expectOne(`${API}/user/1`);
//     getReq.flush(mockUser);

//     const putReq = httpMock.expectOne(`${API}/user/1`);
//     expect(putReq.request.body.password).toBe('newpass');
//     putReq.flush({});
//   });

//   /* =====================================================
//      COUNTRIES
//   ===================================================== */


//   it('should load countries once', () => {
//     (service as any).countriesLoaded = false; // ensure fresh state

//     service.getCountries$()
//       .pipe(
//         skip(1), // 🚀 skip initial []
//         take(1)
//       )
//       .subscribe(list => {
//         expect(list).toEqual(['India', 'USA']);
//       });

//     const req = httpMock.expectOne(
//       'https://restcountries.com/v3.1/all?fields=name'
//     );

//     req.flush([
//       { name: { common: 'India' } },
//       { name: { common: 'USA' } },
//     ]);

//     // second call → cached → no HTTP
//     service.getCountries$().pipe(take(1)).subscribe();
//     httpMock.expectNone(
//       'https://restcountries.com/v3.1/all?fields=name'
//     );
//   });

// });


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
