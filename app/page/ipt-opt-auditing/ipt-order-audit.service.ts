import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

//依赖注入
@Injectable()
export class IptOrderAuditService {
    constructor(
        private http: Http
    ) { }
    
    private waitAuditIptListUrl = '/api/v1/ipt/waitAuditIptList';
    private auditAgreeUrl = '/api/v1/auditAgree';
    private auditRefuseUrl = '/api/v1/auditRefuse';
    private auditBatchAgreeUrl = '/api/v1/auditBatchAgree';
    private auditBatchRefuseUrl = '/api/v1/auditBatchRefuse';
    private auditBatchPendingUrl = '/api/v1/batchPending';
    //结束审方  PUT
    private endAuditUrl = '/api/v1/endOfAudit';
    //待审核列表中工作状态心跳
    private auditBeatingUrl = '/api/v1/auditBeating';
    //审核药师是否在工作状态
    private auditWorkingUrl = '/api/v1/auditWorking';
    //当前正在审核的任务状态心跳 PUT
    private auditingUrl = '/api/v1/auditing';

    getWaitAuditIptList () { 
        return this.http.get(this.waitAuditIptListUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //待审核列表中工作状态心跳
    auditBeatingStatus(){
        return this.http.put(this.auditBeatingUrl, {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //审核药师是否在工作状态
    auditWorkingStatus(){
        return this.http.get(this.auditWorkingUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //当前正在审核的任务状态心跳
    auditing(id: string){
        return this.http.put(this.auditingUrl + "?ids=" + id, {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }


    // 单个通过
    getAuditAgree(id: number) {
        return this.http.get(this.auditAgreeUrl + '?id=' + id + '&auditType=3')
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    // 单个打回
    getAuditRefuse(id: number) {
        return this.http.get(this.auditRefuseUrl + '?id=' + id + '&auditType=3')
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    // 批量通过
    auditBatchAgree(ids: any[]) {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers})
        return this.http.post(this.auditBatchAgreeUrl, {"ids": ids, "auditType": 3}, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    // 批量打回
    auditBatchRefuse(ids: any[]) {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers});;
        return this.http.post(this.auditBatchRefuseUrl, {"ids": ids, "auditType": 3}, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    // 批量挂起
    auditBatchPending(ids: any[]) {
        let headers = new Headers({ 'Content-type': 'application/json'});
        let options = new RequestOptions({ headers: headers});
        return this.http.post(this.auditBatchPendingUrl, {"ids": ids, "auditType": 3}, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //结束审方
    endAudit(){
        return this.http.put(this.endAuditUrl, {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    /**
     * promsie处理
     */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}


