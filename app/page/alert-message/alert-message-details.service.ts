import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';


//依赖注入
@Injectable()
export class AlertMessageDetailsService {
    constructor(
        private http: Http
    ) { }
    /**
     * 警示信息详情页
     */
    private getMsgUrl = '/api/v1/msg/';
    private alertMssageStatusUrl = '/api/v1/alertMssageStatus';
    private openAlertMsgDpRemarkUrl = '/api/v1/openAlertMsgDpRemark';
    private alertMsgDpRemarkUrl =  '/api/v1/alertMsgDpRemark';
    private checkRuleUrl = '/api/v1/checkRule';

    getIptPatientMsgList(id: number) {
        return this.http.get(this.getMsgUrl + id)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    alertMssageStatus(param: Object){
        return this.http.put(this.alertMssageStatusUrl+'?messageId='+param['messageId']+'&status='+param['status'],{})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    openAlertMsgDpRemark(param: Object){
        return this.http.put(this.openAlertMsgDpRemarkUrl+'?messageId='+param['messageId']+'&applyType='+param['applyType'],{})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    alertMsgDpRemark(param: Object){
        return this.http.put(this.alertMsgDpRemarkUrl+'?messageId='+param['messageId']+'&applyType='+param['applyType']+'&remark='+param['remark'],{})
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    checkRule(){
        return this.http.get(this.checkRuleUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /**
     * 获取警示信息列表
     * 此处特殊，api也由component传递进来
     */
    getMsgList(Api: string){
        return this.http.get(Api)
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

    private handleError(error: any):Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}