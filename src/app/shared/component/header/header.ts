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
      this.user = this.api.currentUser();
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
