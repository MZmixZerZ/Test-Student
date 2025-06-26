import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { UpdateUserPermissionDto } from 'app/core/user-permission/dto/update-user-permission.dto';
import { UserPermission } from 'app/core/user-permission/user-permission.types';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIcon,
    MatMenuModule,
    MatSelectModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class UserTableComponent implements OnChanges {
  @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

  @Input() usersResp: PageResponse<UserPermission[]>;
  @Output() delete: EventEmitter<UserPermission> = new EventEmitter<UserPermission>(null);
  @Output() edit: EventEmitter<UserPermission> = new EventEmitter<UserPermission>(null);
  @Output() updateStatus: EventEmitter<{id: string, body: UpdateUserPermissionDto}> = new EventEmitter<{id: string, body: UpdateUserPermissionDto}>(null);
  @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(null);

  displayedColumns: string[] = ['username', 'phoneNumber', 'role', 'isActive', 'edit'];
  dataSource: UserPermission[] = [];

  selectOptions = [
    { display: 'ใช้งาน', value: true },
    { display: 'ปิดใช้งาน', value: false }
  ];
  

  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
  ){
      
  }

  ngOnChanges(changes: SimpleChanges): void {
   this.dataSource = this.usersResp.items;
  }

  onChangePage(event: PageEvent) {
    event.pageIndex = event.pageIndex + 1;
    this.changePage.emit(event);
  }

  onStatusChange(user: UserPermission, status: boolean): void {
    this._fuseConfirmationService.alertConfirm(
      'ยืนยันการเปลี่ยนสถานะ',
      `คุณต้องการเปลี่ยนสถานะเป็น${(status)? 'เปิดใช้งาน' : 'ปิดใช้งาน'} หรือไม่`,
      {
          icon: "warning",
          color: "warning"
      },
      { 
          color: 'primary'
      }
    )
    .afterClosed().subscribe((res: boolean) => {
      if(res) {
        const body = {
          id: user.id,
          body: {
            isActive: status
          } as UpdateUserPermissionDto
        }
        this.updateStatus.emit(body);
      } else {
        this.selectStatues.forEach(f => {
          f.value = null;
        });
      }
    })
  }
}
