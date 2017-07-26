import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TbodyPlugin } from './tbody.content.plugin';
import { TablePlugin,TChangeCell } from './table.plugin';
import { TableModel } from './table.model';
import { DialogModule } from '../ug-dialog/dialog';

export { TablePlugin } ;
export { TableModel } ;

@NgModule({
  declarations: [
    TbodyPlugin,
    TablePlugin,
    TChangeCell,
  ],
  exports: [
    TablePlugin
  ],
  imports: [
    CommonModule,
    FormsModule,
    DialogModule
  ],
})
export class TableModule {}