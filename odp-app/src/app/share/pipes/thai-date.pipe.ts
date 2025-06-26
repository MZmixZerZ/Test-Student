import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thaidate',
  standalone: true
})
export class ThaiDatePipe implements PipeTransform {
  /**
   * @param [format='medium']
   * full : วันจันทร์ ที่ 23 มีนาคม พ.ศ. 2559
   * long : 23 มีนาคม 2559
   * medium : 23 มี.ค. 2559
   * short : 23/03/2559
   * @param [timeFormat='medium']
   * full : ??
   * long : ??
   * medium : 15:32:00
   * short : 15:32
   * */
  //
  transform(date: string, dateFormat?: string, timeFormat?: string): string {
    if (!date) {
      return '';
    }

    const inputDate = new Date(date);
    dateFormat = dateFormat ?? 'medium';

    let returnFormat = this._toDateFormat(inputDate, dateFormat);

    if (timeFormat) {
      returnFormat += ' ' + this._toTimeFormat(inputDate, timeFormat);
    }

    return returnFormat;
  }

  private _toTimeFormat(inputDate: Date, format: string): string {
    let timeFormat: string = '';

    let hr = inputDate.getHours().toString().padStart(2, "0");
    let min = inputDate.getMinutes().toString().padStart(2, "0");
    let sec = inputDate.getSeconds().toString().padStart(2, "0");


    switch (format) {
      case 'full':
        // TODO: implement later
        break;
      case 'long':
        // TODO: implement later
        break;
      case 'medium':
        timeFormat = `${hr}:${min}:${sec}`;
        break;
      case 'short':
      default:
        timeFormat = `${hr}:${min}`;
        break;

    }

    return timeFormat;
  }

  private _toDateFormat(inputDate: Date, format: string): string {
    let dateFormat: string = '';

    const thaiDay = [
      'อาทิตย์',
      'จันทร์',
      'อังคาร',
      'พุธ',
      'พฤหัสบดี',
      'ศุกร์',
      'เสาร์',
    ];
    const shortThaiMonth = [
      'ม.ค.',
      'ก.พ.',
      'มี.ค.',
      'เม.ย.',
      'พ.ค.',
      'มิ.ย.',
      'ก.ค.',
      'ส.ค.',
      'ก.ย.',
      'ต.ค.',
      'พ.ย.',
      'ธ.ค.',
    ];
    const longThaiMonth = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    const yearBD = inputDate.getFullYear() + 543;

    const dayOfWeek = inputDate.getDay();
    const day = inputDate.getDate();
    const month = inputDate.getMonth();

    switch (format) {
      case 'full':
        dateFormat = `วัน ${thaiDay[dayOfWeek]} ที่ ${day} เดือน ${longThaiMonth[month]} พ.ศ. ${yearBD}`;
        break;
      case 'long':
        dateFormat = `${day} ${longThaiMonth[month]} ${yearBD}`;
        break;
      case 'short':
        dateFormat = `${day.toString().padStart(2, "0")}/${(month + 1).toString().padStart(2, "0")}/${yearBD}`;
        break;
      case 'medium':
      default:
        dateFormat = `${day} ${shortThaiMonth[month]} ${yearBD}`;
        break;
    }

    return dateFormat;
  }

}
