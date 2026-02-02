
import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/component/header/header';
import { ApiService } from './core/service/mocapi/api/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {


  constructor(private api: ApiService) { }

  
}
