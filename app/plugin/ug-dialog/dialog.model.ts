import { Injectable, Component, Input } from '@angular/core';

@Injectable()
export class DialogModel {
    dialogTemplate: any = {};
    _dialogContentComponent: any;
    isTemplate = false;
    customModule = false;
    setData({ dialogTemplate }:any) {
        if (dialogTemplate) {
            this.dialogTemplate = dialogTemplate;
            this.initDialogContentComponent();
        }

    }

    get dialogContentComponent() {
        return this._dialogContentComponent;
    };

    initDialogContentComponent() {
        this._dialogContentComponent = this.dialogTemplate;
        if (typeof this._dialogContentComponent.template === 'string') {
            this._dialogContentComponent = this.createAdHocComponent(this._dialogContentComponent.template);
        }
    }

    createAdHocComponent(templateStr: any): any {
        @Component({
            selector: 'dialog-template',
            template: templateStr,
            styles: [require('./dialog.plugin.css') + ""]
        })
        class AdHocTemplateComponent {
            // @Input() tablecell:any
        }
        return AdHocTemplateComponent;
    }

    private isEmptyObject(obj: any) {
        for (var name in obj) {
            return false;
        }
        return true;
    }

}