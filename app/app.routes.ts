import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Injectable, ModuleWithProviders,NgModule } from '@angular/core';
// import { CanDeactivateGuard } from './can-deactivate-guard.service';

//pages
import { TestLineChartComponent } from './test/test-line-chart.component';
import { AuditSettingComponent } from './page/audit-setting/audit-setting.component';
import { AuditPlanComponent } from './page/audit-setting/audit-plan.component';
//审方方案查看
import { AuditReviewComponent } from './page/audit-setting/audit-review.component'
//门诊方案选择
import { OptAuditPlanChooseComponent } from './page/ipt-opt-auditing/opt-audit-plan-choose.component';
//医嘱方案选择
import { IptAuditPlanChooseComponent } from './page/ipt-opt-auditing/ipt-audit-plan-choose.component';
//处方审核列表
import { OptOrderAuditComponent } from './page/ipt-opt-auditing/opt-order-audit.component';
//医嘱审核列表
import { IptOrderAuditComponent } from './page/ipt-opt-auditing/ipt-order-audit.component';
//医嘱审核详情
import { IptOrderDetailsComponent } from './page/ipt-opt-auditing/ipt-order-details.component';
//门诊处方详情
import { OptRecipeDetailsComponent } from './page/ipt-opt-auditing/opt-recipe-details.component';

import { OptRecipeReviewComponent } from './page/ipt-opt-review/opt-recipe-review.component';
import { IptRecipeReviewComponent } from './page/ipt-opt-review/ipt-recipe-review.component';
import { OptRecipeReviewDetailsComponent } from './page/ipt-opt-review/opt-recipe-review-details.component';
import { IptRecipeReviewDetailsComponent } from './page/ipt-opt-review/ipt-recipe-review-details.component';
/**审方统计 */
import { PharmacistsStatisticComponent } from './page/pc-statistic/pharmacists-statistic.component';
import { QualityEvaluateComponnet } from './page/pc-statistic/quality-evaluate.component';
import { ReviewProjectComponent } from './page/pc-statistic/review-project.component';
import { PersonalQualityComponent } from './page/pc-statistic/personal-quality.component';
import { IptQualityEvaluateComponent } from './page/pc-statistic/ipt-quality-evaluate.component';
import { OptQualityEvaluateComponent } from './page/pc-statistic/opt-quality-evaluate.component';
import { DownloadSheetsComponent } from './page/pc-statistic/download-sheets.component';

//警示信息管理
import { AlertMessageComponent } from './page/alert-message/list/alert-message.component';
//警示信息详情-管理
import { AlertMessageDetailsComponent } from './page/alert-message/alert-message-details.component';

import { LoginComponent } from './page/login/login.component';

import { IndexComponent } from './page/index/index.component';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) { }

    canActivate() {
        

        return this.userService.isLogin;
    }
}


