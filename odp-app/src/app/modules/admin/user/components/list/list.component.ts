import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UpdateUserPermissionDto } from 'app/core/user-permission/dto/update-user-permission.dto';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { Role } from 'app/core/user-permission/enum/role.enum';
import { GetAdminUserParameter } from 'app/core/user-permission/parameters/get-admin-user.parameter';
import { UserPermissionService } from 'app/core/user-permission/user-permission.service';
import { UserPermission } from 'app/core/user-permission/user-permission.types';
import { Observable, Subject, debounceTime, merge, takeUntil } from 'rxjs';
import { UserTableComponent } from '../table/table.component';
import { CommonSearchComponent } from 'app/share/components/common-search/common-search.component';
import { CommonSearch, SearchConfig } from 'app/share/components/common-search/common-search.type';
@Component({
    selector: 'user-list',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatSelectModule,
        RouterModule,
        MatTabsModule,
        UserTableComponent,
        MatButtonToggleModule,
        CommonSearchComponent
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class UserListComponent implements OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    readonly isActiveLists: { displayName: string; value: boolean }[] = [
        { displayName: 'ทั้งหมด', value: null },
        { displayName: 'ใช้งาน', value: true },
        { displayName: 'ปิดการใช้งาน', value: false },
    ];

    showLoading = {
        search: false,
    };

    drawerMode: 'side' | 'over' = 'over';
    currPage: Page = {
        page: 1,
        limit: DEF_LIMIT,
        sortBy: 'updatedAt',
        sortType: SortType.desc,
    };
    searchConfig:SearchConfig = {
        placeholder: {
            keyword: 'ค้นหา ชื่อผู้ใช้, อีเมล, เบอร์โทรศัพท์'
        },
        label: {
            keyword: 'ค้นหา ชื่อผู้ใช้, อีเมล, เบอร์โทรศัพท์'
        },
        useRangeDate: false
    };
    
    role = Role;

    searchControl: FormControl<CommonSearch> = new FormControl<CommonSearch>(null);
    isActiveControl: UntypedFormControl = new UntypedFormControl(
        this.isActiveLists[0]
    );
    roleUserControl: UntypedFormControl = new UntypedFormControl();

    users$: Observable<PageResponse<UserPermission[]>>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _userPermissionService: UserPermissionService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.users$ = this._userPermissionService.userLists$.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300)
        );

        merge(
            this.isActiveControl.valueChanges,
            this.roleUserControl.valueChanges,
            this.searchControl.valueChanges
        )
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe(() => {
                this.fetchData();
            });
    }

    get getIsActive(): boolean {
        return this.isActiveControl.value.value;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onChangeTap(event: MatTabChangeEvent): void {
        const role = event.tab.textLabel as string;
        this.roleUserControl.setValue(role);
    }

    onOpenCreate(): void {
        this._router.navigate(['./', 'create'], {
            relativeTo: this._activatedRoute,
        });
    }

    onOpenEdit(id: string): void {
        this._router.navigate(['./', 'edit', id], {
            relativeTo: this._activatedRoute,
        });
    }

    onEdit(user: UserPermission): void {
        this.onOpenEdit(user.id);
    }

    onDelete(userPermission: UserPermission): void {
        this._fuseConfirmationService
            .alertConfirm('ลบข้อมูล', 'คุณต้องการลบบัญชีผู้ใช่งาน หรือไม่')
            .afterClosed()
            .pipe(debounceTime(300))
            .subscribe((result: boolean) => {
                if (result) {
                    this.deleteUser(userPermission.id);
                }
            });
    }

    deleteUser(id: string): void {
        this._userPermissionService
            .delete(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.fetchData();
                this._fuseConfirmationService.alertSuccess();
            });
    }

    onChangePage(even: PageEvent): void {
        this.currPage.limit = even.pageSize;
        this.currPage.page = even.pageIndex;
        this.fetchData();
    }

    onUpdateStatus(data: {id: string, body: UpdateUserPermissionDto}): void {
        this._userPermissionService
        .update(data.id, data.body)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((res) => {
            this.fetchData();
            this._fuseConfirmationService.alertSuccess();
        });
    }

    onSelectedIsActive(isActive: {
        displayName: string;
        value: boolean;
    }): void {
        this.isActiveControl.setValue(isActive);
    }

    getParameter(): GetAdminUserParameter {
        const param = new GetAdminUserParameter();
        const search = this.searchControl.value;

        param.limit = this.currPage.limit;
        param.page = this.currPage.page;
        param.sortBy = this.currPage.sortBy;
        param.sortType = this.currPage.sortType;
        param.keyword = search?.keyword;
        param.isActive = this.getIsActive;
        param.roles = this.roleUserControl.value;
        console.log(param);
        return param;
    }

    fetchData(): void {
        this._userPermissionService
            .getUserLists(this.getParameter())
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
    }

    onSearch(search: CommonSearch): void {
        this.searchControl.setValue(search);
    }

}
