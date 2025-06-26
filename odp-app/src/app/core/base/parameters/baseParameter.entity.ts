import { HttpParams } from '@angular/common/http';

export class BaseParameter {
    constructor() {}

    public toHttpParams(): HttpParams {
        const k = Object.keys(this);
        let httpParam = new HttpParams();

        k.forEach((key: string) => {
            const value: any = this[key as keyof this];
            if (value !== null && value !== undefined) {
                if (value instanceof Date) {
                    httpParam = httpParam.set(key, value.toISOString());
                } else if (value instanceof Array) {
                    value.forEach((item) => {
                        httpParam = httpParam.append(
                            `${key.toString()}[]`,
                            item
                        );
                    });
                } else {
                    httpParam = httpParam.set(key, value);
                }
            }
        });
        return httpParam;
    }
}
