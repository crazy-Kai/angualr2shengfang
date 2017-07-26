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
var AdHocComponentFactoryCreator = (function () {
    function AdHocComponentFactoryCreator(compiler) {
        this.compiler = compiler;
        this.factories = [];
    }
    AdHocComponentFactoryCreator.prototype.getFactory = function (component) {
        var factory = this.factories.find(function (factory) { return factory.componentType === component; });
        if (!factory) {
            factory = this._createAdHocComponentFactory(component);
        }
        return factory;
    };
    AdHocComponentFactoryCreator.prototype._createAdHocComponentFactory = function (component) {
        var AdHocModule = (function () {
            function AdHocModule() {
            }
            AdHocModule = __decorate([
                core_1.NgModule({
                    declarations: [component],
                    entryComponents: [component],
                    imports: [common_1.CommonModule],
                }), 
                __metadata('design:paramtypes', [])
            ], AdHocModule);
            return AdHocModule;
        }());
        var factory = this.compiler.compileModuleAndAllComponentsSync(AdHocModule).componentFactories
            .find(function (factory) { return factory.componentType === component; });
        this.factories.push(factory);
        return factory;
    };
    AdHocComponentFactoryCreator = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.Compiler])
    ], AdHocComponentFactoryCreator);
    return AdHocComponentFactoryCreator;
}());
exports.AdHocComponentFactoryCreator = AdHocComponentFactoryCreator;
//# sourceMappingURL=adhoc-component-factory.service.js.map