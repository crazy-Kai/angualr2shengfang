import { Component, ViewContainerRef, Input, ComponentFactoryResolver, ComponentFactory, ComponentRef,TemplateRef } from '@angular/core';
import { TableModel } from './table.model';
import { AdHocComponentFactoryCreator } from './adhoc-component-factory.service';

export interface ITableTemplate {
  tableinfo:any;
}

@Component({
    selector: 'my-tbody',
    template: `<template [ngTemplateOutlet]="tableTemplate" [ngOutletContext]="{ $implicit: tableinfo }"></template>`,
    styles: [require('./table.plugin.css') + ""]
})
export class TbodyPlugin {
    @Input() tableinfo: any;
    @Input() tableTemplate: TemplateRef<ITableTemplate>;

}