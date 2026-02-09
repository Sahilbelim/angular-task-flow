// import { Component ,effect} from '@angular/core';
// import { Router, RouterLink, RouterLinkActive } from '@angular/router';
// import { AuthService } from '../../../core/service/mocapi/auth';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterLink, RouterLinkActive],
//   templateUrl: './header.html',
// })
// export class Header {

//   isLoggedIn = false;
//   menuOpen = false;
//   user: any = null;
//   constructor(private authService: AuthService,private router: Router,private toststr: ToastrService) {
//     this.router.events.subscribe(() => {
//       this.userMenuOpen = false;
//       this.menuOpen = false;
//     });
//     // console.log('Header initialized');
//     this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    
//     effect(() => {
//       // console.log('Header User:', this.user);
//       this.isLoggedIn = this.authService.isLoggedIn();
//     })
//    }
  
  

//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//   }

//   closeMenu() {
//     this.menuOpen = false;
//   }

 
//   userMenuOpen = false;

 

//   toggleUserMenu() {
//     this.userMenuOpen = !this.userMenuOpen;
//   }

//   closeUserMenu() {
//     this.userMenuOpen = false;
//   }

 

//   async logout() {
//     try {
//       await this.authService.logout();
//       this.router.navigate(['/login']);
//       this.toststr.success('Logout successful');
//       console.log('Logout successful');
//     } catch (error) {
//       console.error('Logout failed:', error);

//     }
//   }
// }

import { Component, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../core/service/mocapi/api/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {

  menuOpen = false;
  userMenuOpen = false;

  // 🔥 derived state (NO localStorage)
  user:any = null;
  isLoggedIn = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {

    // 🔁 close menus on route change
    this.router.events.subscribe(() => {
      this.menuOpen = false;
      this.userMenuOpen = false;
    });

    // ✅ REACTIVE AUTH STATE
    effect(() => {
      this.user = this.api.user();
      this.isLoggedIn = !!this.user;
    });
  }

  /* =====================
     UI ACTIONS
  ===================== */

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeMenus() {
    this.menuOpen = false;
    this.userMenuOpen = false;
  }

  
  // 🔁 Backward compatibility for template
  closeMenu() {
    this.closeMenus();
  }

  closeUserMenu() {
    this.closeMenus();
  }


  /* =====================
     LOGOUT
  ===================== */

  logout() {
    this.api.logout();            // 🔥 clears cache + user
    this.toastr.success('Logout successful');
  }
}
