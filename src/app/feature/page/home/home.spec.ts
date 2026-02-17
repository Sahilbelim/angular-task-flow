// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Home } from './home';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { BehaviorSubject } from 'rxjs';
// import { Chart } from 'chart.js';

// class ApiServiceMock {
//   private tasks$ = new BehaviorSubject<any[]>([]);
//   private users$ = new BehaviorSubject<any[]>([]);

//   getTasks$() {
//     return this.tasks$.asObservable();
//   }

//   getUsers$() {
//     return this.users$.asObservable();
//   }

//   emitTasks(data: any[]) {
//     this.tasks$.next(data);
//   }

//   emitUsers(data: any[]) {
//     this.users$.next(data);
//   }
// }

// describe('Home', () => {
//   let component: Home;
//   let fixture: ComponentFixture<Home>;
//   let api: ApiServiceMock;

//   beforeEach(async () => {

//     // ✅ LEGAL place for spies
//     spyOn(Chart.prototype, 'destroy').and.callFake(() => { });
//     spyOn(Chart as any, 'register').and.callFake(() => { });

//     await TestBed.configureTestingModule({
//       imports: [Home],
//       providers: [{ provide: ApiService, useClass: ApiServiceMock }],
//     }).compileComponents();

//     fixture = TestBed.createComponent(Home);
//     component = fixture.componentInstance;
//     api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should compute stats when data arrives', fakeAsync(() => {
//     fixture.detectChanges(); // ngOnInit

//     api.emitTasks([
//       { status: 'completed' },
//       { status: 'pending' },
//     ]);

//     api.emitUsers([
//       { permissions: { createUser: true } },
//     ]);

//     tick();
//     fixture.detectChanges();

//     expect(component.taskStats.total).toBe(2);
//     expect(component.taskStats.completed).toBe(1);
//     expect(component.taskStats.pending).toBe(1);
//     expect(component.userStats.totalUsers).toBe(1);
//   }));

//   it('should cleanup on destroy', () => {
//     const destroySpy = spyOn<any>(component, 'destroyCharts');
//     component.ngOnDestroy();
//     expect(destroySpy).toHaveBeenCalled();
//   });
// });


// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Home } from './home';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { BehaviorSubject } from 'rxjs';
// import { Chart } from 'chart.js';

// /* =====================================================
//    MOCK API SERVICE (MATCHES REAL STORE STRUCTURE)
//    ===================================================== */
// class ApiServiceMock {

//   initialDataResolved$ = new BehaviorSubject<boolean>(false);
//   tasks$ = new BehaviorSubject<any[]>([]);
//   users$ = new BehaviorSubject<any[]>([]);

//   emitResolved() {
//     this.initialDataResolved$.next(true);
//   }

//   emitTasks(tasks: any[]) {
//     this.tasks$.next(tasks);
//   }

//   emitUsers(users: any[]) {
//     this.users$.next(users);
//   }
// }

// describe('Home Component', () => {

//   let component: Home;
//   let fixture: ComponentFixture<Home>;
//   let api: ApiServiceMock;

//   /* =====================================================
//      GLOBAL CHART MOCK (VERY IMPORTANT)
//      Prevents canvas errors in test environment
//      ===================================================== */
//   // beforeAll(() => {
//   //   spyOn(Chart.prototype, 'destroy').and.callFake(() => { });
//   //   spyOn(window as any, 'requestAnimationFrame').and.callFake(cb => cb());
//   //   spyOn(document, 'getElementById').and.returnValue({
//   //     getContext: () => ({})
//   //   } as any);

//   //   spyOn(Chart as any, 'register').and.callFake(() => { });
//   //   spyOn(window as any, 'setTimeout').and.callFake((cb: any) => cb());
//   // });

//   beforeAll(() => {

//     spyOn(Chart.prototype, 'destroy').and.callFake(() => { });

//     spyOn(window, 'requestAnimationFrame').and.callFake(
//       (cb: FrameRequestCallback): number => {
//         cb(0);
//         return 1;
//       }
//     );

