import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PharmacistsStatisticService{
    constructor(private http: Http) { }
    //审方药师工作统计(列表+统计)
    private workStatisticsUrl = '/api/v1/workStatistics';
    //药师名称
    private auditDoctorListURl = '/api/v1/auditDoctorList';
    //导出报表
    private exportUrl = '/api/v1/workStatistics/export';
    //下载
    private downloadListUrl = '/api/v1/exportList';

    getWorkStatistics(paramStr?: string){
        let tempUrl = paramStr ? `${this.workStatisticsUrl}?${paramStr}` : this.workStatisticsUrl;

        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    getAuditDoctorList(keyword?: string){
        let tempUrl = keyword ? `${this.auditDoctorListURl}?keyword=${keyword}` : this.auditDoctorListURl;

        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    exportWorkStatistics(){
        return this.http.get(this.exportUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    
    getDownloadList(){
        return this.http.get(this.downloadListUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }


    /**
     * promise预处理
     */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}