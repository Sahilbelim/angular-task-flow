import { Component, effect, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../../core/service/task';
import { Auth } from '../../../core/auth/auth';
import { PostService } from '../../../core/service/post';
import { Post } from '../../../core/models/post.model';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

@Component({
  selector: 'app-dashbord',
  imports: [ReactiveFormsModule],
  templateUrl: './dashbord.html',
  styleUrl: './dashbord.css',
})
  
 

export class Dashbord implements OnInit  {

  popupVisible = false;
  // tasks;
  taskForm;
  user:any;
  posts: Post[] = [];

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
      console.log("effect call")
      //  this.user = this.auth.user()?.uid;
      // if (this.user) {
      //     this.taskService.loadTasks(this.user);
      //   // console.log(this.tasks)
      //   // console.log(this.taskService.tasks())
      // }
    });
   


  }

  ngOnInit(): void {
    console.log("ng init work")
    this.user = this.auth.user()?.uid;
    if (this.user) {
      this.taskService.loadTasks(this.user);
      console.log("hi")
    }
    console.log(this.taskService.tasks())
  }
 

  togglePopup() {
    this.popupVisible = !this.popupVisible;
  }

  async addTask() {
    if (this.taskForm.invalid) return;
    console.log(this.taskForm.value)

    const { title, dueDate, status } = this.taskForm.getRawValue();

    await this.taskService.addTask({
      title,
      dueDate,
      status,
      createdAt: Date.now(),
      userId: this.auth.user()!.uid,
    });

    this.taskForm.reset({
      title: '',
      dueDate: '',
      status: 'pending',
    });

    this.togglePopup();
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
  
}
