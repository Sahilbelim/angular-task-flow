// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { Auth } from '../auth/auth';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(Auth)
//   const router = inject(Router)

//   if (authService.isLoggedIn()) {
//     return true;
   
//   }

//   router.navigate(['/login'])
//   return false;
// };

// import { inject } from '@angular/core';
// import { CanActivateFn, Router, UrlTree } from '@angular/router';
// import { Auth } from '../auth/auth';

// export const authGuard: CanActivateFn = (): boolean | UrlTree => {
//   const auth = inject(Auth);
//   const router = inject(Router);

//   // ⏳ While Firebase restores session → allow route
//   if (auth.loading()) {
//     return true;
//   }

//   // ✅ Logged in → allow
//   if (auth.isLoggedIn()) {
//     return true;
//   }

//   // ❌ Not logged in → redirect to login
//   return router.createUrlTree(['/login']);
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // ✅ Logged in (token exists)
  if (auth.isLoggedIn()) {
    return true;
  }

  // ❌ Not logged in → redirect
  return router.createUrlTree(['/login']);
};
