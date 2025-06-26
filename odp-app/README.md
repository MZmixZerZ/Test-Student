# วิธีการใช้งาน Schemetic CLI สำหรับ Angular 
* 1. Install node package โดยใช้คำสั่ง 
```bash
npm i
```
* 2. Run Angular project โดยใช้คำสั่ง 
```bash
npm start
```

# วิธีการใช้งาน CASAN Schemetic CLI สำหรับ Angular
* 1. ติดตั้ง CASAN Schemetic CLI โดยใช้คำสั่ง 
```bash
npm i --save-dev casan-schematics@0.0.52
```
* 2. Generate Angular services โดยใช้คำสั่ง 
```bash
schematics casan-schematics:fuse-crud-services --name=person
```
* 3. Generate Angular components โดยใช้คำสั่ง 
```bash
schematics casan-schematics:fuse-crud-components --name=person
```
* 6. เพิ่ม Route ในไฟล์ `app-routing.module.ts` ดังนี้
```typescript
import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboards'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboards' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    {
        path: 'test',
        loadChildren: () => import('./modules/test/test.routes'),
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            {
                path: 'dashboards',
                loadChildren: () =>
                    import('app/modules/admin/dashboards/dashboards.routes'),
            },
            {
                path: 'persons',
                loadChildren: () =>
                    import('app/modules/admin/persons/person.routes'),
            },
            {
                path: 'report',
                loadChildren: () =>
                    import('app/modules/admin/example/example.routes'),
            },
            {
                path: 'companies',
                loadChildren: () =>
                    import('app/modules/admin/companies/companies.routes'),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('app/modules/admin/user/user.routes'),
            },
        ],
    },
];

```
* 7. เพิ่ม Menu ในไฟล์ `app/mock-api/common/navigation/data.ts` ดังนี้
```typescript
/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'หน้าหลัก',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboards'
    },
    {
        id: 'report',
        title: 'รายงาน',
        type: 'basic',
        icon: 'heroicons_outline:document-chart-bar',
        link: '/report',
    },
    {
        id: 'settings',
        title: 'ตั้งค่า',
        type: 'aside',
        icon: 'heroicons_outline:cog-6-tooth',
        children: [
            {
                id: 'settings.system',
                title: 'ตั้งค่าบริษัท',
                type: 'basic',
                icon: 'heroicons_outline:building-office-2',
                link: '/companies',
            },
            {
                id: 'settings.user',
                title: 'ตั้งค่าผู้ใช้',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/users',
            },
            
        ],
    },
];

```