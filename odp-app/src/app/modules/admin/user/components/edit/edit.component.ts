import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Role } from 'app/core/user-permission/enum/role.enum';
import { UserPermissionService } from 'app/core/user-permission/user-permission.service';
import { UserPermission } from 'app/core/user-permission/user-permission.types';
import { Observable, Subject, catchError, debounceTime, takeUntil } from 'rxjs';
import { UserListComponent } from '../list/list.component';

@Component({
    selector: 'app-user-edit',
    standalone: true,
    imports: [
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
        TitleCasePipe,
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
})
export class UserEditComponent implements OnDestroy {
    readonly patternPassword = '(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]+';
    isEdit: boolean = false;
    initForm: FormGroup = null;
    enterPassword: boolean;
    role = Role;
    userId: string;

    displayRoles: Role[] = [Role.admin, Role.operator];
    disabledSave: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _formBuilder: FormBuilder,
        private _userListComponent: UserListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _userPermissionService: UserPermissionService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.userId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.userId;

        this.enterPassword = this.isEdit ? false : true;
        this._userListComponent.matDrawer.open();

        this._userPermissionService.user$
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((resp: UserPermission) => {
                this.initForm = this.initialForm(resp);
                this.initForm.setValidators(this.comparisonValidator());
            });
    }

    get getUsername() {
        return this.initForm.get('username');
    }
    get getPassword() {
        return this.initForm.get('password');
    }
    get getConfirmPassword() {
        return this.initForm.get('confirmPassword');
    }
    get getCheckConfirmPass(): boolean {
        return !!this.initForm?.hasError('passwordMismatch');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    initialForm(user?: UserPermission): FormGroup {
        const selectedRole = user?.role; // role ที่ถูกเลือก

        return this._formBuilder.group({
            fullName: [user?.fullName || '', [Validators.required]],
            username: [
                user?.username || '',
                [Validators.required, Validators.email],
            ],
            password: [
                { value: '', disabled: !this.enterPassword },
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(20),
                    Validators.pattern(this.patternPassword),
                ],
            ],
            confirmPassword: [
                { value: '', disabled: !this.enterPassword },
                [Validators.required],
            ],
            email: [user?.email || ''],
            phoneNumber: [
                user?.phoneNumber || '',
                [
                    Validators.required,
                    Validators.pattern('^[0-9]+$'),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            role: [user?.role || '', [Validators.required]],
            isActive: [
                user?.isActive === null || user?.isActive === undefined
                    ? true
                    : user.isActive,
                [Validators.required],
            ],
        });
    }

    comparisonValidator(): any {
        return (group: FormGroup): ValidationErrors | null => {
            const password = group?.controls['password'].value;
            const confirmPassword = group?.controls['confirmPassword'].value;

            if (password !== confirmPassword) {
                return { passwordMismatch: true }; //Error
            } else {
                return null;
            }
        };
    }

    requiredRoleValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const rolesArray = control.value;
            const isValid = rolesArray.some((role: boolean) => role === true);
            return isValid ? null : { requiredRole: true };
        };
    }

    onChangePassword(): void {
        // this.initForm.get('password')?.enable();
        // this.initForm.get('confirmPassword')?.enable();
        this.getPassword.enable();
        this.getConfirmPassword.enable();
        this.enterPassword = true;
    }

    getSelectedRoles(): string[] {
        const selectedRoles = this.initForm.get('roles')?.value;
        return this.displayRoles.filter((_, index) => selectedRoles[index]);
    }

    onSave(): void {
        this.disabledSave = true;
        const payload = this.initForm.getRawValue();
        payload.email = payload.username;
        delete payload.confirmPassword;

        let action$: Observable<any>;
        if (this.isEdit) {
            action$ = this._userPermissionService.update(this.userId, payload);
        } else {
            action$ = this._userPermissionService.create(payload);
        }

        action$
            .pipe(
                takeUntil(this._unsubscribeAll),
                catchError((err) => {
                    this.disabledSave = false;
                    return err;
                })
            )
            .subscribe((res) => {
                this._userListComponent.fetchData();
                this.onClose();
                this._fuseConfirmationService.alertSuccess();
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._userListComponent.matDrawer.close();
    }

    onClose(): void {
        this.closeDrawer().then(() => {
            if (this.isEdit) {
                this.backFromUpdate();
            } else {
                this.backFromCreate();
            }
        });
    }

    backFromCreate(): void {
        this._router.navigate(['../'], { relativeTo: this._route });
    }

    backFromUpdate(): void {
        this._router.navigate(['../../'], { relativeTo: this._route });
    }
}
