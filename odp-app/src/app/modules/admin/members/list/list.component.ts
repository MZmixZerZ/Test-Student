import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDateRangePicker,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MemberService } from 'app/core/member/member.service';
import { Member } from 'app/core/member/member.type';
import { GetMemberParameter } from 'app/core/member/parameters/get-member.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { Observable, Subject, debounceTime, merge, takeUntil } from 'rxjs';
import { TableMemberComponent } from '../table/table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdateMemberDto } from 'app/core/member/dto/update-member.dto';
import { EditMemberComponent } from '../edit/edit.component';

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
        MatSelectModule,
        RouterModule,
        MatTabsModule,
        MatDatepickerModule,
        TableMemberComponent,
        MatTooltipModule,
        EditMemberComponent // เพิ่ม EditMemberComponent ใน imports
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('350ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('350ms ease-in-out', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ]),
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.95)' }),
                animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
        ])
    ]
})
export class MemberListComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

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
    statusControl: UntypedFormControl = new UntypedFormControl('');

    members$: Observable<PageResponse<Member[]>>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    isEditDrawerOpen = false;
    selectedMember: Member | null = null;

    drawerOpened = false;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _memberService: MemberService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.members$ = this._memberService.memberLists$.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300)
        );

        merge(this.statusControl.valueChanges)
            .pipe(debounceTime(300))
            .subscribe(() => {
                this.fetchData();
            });
    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe(data => {
            if (data['openDrawer']) {
                this.drawerOpened = true;
                setTimeout(() => this.matDrawer.open(), 0);
            } else {
                this.drawerOpened = false;
                setTimeout(() => this.matDrawer.close(), 0);
            }
        });
    }

    onOpenCreate(): void {
        const currentUrl = this._router.url;
        if (!currentUrl.endsWith('/create')) {
            this._router.navigate(['create'], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
        } else if (this.matDrawer) {
            this.matDrawer.open();
        }
    }

    onOpenEdit(id: string): void {
        this._router.navigate(['edit', id], { relativeTo: this._activatedRoute, queryParamsHandling: 'preserve' });
    }

    onEdit(member: Member): void {
        this.onOpenEdit(member.id);
    }

    onDelete(member: Member): void {
        this._fuseConfirmationService
            .alertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้ หรือไม่')
            .afterClosed()
            .subscribe((result: boolean) => {
                if (result) {
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
        this.currPage.page = event.pageIndex + 1; // เพิ่ม +1 เพราะ paginator เริ่มที่ 0
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

    onEditMember(member: Member) {
        this.onOpenEdit(member.id);
    }

    closeEditDrawer() {
        this.isEditDrawerOpen = false;
        this.selectedMember = null;
    }

    onDeleteMember(member: Member) {
        this._fuseConfirmationService
            .alertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้ หรือไม่')
            .afterClosed()
            .subscribe((result: boolean) => {
            if (result) {
                this.deleteMember(member.id);
            }
            });
    }
}
