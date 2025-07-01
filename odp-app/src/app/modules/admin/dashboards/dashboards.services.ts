import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError, catchError, timer, interval } from 'rxjs';
import { Dashboard, DashboardPagination } from './dashboards.types';

@Injectable({providedIn: 'root'})
export class DashboardsService
{
    // Private
    private _pagination: BehaviorSubject<DashboardPagination | null> = new BehaviorSubject(null);
    private _dashboard: BehaviorSubject<Dashboard | null> = new BehaviorSubject(null);
    private _dashboards: BehaviorSubject<Dashboard[] | null> = new BehaviorSubject(null);
    private _summary: BehaviorSubject<{ member: number, org: number, person: number, stats?: any } | null> = new BehaviorSubject(null);
    
    // Real-time data simulation - faster updates for demo
    private summaryTimer = interval(3000); // Update every 3 seconds for better real-time feel
    
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    /**
     * Getter for pagination
     */
    get pagination$(): Observable<DashboardPagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for dashboard
     */
    get dashboard$(): Observable<Dashboard>
    {
        return this._dashboard.asObservable();
    }

    /**
     * Getter for dashboards
     */
    get dashboards$(): Observable<Dashboard[]>
    {
        return this._dashboards.asObservable();
    }

    /**
     * Getter for summary (real-time)
     */
    get summary$(): Observable<{ member: number, org: number, person: number, stats?: any }>
    {
        return this._summary.asObservable().pipe(
            filter(summary => summary !== null)
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get dashboards
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getDashboards(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: DashboardPagination; dashboards: Dashboard[] }>
    {
        console.log('getDashboards');
        return this._httpClient.get<{ pagination: DashboardPagination; dashboards: Dashboard[] }>('api/dashboards', {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search,
            },
        }).pipe(
            tap((response) =>
            {
                console.log(response);
                this._pagination.next(response.pagination);
                this._dashboards.next(response.dashboards);
            }),
        );
    }

    /**
     * Get dashboard by id
     */
    getDashboardById(id: string): Observable<Dashboard>
    {
        return this._dashboards.pipe(
            take(1),
            map((dashboards) =>
            {
                // Find the dashboard
                const dashboard = dashboards.find(item => item.id === id) || dashboards[0];;

                // Update the dashboard
                this._dashboard.next(dashboard);

                // Return the dashboard
                return dashboard;
            }),
            switchMap((dashboard) =>
            {
                if ( !dashboard )
                {
                    return throwError('Could not found dashboard with id of ' + id + '!');
                }

                return of(dashboard);
            }),
        );
    }

    /**
     * Create dashboard
     */
    createDashboard(): Observable<Dashboard>
    {
        console.log('createDashboard');
        return this.dashboards$.pipe(
            take(1),
            switchMap(dashboards => this._httpClient.post<Dashboard>('api/dashboards/dashboard', {}).pipe(
                map((newDashboard) =>
                {
                    
                    // Update the dashboards with the new dashboard
                    this._dashboards.next([newDashboard, ...dashboards]);

                    // Return the new dashboard
                    return newDashboard;
                }),
            )),
        );
    }

    /**
     * Update dashboard
     *
     * @param id
     * @param dashboard
     */
    updateDashboard(id: string, dashboard: Dashboard): Observable<Dashboard>
    {
        return this.dashboards$.pipe(
            take(1),
            switchMap(dashboards => this._httpClient.patch<Dashboard>('api/dashboards', {
                id,
                dashboard,
            }).pipe(
                map((updatedDashboard) =>
                {
                    // Find the index of the updated dashboard
                    const index = dashboards.findIndex(item => item.id === id);

                    // Update the dashboard
                    dashboards[index] = updatedDashboard;

                    // Update the dashboards
                    this._dashboards.next(dashboards);

                    // Return the updated dashboard
                    return updatedDashboard;
                }),
                switchMap(updatedDashboard => this.dashboard$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() =>
                    {
                        // Update the dashboard if it's selected
                        this._dashboard.next(updatedDashboard);

                        // Return the updated dashboard
                        return updatedDashboard;
                    }),
                )),
            )),
        );
    }

    /**
     * Delete the dashboard
     *
     * @param id
     */
    deleteDashboard(id: string): Observable<boolean>
    {
        return this.dashboards$.pipe(
            take(1),
            switchMap(dashboards => this._httpClient.delete('api/dashboards', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted dashboard
                    const index = dashboards.findIndex(item => item.id === id);

                    // Delete the dashboard
                    dashboards.splice(index, 1);

                    // Update the dashboards
                    this._dashboards.next(dashboards);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }    

    /**
     * Get summary with real-time updates
     */
    getSummary(): Observable<{ member: number, org: number, person: number, stats?: any }>
    {
        // Start real-time polling
        this.startRealTimeUpdates();
        
        // Return the observable
        return this.summary$;
    }

    /**
     * Get summary data once (for manual refresh)
     */
    getSummaryOnce(): Observable<{ member: number, org: number, person: number, stats?: any }>
    {
        // Use the backend endpoint if available, otherwise use simulated data
        return this._httpClient.get<{ member: number, org: number, person: number, stats?: any }>('/api/dashboard/summary').pipe(
            catchError(error => {
                console.log('Using simulated data for demo purposes');
                // Simulate real data with some variation
                const baseData = {
                    member: 125 + Math.floor(Math.random() * 20), // 125-145
                    org: 45 + Math.floor(Math.random() * 10),     // 45-55  
                    person: 89 + Math.floor(Math.random() * 15),   // 89-104
                    stats: {
                        totalMembers: 125 + Math.floor(Math.random() * 20),
                        totalPersons: 89 + Math.floor(Math.random() * 15),
                        totalOrganizations: 45 + Math.floor(Math.random() * 10),
                        recentMembers: Math.floor(Math.random() * 15) + 5,
                        recentPersons: Math.floor(Math.random() * 10) + 3,
                        growthRates: {
                            members: Math.floor(Math.random() * 20) + 5,
                            persons: Math.floor(Math.random() * 15) + 3,
                            organizations: Math.floor(Math.random() * 10) + 2
                        },
                        topOrganizations: [
                            { name: 'วิทยาลัยเทคนิค', memberCount: 25 + Math.floor(Math.random() * 10) },
                            { name: 'บริษัท ABC', memberCount: 18 + Math.floor(Math.random() * 8) },
                            { name: 'องค์กร XYZ', memberCount: 12 + Math.floor(Math.random() * 6) },
                            { name: 'สถาบัน DEF', memberCount: 8 + Math.floor(Math.random() * 5) },
                            { name: 'กลุ่ม GHI', memberCount: 5 + Math.floor(Math.random() * 3) }
                        ],
                        lastUpdated: new Date().toISOString()
                    }
                };
                return of(baseData);
            }),
            tap(summary => {
                this._summary.next(summary);
            })
        );
    }

    /**
     * Start real-time updates
     */
    private startRealTimeUpdates(): void
    {
        // Initial load
        this.getSummaryOnce().subscribe();
        
        // Set up interval for real-time updates
        this.summaryTimer.subscribe(() => {
            this.getSummaryOnce().subscribe();
        });
    }

    /**
     * Get dashboards
     */
    getDashboardsList(): Observable<any[]>
    {
        return this._httpClient.get<any[]>('/api/dashboard/list');
    }
}
