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
var forms_1 = require('@angular/forms');
var common_1 = require('@angular/common');
var tbody_content_plugin_1 = require('./tbody.content.plugin');
var table_plugin_1 = require('./table.plugin');
exports.TablePlugin = table_plugin_1.TablePlugin;
var table_model_1 = require('./table.model');
exports.TableModel = table_model_1.TableModel;
var dialog_1 = require('../ug-dialog/dialog');
var TableModule = (function () {
    function TableModule() {
    }
    TableModule = __decorate([
        core_1.NgModule({
            declarations: [
                tbody_content_plugin_1.TbodyPlugin,
                table_plugin_1.TablePlugin,
                table_plugin_1.TChangeCell,
            ],
            exports: [
                table_plugin_1.TablePlugin
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                dialog_1.DialogModule
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], TableModule);
    return TableModule;
}());
exports.TableModule = TableModule;
//# sourceMappingURL=table.module.js.map