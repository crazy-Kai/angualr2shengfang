import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuditPlanAnalysis } from './audit-plan-analysis';
import { AuditPlanAnalysisType } from './audit-plan-analysis-type';

@Injectable()
export class AuditPlanWarningService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private analysisMapUrl = '/api/v1/analysisType';
    private analysisTypeMapUrl = '/api/v1/analysisResultTypeList';

    constructor(private http: Http) { }

    getAnalysisMap(): Promise<AuditPlanAnalysis[]> {
        return this.http.get(this.analysisMapUrl, {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanAnalysis : [])
                   .catch(this.handleError);
    }
    getAnalysisTypeMap(analysisName: string): Promise<AuditPlanAnalysisType[]> {
        return this.http.get(this.analysisTypeMapUrl + '?analysisType=' + encodeURIComponent(analysisName), {headers: this.headers})
                   .toPromise()
                   .then(response => response && response.json().code == 200 ? response.json().data as AuditPlanAnalysisType : [])
                   .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}