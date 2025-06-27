import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './member.guard';
import { memberListsResolver, memberResolver } from './member.resolver';
import { MemberComponent } from './member.component';
import { EditMemberComponent } from './edit/edit.component';
import { MemberListComponent } from './list/list.component';

export default [
    {
        path: 'member',
        children: [
            {
                path: '',
                loadComponent: () => import('./list/list.component').then(m => m.MemberListComponent),
                resolve: {
                    initialData: memberListsResolver,
                },
            },
            {
                path: 'create',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditMemberComponent),
                canDeactivate: [CanDeactivateUserEdit],
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditMemberComponent),
                resolve: {
                    initialData: memberResolver,
                },
                canDeactivate: [CanDeactivateUserEdit],
            },
        ],
    },
] as Routes;
