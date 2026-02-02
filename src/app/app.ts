
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
export class App  implements OnInit {
  isOverlayOpen = false;

  constructor(private api: ApiService) {
    this.api.overlayOpen$.subscribe(v => {
      this.isOverlayOpen = v;
    });
  }

  ngOnInit() {
  this.api.loadUserFromStorage();
  this.api.getCurrentUser()?.subscribe();
}
}
