import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserEditComponent } from './components/edit/edit.component';
import { inject } from '@angular/core';
import { UserPermissionService } from 'app/core/user-permission/user-permission.service';

export const CanDeactivateUserEdit = (
    component: UserEditComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const userPermissionService = inject(UserPermissionService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/permission')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    userPermissionService.user = null;
    return true
  });
  
};