//     spyOn(document, 'getElementById').and.returnValue({
//       getContext: () => ({})
//     } as any);

//     spyOn(Chart as any, 'register').and.callFake(() => { });

//     // 🔥 CORRECT setTimeout MOCK
//     spyOn(window, 'setTimeout').and.callFake(
//       ((handler: TimerHandler): number => {
//         if (typeof handler === 'function') {
//           handler();
//         }
//         return 1;
//       }) as any
//     );
//   });

//   beforeEach(async () => {

//     await TestBed.configureTestingModule({
//       imports: [Home],
//       providers: [
//         { provide: ApiService, useClass: ApiServiceMock }
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(Home);
//     component = fixture.componentInstance;
//     api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
//   });

//   /* =====================================================
//      CREATION
//      ===================================================== */
//   it('should create component', () => {
//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      DATA HYDRATION FLOW
//      Should wait until initialDataResolved = true
//      ===================================================== */
//   it('should stay loading until hydration resolves', fakeAsync(() => {

//     fixture.detectChanges(); // ngOnInit
//     tick();

//     expect(component.loading).toBeTrue();
//     expect(component.dataReady).toBeFalse();
//   }));

//   /* =====================================================
//      COMPUTE TASK STATS
//      ===================================================== */
//   it('should compute task statistics correctly', fakeAsync(() => {

//     fixture.detectChanges();

//     api.emitResolved();

//     api.emitTasks([
//       { status: 'completed' },
//       { status: 'completed' },
//       { status: 'pending' },
//       { status: 'in-progress' },
//     ]);

//     api.emitUsers([]);

//     tick();
//     fixture.detectChanges();

//     expect(component.taskStats.total).toBe(4);
//     expect(component.taskStats.completed).toBe(2);
//     expect(component.taskStats.pending).toBe(1);
//     expect(component.taskStats.inProgress).toBe(1);
//   }));

//   /* =====================================================
//      COMPUTE USER STATS
//      ===================================================== */
//   it('should compute user permission statistics', fakeAsync(() => {

//     fixture.detectChanges();

//     api.emitResolved();

//     api.emitUsers([
//       { permissions: { createUser: true, createTask: true } },
//       { permissions: { editTask: true } },
//       { permissions: { deleteTask: true } },
//     ]);

//     api.emitTasks([]);

//     tick();
//     fixture.detectChanges();

//     expect(component.userStats.totalUsers).toBe(3);
//     expect(component.userStats.canCreateUser).toBe(1);
//     expect(component.userStats.canCreateTask).toBe(1);
//     expect(component.userStats.canEditTask).toBe(1);
//     expect(component.userStats.canDeleteTask).toBe(1);
//   }));

//   /* =====================================================
//      DATA READY STATE
//      ===================================================== */
//   it('should set dataReady true after data arrives', fakeAsync(() => {

//     fixture.detectChanges();

//     api.emitResolved();
//     api.emitTasks([{ status: 'pending' }]);
//     api.emitUsers([{ permissions: {} }]);

//     tick();
//     fixture.detectChanges();

//     expect(component.loading).toBeFalse();
//     expect(component.dataReady).toBeTrue();
//   }));

//   /* =====================================================
//      CLEANUP
//      ===================================================== */
//   it('should destroy charts on destroy', () => {

//     const destroySpy = spyOn<any>(component, 'destroyCharts');

//     component.ngOnDestroy();

//     expect(destroySpy).toHaveBeenCalled();
//   });

// });

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Home } from './home';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { BehaviorSubject } from 'rxjs';
import { Chart } from 'chart.js';

/* =====================================================
   MOCK API SERVICE (MATCHES REAL STORE STRUCTURE)
   ===================================================== */
class ApiServiceMock {

  initialDataResolved$ = new BehaviorSubject<boolean>(false);
  tasks$ = new BehaviorSubject<any[]>([]);
  users$ = new BehaviorSubject<any[]>([]);

