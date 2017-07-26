/**
 *  @author: anwen
 *  @Description:TODO(弹窗组件的自定义模板封装)     
 */
import { Component, ViewContainerRef, Input, ComponentFactoryResolver, TemplateRef } from '@angular/core';
import { DialogModel } from './dialog.model';
import { AdHocComponentFactoryCreator } from './adhoc-component-factory.service';

export interface IDialogModel {
    dialogModel:DialogModel
}

@Component({
    selector: 'my-dialog-content',
    template: '<template [ngTemplateOutlet]="dialogTemplate" [ngOutletContext]="{ $implicit: dialogModel }" ></template>',
    styles: [require('./dialog.plugin.css') + ""]
})
export class DialogContentPlugin {
    @Input() dialogTemplate: TemplateRef<IDialogModel>;

    constructor(private dialogModel: DialogModel,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private adHocComponentFactoryCreator: AdHocComponentFactoryCreator) {
    }

    ngAfterViewInit() {
        // this.loadDialogContent();
    }

    loadDialogContent() {
        // this.componentLoader.loadNextToLocation(this.dialogModel.dialogContentComponent,
        //     this.viewContainerRef);
        let componentFactory: any;
        try {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dialogModel.dialogContentComponent);
        } catch (error) {
            componentFactory = this.adHocComponentFactoryCreator.getFactory(this.dialogModel.dialogContentComponent);
        }
        let componentRef = this.viewContainerRef.createComponent(componentFactory);
        componentRef.changeDetectorRef.detectChanges();
    }
}