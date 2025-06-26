import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { PersonService } from 'app/core/person/person.service';

export const CanDeactivateUserEdit = (
    component: { closeDrawer?: () => Promise<void> } | null,
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

    // ป้องกัน error ถ้า component เป็น null หรือไม่มี closeDrawer
    if (component && typeof component.closeDrawer === 'function') {
        return component.closeDrawer().then(() => {
            personService.person = null;
            return true;
        });
    }
    personService.person = null;
    return true;
};