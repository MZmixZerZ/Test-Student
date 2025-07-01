import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { dashboards as dashboardsData } from './data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class DashboardsMockApi {
    private _dashboards: any = dashboardsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Dashboards - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards')
            .reply(() => [200, cloneDeep(this._dashboards)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Dashboard - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/dashboards/dashboard')
            .reply(() => {
                // Generate a new dashboard
                const newDashboard = {
                    id: Date.now().toString(),
                    name: 'New Dashboard',
                    description: 'A new dashboard',
                    createdAt: new Date().toISOString(),
                };

                // Add the new dashboard to dashboards
                this._dashboards.dashboards.unshift(newDashboard);

                // Return the response
                return [200, newDashboard];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Dashboard - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/dashboards')
            .reply(({ request }) => {
                // Get the id and dashboard
                const id = request.body.id;
                const dashboard = cloneDeep(request.body.dashboard);

                // Prepare the updated dashboard
                let updatedDashboard = null;

                // Find the dashboard and update it
                this._dashboards.dashboards = this._dashboards.dashboards.map((item) => {
                    if (item.id === id) {
                        // Update the dashboard
                        updatedDashboard = { ...item, ...dashboard };
                        return updatedDashboard;
                    }

                    return item;
                });

                // Return the response
                return [200, updatedDashboard];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Dashboard - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/dashboards')
            .reply(({ request }) => {
                // Get the id
                const id = request.params.get('id');

                // Find the dashboard and delete it
                this._dashboards.dashboards = this._dashboards.dashboards.filter((item) => item.id !== id);

                // Return the response
                return [200, true];
            });
    }
}
