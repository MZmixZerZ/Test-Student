/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'หน้าหลัก',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboards',
    },
    {
        id: 'person',
        title: 'บุคคล',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/persons',
    },
    {
        id: 'member',
        title: 'สมาชิก',
        type: 'basic',
        icon: 'heroicons_outline:identification',
        link: '/members', // ตรวจสอบว่ามี route /member จริงใน app.routes.ts ด้วย
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
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'หน้าหลัก',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboards',
    },
    {
        id: 'person',
        title: 'บุคคล',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/persons',
    },
    {
        id: 'member',
        title: 'สมาชิก',
        type: 'basic',
        icon: 'heroicons_outline:identification',
        link: '/members', // ตรวจสอบว่ามี route /member จริงใน app.routes.ts ด้วย
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
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'หน้าหลัก',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboards',
    },
    {
        id: 'person',
        title: 'บุคคล',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/persons',
    },
    {
        id: 'member',
        title: 'สมาชิก',
        type: 'basic',
        icon: 'heroicons_outline:identification',
        link: '/members', // ตรวจสอบว่ามี route /member จริงใน app.routes.ts ด้วย
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
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'หน้าหลัก',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboards',
    },
    {
        id: 'person',
        title: 'บุคคล',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/persons',
    },
    {
        id: 'member',
        title: 'สมาชิก',
        type: 'basic',
        icon: 'heroicons_outline:identification',
        link: '/members', // ตรวจสอบว่ามี route /member จริงใน app.routes.ts ด้วย
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
