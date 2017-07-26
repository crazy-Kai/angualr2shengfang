import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

//依赖注入
@Injectable()
export class AuditSettingService {
    constructor(private http: Http) { }
    /**
     * 审方方案列表
     */
    private deleteAuditPlanUrl = '/api/v1/auditPlan/';
    private auditPlanSettingUrl = '/api/v1/auditPlanSetting?ids=';

    //删除
    deleteAuditPlan(auditPlanId: string) {
        //let tempUrl = this.deleteAuditPlanUrl + "?filePath=" + this.fileList[index].filePath + "&id=" + this.fileList[index].id;
        return this.http.delete(this.deleteAuditPlanUrl + auditPlanId)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    }

    //请求判断
    getAuditPlanSetting(auditPlanId: string) {
        return this.http.get(this.auditPlanSettingUrl + auditPlanId)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /**
     * promise处理
     */
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}