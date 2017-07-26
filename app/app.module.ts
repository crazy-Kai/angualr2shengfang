import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { TreeModule } from 'angular2-tree-component';
import { appRoutingProviders, AppRoutingModule } from '../app/app.routes';
import { provideInterceptorService  } from 'ng2-interceptors';
import { ServerInterceptor } from './server.interceptor';

import { AppComponent }  from './app.component';
import { DialogModule } from './plugin/ug-dialog/dialog';
import { TableModule } from './plugin/ug-table/table.module';
import { UploadPlugin } from './plugin/ug-upload/upload.plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//pages
import { AuditSettingComponent } from './page/audit-setting/audit-setting.component';
import { AuditPlanComponent } from './page/audit-setting/audit-plan.component';
import { AuditPlanWarningComponent } from './page/common/audit-plan-warning/audit-plan-warning.component';
import { AuditPlanPayTypeComponent } from './page/common/audit-plan-pay-type/audit-plan-pay-type.component';
import { AuditPlanDrugPropertyComponent } from './page/common/audit-plan-drug-property/audit-plan-drug-property.component';
import { AuditPlanDrugCategoryComponent } from './page/common/audit-plan-drug-category/audit-plan-drug-category.component';
import { AuditPlanDoctorComponent } from './page/common/audit-plan-doctor/audit-plan-doctor.component';
import { AuditPlanDeptComponent } from './page/common/audit-plan-dept/audit-plan-dept.component';
import { ICD10Tree } from './page/audit-setting/audit-plan-icd10/icd10-tree.component';
import { ICD10Dialog } from './page/audit-setting/audit-plan-icd10/icd10-dialog.component';

import { MusetipsComponent } from './page/common/mousetips/mousetips.component';
import { TimeIntervalComponent } from './page/common/time-interval/time-interval.component';
import { ZoneComponent } from './page/common/zone-dept/zone/zone.component';
import { DeptComponent } from './page/common/zone-dept/dept/dept.component';
import { ZoneDeptWrapComponent } from './page/common/zone-dept/zone-dept-wrap/zone-dept-wrap.component';
//门诊处方审核
import { OptOrderAuditComponent } from './page/ipt-opt-auditing/opt-order-audit.component';
//医嘱审核列表
import { IptOrderAuditComponent } from './page/ipt-opt-auditing/ipt-order-audit.component';
//医嘱审核详情
import { IptOrderDetailsComponent } from './page/ipt-opt-auditing/ipt-order-details.component';
import { OptRecipeDetailsComponent } from './page/ipt-opt-auditing/opt-recipe-details.component';
//审核结果查看
import { OptRecipeReviewComponent } from './page/ipt-opt-review/opt-recipe-review.component';
import { IptRecipeReviewComponent } from './page/ipt-opt-review/ipt-recipe-review.component';
import { OptRecipeReviewDetailsComponent } from './page/ipt-opt-review/opt-recipe-review-details.component';
import { IptRecipeReviewDetailsComponent } from './page/ipt-opt-review/ipt-recipe-review-details.component';
//审方统计
import { PharmacistsStatisticComponent } from './page/pc-statistic/pharmacists-statistic.component';
import { QualityEvaluateComponnet } from './page/pc-statistic/quality-evaluate.component';
import { ReviewProjectComponent } from './page/pc-statistic/review-project.component';
import { PersonalQualityComponent } from './page/pc-statistic/personal-quality.component';
import { IptQualityEvaluateComponent } from './page/pc-statistic/ipt-quality-evaluate.component';
import { OptQualityEvaluateComponent } from './page/pc-statistic/opt-quality-evaluate.component';
import { DownloadSheetsComponent } from './page/pc-statistic/download-sheets.component';
//审方查看列表
import { AuditReviewComponent } from './page/audit-setting/audit-review.component';
//处方方案选择
import { OptAuditPlanChooseComponent } from './page/ipt-opt-auditing/opt-audit-plan-choose.component';
//医嘱方案选择
import { IptAuditPlanChooseComponent } from './page/ipt-opt-auditing/ipt-audit-plan-choose.component';

//警示信息详情-管理
import { AlertMessageDetailsComponent } from './page/alert-message/alert-message-details.component';

//自定义组件
import { AssociatedSelectComponent } from './page/common/associated-select/associated-select.component';
import { AssociatedInputComponent } from './page/common/associated-input/associated-input.component';
import { PaginationComponent } from './page/common/pagination/pagination.component';
import { LaboratorySheetComponent } from './page/common/laboratory-sheet/laboratory-sheet.component';
import { OperationListComponent } from './page/common/operation-list/operation-list.component';
import { ElecMedRecordComponent } from './page/common/elec-med-record/elec-med-record.component';
import { AutidTipsComponent } from './page/common/audit-tips/audit-tips.component';
import { ConfirmDirective } from './page/common/confirm-directive/confirm-directive';
import { ConfirmComponent } from './page/common/confirm-directive/confirm.component';
import { VirtualScrollBarDirective } from './page/common/virtual-scroll-bar/virtual-scroll-bar.directive';
import { VirtualScrollBarComponent } from './page/common/virtual-scroll-bar/virtual-scroll-bar.component';
import { IphDownloadComponent } from './page/common/iph-download/iph-download.component';
import { MultiChoosenComponent } from './page/common/multi-choosen/multi-choosen.component';

