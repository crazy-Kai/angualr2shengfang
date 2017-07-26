import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuditPlanDept } from './audit-plan-dept';
import { AuditPlanZone } from './audit-plan-zone';

@Injectable()
export class AuditPlanDeptService {
    private headers = new Headers({'Content-Type': 'application/json'});

    private deptListUrl = '/api/v1/childrenDept';

    private zoneListUrl = '/api/v1/zoneList';
    constructor(private http: Http) { }

    getDeptList(zoneId: string): Promise<AuditPlanDept[]>{
        //TODO - 缺少按院区搜索科室接口

        return this.http.get(this.deptListUrl + (zoneId != '' ? ('?parentId=' + encodeURIComponent(zoneId)) : ''), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDept : [])
                   .catch(this.handleError);
    }
    getZoneList(): Promise<AuditPlanZone[]>{
        return this.http.get(this.zoneListUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanZone : [])
                   .catch(this.handleError);
    }
    searchDept(keyWord: string): Promise<AuditPlanDept[]> {
        return this.http.get(this.deptListUrl + (keyWord ?'?keyword=' + encodeURIComponent(keyWord) : ''), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDept : [])
                   .catch(this.handleError);
    }
    searchZone(keyWord: string): Promise<AuditPlanZone[]>{
        return this.http.get(this.zoneListUrl + (keyWord ?'?keyword=' + encodeURIComponent(keyWord) : ''), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanZone : [])
                   .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}