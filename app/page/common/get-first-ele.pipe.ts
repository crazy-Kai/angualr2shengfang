import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'firstArrEle'})
export class getFirstElePipe implements PipeTransform {
  transform(arrList: any[]) : any {
    return arrList.filter(item => arrList.indexOf(item) == 0);
  }
}