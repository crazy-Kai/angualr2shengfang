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
 *  @Description:TODO(弹窗组件的自定义模板封装)
 */
var core_1 = require('@angular/core');
var dialog_model_1 = require('./dialog.model');
var adhoc_component_factory_service_1 = require('./adhoc-component-factory.service');
var DialogContentPlugin = (function () {
    function DialogContentPlugin(dialogModel, componentFactoryResolver, viewContainerRef, adHocComponentFactoryCreator) {
        this.dialogModel = dialogModel;
        this.componentFactoryResolver = componentFactoryResolver;
        this.viewContainerRef = viewContainerRef;
        this.adHocComponentFactoryCreator = adHocComponentFactoryCreator;
    }
    DialogContentPlugin.prototype.ngAfterViewInit = function () {
        // this.loadDialogContent();
    };
    DialogContentPlugin.prototype.loadDialogContent = function () {
        // this.componentLoader.loadNextToLocation(this.dialogModel.dialogContentComponent,
        //     this.viewContainerRef);
        var componentFactory;
        try {
            componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dialogModel.dialogContentComponent);
        }
        catch (error) {
            componentFactory = this.adHocComponentFactoryCreator.getFactory(this.dialogModel.dialogContentComponent);
        }
        var componentRef = this.viewContainerRef.createComponent(componentFactory);
        componentRef.changeDetectorRef.detectChanges();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', core_1.TemplateRef)
    ], DialogContentPlugin.prototype, "dialogTemplate", void 0);
    DialogContentPlugin = __decorate([
        core_1.Component({
            selector: 'my-dialog-content',
            template: '<template [ngTemplateOutlet]="dialogTemplate" [ngOutletContext]="{ $implicit: dialogModel }" ></template>',
            styles: [require('./dialog.plugin.css') + ""]
        }), 
        __metadata('design:paramtypes', [dialog_model_1.DialogModel, core_1.ComponentFactoryResolver, core_1.ViewContainerRef, adhoc_component_factory_service_1.AdHocComponentFactoryCreator])
    ], DialogContentPlugin);
    return DialogContentPlugin;
}());
exports.DialogContentPlugin = DialogContentPlugin;
//# sourceMappingURL=dialog.content.plugin.js.map