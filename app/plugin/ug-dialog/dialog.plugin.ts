/**
 *  @author: anwen
 *  @Description:TODO(弹窗组件的封装)     
 */
import { Component, Input, Output, ContentChild, TemplateRef } from '@angular/core';
import { DialogContentPlugin } from './dialog.content.plugin';
import { DialogModel } from './dialog.model';
import { Observable } from 'rxjs/Observable';
import { AdHocComponentFactoryCreator } from './adhoc-component-factory.service';
import { IDialogModel } from './dialog.content.plugin';
export class Dialog {
    isShow: boolean;//false显现，true隐藏
    message: string;
    isConfirm: boolean;
    confirmMessage: string;
    deniedMessage: string;
    loading: boolean;
    constructor() {
        this.isShow = false;
        this.message = "warning";
        this.isConfirm = false;
        this.confirmMessage = "OK";
        this.deniedMessage = "CANCEL";
        this.loading = false;
    }
}

@Component({
    selector: 'my-dialog',
    template: `
    <div class="dialog center" [hidden]="!dialogInfo.isShow">
        <div class="dialog-message">{{dialogInfo.message}}</div>
        <div [hidden]="!dialogInfo.isConfirm">
            <button  class="dialog-btn" (click)="dialogInfo.isShow = false;callbackSuccess();">{{dialogInfo.confirmMessage}}</button>
            <button  class="dialog-btn" (click)="dialogInfo.isShow = false;callbackError();">{{dialogInfo.deniedMessage}}</button>
        </div>
    </div>
    <div class="container" *ngIf="dialogModel.customModule">
        <template *ngIf="dialogModel.customModule" [ngTemplateOutlet]="dialogTemplate" [ngOutletContext]="{ $implicit: dialogModel }" ></template>
        <div class="in modal-backdrop fade"></div>
    </div>
    <div class="container" *ngIf="dialogModel.isTemplate">
        <div class="modal" style="display:block;" [class.fade]="!dialogModel.isTemplate">
            <div class="modal-dialog ">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" data-dismiss="modal">
                        <span (click)="onClose()">x</span>
                        <span class="sr-only" (click)="onClose()">关闭</span>
                    </button>
                        <h4 class="modal-title">{{title}}</h4>
                    </div>
                    <my-dialog-content [dialogTemplate]="dialogTemplate"></my-dialog-content>
                </div>
            </div>
        </div>
        <div class="in modal-backdrop fade" *ngIf="dialogModel.isTemplate"></div>
    </div>
    `,
    styles: [require('./dialog.plugin.css') + ""],
    providers: [DialogModel, AdHocComponentFactoryCreator]
})
export class DialogPlugin {
    @Input() title = "知识管理平台";
    @ContentChild('dialogTemplate') dialogTemplate: TemplateRef<IDialogModel>;
    callbackSuccess: any;
    callbackError: any;
    dialogInfo = new Dialog();
    constructor(private dialogModel: DialogModel) { };
    specialMsg: string;
    ignoreLoading: boolean;
    //@Description:TODO(提示框)     
    tip(message: string, ignoreLoading?: boolean) {     //ignoreLoading  忽略持续性loading事件  直接关闭对话框
        this.dialogInfo.isConfirm = false;
        this.dialogInfo.isShow = true;
        this.dialogInfo.message = message;
        this.ignoreLoading = ignoreLoading;
        window.setTimeout(() => {
            if (!this.dialogInfo.isConfirm) {
                this.dialogInfo.isShow = false;
            }
            //如果存在一个持续性loading事件，由它来控制关闭
            if (this.dialogInfo.loading) {
                if (this.ignoreLoading) return;

                this.dialogInfo.isShow = true;
                this.dialogInfo.message = this.specialMsg;
            }
        }, 2000);
    }

    //@Description: 特殊事件，加载。
    loading(message: string) {
        this.dialogInfo.loading = true;
        this.dialogInfo.isShow = true;
        this.dialogInfo.message = this.specialMsg = message;
    }
    success() {
        this.dialogInfo.loading = false;
        this.dialogInfo.isShow = false;
    }

    //@Description:TODO(对话框)    
    confirm(message: string, callbackSuccess: () => void, callbackError: () => void) {
        this.dialogInfo.isShow = true;
        this.dialogInfo.isConfirm = true;
        this.dialogInfo.message = message;
        this.callbackSuccess = callbackSuccess;
        this.callbackError = callbackError;
    }


    confirmWin(message?: string) {
        // return new Observable((observer:any) =>{
        return window.confirm(message || 'Is it OK?');
        // });
    };

    //@Description:TODO(自定义框)
    myDialog() {
        this.dialogInfo.isShow = false;
        this.dialogModel.isTemplate = true;
        // this.dialogModel.setData({ dialogTemplate: myComponent });
    }
    myModule(){
        this.dialogModel.customModule = true;
    }

    onClose() {
        this.dialogModel.isTemplate = false;
    }
}