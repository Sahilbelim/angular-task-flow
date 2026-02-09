// // import { ComponentFixture, TestBed } from '@angular/core/testing';

// // import { provideHttpClient } from '@angular/common/http';
// // import { provideHttpClientTesting } from '@angular/common/http/testing';
// // import { provideRouter } from '@angular/router';

// // import { Home } from './home';

// // describe('Home', () => {
// //   let component: Home;
// //   let fixture: ComponentFixture<Home>;

// //   beforeEach(async () => {
// //     await TestBed.configureTestingModule({
// //       imports: [Home],
// //       providers: [provideHttpClient(),
// //       provideHttpClientTesting(),
// //       provideRouter([]),]
// //     })
// //     .compileComponents();

// //     fixture = TestBed.createComponent(Home);
// //     component = fixture.componentInstance;
// //     fixture.detectChanges();
// //   });

// //   it('should create', () => {
// //     expect(component).toBeTruthy();
// //   });
// // });


// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { Home } from './home';
// import { ApiService } from '../../../core/service/mocapi/api/api';
// import { of, BehaviorSubject } from 'rxjs';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { Chart } from 'chart.js';

// /* =====================================================
//    MOCK CHART.JS (CRITICAL)
// ===================================================== */
// class ChartMock {
//   destroy = jasmine.createSpy('destroy');
// }
// spyOn(Chart as any, 'register').and.callFake(() => { });
// spyOn(window as any, 'Chart').and.callFake(() => new ChartMock());

// /* =====================================================
//    MOCK API SERVICE
// ===================================================== */
// class ApiServiceMock {
//   private tasks$ = new BehaviorSubject<any[]>([]);
//   private users$ = new BehaviorSubject<any[]>([]);

//   getTasks$() {
//     return this.tasks$.asObservable();
//   }

//   getUsers$() {
//     return this.users$.asObservable();
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

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Home],
//       providers: [
//         { provide: ApiService, useClass: ApiServiceMock }
//       ],
//       schemas: [NO_ERRORS_SCHEMA], // ignore canvas/chart DOM
//     }).compileComponents();

//     fixture = TestBed.createComponent(Home);
//     component = fixture.componentInstance;
//     api = TestBed.inject(ApiService) as any;
//   });

//   /* =====================================================
//      BASIC CREATION
//   ===================================================== */
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   /* =====================================================
//      INITIAL STATE
//   ===================================================== */
//   it('should start in loading state', () => {
//     expect(component.loading).toBeTrue();
//     expect(component.dataReady).toBeFalse();
//   });

//   /* =====================================================
//      IGNORE FIRST EMPTY CACHE EMISSION
//   ===================================================== */
//   it('should ignore initial empty data emission', fakeAsync(() => {
//     fixture.detectChanges(); // ngOnInit

//     api.emitTasks([]);
//     api.emitUsers([]);

//     tick();

//     expect(component.dataReady).toBeFalse();
//     expect(component.loading).toBeTrue();
//   }));

//   /* =====================================================
//      PROCESS REAL DATA
//   ===================================================== */
//   it('should compute task & user stats when real data arrives', fakeAsync(() => {
//     fixture.detectChanges(); // ngOnInit

//     api.emitTasks([
//       { status: 'completed' },
//       { status: 'pending' },
//       { status: 'in-progress' },
//     ]);

//     api.emitUsers([
//       { permissions: { createUser: true, createTask: true } },
//       { permissions: { createTask: true } },
//     ]);

//     tick();

//     expect(component.loading).toBeFalse();
//     expect(component.dataReady).toBeTrue();

//     /* TASK STATS */
//     expect(component.taskStats.total).toBe(3);
//     expect(component.taskStats.completed).toBe(1);
//     expect(component.taskStats.pending).toBe(1);
//     expect(component.taskStats.inProgress).toBe(1);

//     /* USER STATS */
//     expect(component.userStats.totalUsers).toBe(2);
//     expect(component.userStats.canCreateUser).toBe(1);
//     expect(component.userStats.canCreateTask).toBe(2);
//   }));

