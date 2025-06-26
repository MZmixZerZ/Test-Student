import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Person } from './person.type';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonService {
    private _basePersonUrl = `${environment.apiUrl}/persons`;

    readonly apiUrl = {
        personUrl: this._basePersonUrl,
        personWithIdUrl: (id: string): string => `${this._basePersonUrl}/${id}`
    };

    private _httpClient = inject(HttpClient);
    private _personLists: BehaviorSubject<PageResponse<Person[]>> = new BehaviorSubject<PageResponse<Person[]>>(null);
    private _person: BehaviorSubject<Person> = new BehaviorSubject<Person>(null);

    set personLists(value: PageResponse<Person[]>) {
        this._personLists.next(value);
    }

    set person(value: Person) {
        this._person.next(value);
    }

    get personLists$(): Observable<PageResponse<Person[]>> {
        return this._personLists.asObservable();
    }

    get person$(): Observable<Person> {
        return this._person.asObservable();
    }

    getPersonLists(param: SearchParameter): Observable<PageResponse<Person[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Person[]>>(this.apiUrl.personUrl, options).pipe(
            tap((personResp) => {
                if (personResp?.items) {
                    personResp.items = personResp.items.map((p: any) => ({
                        ...p,
                        id: p.id || p._id || p.n_id,
                        name: p.name ?? p.firstname ?? '',
                        surname: p.surname ?? '',
                        phone: p.phone ?? '',
                        nationality: p.nationality ?? '',
                        citizen: p.citizen ?? '',
                        religion: p.religion ?? '',
                        address: p.address ?? '',
                    }));
                }
                // เก็บ search param ล่าสุดไว้ใน response
                (personResp as any)._searchParam = param;
                this._personLists.next(personResp);
            })
        );
    }

    getPersonById(id: string): Observable<Person> {
        return this._httpClient.get<Response<Person>>(this.apiUrl.personWithIdUrl(id)).pipe(
            map((m: Response<Person>) => {
                if (m?.item) {
                    return {
                        ...m.item,
                        id: m.item.id || m.item.n_id || m.item.n_id,
                        name: m.item.name ?? m.item.name ?? '',
                        surname: m.item.surname ?? '',
                        phone: m.item.phone ?? '',
                        nationality: m.item.nationality ?? '',
                        citizen: m.item.citizen ?? '',
                        religion: m.item.religion ?? '',
                        address: m.item.address ?? '',
                    };
                }
                return m?.item;
            }),
            tap((person) => {
                this._person.next(person);
            })
        );
    }

    create(body: CreatePersonDto): Observable<Person> {
        return this._httpClient.post<Person>(this.apiUrl.personUrl, body).pipe(
            tap(() => {
                // หลังสร้างข้อมูลใหม่ ให้รีเฟรชรายการ
                this.refreshPersonLists();
            })
        );
    }

    update(id: string, body: UpdatePersonDto): Observable<Person> {
        return this._httpClient.put<Person>(this.apiUrl.personWithIdUrl(id), body).pipe(
            tap(() => {
                // หลังอัปเดตข้อมูล ให้รีเฟรชรายการ
                this.refreshPersonLists();
            })
        );
    }

    delete(id: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.personWithIdUrl(id)).pipe(
            tap(() => {
                // หลังลบข้อมูล ให้รีเฟรชรายการ
                this.refreshPersonLists();
            })
        );
    }

    refreshPersonLists(): void {
        const lastValue = this._personLists.value;
        if (lastValue && (lastValue as any)._searchParam) {
            this.getPersonLists((lastValue as any)._searchParam).subscribe();
        }
    }
}