const routes: Routes = [
    { path: '', 
      component: IndexComponent,
      pathMatch: 'full' 
    },
    {
      path:'page/test-svg',
      canActivate: [AuthGuard],
      component: TestLineChartComponent
    },{
      path:'page/audit-setting',
      canActivate: [AuthGuard],
      component: AuditSettingComponent
    },{
      path:'page/audit-plan',
      canActivate: [AuthGuard],
      component: AuditPlanComponent
    },{
      path:'page/audit-plan/:id',
      canActivate: [AuthGuard],
      component: AuditPlanComponent
    },
    //审方方案查看
    {
      path: 'page/audit-review/:id',
      canActivate: [AuthGuard],
      component: AuditReviewComponent
    },
    //处方方案选择
    {
      path: 'page/opt-audit-plan-choose',
      canActivate: [AuthGuard],
      component: OptAuditPlanChooseComponent
    },
    //医嘱方案选择
    {
      path: 'page/ipt-audit-plan-choose',
      canActivate: [AuthGuard],
      component: IptAuditPlanChooseComponent
    },
    //处方审核列表
    {
      path:'page/opt-order-audit',
      canActivate: [AuthGuard],
      component: OptOrderAuditComponent
    },
    //医嘱审核列表
    {
      path: 'page/ipt-order-audit',
      canActivate: [AuthGuard],
      component: IptOrderAuditComponent
    },
    //医嘱审核列表-- 增加结束审方状态
    {
      path: 'page/ipt-order-audit',
      canActivate: [AuthGuard],
      component: IptOrderAuditComponent
    },
    //医嘱审核详情
    {
      path:'page/ipt-order-details/:recipeId',
      canActivate: [AuthGuard],
      component: IptOrderDetailsComponent
    },
    //医嘱审核详情-- 增加结束审方状态
    {
      path:'page/ipt-order-details/:recipeId',
      canActivate: [AuthGuard],
      component: IptOrderDetailsComponent
    },
    //门诊处方详情
    {
      path:'page/opt-recipe-details/:recipeId',
      canActivate: [AuthGuard],
      component: OptRecipeDetailsComponent
    },
    //审核结果查看
    {
      path: 'page/opt-recipe-review',
      canActivate: [AuthGuard],
      component: OptRecipeReviewComponent
    },
    {
      path: 'page/ipt-recipe-review',
      canActivate: [AuthGuard],
      component: IptRecipeReviewComponent
    },
    {
      path: 'page/opt-recipe-review-details/:recipeId',
      canActivate: [AuthGuard],
      component: OptRecipeReviewDetailsComponent
    },
    {
      path: 'page/ipt-recipe-review-details/:recipeId',
      canActivate: [AuthGuard],
      component: IptRecipeReviewDetailsComponent
    },
    //药师工作统计
    {
      path: 'page/pharmacists-statistic',
      canActivate: [AuthGuard],
      component: PharmacistsStatisticComponent
    },
    //审方质量评价
    {
      path: 'page/quality-evaluat',
      canActivate: [AuthGuard],
      component: QualityEvaluateComponnet
    },
    {
      path: 'page/review-project/:projectId',
      canActivate: [AuthGuard],
      component: ReviewProjectComponent
    },
    {
      path: 'page/personal-quality',
      canActivate: [AuthGuard],
      component: PersonalQualityComponent
    },
    {
      path: 'page/ipt-quality-evaluate/:recipeId/:handle/:checkPeopleId',
      canActivate: [AuthGuard],
      component: IptQualityEvaluateComponent
    },
    {
      path: 'page/opt-quality-evaluate/:recipeId/:handle/:checkPeopleId',
      canActivate: [AuthGuard],
      component: OptQualityEvaluateComponent
    },
    {
      path:'page/export-sheets/:projectId',
      canActivate: [AuthGuard],
      component: DownloadSheetsComponent
    },
    //警示信息管理
    {
      path: 'page/alert-message',
      canActivate: [AuthGuard],
      component: AlertMessageComponent
    },
    {
      path: 'page/alert-message/:back',
      canActivate: [AuthGuard],
      component: AlertMessageComponent
    },
    {
      path: 'page/alert-message-master',
      canActivate: [AuthGuard],
      component: AlertMessageComponent
    },
    {
      path: 'page/alert-message-person',
      canActivate: [AuthGuard],
      component: AlertMessageComponent
    },
    //警示信息详情-管理
    {
      path: 'page/alert-message-details',
      canActivate: [AuthGuard],
      component: AlertMessageDetailsComponent
    },
    {
      path: 'page/alert-message-details/:messageId/:auditObject',
      canActivate: [AuthGuard],
      component: AlertMessageDetailsComponent
    },
    {
      path: 'page/alert-message-details/:messageId/:auditObject/:productId',
      canActivate: [AuthGuard],
      component: AlertMessageDetailsComponent
    }
];

export const authProviders = [AuthGuard, UserService];
export const appRoutingProviders: any[] = [
    authProviders
    // CanDeactivateGuard
];
// export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}