import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { DashboardsService } from './dashboards.services';
import { Dashboard } from './dashboards.types';
import { animate, style, transition, trigger } from '@angular/animations';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [
    CommonModule, 
    MatIconModule, 
    MatTableModule, 
    MatButtonModule, 
    MatCardModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('500ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class DashboardsComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  summary = { member: 0, org: 0, person: 0, stats: null as any };
  dashboards: Dashboard[] = [];
  displayedColumns: string[] = ['name', 'action'];
  isLive = false;
  lastUpdated = new Date();
  
  private chart: Chart | null = null;

  /**
   * Constructor
   */
  constructor(
    private _dashboardsService: DashboardsService,
    private _cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    // ดึงข้อมูล summary แบบ real-time
    this._dashboardsService.getSummary().subscribe({
      next: (res) => {
        this.summary = { ...res, stats: res.stats || null };
        this.isLive = true;
        this.lastUpdated = new Date();
        
        // Update chart if it exists
        if (this.chart) {
          this.updateChart();
        }
        this._cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.isLive = false;
        this._cdr.detectChanges();
      }
    });

    // ดึงข้อมูล dashboards
    this._dashboardsService.getDashboards().subscribe({
      next: (res) => {
        this.dashboards = res.dashboards;
        this._cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dashboards:', error);
        this._cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    if (this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['สมาชิก', 'องค์กร', 'บุคคล'],
            datasets: [{
              label: 'จำนวน',
              data: [this.summary.member, this.summary.org, this.summary.person],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)', 
                'rgba(239, 68, 68, 0.8)'
              ],
              borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(239, 68, 68, 1)'
              ],
              borderWidth: 2,
              borderRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 8,
                displayColors: false
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    size: 12,
                    weight: 'bold' as const
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                  font: {
                    size: 11
                  }
                }
              }
            },
            animation: {
              duration: 1500,
              easing: 'easeInOutCubic'
            }
          }
        });
      }
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.summary.member, 
        this.summary.org, 
        this.summary.person
      ];
      this.chart.update('active');
    }
  }

  /**
   * Manual refresh data
   */
  refreshSummary(): void {
    this.isLive = false;
    this._dashboardsService.getSummaryOnce().subscribe({
      next: (res) => {
        this.summary = { ...res, stats: res.stats || null };
        this.isLive = true;
        this.lastUpdated = new Date();
        
        if (this.chart) {
          this.updateChart();
        }
        this._cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error refreshing summary:', error);
        this.isLive = false;
        this._cdr.detectChanges();
      }
    });
  }

  /**
   * Get growth rate color
   */
  getGrowthColor(rate: number): string {
    if (rate >= 15) return 'text-green-600';
    if (rate >= 10) return 'text-blue-600';
    if (rate >= 5) return 'text-yellow-600';
    return 'text-gray-600';
  }

  /**
   * Format number with K/M suffix
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

