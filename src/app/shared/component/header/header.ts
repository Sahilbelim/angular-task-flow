import { Component ,effect} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header { 

  isLoggedIn = false;
  constructor(private authService: Auth) {

    effect(() => { 
      this.isLoggedIn = this.authService.isLoggedIn();
    })
   }
  
 

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
