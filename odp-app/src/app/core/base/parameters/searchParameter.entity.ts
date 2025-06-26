import { HttpParams } from '@angular/common/http';
import { BaseParameter } from './baseParameter.entity';

export class SearchParameter extends BaseParameter {
    public page?: number;
    public limit?: number;
    public keyword?: string;

    // use field name
    public sortBy?: string;
    // value: "asc" or "desc" , default is desc
    public sortType?: string;

    constructor() {
        super();
        this.page = 1;
        this.limit = 10;
    }

    public override toHttpParams(): HttpParams {
        return super.toHttpParams();
    }
}
