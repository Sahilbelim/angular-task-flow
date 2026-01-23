// import { Component, OnInit, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { Header } from "./shared/component/header/header";
// import { AuthService } from './core/service/mocapi/auth';
// // import { Login } from "./feature/page/login/login";

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, Header],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App implements OnInit {

//   constructor(private auth: AuthService) { }

//   ngOnInit() {
//     const user = this.auth.user();
//     if (!user) return;

//     this.auth.refreshCurrentUser(user.id).subscribe(updatedUser => {
//       this.auth.setUser(updatedUser);
//     });
//   }
//   protected readonly title = signal('task-manager');
// }

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
export class App implements OnInit {

  // optional – only if you use it in template
  protected readonly title = signal('task-manager');

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    /**
     * 🔥 IMPORTANT
     * ApiService already restores user from localStorage
     * via signal initialization.
     *
     * ❌ NO API CALLS HERE
     * ❌ NO REFRESH USER
     * ✅ JUST TRUST THE STORE
     */
  }
}
