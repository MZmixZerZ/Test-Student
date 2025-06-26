import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './person.guard';
import { personResolver } from './person.resolver';
import { PersonComponent } from './person.component';
import { EditPersonComponent } from './edit/edit.component';
import { PersonListComponent } from './list/list.component';

const routes: Routes = [
    {
        path: '',
        component: PersonListComponent,
        children: [
            {
                path: 'create',
                component: EditPersonComponent,
                canDeactivate: [CanDeactivateUserEdit],
                data: { mode: 'create' }
            },
            {
                path: 'edit/:id',
                component: EditPersonComponent,
                resolve: { initialData: personResolver },
                canDeactivate: [CanDeactivateUserEdit],
                data: { mode: 'edit' }
            }
        ]
    }
];

export default routes;
