import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injectable,
    Input,
    OnChanges,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { UpdateMemberDto } from 'app/core/member/dto/update-member.dto';
import { Member } from 'app/core/member/member.type';
import { Observable } from 'rxjs';
// import { PersonService } from 'app/core/person/person.service'; // import service

@Injectable({ providedIn: 'root' })
export class PersonService {
    constructor(private http: HttpClient) {}

    getAllPersons(): Observable<{ items: any[] }> {
        return this.http.get<{ items: any[] }>('/api/persons'); // Adjust the endpoint as needed
    }

    getPersonByIdCard(idCard: string): Observable<any> {
        return this.http.get<any>(`/api/persons/${idCard}`);
    }
}

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
export class TableMemberComponent implements OnInit, OnChanges {
    @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

    @Input() memberResp: PageResponse<Member[]>;
    @Output() delete = new EventEmitter<Member>();
    @Output() edit = new EventEmitter<Member>();
    @Output() updateStatus: EventEmitter<{
        id: string;
        body: UpdateMemberDto;
    }> = new EventEmitter<{ id: string; body: UpdateMemberDto }>(null);
    @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(
        null
    );

    displayedColumns: string[] = ['memberid', 'idCard', 'organization', 'contactPerson', 'contactPhone', 'actions'];
    dataSource: Member[] = [];

    Person: { idCard: string; name: string }[] = [];

    personNameCache: { [idCard: string]: string } = {};

    constructor(
        private personService: PersonService,
        private cdr: ChangeDetectorRef // เพิ่มตรงนี้
    ) {}

    ngOnInit(): void {
        this.personService.getAllPersons().subscribe((response) => {
            const persons = response.items;
            this.Person = persons;
            persons.forEach((person) => {
                if (person.n_id) {
                    // รวมชื่อและนามสกุล
                    this.personNameCache[String(person.n_id).trim()] =
                        `${person.name} ${person.surname ?? ''}`.trim();
                }
            });
            console.log('personNameCache:', this.personNameCache);

            if (this.memberResp) {
                this.dataSource = [...this.memberResp.items]; // เปลี่ยน reference
            }
            this.cdr.detectChanges(); // <<== บังคับ refresh view
        });
    }

    ngOnChanges(): void {
        if (Object.keys(this.personNameCache).length > 0 && this.memberResp) {
            console.log('memberResp:', this.memberResp);
            console.log('memberResp.items:', this.memberResp.items);
            this.dataSource = this.memberResp.items;
            console.log('Members:', this.dataSource);
        }
    }

    onChangePage(event: PageEvent) {
        event.pageIndex = event.pageIndex + 1;
        this.changePage.emit(event);
    }

    getPersonNameByIdCard(idCard: string): string {
        const key = String(idCard).trim();
        console.log('Lookup idCard:', key, '=>', this.personNameCache[key]);
        return this.personNameCache[key] || 'ไม่พบชื่อ';
    }

    onEdit(member: Member) {
        this.edit.emit(member);
    }

    onDelete(member: Member) {
        this.delete.emit(member);
    }
}
