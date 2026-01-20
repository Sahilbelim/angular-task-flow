import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/component/header/header";
import { AuthService } from './core/service/mocapi/auth';
// import { Login } from "./feature/page/login/login";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    const user = this.auth.user();
    if (!user) return;

    this.auth.refreshCurrentUser(user.id).subscribe(updatedUser => {
      this.auth.setUser(updatedUser);
    });
  }
  protected readonly title = signal('task-manager');
}
