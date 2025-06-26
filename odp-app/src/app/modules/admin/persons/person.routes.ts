import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './person.guard';
import { personResolver } from './person.resolver';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./list/list.component').then(m => m.PersonListComponent),
        children: [
            {
                path: 'create',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditPersonComponent),
                canDeactivate: [CanDeactivateUserEdit],
                data: { mode: 'create' }
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditPersonComponent),
                resolve: { initialData: personResolver },
                canDeactivate: [CanDeactivateUserEdit],
                data: { mode: 'edit' }
            }
        ]
    }
];

export default routes;
