import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { IptAuditPlanChoose } from './ipt-audit-plan-choose';
import { AuditPlanChooseMap } from './audit-plan-choose-map';

//依赖注入
@Injectable()
export class IptAuditPlanChooseService {
    constructor(private http: Http) { }
    /**
     * 审方方案选择
     */
    private headers = new Headers({'Cpntent-Type': 'application/json'});
    private auditPlanUrl = '/api/v1/auditPlan/';
    private auditPlanMapUrl = '/api/v1/auditPlanMap';
    private auditPlanSettingUrl = '/api/v1/auditPlanSetting?ids=';

    getAuditPlan (id: number) {
        return this.http.get(this.auditPlanUrl + id)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    getAuditPlanMap (): Promise<IptAuditPlanChoose[]>{
        return this.http.get(this.auditPlanMapUrl + "?category=2", {headers: this.headers})
            .toPromise()
            .then(response => response && response.json().code == 200 ? response.json().data as IptAuditPlanChoose : [])
            .catch(this.handleError)
    }

    //请求判断
    getAuditPlanSetting(auditPlanId: string) {
        return this.http.get(this.auditPlanSettingUrl + auditPlanId)
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
