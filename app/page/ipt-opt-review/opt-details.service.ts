import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OptDetailsService {
    // optRecipeId

    //患者门诊就诊信息
    private optRecipeUrl = '/api/v1/opt/all/recipeInfo';
    //上一次审核，下一次审核
    private aroundAuditResultUrl = '/api/v1/opt/all/aroundAuditResultId';

    //患者过敏药物列表
    private allergyListUrl = '/api/v1/opt/all/optRecipeAllergyList';
    //电子病历
    private optRecipeElectronicMedicalUrl = '/api/v1/opt/all/optRecipeElectronicMedical';
    //检查单 - 检验及检验明细
    private optRecipeExamListUrl = '/api/v1/opt/all/optRecipeExamList';
    //检查单 - 影像
    private optRecipeImageListUrl = '/api/v1/opt/all/optRecipeImageList';
    //检查单 - 特殊检查项
    private optRecipeSpecialExamListUrl = '/api/v1/opt/all/optRecipeSpecialExamList';
    //手术
    private optOperationListUrl = '/api/v1/opt/all/optRecipeOperationList';

    //警示信息接口
    private warningListUrl = '/api/v1/opt/all/engineMsgList';
    //审核医师交互结果
    private auditResultList = '/api/v1/opt/all/auditResultList';
    private getDrugApiUrl = '/api/v1/getInsttips';
    //关联点
    private drugRelatedUrl = '/api/v1/opt/all/drugAuditRelated/';
    
    
constructor(private http: Http) { }

    //获取关联点信息
    getDrugRelated(getDrugParams){
        return this.http.get(this.drugRelatedUrl + getDrugParams.join('/'),{})
            .toPromise()
            .then(response => response && response.json())
            .catch(this.handleError)
    }


    //获取门诊就诊信息
    getOptRecipe(id: string){
        return this.http.get(this.optRecipeUrl + '/' + id)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取关联打回信息
    getAroundAuditResult(optRecipeId: string){
        return this.http.get(this.aroundAuditResultUrl + '?id=' + optRecipeId)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //获取患者过敏药物列表
    getAllergyList(optRecipeId: string){
        return this.http.get(this.allergyListUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取电子病历
    getOptRecipeElectronicMedical(optRecipeId: string){
        return this.http.get(this.optRecipeElectronicMedicalUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取检查单 - 检验及检验明细
    getOptRecipeExamList(optRecipeId: string){
        return this.http.get(this.optRecipeExamListUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取检查单 - 影像
    getOptRecipeImageList(optRecipeId: string){
        return this.http.get(this.optRecipeImageListUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取检查单 - 特殊检查项
    getOptRecipeSpecialExamList(optRecipeId: string){
        return this.http.get(this.optRecipeSpecialExamListUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取检查单 - 手术
    getOptOperationList(optRecipeId: string){
        return this.http.get(this.optOperationListUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取警示信息
    getWarningList(optRecipeId: string){
        return this.http.get(this.warningListUrl + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取审核医师交互结果
    getAuditResultList(optRecipeId: string){
        return this.http.get(this.auditResultList + '/' + optRecipeId)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    
    //获取药品api
    getDrugApi(){
        return this.http.get(this.getDrugApiUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /**
     * promise预处理
     */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}