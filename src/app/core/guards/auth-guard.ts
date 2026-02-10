import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ApiService } from '../service/mocapi/api/api';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const api = inject(ApiService);
  const router = inject(Router);

  // ✅ user already restored from localStorage via signal
  if (api.isLoggedIn()) {
    return true;
  }

  // ❌ not logged in → redirect
  return router.createUrlTree(['/login']);
};
