import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { PersonService } from 'app/core/person/person.service';
import { EditPersonComponent } from './edit/edit.component';

export const CanDeactivateUserEdit = (
    component: EditPersonComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const personService = inject(PersonService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/person')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    personService.person = null;
    return true
  });
  
};