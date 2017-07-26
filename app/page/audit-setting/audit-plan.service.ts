import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { AuditPlan } from './audit-plan';
import { AuditPlanMap } from './audit-plan-map';
import { AuditPlanICD10 } from './audit-plan-icd10/audit-plan-icd10';

@Injectable()
export class AuditPlanService {
    
    private headers = new Headers({'Content-Type': 'application/json'});
    private auditPlanUrl = '/api/v1/auditPlan';
    //加载已有方案，最多10个，创建时间倒叙排序
    private auditPlanMapUrl = '/api/v1/auditPlanMap';
    private auditPlanICD10Url = '/api/v1/icd10';

    constructor(private http: Http) { }

    getAuditPlanMap(category): Promise<AuditPlanMap[]>{
        return this.http.get(this.auditPlanMapUrl+'?category='+category, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanMap : [])
                   .catch(this.handleError);
    }
    getVagueAuditPlanMap(str, category): Promise<AuditPlanMap[]>{
        return this.http.get(this.auditPlanMapUrl+'?str='+str+'&category='+category, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanMap : [])
                   .catch(this.handleError);
    }
    getAuditPlanICD10(): Promise<AuditPlanICD10[]>{
        return this.http.get(this.auditPlanICD10Url, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanICD10 : [])
                   .catch(this.handleError);
    }
    searchAuditPlanICD10(keyWord: string): Promise<AuditPlanICD10[]>{
        return this.http.get(this.auditPlanICD10Url + '?keyword=' + encodeURIComponent(keyWord), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanICD10 : [])
                   .catch(this.handleError);
    }
    addAuditPlan(auditPlan: AuditPlan): Promise<any>{
        return this.http.post(this.auditPlanUrl, JSON.stringify(auditPlan), {headers: this.headers})
                   .toPromise()
                   .then(res => res.json())
                   .catch(this.handleError);
    }
    updateAuditPlan(auditPlan: AuditPlan): Promise<any>{
        return this.http.put(this.auditPlanUrl + '/' + auditPlan.id, JSON.stringify(auditPlan), {headers: this.headers})
                   .toPromise()
                   .then(res => res.json())
                   .catch(this.handleError);
    }
    getAuditPlan(auditPlanId: string): Promise<AuditPlan>{
        return this.http.get(this.auditPlanUrl + '/' + auditPlanId, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlan: {})
                   .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}