import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string | undefined;
  const user = auth.currentUser;

  if (!user) return router.createUrlTree(['/login']);
  if (!requiredRole || user.role === requiredRole) return true;

  return router.createUrlTree(
    user.role === 'admin' ? ['/administrator/employees'] : ['/employee/workday']
  );
};
