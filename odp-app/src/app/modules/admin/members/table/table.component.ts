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
import { PageResponse } from 'app/core/base/pageResponse.types';
import { UpdateMemberDto } from 'app/core/member/dto/update-member.dto';
import { Member } from 'app/core/member/member.type';
import { Person } from 'app/core/person/person.type';

@Component({
    selector: 'app-table-member',
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
export class TableMemberComponent implements OnChanges {
    @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

    @Input() memberResp: PageResponse<Member[]>;
    @Output() delete: EventEmitter<Member> = new EventEmitter<Member>(null);
    @Output() edit: EventEmitter<Member> = new EventEmitter<Member>(null);
    @Output() updateStatus: EventEmitter<{
        id: string;
        body: UpdateMemberDto;
    }> = new EventEmitter<{ id: string; body: UpdateMemberDto }>(null);
    @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(
        null
    );

    displayedColumns: string[] = ['memberid', 'name', 'edit'];
    dataSource: Member[] = [];

    Person: { idCard: string; name: string }[] = [];

    ngOnChanges(): void {
        this.dataSource = this.memberResp.items;
    }

    onChangePage(event: PageEvent) {
        event.pageIndex = event.pageIndex + 1;
        this.changePage.emit(event);
    }

    getPersonNameByIdCard(idCard: string): string {
        const found = this.Person?.find(p => p.idCard === idCard);
        if (!found) {
            console.warn(`Person with idCard ${idCard} not found.`);
            return '-';
        }
        return found?.name
    }
}
