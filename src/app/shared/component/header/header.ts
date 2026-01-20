import { Component ,effect} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/service/mocapi/auth';
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
  user: any = null;
  constructor(private authService: AuthService,private router: Router,private toststr: ToastrService) {

    // console.log('Header initialized');
    this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    
    effect(() => { 
      // console.log('Header User:', this.user);
      this.isLoggedIn = this.authService.isLoggedIn();
    })
   }
  
  

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

 
  userMenuOpen = false;

 

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
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
