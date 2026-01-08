import { Component, effect } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../../core/service/task';
import { Auth } from '../../../core/auth/auth';

type TaskStatus = 'pending' | 'in-progress' | 'completed';

@Component({
  selector: 'app-dashbord',
  imports: [ReactiveFormsModule],
  templateUrl: './dashbord.html',
  styleUrl: './dashbord.css',
})
  
 

export class Dashbord {

  popupVisible = false;
  // tasks;
  taskForm;
  

  constructor(
    private fb: FormBuilder,
    public taskService: TaskService,
    private auth: Auth
  ) { 
    this.taskForm = this.fb.nonNullable.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['pending' as TaskStatus, Validators.required],
    });


    effect(() => {
      console.log("effect call")
      const user = this.auth.user()?.uid;
      if (user) {
          this.taskService.loadTasks(user);
        // console.log(this.tasks)
      }
    });
   

    console.log(this.taskService.tasks)

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

  
}
