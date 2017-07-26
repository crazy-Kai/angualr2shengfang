import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'exampipe'})
export class OptRecipeDetailsExamPipe implements PipeTransform {
  transform(examList: any[], arg: any[]) : any {
    return examList.filter(exam => examList.indexOf(exam) % 2 == 0);
  }
}