import { AuditPlanService } from './page/audit-setting/audit-plan.service';
import { AuditPlanWarningService } from './page/common/audit-plan-warning/audit-plan-warning.service';
import { AuditPlanPayTypeService } from './page/common/audit-plan-pay-type/audit-plan-pay-type.service';
import { AuditPlanDrugPropertyService } from './page/common/audit-plan-drug-property/audit-plan-drug-property.service';
import { AuditPlanDrugCategoryService } from './page/common/audit-plan-drug-category/audit-plan-drug-category.service';
import { AuditPlanDoctorService } from './page/common/audit-plan-doctor/audit-plan-doctor.service';
import { AuditPlanDeptService } from './page/common/audit-plan-dept/audit-plan-dept.service';

import { OptRecipeDetailsService } from './page/ipt-opt-auditing/opt-recipe-details.service';

import { IptOrderDetailsService } from './page/ipt-opt-auditing/ipt-order-details.service';
import { DrugCategoryDialog } from './page/common/drug-category/drug-category-dialog.component';
import { DrugCategoryTree } from './page/common/drug-category/drug-category-tree.component';

import { TestLineChartComponent } from './test/test-line-chart.component';

import { OptRecipeDetailsExamPipe } from './page/ipt-opt-auditing/opt-recipe-details-exam.pipe';
import { getFirstElePipe } from './page/common/get-first-ele.pipe';

import { AlertMessageComponent } from './page/alert-message/list/alert-message.component';

import { AutoCompleteComponent } from './page/common/auto-complete/auto-complete.component';

import { SelectComponent } from './page/common/select-comp/select.component';

import { AutocompleteDirective } from './page/common/auto-complete-directive/autocomplete-directive';
import { AutocompleteWindowComponent } from './page/common/auto-complete-directive/autocomplete-window.component';
import { AutocompleteService } from './page/common/auto-complete-directive/autocomplete.service';

import { AuditPlanOldComponent } from './page/common/audit-plan-old/audit-plan-old.component';
import { PromptComponent } from './page/common/prompt/prompt.component';
import { LoginComponent } from './page/login/login.component';
import { UserService } from './user.service';
// 快捷回复组件
import { FastReplyComponent } from './page/common/fast-reply/fast-reply.component';
import { FastReplyService } from './page/common/fast-reply/fast-reply.server';

import { Md5Util } from './util/md5';
import { IndexComponent } from './page/index/index.component';
//第三方table组件
//审方质量评价--项目id
import { ProjectService } from './page/pc-statistic/project.service';

//CSS
// import './plugin/bootstrap/css/bootstrap.min.css';
// import './app.component.css';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DialogModule,
    TableModule,
    TreeModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AppComponent,
    UploadPlugin,
    AuditSettingComponent,
    //审方查看列表
    AuditReviewComponent,
    AuditPlanComponent,
    //门诊方案选择
    OptAuditPlanChooseComponent,
    //医嘱方案选择
    IptAuditPlanChooseComponent,
    AuditPlanWarningComponent,
    AuditPlanPayTypeComponent,
    AuditPlanDrugPropertyComponent,
    AuditPlanDrugCategoryComponent,
    AuditPlanDoctorComponent,
    AuditPlanDeptComponent,
    MusetipsComponent,
    TimeIntervalComponent,
    DeptComponent,
    ZoneComponent,
    ZoneDeptWrapComponent,
    //门诊处方审核
    OptOrderAuditComponent,
    //医嘱审核列表
    IptOrderAuditComponent,
    //医嘱审核详情
    IptOrderDetailsComponent,
    OptRecipeDetailsComponent,
    OptRecipeReviewComponent,
    IptRecipeReviewComponent,
    OptRecipeReviewDetailsComponent,
    IptRecipeReviewDetailsComponent,
    TestLineChartComponent,
    //警示信息管理
    AlertMessageComponent,
    //警示信息详情-管理
    AlertMessageDetailsComponent,
    AutoCompleteComponent,
    SelectComponent,
    //自定义组件
    AssociatedSelectComponent,
    AssociatedInputComponent,
    PharmacistsStatisticComponent,
    QualityEvaluateComponnet,
    ReviewProjectComponent,
    PersonalQualityComponent,
    IptQualityEvaluateComponent,
    OptQualityEvaluateComponent,
    DownloadSheetsComponent,
    PaginationComponent,
    LaboratorySheetComponent,
    OperationListComponent,
    ElecMedRecordComponent,
    AutidTipsComponent,
    OptRecipeDetailsExamPipe,
    getFirstElePipe,
    DrugCategoryDialog,
    DrugCategoryTree,
    ICD10Dialog,
    ICD10Tree,
    ConfirmComponent,
    IphDownloadComponent,
    MultiChoosenComponent,
    ConfirmDirective,
    //VirtualScrollBarComponent,
    //VirtualScrollBarDirective,
    AutocompleteDirective,
    AutocompleteWindowComponent,
    AuditPlanOldComponent,
    PromptComponent,
    LoginComponent,
    FastReplyComponent,
    IndexComponent
],
  providers:[
    appRoutingProviders,
    AuditPlanService,
    AuditPlanWarningService,
    AuditPlanPayTypeService,
    AuditPlanDrugPropertyService,
    AuditPlanDrugCategoryService,
    AuditPlanDoctorService,
    AuditPlanDeptService,
    OptRecipeDetailsService,
    IptOrderDetailsService,
    AutocompleteService,
    FastReplyService,
    ServerInterceptor,
    ProjectService,
    provideInterceptorService([
      ServerInterceptor 
    ]),
    UserService,
    Md5Util
  ],
  entryComponents:[AutocompleteWindowComponent, ConfirmComponent],
  bootstrap: [ AppComponent  ]
})
export class AppModule { }