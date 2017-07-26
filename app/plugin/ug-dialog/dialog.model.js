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
var core_1 = require('@angular/core');
var DialogModel = (function () {
    function DialogModel() {
        this.dialogTemplate = {};
        this.isTemplate = false;
        this.customModule = false;
    }
    DialogModel.prototype.setData = function (_a) {
        var dialogTemplate = _a.dialogTemplate;
        if (dialogTemplate) {
            this.dialogTemplate = dialogTemplate;
            this.initDialogContentComponent();
        }
    };
    Object.defineProperty(DialogModel.prototype, "dialogContentComponent", {
        get: function () {
            return this._dialogContentComponent;
        },
        enumerable: true,
        configurable: true
    });
    ;
    DialogModel.prototype.initDialogContentComponent = function () {
        this._dialogContentComponent = this.dialogTemplate;
        if (typeof this._dialogContentComponent.template === 'string') {
            this._dialogContentComponent = this.createAdHocComponent(this._dialogContentComponent.template);
        }
    };
    DialogModel.prototype.createAdHocComponent = function (templateStr) {
        var AdHocTemplateComponent = (function () {
            function AdHocTemplateComponent() {
            }
            AdHocTemplateComponent = __decorate([
                core_1.Component({
                    selector: 'dialog-template',
                    template: templateStr,
                    styles: [require('./dialog.plugin.css') + ""]
                }), 
                __metadata('design:paramtypes', [])
            ], AdHocTemplateComponent);
            return AdHocTemplateComponent;
        }());
        return AdHocTemplateComponent;
    };
    DialogModel.prototype.isEmptyObject = function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };
    DialogModel = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DialogModel);
    return DialogModel;
}());
exports.DialogModel = DialogModel;
//# sourceMappingURL=dialog.model.js.map