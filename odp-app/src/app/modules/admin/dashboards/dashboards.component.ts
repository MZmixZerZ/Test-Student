import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DashboardsService } from './dashboards.services';
import { Dashboard } from './dashboards.types';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [CommonModule, MatIconModule, MatTableModule],
})
export class DashboardsComponent implements OnInit {
  summary = { member: 0, org: 0, person: 0 };
  dashboards: Dashboard[] = [];
  displayedColumns: string[] = ['name', 'action'];

  /**
     * Constructor
     */
    constructor(private _dashboardsService: DashboardsService)
    {
    }

    ngOnInit(): void {
      // ดึงข้อมูล summary
      this._dashboardsService.getSummary().subscribe(res => {
        this.summary = res;
      });

      // ดึงข้อมูล dashboards
      this._dashboardsService.getDashboards().subscribe(res => {
        this.dashboards = res.dashboards;
      });
    }
}

