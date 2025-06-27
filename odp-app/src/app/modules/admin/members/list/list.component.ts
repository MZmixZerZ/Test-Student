import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MemberService } from 'app/core/member/member.service';
import { Member } from 'app/core/member/member.type';
import { GetMemberParameter } from 'app/core/member/parameters/get-member.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { Observable, Subject, debounceTime, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'member-list',
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
        RouterModule,
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class MemberListComponent {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;

    displayedColumns: string[] = [
        'memberId',
        'idCard',
        'organization',
        'contactPerson',
        'contactPhone',
        'actions'
    ];

    isShowReset: boolean = false;
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

    searchInputControl: UntypedFormControl = new UntypedFormControl();

    members$: Observable<PageResponse<Member[]>>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _memberService: MemberService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        // ปิด drawer ทุกครั้งที่เปลี่ยน route (กลับหน้าลิสต์)
        this._router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                if (this.matDrawer && this.matDrawer.opened) {
                    this.matDrawer.close();
                }
            });

        this.members$ = this._memberService.memberLists$.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300)
        );
    }

    onOpenCreate(): void {
        this._router.navigate(['create'], {
            relativeTo: this._activatedRoute,
        });
        setTimeout(() => this.matDrawer?.open(), 100);
    }

    onOpenEdit(id: string): void {
        this._router.navigate(['edit', id], {
            relativeTo: this._activatedRoute,
        });
        setTimeout(() => this.matDrawer?.open(), 100);
    }

    onEdit(member: Member): void {
        if (member.id) {
            this.onOpenEdit(member.id);
        }
    }

    onDelete(member: Member): void {
        this._fuseConfirmationService
            .alertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้ หรือไม่')
            .afterClosed()
            .subscribe((result: boolean) => {
                if (result && member.id) {
                    this.deleteMember(member.id);
                }
            });
    }

    deleteMember(id: string): void {
        this._memberService
            .delete(id)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe(() => {
                this.fetchData();
                this._fuseConfirmationService.alertSuccess();
            });
    }

    onChangePage(event: PageEvent): void {
        this.currPage.limit = event.pageSize;
        this.currPage.page = event.pageIndex + 1;
        this.fetchData();
    }

    getParameter(): GetMemberParameter {
        const param = new GetMemberParameter();
        param.limit = this.currPage.limit;
        param.page = this.currPage.page;
        param.sortBy = this.currPage.sortBy;
        param.sortType = this.currPage.sortType;
        param.keyword = this.searchInputControl.value;
        return param;
    }

    fetchData(): void {
        this._memberService
            .getMemberLists(this.getParameter())
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe();
    }

    onReset() {
        this.searchInputControl.setValue('');
        this.fetchData();
        this.isShowReset = false;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
