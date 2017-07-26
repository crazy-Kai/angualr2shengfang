import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPlugin } from './dialog.plugin';
import { DialogModel } from './dialog.model';
import { DialogContentPlugin } from './dialog.content.plugin';
export { DialogPlugin } from './dialog.plugin';
export { DialogModel } from './dialog.model';
@NgModule({
  declarations: [
    DialogContentPlugin,
    DialogPlugin
  ],
  exports: [
    DialogPlugin
  ],
  imports: [
    CommonModule,
  ],
})
export class DialogModule {}