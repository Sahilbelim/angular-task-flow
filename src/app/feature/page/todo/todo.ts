import { Component, OnInit } from '@angular/core';
import { Todomodel } from '../../../core/models/todo.model';
import { TodoService } from '../../../core/service/todo';
@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    // this.loadTodos();
  }

  // loadTodos() {
  //   this.todoService.getTodos().subscribe(data => {
  //     this.todos = data.slice(0, 10); // limit for demo
  //   });
  // }

  // addTodo() {
  //   const newTodo: Todo = {
  //     title: 'New Task from Angular',
  //     completed: false,
  //     userId: 1
  //   };

  //   this.todoService.createTodo(newTodo).subscribe(todo => {
  //     this.todos.unshift(todo);
  //   });
  // }

  // deleteTodo(id: number) {
  //   this.todoService.deleteTodo(id).subscribe(() => {
  //     // this.todos = this.todos.filter(t => t.id !== id);
  //   });
  // }
}

