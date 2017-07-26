import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuditPlanDoctor } from './audit-plan-doctor.ts';
import { AuditPlanZone } from './audit-plan-zone.ts';

@Injectable()
export class AuditPlanDoctorService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private doctorListUrl = '/api/v1/doctorInZone';
    private groupListUrl = '/api/v1/docGroupList';
    private zoneListUrl = '/api/v1/zoneList';
    private getIptWardListUrl = '/api/v1/iptWardList';
    constructor(private http: Http) { }

    getDoctorList(zoneId: string): Promise<AuditPlanDoctor[]>{
        //TODO - 接口暂不支持按院区查询医生
        return this.http.get(this.doctorListUrl+'?zoneIds='+(zoneId || ''), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDoctor : [])
                   .catch(this.handleError);
    }
    getGroupList(zoneId: string): Promise<AuditPlanDoctor[]>{
        //TODO - 接口暂不支持按院区查询医生
        return this.http.get(this.groupListUrl+'?zoneIds='+(zoneId || ''), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDoctor : [])
                   .catch(this.handleError);
    }
    getIptWardList(zoneId: string): Promise<AuditPlanDoctor[]>{
        //TODO - 接口暂不支持按院区查询医生
        return this.http.get(this.getIptWardListUrl+'?zoneIds='+(zoneId || ''), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDoctor : [])
                   .catch(this.handleError);
    }
    getZoneList(): Promise<AuditPlanZone[]>{
        return this.http.get(this.zoneListUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanZone : [])
                   .catch(this.handleError);
    }
    searchDoctor(keyWord: string): Promise<AuditPlanDoctor[]> {
        return this.http.get(this.doctorListUrl + '?keyWord=' + encodeURIComponent(keyWord), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDoctor : [])
                   .catch(this.handleError);
    }
    searchGroup(keyWord: string): Promise<AuditPlanDoctor[]> {
        return this.http.get(this.groupListUrl + '?keyWord=' + encodeURIComponent(keyWord), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDoctor : [])
                   .catch(this.handleError);
    }
    searchIptWardList(keyWord: string): Promise<AuditPlanDoctor[]> {
        return this.http.get(this.getIptWardListUrl + '?inWardName=' + encodeURIComponent(keyWord), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDoctor : [])
                   .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
