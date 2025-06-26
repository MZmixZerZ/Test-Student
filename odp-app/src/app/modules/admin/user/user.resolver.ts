import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { GetAdminUserParameter } from 'app/core/user-permission/parameters/get-admin-user.parameter';
import { UserPermissionService } from 'app/core/user-permission/user-permission.service';
import { UserPermission } from 'app/core/user-permission/user-permission.types';
import { catchError, debounceTime, takeUntil, throwError } from 'rxjs';

export const userListsResolver: ResolveFn<PageResponse<UserPermission[]>> = (route, state) => {
  const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
  const userPermissionService = inject(UserPermissionService);
  const param = new GetAdminUserParameter();
  param.limit = currPage.limit;
  param.page = currPage.page;
  param.sortBy = currPage.sortBy;
  param.sortType = currPage.sortType;
  return userPermissionService.getUserLists(param);
};


export const userResolver: ResolveFn<UserPermission> = ( 
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userPermissionService = inject(UserPermissionService);
  const router = inject(Router);
  
  return userPermissionService.getUserById(route.paramMap.get('id')).pipe(
    catchError((error) => {
      console.error(error);
      const parentUrl = state.url.split('/').slice(0, -1).join('/');
      // const previousUrl = router.getCurrentNavigation()?.previousNavigation?.extractedUrl?.toString() || 'dashboard';
      router.navigateByUrl(parentUrl);
      return throwError(error);
  })
  )
};