import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Person } from 'app/core/person/person.type';
import { UpdatePersonDto } from 'app/core/person/dto/update-person.dto';
import { PageResponse } from 'app/core/base/pageResponse.types';

@Component({
    selector: 'app-table-person',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIcon,
        MatMenuModule,
        MatSelectModule,
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
})
export class TablePersonComponent implements OnChanges {
    @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

    @Input() personResp: PageResponse<Person[]>;
    @Output() delete: EventEmitter<Person> = new EventEmitter<Person>(null);
    @Output() edit: EventEmitter<Person> = new EventEmitter<Person>(null);
    @Output() updateStatus: EventEmitter<{id: string, body: UpdatePersonDto}> = new EventEmitter<{id: string, body: UpdatePersonDto}>(null);
    @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(
        null
    );

    displayedColumns: string[] = [
        'id',
        'name',
        'edit'
    ];
    dataSource: Person[] = [];

    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource = this.personResp.items;
    }

    onChangePage(event: PageEvent) {
        event.pageIndex = event.pageIndex + 1;
        this.changePage.emit(event);
    }
}
