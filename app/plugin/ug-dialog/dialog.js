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
var common_1 = require('@angular/common');
var dialog_plugin_1 = require('./dialog.plugin');
var dialog_content_plugin_1 = require('./dialog.content.plugin');
var dialog_plugin_2 = require('./dialog.plugin');
exports.DialogPlugin = dialog_plugin_2.DialogPlugin;
var dialog_model_1 = require('./dialog.model');
exports.DialogModel = dialog_model_1.DialogModel;
var DialogModule = (function () {
    function DialogModule() {
    }
    DialogModule = __decorate([
        core_1.NgModule({
            declarations: [
                dialog_content_plugin_1.DialogContentPlugin,
                dialog_plugin_1.DialogPlugin
            ],
            exports: [
                dialog_plugin_1.DialogPlugin
            ],
            imports: [
                common_1.CommonModule,
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], DialogModule);
    return DialogModule;
}());
exports.DialogModule = DialogModule;
//# sourceMappingURL=dialog.js.map