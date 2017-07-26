import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';


@Injectable()
export class FastReplyService {
    private headers = new Headers({ 'Content-type': 'application/json' });
    //快捷回复模板列表
    private replyTemplateListUrl = '/api/v1/replyTemplateList';
    //快捷回复添加模板
    private addReplyTemplateListUrl = '/api/v1/addReplyTemplate';
    //快捷回复删除模板
    private deleteReplyTemplateListUrl = '/api/v1/deleteReplyTemplate/';

    constructor(private http: Http) { }

    //获取快捷回复模板列表
    getReplyTemplateList(): Promise<any> {
        return this.http.get(this.replyTemplateListUrl, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    //快捷回复添加
    addReplyTemplateService(params: any): Promise<any> {
        // return this.http.post(this.addReplyTemplateListUrl, 'replyTemplate:' +  '"' + replyTemplate + '"', {headers: this.headers})
        return this.http.post(this.addReplyTemplateListUrl + "?replyTemplate=" + encodeURIComponent(params.replyTemplate), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            // .then(res => res)
            .catch(this.handleError);
    }

    //快捷回复删除
    deleteReplyTemplate(params: any): Promise<any> {
        return this.http.delete(this.deleteReplyTemplateListUrl + encodeURIComponent(params.id), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            // .then(res => res)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}