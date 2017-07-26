import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuditPlanDrugProperty } from './audit-plan-drug-property';

@Injectable()
export class AuditPlanDrugPropertyService {
    private headers = new Headers({'Content-Type': 'application/json'});
    // private drugPropertyUrl = '/api/v1/drugPropertyList';
    private drugPropertyUrl = '/api/v1/childDrugProperty';

    constructor(private http: Http) { }

    getDrugPropertyList(): Promise<any[]>{
        return this.http.get(this.drugPropertyUrl, {headers: this.headers})
                   .toPromise()
                   .then(this.extractData)
                   .catch(this.handleError);
    }
    getChildrenList(parentId: any): Promise<any[]>{
        return this.http.get(this.drugPropertyUrl + (parentId ? '?parentId='+parentId : ''), {headers: this.headers})
                   .toPromise()
                   .then(this.extractData)
                   .catch(this.handleError);
    }
    searchDrugProperty(keyWord: string): Promise<AuditPlanDrugProperty[]>{
        return this.http.get(this.drugPropertyUrl + '?keyword=' + encodeURIComponent(keyWord), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanDrugProperty : [])
                   .catch(this.handleError);
    }
    private extractData(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        //后端返回的是hasChild,需要hasChildren字段
        body.data.forEach(function(item){
            item.hasChildren = item.hasChild;
        });
        return body.data || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}