// import { inject } from '@angular/core';
// import { CanActivateFn, Router, UrlTree } from '@angular/router';
// import { ApiService } from '../service/mocapi/api/api';

// export const authGuard: CanActivateFn = (): boolean | UrlTree => {
//   const api = inject(ApiService);
//   const router = inject(Router);

//   // ✅ user already restored from localStorage via signal
//   if (api.isLoggedIn()) {
//     return true;
//   }

//   // ❌ not logged in → redirect
//   return router.createUrlTree(['/login']);
// };

// import { inject } from '@angular/core';
// import { CanActivateFn, Router, UrlTree } from '@angular/router';
// import { ApiService } from '../service/mocapi/api/api';

// export const authGuard: CanActivateFn = (): boolean | UrlTree => {

//   const api = inject(ApiService);
//   const router = inject(Router);

//   // read from signal store
//   const user = api.currentUser();

//   // logged in
//   if (user) {
//     return true;
//   }

//   // not logged in → redirect
//   return router.createUrlTree(['/login']);
// };

/* =========================================================
   🔐 UNIVERSAL AUTH GUARD
   Handles BOTH cases:

   1) Private pages → require login
   2) Login/Register → block if already logged in
   ========================================================= */

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { ApiService } from '../service/mocapi/api/api';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): boolean | UrlTree => {

  const api = inject(ApiService);
  const router = inject(Router);

  const user = api.currentUser();
  const url = route.routeConfig?.path ?? '';

  /* =========================================
     CASE 1 — LOGIN / REGISTER PAGES
     If already logged in → redirect dashboard
     ========================================= */
  if (url === 'login' || url === 'register') {
    if (user) {
      return router.createUrlTree(['/dashboard']);
    }
    return true;
  }

  /* =========================================
     CASE 2 — PRIVATE PAGES
     If not logged in → redirect login
     ========================================= */
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  /* =========================================
     CASE 3 — ALLOW ACCESS
     ========================================= */
  return true;
};
