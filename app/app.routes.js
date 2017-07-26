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
var router_1 = require('@angular/router');
// import { UserService } from './user.service';
var core_1 = require('@angular/core');
// import { CanDeactivateGuard } from './can-deactivate-guard.service';
//pages
var test_line_chart_component_1 = require('./test/test-line-chart.component');
var audit_setting_component_1 = require('./page/audit-setting/audit-setting.component');
var audit_plan_component_1 = require('./page/audit-setting/audit-plan.component');
//审方方案查看
var audit_review_component_1 = require('./page/audit-setting/audit-review.component');
//门诊方案选择
var opt_audit_plan_choose_component_1 = require('./page/ipt-opt-auditing/opt-audit-plan-choose.component');
//医嘱方案选择
var ipt_audit_plan_choose_component_1 = require('./page/ipt-opt-auditing/ipt-audit-plan-choose.component');
//处方审核列表
var opt_order_audit_component_1 = require('./page/ipt-opt-auditing/opt-order-audit.component');
//医嘱审核列表
var ipt_order_audit_component_1 = require('./page/ipt-opt-auditing/ipt-order-audit.component');
//医嘱审核详情
var ipt_order_details_component_1 = require('./page/ipt-opt-auditing/ipt-order-details.component');
//门诊处方详情
var opt_recipe_details_component_1 = require('./page/ipt-opt-auditing/opt-recipe-details.component');
var opt_recipe_review_component_1 = require('./page/ipt-opt-review/opt-recipe-review.component');
var ipt_recipe_review_component_1 = require('./page/ipt-opt-review/ipt-recipe-review.component');
var opt_recipe_review_details_component_1 = require('./page/ipt-opt-review/opt-recipe-review-details.component');
var ipt_recipe_review_details_component_1 = require('./page/ipt-opt-review/ipt-recipe-review-details.component');
var pharmacists_statistic_component_1 = require('./page/pc-statistic/pharmacists-statistic.component');
//警示信息管理
var alert_message_component_1 = require('./page/alert-message/list/alert-message.component');
//警示信息详情-管理
var alert_message_details_component_1 = require('./page/alert-message/alert-message-details.component');
var AuthGuard = (function () {
    function AuthGuard() {
    }
    // constructor(private userService: UserService, private router: Router) { }
    AuthGuard.prototype.canActivate = function () {
        // if (this.userService.isLogin) {
        //     return true;
        // }
        // this.router.navigate(['/login']);
        return false;
    };
    AuthGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
var routes = [
    { path: '',
        component: audit_setting_component_1.AuditSettingComponent,
        pathMatch: 'full'
    }, {
        path: 'test-svg',
        component: test_line_chart_component_1.TestLineChartComponent
    }, {
        path: 'audit-setting',
        component: audit_setting_component_1.AuditSettingComponent
    }, {
        path: 'audit-plan',
        component: audit_plan_component_1.AuditPlanComponent
    }, {
        path: 'audit-plan/:id',
        component: audit_plan_component_1.AuditPlanComponent
    },
    //审方方案查看
    {
        path: 'audit-review/:id',
        component: audit_review_component_1.AuditReviewComponent
    },
    //处方方案选择
    {
        path: 'opt-audit-plan-choose',
        component: opt_audit_plan_choose_component_1.OptAuditPlanChooseComponent
    },
    //医嘱方案选择
    {
        path: 'ipt-audit-plan-choose',
        component: ipt_audit_plan_choose_component_1.IptAuditPlanChooseComponent
    },
    //处方审核列表
    {
        path: 'opt-order-audit',
        component: opt_order_audit_component_1.OptOrderAuditComponent
    },
    //医嘱审核列表
    {
        path: 'ipt-order-audit',
        component: ipt_order_audit_component_1.IptOrderAuditComponent
    },
    //医嘱审核详情
    {
        path: 'ipt-order-details/:recipeId',
        component: ipt_order_details_component_1.IptOrderDetailsComponent
    },
    //门诊处方详情
    {
        path: 'opt-recipe-details/:recipeId',
        component: opt_recipe_details_component_1.OptRecipeDetailsComponent
    },
    //审核结果查看
    {
        path: 'opt-recipe-review',
        component: opt_recipe_review_component_1.OptRecipeReviewComponent
    },
    {
        path: 'ipt-recipe-review',
        component: ipt_recipe_review_component_1.IptRecipeReviewComponent
    },
    {
        path: 'opt-recipe-review-details/:recipeId',
        component: opt_recipe_review_details_component_1.OptRecipeReviewDetailsComponent
    },
    {
        path: 'ipt-recipe-review-details/:recipeId',
        component: ipt_recipe_review_details_component_1.IptRecipeReviewDetailsComponent
    },
    //药师工作统计
    {
        path: 'pharmacists-statistic',
        component: pharmacists_statistic_component_1.PharmacistsStatisticComponent
    },
    //警示信息管理
    {
        path: 'alert-message',
        component: alert_message_component_1.AlertMessageComponent
    },
    {
        path: 'alert-message-master',
        component: alert_message_component_1.AlertMessageComponent
    },
    {
        path: 'alert-message-person',
        component: alert_message_component_1.AlertMessageComponent
    },
    //警示信息详情-管理
    {
        path: 'alert-message-details',
        component: alert_message_details_component_1.AlertMessageDetailsComponent
    },
    {
        path: 'alert-message-details/:productId',
        component: alert_message_details_component_1.AlertMessageDetailsComponent
    },
];
// export const authProviders = [AuthGuard, UserService];
// export const appRoutingProviders: any[] = [
//     // authProviders,
//     CanDeactivateGuard
// ];
// export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot(routes)
            ],
            exports: [
                router_1.RouterModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app.routes.js.map