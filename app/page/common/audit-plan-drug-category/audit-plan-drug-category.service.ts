import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuditPlanDrugCategory } from './audit-plan-drug-category';

@Injectable()
export class AuditPlanDrugCategoryService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private drugCategoryUrl = '/api/v1/drugCategory';
    private childDrugCategoryUrl = '/api/v1/childDrugCategoryList';

    constructor(private http: Http) { }

    getDrugCategoryList(): Promise<any[]>{
        return this.http.get(this.drugCategoryUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    getChildDrugCategoryList(parentId: string): Promise<any[]>{
        return this.http.get(this.childDrugCategoryUrl + '?parentId=' + parentId, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data: [])
                   .catch(this.handleError);
    }
    searchDrugCategory(keyWord: string): Promise<any[]> {
        return this.http.get(this.drugCategoryUrl + '?keyWord=' + encodeURIComponent(keyWord), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data : [])
                   .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}