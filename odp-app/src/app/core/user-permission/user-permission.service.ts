import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap, of } from 'rxjs';
import { UserPermission } from './user-permission.types';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { GetAdminUserParameter } from './parameters/get-admin-user.parameter';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';

@Injectable({ providedIn: 'root' })
export class UserPermissionService {
    private _baseUserUrl = '/api/admin/users';

    readonly apiUrl = {
        userUrl: this._baseUserUrl,
        userWithIdUrl: (id: string): string => `${this._baseUserUrl}/${id}`
    };

    private _httpClient = inject(HttpClient);
    private _userLists: BehaviorSubject<PageResponse<UserPermission[]>> = new BehaviorSubject<PageResponse<UserPermission[]>>(null);
    private _user: BehaviorSubject<UserPermission> = new BehaviorSubject<UserPermission>(null);

    set userLists(value: PageResponse<UserPermission[]>) {
        this._userLists.next(value);
    }

    set user(value: UserPermission) {
        this._user.next(value);
    }


    get userLists$(): Observable<PageResponse<UserPermission[]>> {
        return this._userLists.asObservable();
    }

    get user$(): Observable<UserPermission> {
        return this._user.asObservable();
    }

    getUserLists(param: GetAdminUserParameter): Observable<PageResponse<UserPermission[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<UserPermission[]>>(this.apiUrl.userUrl,options).pipe(
            tap((user) => {
                this._userLists.next(user);
            })
        );
    }

    getUserById(id: string): Observable<UserPermission> {
        return this._httpClient.get<Response<UserPermission>>(this.apiUrl.userWithIdUrl(id)).pipe(
            map((m: Response<UserPermission>) => m.item),
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    create(body: CreateUserPermissionDto): Observable<any> {
        return this._httpClient.post(this.apiUrl.userUrl, body);
    }

    update(id: string, body: UpdateUserPermissionDto): Observable<any> {
        return this._httpClient.put(this.apiUrl.userWithIdUrl(id), body);
    }

    delete(id: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.userWithIdUrl(id));
    }
}
