import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Dashbord } from './dashbord';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../../../core/service/mocapi/api/common-api.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Dashbord', () => {

  let component: Dashbord;
  let fixture: ComponentFixture<Dashbord>;
  let api: any;
  let toastr: any;
  let http: any;

  /* ================= MOCK STORE STREAMS ================= */

  const tasks$ = new BehaviorSubject<any[]>([]);
  const users$ = new BehaviorSubject<any[]>([]);
  const resolved$ = new BehaviorSubject<boolean>(false);

  beforeEach(async () => {

    api = {
      tasks$: tasks$.asObservable(),
      users$: users$.asObservable(),
      initialDataResolved$: resolved$.asObservable(),
      consumeTaskFilter: jasmine.createSpy().and.returnValue(null),
      currentUser: jasmine.createSpy().and.returnValue({ id: '1', parentId: null }),
      hasPermission: jasmine.createSpy().and.returnValue(true),
      setOverlay: jasmine.createSpy(),
      addTask: jasmine.createSpy(),
      updateTask: jasmine.createSpy(),
      deleteTask: jasmine.createSpy(),
      reorderTasks: jasmine.createSpy(),
    };

    toastr = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    http = jasmine.createSpyObj('CommonApiService', ['post', 'put', 'delete']);

    await TestBed.configureTestingModule({
      imports: [Dashbord, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ToastrService, useValue: toastr },
        { provide: CommonApiService, useValue: http },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashbord);
    component = fixture.componentInstance;
  });

  /* =====================================================
     INIT
  ===================================================== */

  it('should load data after store resolved', fakeAsync(() => {

    fixture.detectChanges();

    users$.next([{ id: 'u1', name: 'John' }]);
    tasks$.next([{ id: '1', title: 'Task', status: 'pending' }]);

    resolved$.next(true);
    tick();

    expect(component.dataLoaded).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.tasks.length).toBe(1);
  }));

  /* =====================================================
     CREATE TASK
  ===================================================== */

  it('should create task', fakeAsync(() => {

    http.post.and.returnValue(of({ id: '10', title: 'New' }));

    component.taskForm.patchValue({
      title: 'New',
      dueDate: new Date(),
      status: 'pending',
      priority: 'medium',
      assignedUsers: []
    });

    component.saveTask();
    tick();

    expect(http.post).toHaveBeenCalled();
    expect(api.addTask).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Task created');
  }));

  /* =====================================================
     UPDATE TASK
  ===================================================== */

  it('should update task', fakeAsync(() => {

    component.editingTask = { id: '1' };
    http.put.and.returnValue(of({ id: '1', title: 'Updated' }));

    component.taskForm.patchValue({
      title: 'Updated',
      dueDate: new Date(),
      status: 'pending',
      priority: 'medium',
      assignedUsers: []
    });

    component.saveTask();
    tick();

    expect(http.put).toHaveBeenCalled();
    expect(api.updateTask).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Task updated');
  }));

  /* =====================================================
     DELETE TASK
  ===================================================== */

  it('should delete task', fakeAsync(() => {

    component.deleteId = '1';
    http.delete.and.returnValue(of({}));

    component.confirmDelete();
    tick();

    expect(api.deleteTask).toHaveBeenCalledWith('1');
    expect(toastr.success).toHaveBeenCalledWith('Task deleted');
  }));

  /* =====================================================
     FILTERS
  ===================================================== */

  it('should filter by search', () => {

    component.tasks = [
      { title: 'Fix bug', status: 'pending' },
      { title: 'Write docs', status: 'completed' }
    ];

    component.searchText = 'fix';
    component.applyAllFilters();

    expect(component.filteredTasks.length).toBe(1);
  });

  it('should filter by status', () => {

    component.tasks = [
      { title: 'A', status: 'pending' },
      { title: 'B', status: 'completed' }
    ];

    component.statusFilter = 'completed';
    component.applyAllFilters();

    expect(component.filteredTasks[0].status).toBe('completed');
  });

  /* =====================================================
     PERMISSIONS
  ===================================================== */

  it('should respect permissions', () => {

    api.hasPermission.and.callFake((p: string) => p === 'createTask');

    expect(component.canCreate()).toBeTrue();
    expect(component.canEdit()).toBeFalse();
    expect(component.canDelete()).toBeFalse();
  });

  /* =====================================================
     POPUP
  ===================================================== */

  it('should toggle popup and overlay', () => {

    component.togglePopup();

    expect(api.setOverlay).toHaveBeenCalledWith(true);

    component.togglePopup();

    expect(api.setOverlay).toHaveBeenCalledWith(false);
  });

});
