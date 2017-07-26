"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 *  @author: anwen
 *  @Description:TODO(弹窗组件的封装)
 */
var core_1 = require('@angular/core');
var dialog_model_1 = require('./dialog.model');
var adhoc_component_factory_service_1 = require('./adhoc-component-factory.service');
var Dialog = (function () {
    function Dialog() {
        this.isShow = false;
        this.message = "warning";
        this.isConfirm = false;
        this.confirmMessage = "OK";
        this.deniedMessage = "CANCEL";
        this.loading = false;
    }
    return Dialog;
}());
exports.Dialog = Dialog;
var DialogPlugin = (function () {
    function DialogPlugin(dialogModel) {
        this.dialogModel = dialogModel;
        this.title = "知识管理平台";
        this.dialogInfo = new Dialog();
    }
    ;
    //@Description:TODO(提示框)     
    DialogPlugin.prototype.tip = function (message, ignoreLoading) {
        var _this = this;
        this.dialogInfo.isConfirm = false;
        this.dialogInfo.isShow = true;
        this.dialogInfo.message = message;
        this.ignoreLoading = ignoreLoading;
        window.setTimeout(function () {
            if (!_this.dialogInfo.isConfirm) {
                _this.dialogInfo.isShow = false;
            }
            //如果存在一个持续性loading事件，由它来控制关闭
            if (_this.dialogInfo.loading) {
                if (_this.ignoreLoading)
                    return;
                _this.dialogInfo.isShow = true;
                _this.dialogInfo.message = _this.specialMsg;
            }
        }, 2000);
    };
    //@Description: 特殊事件，加载。
    DialogPlugin.prototype.loading = function (message) {
        this.dialogInfo.loading = true;
        this.dialogInfo.isShow = true;
        this.dialogInfo.message = this.specialMsg = message;
    };
    DialogPlugin.prototype.success = function () {
        this.dialogInfo.loading = false;
        this.dialogInfo.isShow = false;
    };
    //@Description:TODO(对话框)    
    DialogPlugin.prototype.confirm = function (message, callbackSuccess, callbackError) {
        this.dialogInfo.isShow = true;
        this.dialogInfo.isConfirm = true;
        this.dialogInfo.message = message;
        this.callbackSuccess = callbackSuccess;
        this.callbackError = callbackError;
    };
    DialogPlugin.prototype.confirmWin = function (message) {
        // return new Observable((observer:any) =>{
        return window.confirm(message || 'Is it OK?');
        // });
    };
    ;
    //@Description:TODO(自定义框)
    DialogPlugin.prototype.myDialog = function () {
        this.dialogInfo.isShow = false;
        this.dialogModel.isTemplate = true;
        // this.dialogModel.setData({ dialogTemplate: myComponent });
    };
    DialogPlugin.prototype.myModule = function () {
        this.dialogModel.customModule = true;
    };
    DialogPlugin.prototype.onClose = function () {
        this.dialogModel.isTemplate = false;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DialogPlugin.prototype, "title", void 0);
    __decorate([
        core_1.ContentChild('dialogTemplate'), 
        __metadata('design:type', core_1.TemplateRef)
    ], DialogPlugin.prototype, "dialogTemplate", void 0);
    DialogPlugin = __decorate([
        core_1.Component({
            selector: 'my-dialog',
            template: "\n    <div class=\"dialog center\" [hidden]=\"!dialogInfo.isShow\">\n        <div class=\"dialog-message\">{{dialogInfo.message}}</div>\n        <div [hidden]=\"!dialogInfo.isConfirm\">\n            <button  class=\"dialog-btn\" (click)=\"dialogInfo.isShow = false;callbackSuccess();\">{{dialogInfo.confirmMessage}}</button>\n            <button  class=\"dialog-btn\" (click)=\"dialogInfo.isShow = false;callbackError();\">{{dialogInfo.deniedMessage}}</button>\n        </div>\n    </div>\n    <div class=\"container\" *ngIf=\"dialogModel.customModule\">\n        <template *ngIf=\"dialogModel.customModule\" [ngTemplateOutlet]=\"dialogTemplate\" [ngOutletContext]=\"{ $implicit: dialogModel }\" ></template>\n        <div class=\"in modal-backdrop fade\"></div>\n    </div>\n    <div class=\"container\" *ngIf=\"dialogModel.isTemplate\">\n        <div class=\"modal\" style=\"display:block;\" [class.fade]=\"!dialogModel.isTemplate\">\n            <div class=\"modal-dialog \">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <button class=\"close\" data-dismiss=\"modal\">\n                        <span (click)=\"onClose()\">x</span>\n                        <span class=\"sr-only\" (click)=\"onClose()\">\u5173\u95ED</span>\n                    </button>\n                        <h4 class=\"modal-title\">{{title}}</h4>\n                    </div>\n                    <my-dialog-content [dialogTemplate]=\"dialogTemplate\"></my-dialog-content>\n                </div>\n            </div>\n        </div>\n        <div class=\"in modal-backdrop fade\" *ngIf=\"dialogModel.isTemplate\"></div>\n    </div>\n    ",
            styles: [require('./dialog.plugin.css') + ""],
            providers: [dialog_model_1.DialogModel, adhoc_component_factory_service_1.AdHocComponentFactoryCreator]
        }), 
        __metadata('design:paramtypes', [dialog_model_1.DialogModel])
    ], DialogPlugin);
    return DialogPlugin;
}());
exports.DialogPlugin = DialogPlugin;
//# sourceMappingURL=dialog.plugin.js.map