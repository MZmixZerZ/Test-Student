import { ChangeDetectorRef, Component, OnInit, Inject, Optional, SkipSelf, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MemberService } from 'app/core/member/member.service';
import { Member } from 'app/core/member/member.type';
import { CreateMemberDto } from 'app/core/member/dto/create-member.dto';
import { UpdateMemberDto } from 'app/core/member/dto/update-member.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MemberListComponent } from '../list/list.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-member',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
    animations: [
        trigger('slideInFromRight', [
            transition(':enter', [
                style({ 
                    transform: 'translateX(100%)', 
                    opacity: 0 
                }),
                animate(
                    '300ms ease-in-out',
                    style({ 
                        transform: 'translateX(0%)', 
                        opacity: 1 
                    })
                ),
            ]),
            transition(':leave', [
                animate(
                    '300ms ease-in-out',
                    style({ 
                        transform: 'translateX(100%)', 
                        opacity: 0 
                    })
                ),
            ]),
        ]),
        trigger('fadeInUp', [
            transition(':enter', [
                style({ 
                    transform: 'translateY(30px)', 
                    opacity: 0 
                }),
                animate(
                    '400ms 100ms ease-out',
                    style({ 
                        transform: 'translateY(0)', 
                        opacity: 1 
                    })
                ),
            ]),
        ]),
    ],
})
export class EditMemberComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup;
    memberid: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    @Input() member: Member | null = null;

    get name() {
        return this.initForm?.get('name');
    }

    constructor(
        private _formBuilder: FormBuilder,
        @Optional() @SkipSelf() private _listMemberComponent: MemberListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _memberService: MemberService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.memberid = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.memberid;
    }

    ngOnInit(): void {
        // สร้างฟอร์มให้ตรงกับ DTO
        this._route.data.subscribe(({ initialData }) => {
            this.initForm = this.initialForm(initialData || undefined);
        });
    }

    initialForm(member?: Member): FormGroup {
        return this._formBuilder.group({
            memberid: [member?.memberid || '', [Validators.required]],
            idCard: [member?.idCard || '', [Validators.required]],
            organization: [member?.organization || '', [Validators.required]],
            contactPerson: [member?.contactPerson || '', [Validators.required]],
            contactPhone: [member?.contactPhone || '', [Validators.required]],
        });
    }

    ngOnChanges() {
        if (this.member) {
            this.initForm.patchValue(this.member);
            this.isEdit = true;
        }
    }

    onSave(): void {
        this.disableSave = true;
        const payload = this.initForm.getRawValue();
        if (this.isEdit) {
            this.update(this.memberid, payload);
        } else {
            this.create(payload);
        }
    }

    create(body: CreateMemberDto): void {
        this._memberService
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: () => {
                    if (this._listMemberComponent) {
                        this._listMemberComponent.fetchData();
                    }
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: () => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    update(id: string, body: UpdateMemberDto): void {
        this._memberService
            .update(id, body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: () => {
                    if (this._listMemberComponent) {
                        this._listMemberComponent.fetchData();
                    }
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: () => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        if (this._listMemberComponent && this._listMemberComponent.matDrawer) {
            return this._listMemberComponent.matDrawer.close();
        }
        return Promise.resolve(null);
    }

    onClose(): void {
        // ปิด Drawer
        if (this._listMemberComponent && this._listMemberComponent.matDrawer) {
            this._listMemberComponent.matDrawer.close();
        }
        // กลับไป route หลัก (เช่น /members)
        this._router.navigateByUrl('/members');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
