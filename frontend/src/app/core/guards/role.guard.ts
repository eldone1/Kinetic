import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getUserRole();
  if (role && allowedRoles.includes(role)) {
    return true;
  }

  return router.parseUrl('/login');
};
