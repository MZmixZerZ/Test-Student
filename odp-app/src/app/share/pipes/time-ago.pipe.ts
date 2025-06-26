import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'timeAgo',
    standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
    transform(value: Date | string | number): string {
        moment.locale('th');
        return moment(value).fromNow();
    }
}
