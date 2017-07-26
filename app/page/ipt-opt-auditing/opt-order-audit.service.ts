import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

//依赖注入
@Injectable()
export class OptOrderAuditService {
    constructor(private http: Http) { }
    
    private headers = new Headers({'Content-Type': 'application/json'});
    private optRecipeListUrl = '/api/v1/opt/optRecipeList';
    private auditAgreeUrl = '/api/v1/auditAgree';
    private auditRefuseUrl = '/api/v1/auditRefuse';
    private auditBatchAgreeUrl = '/api/v1/auditBatchAgree';
    private auditBatchRefuseUrl = '/api/v1/auditBatchRefuse';
    //结束审方  PUT
    private endAuditUrl = '/api/v1/endOfAudit';
    //待审核列表中工作状态心跳
    private auditBeatingUrl = '/api/v1/auditBeating';
    private auditWorkingUrl = '/api/v1/auditWorking';

    private auditingUrl = '/api/v1/auditing';

    getAuditing(id) {
        return this.http.put(this.auditingUrl+ '?ids=' + encodeURIComponent(id), {})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    

    getOptRecipeList () {
        return this.http.get(this.optRecipeListUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    auditWorking(){
        return this.http.get(this.auditWorkingUrl, {})
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
    

    // 单个通过
    getAuditAgree(id: number) {
        return this.http.get(this.auditAgreeUrl + '?id=' + id + '&auditType=1')
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    // 单个打回
    getAuditRefuse(id: number) {
        return this.http.get(this.auditRefuseUrl + '?id=' + id + '&auditType=1')
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    // 批量通过
    auditBatchAgree(ids: any[]) {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers })
        return this.http.post(this.auditBatchAgreeUrl, {"ids": ids, "auditType": 1}, options)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    // 批量打回
    auditBatchRefuse(ids: any[]) {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers })
        return this.http.post(this.auditBatchRefuseUrl, {"ids": ids, "auditType": 1}, options)
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
