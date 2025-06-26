import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { UserComponent } from './user.component';
import { userListsResolver, userResolver } from './user.resolver';
import { UserListComponent } from './components/list/list.component';
import { UserEditComponent } from './components/edit/edit.component';
import { CanDeactivateUserEdit } from './user.guard';

export default [
    {
        path     : '',
        component: UserComponent,
        children: [
            {
                path     : '',
                component: UserListComponent,
                resolve: {
                    initialData: userListsResolver
                },
                children: [
                    {
                        path     : 'create',
                        component: UserEditComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path     : 'edit/:id',
                        component: UserEditComponent,
                        resolve: {
                            initialData: userResolver
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    }
                ]
            }
        ]
    },
] as Routes;
