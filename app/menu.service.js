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
var SubMenu = (function () {
    function SubMenu() {
    }
    return SubMenu;
}());
exports.SubMenu = SubMenu;
var Menu = (function () {
    function Menu() {
    }
    return Menu;
}());
exports.Menu = Menu;
var MenuService = (function () {
    function MenuService() {
        this.menus = [{
                id: 1,
                iconSrc: 'app/images/menu-set.svg',
                iconActionSrc: 'app/images/menu-set-a.svg',
                title: '审方设置',
                subMenus: [
                    { title: '审方方案设置', resource: 'audit-setting' }
                ]
            }, {
                id: 2,
                iconSrc: 'app/images/menu-prescription.svg',
                iconActionSrc: 'app/images/menu-prescription-a.svg',
                title: '处方/医嘱审核',
                subMenus: [
                    { title: '门诊处方审核', resource: 'opt-audit-plan-choose' },
                    { title: '住院医嘱审核', resource: 'ipt-audit-plan-choose' }
                ]
            }, {
                id: 3,
                iconSrc: 'app/images/menu-end.svg',
                iconActionSrc: 'app/images/menu-end-a.svg',
                title: '审核结果查看',
                subMenus: [
                    { title: '已审门诊处方查看', resource: 'opt-recipe-review' },
                    { title: '已审住院医嘱查看', resource: 'ipt-recipe-review' }
                ]
            }, {
                id: 4,
                iconSrc: 'app/images/menu-stat.svg',
                iconActionSrc: 'app/images/menu-stat-a.svg',
                title: '审方统计',
                subMenus: [
                    { title: '药师工作统计', resource: 'pharmacists-statistic' }
                ]
            }, {
                id: 5,
                iconSrc: 'app/images/menu-stat.svg',
                iconActionSrc: 'app/images/menu-stat-a.svg',
                title: '警示信息管理',
                subMenus: [
                    { title: '用药警示管理', resource: 'alert-message' },
                    { title: '用药警示管理-个人', resource: 'alert-message-person' },
                    { title: '用药警示管理-管理', resource: 'alert-message-master' }
                ]
            }];
    }
    MenuService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], MenuService);
    return MenuService;
}());
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map