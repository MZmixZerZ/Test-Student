import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { MemberService } from 'app/core/member/member.service';
import { Member } from 'app/core/member/member.type';
import { GetMemberParameter } from 'app/core/member/parameters/get-member.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { catchError, throwError } from 'rxjs';

export const memberListsResolver: ResolveFn<PageResponse<Member[]>> = (
    route,
    state
) => {
    const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
    const memberService = inject(MemberService);
    const param = new GetMemberParameter();
    param.limit = currPage.limit;
    param.page = currPage.page;
    param.sortBy = currPage.sortBy;
    param.sortType = currPage.sortType;
    return memberService.getMemberLists(param);
};

export const memberResolver: ResolveFn<Member> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const memberService = inject(MemberService);
    const router = inject(Router);

    return memberService.getMemberById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
};
