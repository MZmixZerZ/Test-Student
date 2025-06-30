import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './member.guard';
import { memberListsResolver, memberResolver } from './member.resolver';
import { MemberComponent } from './member.component';
import { MemberListComponent } from './list/list.component';

export const MEMBER_ROUTES: Routes = [
    {
        path: '',
        component: MemberComponent,
        children: [
            {
                path: '',
                component: MemberListComponent,
                resolve: { initialData: memberListsResolver }
            },
            {
                path: 'create',
                component: MemberListComponent,
                data: { openDrawer: 'create' }
            },
            {
                path: 'edit/:id',
                component: MemberListComponent,
                data: { openDrawer: 'edit' },
                resolve: { initialData: memberResolver }
            }
        ]
    }
];
