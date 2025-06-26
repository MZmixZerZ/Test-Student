import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Company } from './companies.types';


@Injectable({ providedIn: 'root' })
export class CompaniesService {
    private _baseUserUrl = '/api/companies';

    readonly apiUrl = {
        userUrl: this._baseUserUrl,
        userWithIdUrl: (id: string): string => `${this._baseUserUrl}/${id}`,
    };
    private _company: BehaviorSubject<Company | null> = new BehaviorSubject(
        null
    );

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    

    /**
     * Getter for companie
     */
    get company$(): Observable<Company> {
        return this._company.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get companie by id
     */
    getById(id: string): Observable<Company> {
        // console.log(this.apiUrl)
        return this._httpClient.get<any>(this.apiUrl.userWithIdUrl(id)).pipe(
            map((m: any) => m.item),
            tap((company) => {
                // console.log('company', company)
                this._company.next(company);
            })
        );
    }

    update(id: string, body: Company): Observable<any> {
        return this._httpClient.put(this.apiUrl.userWithIdUrl(id), body);
    }

}
