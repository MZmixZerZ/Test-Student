import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { MemberService } from 'app/core/member/member.service';
import { EditMemberComponent } from './edit/edit.component';

export const CanDeactivateUserEdit = (
    component: EditMemberComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const memberService = inject(MemberService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/member')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    memberService.member = null;
    return true
  });
  
};