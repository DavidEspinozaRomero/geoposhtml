import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of, map, take, filter } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { Auth } from '../services/auth';

function resolve(auth: Auth, router: Router): boolean | UrlTree {
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
}

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isReady()) {
    return of(resolve(auth, router));
  }

  return toObservable(auth.isReady).pipe(
    filter((ready) => ready),
    take(1),
    map(() => resolve(auth, router)),
  );
};
