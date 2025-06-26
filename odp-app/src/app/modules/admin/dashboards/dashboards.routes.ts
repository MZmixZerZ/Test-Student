import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DashboardsService } from './dashboards.services';


export default [
    {
        path     : '',
        component: DashboardsComponent,
    },
] as Routes;
