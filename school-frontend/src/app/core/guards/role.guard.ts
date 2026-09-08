import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as string[];

  if (auth.isAuthenticated() && auth.hasRole(allowedRoles)) {
    return true;
  }

  const role = auth.getRole();
  if (role) {
    router.navigate([`/${role}/dashboard`]);
  } else {
    router.navigate(['/auth/login']);
  }
  return false;
};
