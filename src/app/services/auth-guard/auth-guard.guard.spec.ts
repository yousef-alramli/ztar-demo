import { TestBed, fakeAsync } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth-guard.guard';

describe('authGuard', () => {
  let executeGuard: CanActivateFn;
  const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    executeGuard = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          },
        },
      ],

    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when having a token', fakeAsync(() => {
    localStorage.setItem('token', 'my-token');

    executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBeTrue();
  }));

  it('should navigate to login without a token', fakeAsync(() => {
    localStorage.removeItem('token');

    executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)

    expect(executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  }));
});
