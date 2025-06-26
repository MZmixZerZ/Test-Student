import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { PersonService } from 'app/core/person/person.service';
import { Person } from 'app/core/person/person.type';
import { GetPersonParameter } from 'app/core/person/parameters/get-person.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { catchError, of } from 'rxjs';

export const personListsResolver: ResolveFn<PageResponse<Person[]>> = (
    route,
    state
) => {
    const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
    const personService = inject(PersonService);
    const param = new GetPersonParameter();
    param.limit = currPage.limit;
    param.page = currPage.page;
    param.sortBy = currPage.sortBy;
    param.sortType = currPage.sortType;
    return personService.getPersonLists(param);
};

export const personResolver: ResolveFn<Person> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const personService = inject(PersonService);
    const router = inject(Router);

    return personService.getPersonById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            // กลับไปหน้ารายการถ้า error
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return of(null);
        })
    );
};
