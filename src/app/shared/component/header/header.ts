import { Component ,effect} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header { 

  isLoggedIn = false;
  menuOpen = false;
  constructor(private authService: AuthService,private router: Router,private toststr: ToastrService) {

    effect(() => { 
      this.isLoggedIn = this.authService.isLoggedIn();
    })
   }
  
  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

 

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
      this.toststr.success('Logout successful');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);

    }
  }
}
