import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { User } from 'app/core/user/user.types';
import { catchError, throwError } from 'rxjs';
import { CompaniesService } from '../../../core/company/companies.service';
import { CompaniesComponent } from './companies.component';
import { CompaniesDetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { SearchParameter } from 'app/core/base/parameters/searchParameter.entity';
import { SortType } from 'app/core/base/page.type';

/**
 * Companie resolver
 *
 * @param route
 * @param state
 */
const companieResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const companiesService = inject(CompaniesService);
    const router = inject(Router);
    const authService = inject(AuthService);

    const token = authService.accessToken;
    const user: User = AuthUtils.decodeToken(token);
    const companies = user.companies;
    const companyId = user.companySelected;

    return companiesService.getById(companyId).pipe(
        // Error here means the requested task is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};


export default [
    {
        path: '',
        component: CompaniesComponent,
        children: [
            {
                path: '',
                component: CompaniesDetailsComponent,
                resolve: {
                    companie: companieResolver,
                },
            },
            {
                path: 'edit',
                component: EditComponent,
                resolve: {
                    companie: companieResolver,
                },
            },
        ],
    },
] as Routes;
