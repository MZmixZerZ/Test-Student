import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationConfig } from '@fuse/services/confirmation/confirmation.types';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { merge } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class FuseConfirmationService {
    private _matDialog: MatDialog = inject(MatDialog);
    private _defaultConfig: FuseConfirmationConfig = {
        title: 'Confirm action',
        message: 'Are you sure you want to confirm this action?',
        icon: {
            show: true,
            name: 'heroicons_outline:exclamation-triangle',
            color: 'warn',
        },
        actions: {
            confirm: {
                show: true,
                label: 'Confirm',
                color: 'warn',
            },
            cancel: {
                show: true,
                label: 'Cancel',
            },
        },
        dismissible: false,
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(
        config: FuseConfirmationConfig = {}
    ): MatDialogRef<FuseConfirmationDialogComponent> {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(FuseConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig,
            panelClass: 'fuse-confirmation-dialog-panel',
        });
    }

    alertSuccess(
        title: string = 'สำเร็จ',
        message: string = 'บันทึกข้อมูลสำเร็จ',
        icon: string = "check_circle_outline"
    ): void {
        const config: FuseConfirmationConfig = {
            "title": title,
            "message": message,
            "icon": {
                "show": true,
                "name": icon,
                "color": "success"
            },
            "actions": {
                "confirm": {
                    "show": false,
                },
                "cancel": {
                    "show": false,
                }
            },
            "dismissible": true
        }
        this.open(config);
    }

    alertError(
        title: string = 'ผิดพลาด',
        message: string = 'ผิดพลาด',
        icon: string = "highlight_off"
    ): void {
        const config: FuseConfirmationConfig = {
            "title": title,
            "message": message,
            "icon": {
                "show": true,
                "name": icon,
                "color": "warn"
            },
            "actions": {
                "confirm": {
                    "show": false,
                },
                "cancel": {
                    "show": false,
                }
            },
            "dismissible": true
        }
        this.open(config);
    }

    alertConfirm(
        title: string,
        message: string,
        icon?: {
            icon?: string;
            color?: string
        },
        btnConfirm?:{
            text?: string;
            color?: string
        },
        btnCancel?:{
            text?: string;
            color?: string
        }
    ): MatDialogRef<FuseConfirmationDialogComponent> {
        const config: FuseConfirmationConfig = {
            "title": title,
            "message": message,
            "icon": {
                "show": true,
                "name": icon?.icon || 'heroicons_solid:x-circle',
                "color": icon?.color as any || 'warning'
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": btnConfirm?.text || 'ยืนยัน',
                    "color": btnConfirm?.color as any || 'warn'
                },
                "cancel": {
                    "show": true,
                    "label": btnCancel?.text || 'ยกเลิก'
                }
            },
            "dismissible": true
        };
        return this.open(config);
    }
}
