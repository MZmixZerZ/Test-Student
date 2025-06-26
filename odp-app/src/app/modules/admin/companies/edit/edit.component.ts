import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CompaniesService } from 'app/core/company/companies.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Company } from '../../../../core/company/companies.types';

@Component({
    selector: 'edit-company',
    templateUrl: './edit.component.html',
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    styles: [
        /* language=SCSS */
        `
            .mat-mdc-form-field-subscript-wrapper {
                display: none !important;
            }
            textarea {
                resize: none;
            }
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    imports: [
        CommonModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatDatepicker,
        MatDatepickerToggle,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        MatRadioModule,
    ],
})
export class EditComponent implements OnInit, OnDestroy {
    initForm: FormGroup = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    logoUrl: string = 'https://cdn-icons-png.flaticon.com/512/3061/3061341.png';

    /**
     * Constructor
     */
    constructor(
        private _companiesService: CompaniesService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the companie
        this._companiesService.company$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (company: Company) => {
                    this.initForm = this.initialForm(company);
                },
                error: (error) => {
                    console.error('Error: ', error);
                },
            });
    }

    initialForm(company?: Company): FormGroup {
        return this._formBuilder.group({
            id: [company.id],
            name: [company?.name || '', [Validators.required]],
            registerNo: [company?.registerNo || '', [Validators.required]],
            companyShortName: [
                company?.companyShortName || '',
                [Validators.required],
            ],
            taxId: [company?.taxId || '', [Validators.required]],
            address: [company?.address || '', [Validators.required]],
        });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     *
     */
    submitForm() {
        const payload: Company = this.initForm.getRawValue();
        console.log(payload);

        this._companiesService
            .update(payload.id, payload)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._fuseConfirmationService.alertSuccess();
                    this.gotoBack();
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    gotoBack() {
        this._router.navigateByUrl('/companies');
    }

    /**
     *
     * @param event
     * @returns
     */
    changeImage(event: Event) {
        const file = (event.target as HTMLInputElement)['files'][0];

        // ไม่มีไฟล์ใหม่ และ ตรวจสอบชนิดของไฟล์
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            this.logoUrl = reader.result as string;

            this.initForm.get('imageName').setValue(file);

            // this._changeDetectorRef.markForCheck();
        };

        reader.readAsDataURL(file);
    }
}
