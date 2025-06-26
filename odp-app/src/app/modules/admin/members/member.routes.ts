import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './member.guard';
import { memberListsResolver, memberResolver } from './member.resolver';
import { MemberComponent } from './member.component';
import { EditMemberComponent } from './edit/edit.component';
import { MemberListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: MemberComponent,
        children: [
            {
                path: '',
                component: MemberListComponent,
                resolve: {
                    initialData: memberListsResolver,
                },
                children: [
                    {
                        path: 'create',
                        component: EditMemberComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path: 'edit/:id',
                        component: EditMemberComponent,
                        resolve: {
                            initialData: memberResolver,
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                ],
            },
        ],
    },
] as Routes;
