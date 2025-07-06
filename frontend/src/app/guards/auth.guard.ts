import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    return true; // User is authenticated
  } else {
    // Redirect to login if no token
    router.navigate(['/login']);
    return false;
  }
};