import { SearchParameter } from 'app/core/base/parameters/searchParameter.entity';

export class GetPersonParameter extends SearchParameter {
    name?: string;
    surname?: string;
    n_id?: string;
    phone?: string;
    nationality?: string;
    citizen?: string;
    religion?: string;
    address?: string;
}
