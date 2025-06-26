import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap, of } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Member } from './member.type';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable({ providedIn: 'root' })
export class MemberService {
    private _baseMemberUrl = '/api/members';

    readonly apiUrl = {
        memberUrl: this._baseMemberUrl,
        memberWithIdUrl: (id: string): string => `${this._baseMemberUrl}/${id}`
    };

    private _httpClient = inject(HttpClient);
    private _memberLists: BehaviorSubject<PageResponse<Member[]>> = new BehaviorSubject<PageResponse<Member[]>>(null);
    private _member: BehaviorSubject<Member> = new BehaviorSubject<Member>(null);

    set memberLists(value: PageResponse<Member[]>) {
        this._memberLists.next(value);
    }

    set member(value: Member) {
        this._member.next(value);
    }


    get memberLists$(): Observable<PageResponse<Member[]>> {
        return this._memberLists.asObservable();
    }

    get member$(): Observable<Member> {
        return this._member.asObservable();
    }

    getMemberLists(param: SearchParameter): Observable<PageResponse<Member[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Member[]>>(this.apiUrl.memberUrl,options).pipe(
            tap((member) => {
                this._memberLists.next(member);
            })
        );
    }

    getMemberById(id: string): Observable<Member> {
        return this._httpClient.get<Response<Member>>(this.apiUrl.memberWithIdUrl(id)).pipe(
            map((m: Response<Member>) => m.item),
            tap((member) => {
                this._member.next(member);
            })
        );
    }

    create(body: CreateMemberDto): Observable<any> {
        return this._httpClient.post(this.apiUrl.memberUrl, body);
    }

    update(id: string, body: UpdateMemberDto): Observable<any> {
        return this._httpClient.put(this.apiUrl.memberWithIdUrl(id), body);
    }

    delete(id: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.memberWithIdUrl(id));
    }
}
