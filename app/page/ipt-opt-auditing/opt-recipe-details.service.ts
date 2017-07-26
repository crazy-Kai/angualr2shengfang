import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { OptRecipePatient } from './opt-recipe-patient';
import { OptRecipeDetails } from './opt-recipe-details';
import { OptRecipeDrugs } from './opt-recipe-drugs';
import { OptRecipeAuditResult } from './opt-recipe-audit-result';
import { OptRecipeMedical } from './opt-recipe-medical';

@Injectable()
export class OptRecipeDetailsService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    //患者门诊就诊信息
    private optRecipeUrl = '/api/v1/opt/recipeInfo';
    //患者过敏药物列表
    private allergyListUrl = '/api/v1/opt/optAllergyList/';
    //检查单 - 检验及检验明细
    private optRecipeExamListUrl = '/api/v1/opt/optRecipeExamList/';
    //检查单 - 影像
    private optRecipeImageListUrl = '/api/v1/opt/optRecipeImageList/';
    //检查单 - 特殊检查项
    private optRecipeSpecialExamListUrl = '/api/v1/opt/optRecipeSpecialExamList/';
    //手术
    private optOperationListUrl = '/api/v1/opt/optOperationList/';
    //电子病历
    private optMedicalListUrl = '/api/v1/opt/optElectronicMedical/';
    //警示信息接口
    private warningListUrl = '/api/v1/opt/engineMsgList/';
    //审核医师交互结果
    private auditResultListUrl = '/api/v1/opt/auditResultList/';
    //下一张处方原接口
    // private nextRecipeUrl = '/api/v1/getNextId/';
    //下一张处方新接口
    private nextRecipeUrl = '/api/v1/nextAuditTaskId';
    //通过处方
    private agreeRecipeUrl = '/api/v1/detailPageAuditAgree';
    //打回处方
    private refuseRecipeUrl = '/api/v1/detailPageAuditRefuse';
    //单个任务工作状态心跳
    private auditBeatingUrl = '/api/v1/auditBeating';
    //锁任务接口
    private auditingUrl = '/api/v1/auditing';
    //关联点
    private drugRelatedUrl = '/api/v1/opt/drugAuditRelated/';

    constructor(private http: Http) { }

    //获取关联点信息
    getDrugRelated(getDrugParams){
        return this.http.get(this.drugRelatedUrl + getDrugParams.join('/'),{})
            .toPromise()
            .then(response => response && response.json())
            .catch(this.handleError)
    }


    getAuditing(idAssemble) {
        return this.http.put(this.auditingUrl+ '?ids=' + idAssemble.join(','), {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //单个任务工作状态心跳
    auditBeatingStatus() {
        return this.http.put(this.auditBeatingUrl, {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    getOptRecipe(id: string): Promise<any> {
        return this.http.get(this.optRecipeUrl + '/' + encodeURIComponent(id), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getOptAllergyList(recipeId: string): Promise<any> {
        return this.http.get(this.allergyListUrl + encodeURIComponent(recipeId), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getOptRecipeExamList(recipeId: string): Promise<any> {
        return this.http.get(this.optRecipeExamListUrl + encodeURIComponent(recipeId), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getOptRecipeImageList(recipeId: string): Promise<any> {
        return this.http.get(this.optRecipeImageListUrl + encodeURIComponent(recipeId), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getOptRecipeSpecialExamList(recipeId: string): Promise<any> {
        return this.http.get(this.optRecipeSpecialExamListUrl + encodeURIComponent(recipeId), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getOptOperationList(recipeId: string): Promise<any> {
        return this.http.get(this.optOperationListUrl + encodeURIComponent(recipeId), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getWarningList(id: string): Promise<any> {
        return this.http.get(this.warningListUrl + encodeURIComponent(id), { headers: this.headers })
            .toPromise()
            //    .then(response => response && response.json().code == 200 ? response.json().data : {})
            .then(response => response && response.json())
            .catch(this.handleError);
    }
    getElectronicMedical(id: string): Promise<any> {
        return this.http.get(this.optMedicalListUrl + encodeURIComponent(id), { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getAuditResultList(recipeId: string): Promise<OptRecipeAuditResult[]> {
        return this.http.get(this.auditResultListUrl + encodeURIComponent(recipeId), { headers: this.headers })
            .toPromise()
            //    .then(response => response && response.json().code == 200 ? response.json().data.recordList as OptRecipeAuditResult[] : {})
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            .catch(this.handleError);
    }
    getNextRecipe(params: any): Promise<any> {
        return this.http.get(this.nextRecipeUrl + "?id=" + encodeURIComponent(params.id) + '&type=' + params.type, { headers: this.headers })
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data : {})
            // .then(response => response.json())
            .catch(this.handleError);
    }
    agreeRecipe(params: any): Promise<any> {
        return this.http.post(this.agreeRecipeUrl, params)
            .toPromise()
            .then(res => res.json())
            // .then(res => res)
            .catch(this.handleError);
    }
    refuseRecipe(params: any): Promise<any> {
        return this.http.post(this.refuseRecipeUrl, params)
            .toPromise()
            .then(res => res.json())
            // .then(res => res)
            .catch(this.handleError);
    }
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}