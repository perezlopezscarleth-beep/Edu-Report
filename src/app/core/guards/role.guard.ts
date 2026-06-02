import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth    = inject(AuthService);
  const router  = inject(Router);
  const allowed = route.data['roles'] as string[];
  if (allowed.includes(auth.currentUser()?.role ?? '')) return true;
  router.navigate(['/tabs/home']);
  return false;
};
