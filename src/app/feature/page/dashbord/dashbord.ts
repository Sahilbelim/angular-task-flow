import { Component, effect, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, Validators, FormsModule, FormControl } from '@angular/forms';
import { TaskService } from '../../../core/service/task';
import { Auth } from '../../../core/auth/auth';
import { PostService } from '../../../core/service/post';
import { Post } from '../../../core/models/post.model';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgxDaterangepickerMd],
  templateUrl: './dashbord.html',
  styleUrl: './dashbord.css',
})
  

export class Dashbord implements OnInit  {

  popupVisible = false;

  taskForm;
  user:any;
  posts: Post[] = [];

  searchText = '';
  statusFilter: TaskStatus | 'all' = 'all';
  dateRange: { startDate: any; endDate: any } | null = null;
  filteredTasks: any[] = []; 
  dateRangeControl = new FormControl(null);

  editingTask: any = null;


  tasks: any[] = [];           
  totalTasks: number = 0;
  complatedTasks: number = 0;
  inprogressTasks: number = 0;
  pendingTasks: number = 0;

  constructor(
    private fb: FormBuilder,
    public taskService: TaskService,
    private auth: Auth,
    public postService:PostService
  ) { 
    this.taskForm = this.fb.nonNullable.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['pending' as TaskStatus, Validators.required],
    });
    effect(() => {
      const data = this.taskService.tasks();

      this.tasks = [...data];
      this.filteredTasks = [...data];

      // 🔢 Stats update
      this.totalTasks = data.length;
      this.complatedTasks = data.filter(t => t.status === 'completed').length;
      this.inprogressTasks = data.filter(t => t.status === 'in-progress').length;
      this.pendingTasks = data.filter(t => t.status === 'pending').length;
    });

   
  }

  ngOnInit(): void {
    this.user = this.auth.user()?.uid;

    if (this.user) {
      this.taskService.loadTasks(this.user);
    }

    this.dateRangeControl.valueChanges.subscribe(range => {
      this.applyDateFilter(range);
    });
  }



  togglePopup() {
    this.popupVisible = !this.popupVisible;
  }

  // async addTask() {
  //   if (this.taskForm.invalid) return;
  //   console.log(this.taskForm.value)

  //   const { title, dueDate, status } = this.taskForm.getRawValue();

  //   await this.taskService.addTask({
  //     title,
  //     dueDate,
  //     status,
  //     createdAt: Date.now(),
  //     userId: this.auth.user()!.uid,
  //   });

  //   this.taskForm.reset({
  //     title: '',
  //     dueDate: '',
  //     status: 'pending',
  //   });

  //   this.togglePopup();
  // }

  async saveTask() {
    if (this.taskForm.invalid) return;

    const { title, dueDate, status } = this.taskForm.getRawValue();

    
    if (this.editingTask) {
      await this.taskService.updateTask(this.editingTask.id, {
        title,
        dueDate,
        status,
      });
    }
    
    else {
      await this.taskService.addTask({
        title,
        dueDate,
        status,
        createdAt: Date.now(),
        userId: this.auth.user()!.uid,
      });
    }

    this.resetForm();
  }

  editTask(task: any) {
    this.editingTask = task;         
    this.popupVisible = true;

    this.taskForm.patchValue({      
      title: task.title,
      dueDate: task.dueDate,
      status: task.status,
    });
  }

  resetForm() {
    this.taskForm.reset({
      title: '',
      dueDate: '',
      status: 'pending',
    });

    this.popupVisible = false;
    this.editingTask = null;  
  }

   getpost() {
     this.postService.getPost().subscribe(data => {
       this.posts = data;
       console.log(data)
     })
    
    this.postService.getPostById(5).subscribe(data => {
      console.log(data)
      this.postService.updatePost(7, data).subscribe(res => {
        console.log(res);
      })
    })
    console.log(this.posts)
    
  }
  filterBySearch() {
    const text = this.searchText.trim().toLowerCase();

    
    if (!text) {
      this.filteredTasks = [...this.tasks];
      return;
    }

  
    this.filteredTasks = this.tasks.filter(task =>
      task.title.toLowerCase().includes(text)
    );
  }

  filterByStatus() {
    if (this.statusFilter === 'all') {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter(
      task => task.status === this.statusFilter
    );
  }

  applyDateFilter(range: { startDate: any; endDate: any } | null) {
    // If no date selected → show all tasks
    if (!range || !range.startDate || !range.endDate) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    const start = new Date(range.startDate).getTime();
    const end = new Date(range.endDate).getTime();

    this.filteredTasks = this.tasks.filter(task => {
      const taskDate = new Date(task.dueDate).getTime();
      return taskDate >= start && taskDate <= end;
    });

    

  }

  clearDateFilter() {
    // reset date picker
    this.dateRangeControl.setValue(null);

    // show all tasks
    this.filteredTasks = [...this.tasks];
  }

   


  
}
