import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class IptOrderDetailsService {
    private headers = new Headers({'Content-Type': 'application/json'});

    //患者医嘱就诊信息
    private patientInfoUrl = '/api/v1/ipt/iptPatient';
    //药物医嘱
    private iptOrderUrl = '/api/v1/ipt/orderList';
    private herbIptOrderUrl = '/api/v1/ipt/herbOrderList';
    //过敏列表
    private patientAllergyUrl = '/api/v1/ipt/allergyList';
    //诊断记录
    private patientDiagnoseUrl = '/api/v1/ipt/diagnoseList';
    //病程记录
    private progressUrl = '/api/v1/ipt/progressList';
    //入院记录
    private recordUrl = '/api/v1/ipt/iptRecordList';
    //检验单
    private examUrl = '/api/v1/ipt/examList';
    //影像列表
    private imageUrl = '/api/v1/ipt/imageList';
    //特殊检查
    private specialExamUrl = '/api/v1/ipt/specialExamList';
    //药物敏感检查
    private drugSensitiveUrl = '/api/v1/ipt/drugSensitiveList';
    //手术
    private operationUrl = '/api/v1/ipt/operationList';
    //生命体征
    private vitalSignUrl = '/api/v1/ipt/vitalSignList';
    //非药医嘱
    private nonOrderUrl = '/api/v1/ipt/nonOrderList';
    //警示信息
    private engineMsgUrl = '/api/v1/ipt/engineMsgList';
    //单个警示信息
    private singleEngineMsgUrl = '/api/v1/ipt/auditSingle';
    //下一张处方
    private nextRecipeUrl = '/api/v1/nextAuditTaskId';
    //通过处方
    private agreeRecipeUrl = '/api/v1/detailPageAuditRefuse';
    //打回处方
    private refuseRecipeUrl = '/api/v1/detailPageAuditAgree';
    //关联点
    private drugRelatedUrl = '/api/v1/ipt/all/drugAuditRelated';
    //审核工作状态心跳
    private auditBeatingUrl = '/api/v1/auditBeating';
    //获取生命体征开始时间
    private getVitalStartDateUrl = '/api/v1/ipt/getVitalSignStartDate';
    //获取药品api
    private getDrugApiUrl = '/api/v1/getInsttips';
    
    constructor(private http: Http) { }

    //审核工作状态心跳
    auditBeatingStatus(){
        return this.http.put(this.auditBeatingUrl, {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //获取生命体征开始时间
    getVitalStartDate(id: string){
        return this.http.get(this.getVitalStartDateUrl + '?id=' + id)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //获取关联点信息
    getDrugRelated(id: string, zoneId: string, productId: string, startDate :number, period: number){
        return this.http.get(`${this.drugRelatedUrl}?id=${id}&zoneId=${zoneId}&productId=${productId}&startDate=${startDate }&period=${period}`)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //获取药品api
    getDrugApi(){
        return this.http.get(this.getDrugApiUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    getPatientInfo(orderId: number): Promise<any>{
        return this.http.get(this.patientInfoUrl + '?id=' + orderId, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : {})
                   .catch(this.handleError);
    }
    getIptOrderList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.iptOrderUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getHerbIptOrderList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.herbIptOrderUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getAllergyList(orderId: number): Promise<any>{
        return this.http.get(this.patientAllergyUrl + '?id=' + orderId, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getDiagnoseList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.patientDiagnoseUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : {})
                   .catch(this.handleError);
    }
    getProgressList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.progressUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getRecordList(orderId: number): Promise<any> {
        return this.http.get(this.recordUrl + '?id=' + orderId, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getExamList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.examUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getImageList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.imageUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getSpecialExamList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.specialExamUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    // getDrugSensitiveList(patientId: string): Promise<any> {
    //     //TODO - 增加患者id参数
    //     return this.http.get(this.drugSensitiveUrl, {headers: this.headers})
    //                .toPromise()
    //                .then(response => response && response.json().code == 200 ? response.json().data : {})
    //                .catch(this.handleError);
    // }
    getOpeartionList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.operationUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getVitalSignList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.vitalSignUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getNonOrderList(orderId: number, startDate: string, period: number): Promise<any> {
        let reqUrl = this.nonOrderUrl + '?id=' + orderId + ( (startDate && startDate != '') ? ('&startDate=' + startDate) : '') + (period ? ('&period=' + period) : '');
        return this.http.get(reqUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getEngineMsgList(id: string, groupNo: string, orderIdList: any, hisOrderIdList:any, herbOrderIdList: any, hisHerbOrderIdList:any): Promise<any> {
        let engineMsgData = {
            'engineId': id,
            'groupNo': groupNo,
            'medicalIds': orderIdList,
            'medicalHisIds': hisOrderIdList,
            'herbMedicalIds': herbOrderIdList,
            'herbMedicalHisIds': hisHerbOrderIdList
        };
        return this.http.post(this.engineMsgUrl, engineMsgData, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : {})
                   .catch(this.handleError);
    }
    saveEngineMsgList(data: any): Promise<any> {
        return this.http.post(this.singleEngineMsgUrl, data, {headers: this.headers})
                   .toPromise()
                   .then(response => response ? response.json() : {})
                   .catch(this.handleError);
    }
    // getAuditResultList(orderId: string): Promise<any> {
    //     return this.http.get(this.auditResultUrl + orderId, {headers: this.headers})
    //                .toPromise()
    //                .then(response => response && response.json().code == 200 ? response.json().data : {})
    //                .catch(this.handleError);
    // }
    getNextRecipe(orderId: number): Promise<any>{
        return this.http.get(this.nextRecipeUrl + '?id=' + orderId + '&type=3', {headers: this.headers})
                   .toPromise()
                   .then(this.extractJson)
                   .catch(this.handleError);
    }
    // agreeRecipe(recipeId: string): Promise<number>{
    //     return this.http.post(this.agreeRecipeUrl + encodeURIComponent(recipeId), {headers: this.headers})
    //                .toPromise()
    //                .then(res => res.json().code)
    //                .catch(this.handleError);
    // }
    // refuseRecipe(recipeId: string): Promise<number>{
    //     return this.http.post(this.refuseRecipeUrl + encodeURIComponent(recipeId), {headers: this.headers})
    //                .toPromise()
    //                .then(res => res.json().code)
    //                .catch(this.handleError);
    // }
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