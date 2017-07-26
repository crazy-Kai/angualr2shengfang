import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuditPlanPayType } from './audit-plan-pay-type';

@Injectable()
export class AuditPlanPayTypeService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private payTypeUrl = '/api/v1/payTypeList';
    private patientCondtionListUrl = '/api/v1/patientCondtionList';

    constructor(private http: Http) { }

    getPayTypeList(): Promise<AuditPlanPayType[]>{
        return this.http.get(this.payTypeUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanPayType : [])
                   .catch(this.handleError);
    }

    getPatientCondtionList(): Promise<AuditPlanPayType[]>{
        return this.http.get(this.patientCondtionListUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanPayType : [])
                   .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}