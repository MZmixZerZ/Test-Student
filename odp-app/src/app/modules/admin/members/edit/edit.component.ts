import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MemberService } from 'app/core/member/member.service';
import { Member } from 'app/core/member/member.type';
import { CreateMemberDto } from 'app/core/member/dto/create-member.dto';
import { UpdateMemberDto } from 'app/core/member/dto/update-member.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { GetMemberParameter } from 'app/core/member/parameters/get-member.parameter';
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
})
export class EditMemberComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup = null;
    memberId: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private _memberService: MemberService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.memberId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.memberId;
    }

    ngOnInit(): void {
        if (this.isEdit) {
            this._memberService
                .getMemberById(this.memberId)
                .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
                .subscribe((resp: Member) => {
                    this.initForm = this.initialForm(resp);
                });
        } else {
            this.initForm = this.initialForm();
        }
    }

    initialForm(member?: Member): FormGroup {
        return this._formBuilder.group({
            memberId: [member?.memberId || '', [Validators.required]],
            idCard: [member?.idCard || '', [Validators.required]],
            organization: [member?.organization || '', [Validators.required]],
            contactPerson: [member?.contactPerson || '', [Validators.required]],
            contactPhone: [member?.contactPhone || '', [Validators.required]],
        });
    }

    onSave(): void {
        this.disableSave = true;
        const payload = this.initForm.getRawValue();
        if (this.isEdit) {
            this.update(this.memberId, payload);
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
                    const param = new GetMemberParameter();
                    this._memberService.getMemberLists(param).subscribe();
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
                    const param = new GetMemberParameter();
                    this._memberService.getMemberLists(param).subscribe();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: () => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    onClose(): void {
        // ถ้าเป็นหน้าแก้ไข ให้ย้อน 2 step, ถ้าเป็นหน้าเพิ่ม ให้ย้อน 1 step
        if (this.isEdit) {
            this._router.navigate(['../../'], { relativeTo: this._route });
        } else {
            this._router.navigate(['../'], { relativeTo: this._route });
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
