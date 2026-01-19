import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/mocapi/auth';

export const taskPermissionGuard = (permission: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    return auth.hasPermission(permission);
  };
};