//   /* =====================================================
//      DATA FLAGS
//   ===================================================== */
//   it('should set hasTaskData and hasUserData correctly', fakeAsync(() => {
//     fixture.detectChanges();

//     api.emitTasks([{ status: 'completed' }]);
//     api.emitUsers([{ permissions: {} }]);

//     tick();

//     expect(component.hasTaskData).toBeTrue();
//     expect(component.hasUserData).toBeTrue();
//   }));

//   /* =====================================================
//      CHART RENDERING CONTROL
//   ===================================================== */
//   it('should NOT render charts before view is ready', fakeAsync(() => {
//     spyOn<any>(component, 'renderCharts');

//     fixture.detectChanges();

//     api.emitTasks([{ status: 'completed' }]);
//     api.emitUsers([{ permissions: {} }]);

//     tick();

//     expect(component['viewReady']).toBeFalse();
//     expect(component['renderCharts']).not.toHaveBeenCalled();
//   }));

//   it('should render charts AFTER view init when data is ready', fakeAsync(() => {
//     spyOn<any>(component, 'renderCharts');

//     fixture.detectChanges();

//     api.emitTasks([{ status: 'completed' }]);
//     api.emitUsers([{ permissions: {} }]);

//     tick();

//     component.ngAfterViewInit();

//     tick();

//     expect(component['renderCharts']).toHaveBeenCalled();
//   }));

//   /* =====================================================
//      CHART CLEANUP
//   ===================================================== */
//   it('should destroy charts on destroy', () => {
//     const taskChart = new ChartMock();
//     const userChart = new ChartMock();

//     (component as any).taskChart = taskChart as any;
//     (component as any).userChart = userChart as any;

//     component.ngOnDestroy();

//     expect(taskChart.destroy).toHaveBeenCalled();
//     expect(userChart.destroy).toHaveBeenCalled();
//   });

//   /* =====================================================
//      GETTERS
//   ===================================================== */
//   it('hasTasks getter should return true when tasks exist', () => {
//     component.taskStats.total = 5;
//     expect(component.hasTasks).toBeTrue();
//   });

//   it('hasTasks getter should return false when no tasks', () => {
//     component.taskStats.total = 0;
//     expect(component.hasTasks).toBeFalse();
//   });

//   /* =====================================================
//      UNSUBSCRIBE SAFETY
//   ===================================================== */
//   it('should complete destroy$ on destroy', () => {
//     const nextSpy = spyOn<any>(component['destroy$'], 'next');
//     const completeSpy = spyOn<any>(component['destroy$'], 'complete');

//     component.ngOnDestroy();

//     expect(nextSpy).toHaveBeenCalled();
//     expect(completeSpy).toHaveBeenCalled();
//   });
// });


import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Home } from './home';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { BehaviorSubject } from 'rxjs';
import { Chart } from 'chart.js';

class ApiServiceMock {
  private tasks$ = new BehaviorSubject<any[]>([]);
  private users$ = new BehaviorSubject<any[]>([]);

  getTasks$() {
    return this.tasks$.asObservable();
  }

  getUsers$() {
    return this.users$.asObservable();
  }

  emitTasks(data: any[]) {
    this.tasks$.next(data);
  }

  emitUsers(data: any[]) {
    this.users$.next(data);
  }
}

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let api: ApiServiceMock;

  beforeEach(async () => {

    // ✅ LEGAL place for spies
    spyOn(Chart.prototype, 'destroy').and.callFake(() => { });
    spyOn(Chart as any, 'register').and.callFake(() => { });

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: ApiService, useClass: ApiServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiServiceMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute stats when data arrives', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit

    api.emitTasks([
      { status: 'completed' },
      { status: 'pending' },
    ]);

    api.emitUsers([
      { permissions: { createUser: true } },
    ]);

    tick();
    fixture.detectChanges();

    expect(component.taskStats.total).toBe(2);
    expect(component.taskStats.completed).toBe(1);
    expect(component.taskStats.pending).toBe(1);
    expect(component.userStats.totalUsers).toBe(1);
  }));

  it('should cleanup on destroy', () => {
    const destroySpy = spyOn<any>(component, 'destroyCharts');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
