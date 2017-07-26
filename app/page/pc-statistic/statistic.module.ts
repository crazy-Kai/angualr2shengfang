import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule }  from '@angular/common';

import { PharmacistsStatisticComponent } from './pharmacists-statistic.component'
import { PharmacistsStatisticService } from './pharmacists-statistic.service'
import { TimeIntervalComponent } from '../common/time-interval/time-interval.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
  ],
  declarations: [
    TimeIntervalComponent,
    PharmacistsStatisticComponent,
  ],
  exports: [
    TimeIntervalComponent,
    PharmacistsStatisticComponent,
  ],
  providers: [PharmacistsStatisticService]
})
export class StatisticModule {}