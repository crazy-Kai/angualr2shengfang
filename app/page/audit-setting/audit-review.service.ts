import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { AuditReview } from './audit-review';

//依赖注入
@Injectable()
export class AuditReviewService {
    constructor(private http: Http) { }
    /**
     * 审方方案查看
     */
    //私有
    private auditPlanUrl = '/api/v1/auditPlan/';
    /**
     * promsie处理
     */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json().data;
        return body || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occcurred', error);
        return Promise.reject(error.message || error);
    }

    getAuditPlan(auditPlanId: string) {
        return this.http.get(this.auditPlanUrl + auditPlanId)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
}