  emitResolved() {
    this.initialDataResolved$.next(true);
  }

  emitTasks(tasks: any[]) {
    this.tasks$.next(tasks);
  }

  emitUsers(users: any[]) {
    this.users$.next(users);
  }
}

/* =====================================================
   ⭐ NEW — MOCK COMMON API SERVICE
   Prevent Angular from creating HttpClient
   ===================================================== */
class CommonApiServiceMock { }

describe('Home Component', () => {

  let component: Home;
  let fixture: ComponentFixture<Home>;
  let api: ApiServiceMock;

  /* =====================================================
     GLOBAL CHART MOCK (VERY IMPORTANT)
     Prevents canvas errors in test environment
     ===================================================== */
  beforeAll(() => {

    spyOn(Chart.prototype, 'destroy').and.callFake(() => { });

    spyOn(window, 'requestAnimationFrame').and.callFake(
      (cb: FrameRequestCallback): number => {
        cb(0);
        return 1;
      }
    );

    spyOn(document, 'getElementById').and.returnValue({
      getContext: () => ({})
    } as any);

    spyOn(Chart as any, 'register').and.callFake(() => { });

    // Correct setTimeout mock
    spyOn(window, 'setTimeout').and.callFake(
      ((handler: TimerHandler): number => {
        if (typeof handler === 'function') {
          handler();
        }
        return 1;
      }) as any
    );
  });

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: ApiService, useClass: ApiServiceMock },

        // ⭐⭐⭐ CRITICAL FIX
        { provide: CommonApiService, useClass: CommonApiServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
  });

  /* =====================================================
     CREATION
     ===================================================== */
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /* =====================================================
     DATA HYDRATION FLOW
     ===================================================== */
  it('should stay loading until hydration resolves', fakeAsync(() => {

    fixture.detectChanges();
    tick();

    expect(component.loading).toBeTrue();
    expect(component.dataReady).toBeFalse();
  }));

  /* =====================================================
     COMPUTE TASK STATS
     ===================================================== */
  it('should compute task statistics correctly', fakeAsync(() => {

    fixture.detectChanges();

    api.emitResolved();

    api.emitTasks([
      { status: 'completed' },
      { status: 'completed' },
      { status: 'pending' },
      { status: 'in-progress' },
    ]);

    api.emitUsers([]);

    tick();
    fixture.detectChanges();

    expect(component.taskStats.total).toBe(4);
    expect(component.taskStats.completed).toBe(2);
    expect(component.taskStats.pending).toBe(1);
    expect(component.taskStats.inProgress).toBe(1);
  }));

  /* =====================================================
     COMPUTE USER STATS
     ===================================================== */
  it('should compute user permission statistics', fakeAsync(() => {

    fixture.detectChanges();

    api.emitResolved();

    api.emitUsers([
      { permissions: { createUser: true, createTask: true } },
      { permissions: { editTask: true } },
      { permissions: { deleteTask: true } },
    ]);

    api.emitTasks([]);

    tick();
    fixture.detectChanges();

    expect(component.userStats.totalUsers).toBe(3);
    expect(component.userStats.canCreateUser).toBe(1);
    expect(component.userStats.canCreateTask).toBe(1);
    expect(component.userStats.canEditTask).toBe(1);
    expect(component.userStats.canDeleteTask).toBe(1);
  }));

  /* =====================================================
     DATA READY STATE
     ===================================================== */
  it('should set dataReady true after data arrives', fakeAsync(() => {

    fixture.detectChanges();

    api.emitResolved();
    api.emitTasks([{ status: 'pending' }]);
    api.emitUsers([{ permissions: {} }]);

    tick();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.dataReady).toBeTrue();
  }));

  /* =====================================================
     CLEANUP
     ===================================================== */
  it('should destroy charts on destroy', () => {

    const destroySpy = spyOn<any>(component, 'destroyCharts');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
  });

});
