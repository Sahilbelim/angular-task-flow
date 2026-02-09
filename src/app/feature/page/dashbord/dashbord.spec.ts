import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Dashbord } from './dashbord';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';
import { of, BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Dashbord', () => {
  let component: Dashbord;
  let fixture: ComponentFixture<Dashbord>;
  let api: jasmine.SpyObj<ApiService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  const tasks$ = new BehaviorSubject<any[]>([]);
  const users$ = new BehaviorSubject<any[]>([]);
  const filterUser$ = new BehaviorSubject<string | null>(null);

  beforeEach(async () => {
    api = jasmine.createSpyObj<ApiService>('ApiService', [
      'getTasks$',
      'getUsers$',
      'createTaskOptimistic',
      'updateTaskOptimistic',
      'deleteTaskOptimistic',
      'batchUpdateTasks',
      'updateTask',
      'hasPermission',
      'setOverlay',
    ], {
      taskFilterUser$: filterUser$,
    });

    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', [
      'success',
      'error',
      'warning',
    ]);

    api.getTasks$.and.returnValue(tasks$.asObservable());
    api.getUsers$.and.returnValue(users$.asObservable());
    api.hasPermission.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [Dashbord, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: ToastrService, useValue: toastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashbord);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks & users on init', fakeAsync(() => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'pending', order_id: 0 },
      { id: '2', title: 'Task 2', status: 'completed', order_id: 1 },
    ];
    const mockUsers = [{ id: 'u1', name: 'John' }];

    fixture.detectChanges(); // ngOnInit

    users$.next(mockUsers);
    tasks$.next(mockTasks);
    tick();

    expect(component.loading).toBeFalse();
    expect(component.dataLoaded).toBeTrue();
    expect(component.tasks.length).toBe(2);
    expect(component.filteredTasks.length).toBe(2);
  }));



  it('should calculate task stats correctly', () => {
    component.updateStats([
      { status: 'pending' },
      { status: 'completed' },
      { status: 'in-progress' },
    ]);

    expect(component.totalTasks).toBe(3);
    expect(component.pendingTasks).toBe(1);
    expect(component.complatedTasks).toBe(1);
    expect(component.inprogressTasks).toBe(1);
  });
  it('should filter tasks by search text', () => {
    component.tasks = [
      { title: 'Fix bug', status: 'pending' },
      { title: 'Write tests', status: 'completed' },
    ];

    component.searchText = 'fix';
    component.applyAllFilters();

    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Fix bug');
  });

  it('should filter tasks by status', () => {
    component.tasks = [
      { title: 'A', status: 'pending' },
      { title: 'B', status: 'completed' },
    ];

    component.statusFilter = 'completed';
    component.applyAllFilters();

    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].status).toBe('completed');
  });
  it('should not save task if form is invalid', () => {
    component.taskForm.patchValue({ title: '' });

    component.saveTask();

    expect(api.createTaskOptimistic).not.toHaveBeenCalled();
  });

  it('should create task successfully', fakeAsync(() => {
    api.createTaskOptimistic.and.returnValue(of({}));

    component.taskForm.patchValue({
      title: 'New Task',
      status: 'pending',
      priority: 'medium',
      assignedUsers: [],
    });

    component.saveTask();
    tick();

    expect(api.createTaskOptimistic).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Task created');
    expect(component.savingTask).toBeFalse();
  }));
  it('should populate form when editing task', () => {
    const task = {
      id: '1',
      title: 'Edit me',
      status: 'pending',
      priority: 'high',
      assignedUsers: ['u1'],
      dueDate: '2025-01-01',
    };

    component.editTask(task);

    expect(component.editingTask).toBe(task);
    expect(component.popupVisible).toBeTrue();
    expect(component.taskForm.value.title).toBe('Edit me');
    expect(api.setOverlay).toHaveBeenCalledWith(true);
  });
  it('should populate form when editing task', () => {
    const task = {
      id: '1',
      title: 'Edit me',
      status: 'pending',
      priority: 'high',
      assignedUsers: ['u1'],
      dueDate: '2025-01-01',
    };

    component.editTask(task);

    expect(component.editingTask).toBe(task);
    expect(component.popupVisible).toBeTrue();
    expect(component.taskForm.value.title).toBe('Edit me');
    expect(api.setOverlay).toHaveBeenCalledWith(true);
  });
  
  it('should respect permission checks', () => {
    api.hasPermission.and.callFake(p => p === 'createTask');

    expect(component.canCreate()).toBeTrue();
    expect(component.canEdit()).toBeFalse();
    expect(component.canDelete()).toBeFalse();
  });

  it('should toggle popup and reset form', () => {
    component.popupVisible = true;

    component.togglePopup();

    expect(component.popupVisible).toBeFalse();
    expect(component.editingTask).toBeNull();
    expect(api.setOverlay).toHaveBeenCalledWith(false);
  });
 

});