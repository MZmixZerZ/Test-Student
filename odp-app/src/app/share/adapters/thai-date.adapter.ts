import { Injectable } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDateFormats } from '@angular/material/core';
import * as moment from 'moment';
import 'moment/locale/th'; // โหลด locale ภาษาไทย

@Injectable()
export class ThaiDateAdapter extends MomentDateAdapter {
    override format(date: moment.Moment, displayFormat: string): string {
        const yearBuddhist = date.year() + 543; // แปลงปี ค.ศ. เป็น พ.ศ.
        return date.format(
            displayFormat.replace('BBBB', yearBuddhist.toString())
        );
    }
}

export const THAI_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'DD/MM/YYYY', // ฟอร์แมตตอนกรอกข้อมูล
    },
    display: {
        dateInput: 'DD MMMM BBBB', // แสดงวันที่เป็น พ.ศ.
        monthYearLabel: 'MMMM BBBB',
        dateA11yLabel: 'DD MMMM BBBB',
        monthYearA11yLabel: 'MMMM BBBB',
    },
};
