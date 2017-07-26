"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var angular2_tree_component_1 = require('angular2-tree-component');
var app_routes_1 = require('../app/app.routes');
var ng2_interceptors_1 = require('ng2-interceptors');
var server_interceptor_1 = require('./server.interceptor');
var app_component_1 = require('./app.component');
var dialog_1 = require('./plugin/ug-dialog/dialog');
var table_module_1 = require('./plugin/ug-table/table.module');
var upload_plugin_1 = require('./plugin/ug-upload/upload.plugin');
var ng_bootstrap_1 = require('@ng-bootstrap/ng-bootstrap');
//pages
var audit_setting_component_1 = require('./page/audit-setting/audit-setting.component');
var audit_plan_component_1 = require('./page/audit-setting/audit-plan.component');
var audit_plan_warning_component_1 = require('./page/common/audit-plan-warning/audit-plan-warning.component');
var audit_plan_pay_type_component_1 = require('./page/common/audit-plan-pay-type/audit-plan-pay-type.component');
var audit_plan_drug_property_component_1 = require('./page/common/audit-plan-drug-property/audit-plan-drug-property.component');
var audit_plan_drug_category_component_1 = require('./page/common/audit-plan-drug-category/audit-plan-drug-category.component');
var audit_plan_doctor_component_1 = require('./page/common/audit-plan-doctor/audit-plan-doctor.component');
var audit_plan_dept_component_1 = require('./page/common/audit-plan-dept/audit-plan-dept.component');
var icd10_tree_component_1 = require('./page/audit-setting/audit-plan-icd10/icd10-tree.component');
var icd10_dialog_component_1 = require('./page/audit-setting/audit-plan-icd10/icd10-dialog.component');
var mousetips_component_1 = require('./page/common/mousetips/mousetips.component');
var time_interval_component_1 = require('./page/common/time-interval/time-interval.component');
var zone_component_1 = require('./page/common/zone-dept/zone/zone.component');
var dept_component_1 = require('./page/common/zone-dept/dept/dept.component');
var zone_dept_wrap_component_1 = require('./page/common/zone-dept/zone-dept-wrap/zone-dept-wrap.component');
//门诊处方审核
var opt_order_audit_component_1 = require('./page/ipt-opt-auditing/opt-order-audit.component');
//医嘱审核列表
var ipt_order_audit_component_1 = require('./page/ipt-opt-auditing/ipt-order-audit.component');
//医嘱审核详情
var ipt_order_details_component_1 = require('./page/ipt-opt-auditing/ipt-order-details.component');
var opt_recipe_details_component_1 = require('./page/ipt-opt-auditing/opt-recipe-details.component');
//审核结果查看
var opt_recipe_review_component_1 = require('./page/ipt-opt-review/opt-recipe-review.component');
var ipt_recipe_review_component_1 = require('./page/ipt-opt-review/ipt-recipe-review.component');
var opt_recipe_review_details_component_1 = require('./page/ipt-opt-review/opt-recipe-review-details.component');
var ipt_recipe_review_details_component_1 = require('./page/ipt-opt-review/ipt-recipe-review-details.component');
//审方统计
var pharmacists_statistic_component_1 = require('./page/pc-statistic/pharmacists-statistic.component');
//审方查看列表
var audit_review_component_1 = require('./page/audit-setting/audit-review.component');
//处方方案选择
var opt_audit_plan_choose_component_1 = require('./page/ipt-opt-auditing/opt-audit-plan-choose.component');
//医嘱方案选择
var ipt_audit_plan_choose_component_1 = require('./page/ipt-opt-auditing/ipt-audit-plan-choose.component');
//警示信息详情-管理
var alert_message_details_component_1 = require('./page/alert-message/alert-message-details.component');
//自定义组件
var associated_select_component_1 = require('./page/common/associated-select/associated-select.component');
var associated_input_component_1 = require('./page/common/associated-input/associated-input.component');
var pagination_component_1 = require('./page/common/pagination/pagination.component');
var laboratory_sheet_component_1 = require('./page/common/laboratory-sheet/laboratory-sheet.component');
var operation_list_component_1 = require('./page/common/operation-list/operation-list.component');
var elec_med_record_component_1 = require('./page/common/elec-med-record/elec-med-record.component');
var audit_tips_component_1 = require('./page/common/audit-tips/audit-tips.component');
var audit_plan_service_1 = require('./page/audit-setting/audit-plan.service');
var audit_plan_warning_service_1 = require('./page/common/audit-plan-warning/audit-plan-warning.service');
var audit_plan_pay_type_service_1 = require('./page/common/audit-plan-pay-type/audit-plan-pay-type.service');
var audit_plan_drug_property_service_1 = require('./page/common/audit-plan-drug-property/audit-plan-drug-property.service');
var audit_plan_drug_category_service_1 = require('./page/common/audit-plan-drug-category/audit-plan-drug-category.service');
var audit_plan_doctor_service_1 = require('./page/common/audit-plan-doctor/audit-plan-doctor.service');
var audit_plan_dept_service_1 = require('./page/common/audit-plan-dept/audit-plan-dept.service');
var opt_recipe_details_service_1 = require('./page/ipt-opt-auditing/opt-recipe-details.service');
var ipt_order_details_service_1 = require('./page/ipt-opt-auditing/ipt-order-details.service');
var drug_category_dialog_component_1 = require('./page/common/drug_category/drug_category_dialog.component');
var drug_category_tree_component_1 = require('./page/common/drug_category/drug_category_tree.component');
var test_line_chart_component_1 = require('./test/test-line-chart.component');
var opt_recipe_details_exam_pipe_1 = require('./page/ipt-opt-auditing/opt-recipe-details-exam.pipe');
var get_first_ele_pipe_1 = require('./page/common/get-first-ele.pipe');
var alert_message_component_1 = require('./page/alert-message/list/alert-message.component');
var auto_complete_component_1 = require('./page/common/auto-complete/auto-complete.component');
var select_component_1 = require('./page/common/select-comp/select.component');
var autocomplete_directive_1 = require('./page/common/auto-complete-directive/autocomplete-directive');
var autocomplete_window_component_1 = require('./page/common/auto-complete-directive/autocomplete-window.component');
var autocomplete_service_1 = require('./page/common/auto-complete-directive/autocomplete.service');
var audit_plan_old_component_1 = require('./page/common/audit-plan-old/audit-plan-old.component');
var fast_reply_component_1 = require('./page/common/fast-reply/fast-reply.component');
//第三方table组件
//CSS
// import './plugin/bootstrap/css/bootstrap.min.css';
// import './app.component.css';
var AppModule = (function() {
    function AppModule() {}
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                dialog_1.DialogModule,
                table_module_1.TableModule,
                angular2_tree_component_1.TreeModule,
                app_routes_1.AppRoutingModule,
                http_1.HttpModule,
                ng_bootstrap_1.NgbModule.forRoot()
            ],
            declarations: [
                app_component_1.AppComponent,
                upload_plugin_1.UploadPlugin,
                audit_setting_component_1.AuditSettingComponent,
                //审方查看列表
                audit_review_component_1.AuditReviewComponent,
                audit_plan_component_1.AuditPlanComponent,
                //门诊方案选择
                opt_audit_plan_choose_component_1.OptAuditPlanChooseComponent,
                //医嘱方案选择
                ipt_audit_plan_choose_component_1.IptAuditPlanChooseComponent,
                audit_plan_warning_component_1.AuditPlanWarningComponent,
                audit_plan_pay_type_component_1.AuditPlanPayTypeComponent,
                audit_plan_drug_property_component_1.AuditPlanDrugPropertyComponent,
                audit_plan_drug_category_component_1.AuditPlanDrugCategoryComponent,
                audit_plan_doctor_component_1.AuditPlanDoctorComponent,
                audit_plan_dept_component_1.AuditPlanDeptComponent,
                mousetips_component_1.MusetipsComponent,
                time_interval_component_1.TimeIntervalComponent,
                dept_component_1.DeptComponent,
                zone_component_1.ZoneComponent,
                zone_dept_wrap_component_1.ZoneDeptWrapComponent,
                //门诊处方审核
                opt_order_audit_component_1.OptOrderAuditComponent,
                //医嘱审核列表
                ipt_order_audit_component_1.IptOrderAuditComponent,
                //医嘱审核详情
                ipt_order_details_component_1.IptOrderDetailsComponent,
                opt_recipe_details_component_1.OptRecipeDetailsComponent,
                opt_recipe_review_component_1.OptRecipeReviewComponent,
                ipt_recipe_review_component_1.IptRecipeReviewComponent,
                opt_recipe_review_details_component_1.OptRecipeReviewDetailsComponent,
                ipt_recipe_review_details_component_1.IptRecipeReviewDetailsComponent,
                test_line_chart_component_1.TestLineChartComponent,
                //警示信息管理
                alert_message_component_1.AlertMessageComponent,
                //警示信息详情-管理
                alert_message_details_component_1.AlertMessageDetailsComponent,
                auto_complete_component_1.AutoCompleteComponent,
                select_component_1.SelectComponent,
                //自定义组件
                associated_select_component_1.AssociatedSelectComponent,
                associated_input_component_1.AssociatedInputComponent,
                pharmacists_statistic_component_1.PharmacistsStatisticComponent,
                pagination_component_1.PaginationComponent,
                laboratory_sheet_component_1.LaboratorySheetComponent,
                operation_list_component_1.OperationListComponent,
                elec_med_record_component_1.ElecMedRecordComponent,
                audit_tips_component_1.AutidTipsComponent,
                opt_recipe_details_exam_pipe_1.OptRecipeDetailsExamPipe,
                get_first_ele_pipe_1.getFirstElePipe,
                drug_category_dialog_component_1.DrugCategoryDialog,
                drug_category_tree_component_1.DrugCategoryTree,
                icd10_dialog_component_1.ICD10Dialog,
                icd10_tree_component_1.ICD10Tree,
                autocomplete_directive_1.AutocompleteDirective,
                autocomplete_window_component_1.AutocompleteWindowComponent,
                audit_plan_old_component_1.AuditPlanOldComponent,
                fast_reply_component_1.fastReplyComponent
            ],
            providers: [
                // appRoutingProviders,
                audit_plan_service_1.AuditPlanService,
                audit_plan_warning_service_1.AuditPlanWarningService,
                audit_plan_pay_type_service_1.AuditPlanPayTypeService,
                audit_plan_drug_property_service_1.AuditPlanDrugPropertyService,
                audit_plan_drug_category_service_1.AuditPlanDrugCategoryService,
                audit_plan_doctor_service_1.AuditPlanDoctorService,
                audit_plan_dept_service_1.AuditPlanDeptService,
                opt_recipe_details_service_1.OptRecipeDetailsService,
                ipt_order_details_service_1.IptOrderDetailsService,
                autocomplete_service_1.AutocompleteService,
                server_interceptor_1.ServerInterceptor,
                ng2_interceptors_1.provideInterceptorService([
                    server_interceptor_1.ServerInterceptor
                ])
            ],
            entryComponents: [autocomplete_window_component_1.AutocompleteWindowComponent],
            bootstrap: [app_component_1.AppComponent]
        }),
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map