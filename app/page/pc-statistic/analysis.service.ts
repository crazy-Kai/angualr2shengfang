import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AnalysisService{
    constructor(private http: Http) { }
    /*---------------------接口声明部分-----------------------*/
    //获取复核项目列表
    private getProjectListApi = '/api/v1/analysis/checkProjectList';
    //获取操作权限
    private getAuthorityApi = '/api/v1/analysis/judgeSelfOperation';
    /**
     * 抽取保存导出项目Apis
     */
    private getCheckResultQueryApi = '/api/v1/analysis/getCheckResultQuery';
    private createReportApi = '/api/v1/analysis/excuteReport';
    //OPT
    private getOptCheckListApi = '/api/v1/analysis/opt/getCheckList';                   //POST
    private getOptAlreadyCheckNumApi = '/api/v1/analysis/opt/getAlreadyCheckNum';
    private getOptTotalNumApi = '/api/v1/analysis/opt/getTotalNum';
    //IPT
    private getIptCheckListApi = '/api/v1/analysis/ipt/extractIptCheckData';
    private getIptAlreadyCheckNumApi = '/api/v1/analysis/ipt/getAlreadyCheckNum';
    private getIptTotalNumApi = '/api/v1/analysis/ipt/getTotalCheckNum';

    private getCheckResultListApi = '/api/v1/analysis/opt/getCheckResultList';
    private saveProjectApi = '/api/v1/analysis/saveProject';                            //POST
    private deleteProjectApi = '/api/v1/analysis/deleteProject';
    //报表
    private exportApi = '/api/v1/analysis/export';
    private getReportListApi = '/api/v1/analysis/getReportList';
    
    /**
     * 详情接口
     */
    //IPT
    private getIptOrderDataApi = '/api/v1/analysis/ipt/checkIptOrderData';
    private saveIptCheckResultApi = '/api/v1/analysis/ipt/saveCheckResult';                //POST
    private getIptCheckResultApi = '/api/v1/analysis/ipt/getCheckResult';
    private getPreviousIptEngineIdApi = '/api/v1/analysis/ipt/getPreviousEngineId';
    private getNextIptEngineIdApi = '/api/v1/analysis/ipt/getNextEngineId';
    //OPT
    private getOptRecipeDataApi = '/api/v1/analysis/opt/recipeInfo';
    private saveOptCheckResultApi = '/api/v1/analysis/opt/saveOperation';                //POST
    private getOptCheckResultApi = '/api/v1/analysis/opt/getOperation';
    private getPreviousOptEngineIdApi = '/api/v1/analysis/opt/previousId';
    private getNextOptEngineIdApi = '/api/v1/analysis/opt/nextId';
    /*---------------------接口调用部分-----------------------*/
    getAuthority(projectId: string | number){
        let tempUrl = this.getAuthorityApi + '?projectId=' + projectId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //获取列表
    getProjectList(paramstr: string){
        let tempUrl = this.getProjectListApi + paramstr;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //获取项目抽取条件
    getCheckResultQuery(projectId: string | number){
        let tempUrl = this.getCheckResultQueryApi + '?projectId=' + projectId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    
    //抽取
    getCheckList(type: string | number, params: any){
        let tempUrl: string;
        if(type == 3){
            tempUrl = this.getIptCheckListApi;  //IPT
        }else{
            tempUrl = this.getOptCheckListApi;  //OPT
        }

        return this.http.post(tempUrl, params)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //复核总数
    getTotalNum(type: string | number, projectId: string | number){
        let tempUrl: string;
        if(type == 3){
            tempUrl = this.getIptTotalNumApi + '?projectId=' + projectId;;  //IPT
        }else{
            tempUrl = this.getOptTotalNumApi + '?projectId=' + projectId;;  //OPT
        }
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }

    //复核进度
    getAlreadyCheckNum(type: string | number){
        let tempUrl: string;
        if(type == 3){
            tempUrl = this.getIptAlreadyCheckNumApi;  //IPT
        }else{
            tempUrl = this.getOptAlreadyCheckNumApi;  //OPT
        }

        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /**
     * 项目
     */
    //保存项目
    saveProject(proName: string, params: any){
        let tempUrl = this.saveProjectApi + '?projectName=' + proName;
        return this.http.post(tempUrl, params)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    
    //删除项目
    deleteProject(projectId: string | number, source: string | number){
        let tempUrl = this.deleteProjectApi + '?projectId=' + projectId + '&source=' + source;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /**
     * 报表
     */
    //生成报表
    createSheet(projectId: string | number, type: string | number){
        let tempUrl: string;
        tempUrl = this.createReportApi+ '?projectId=' + projectId + '&source=' + type;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //导出报表
    exportSheet(projectId: string | number){
        let tempUrl = this.exportApi + '?projectId=' + projectId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    //查看项目报表
    getReportList(paramstr: string){
        let tempUrl = this.getReportListApi + paramstr;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }


    /**
     * 医嘱复核详情 
     */
    getIptOrderData(id: string | number){
        let tempUrl = this.getIptOrderDataApi + '?id=' + id;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    saveIptCheckResult(params: any){
        return this.http.post(this.saveIptCheckResultApi, params)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError) 
    }
    getIptCheckResult(engineId: any, groupNo: any, projectId: any, checkPeopleId: string){
        let tempUrl = this.getIptCheckResultApi + '?engineId=' + engineId + '&groupNo=' + groupNo + (projectId ? ('&projectId=' + projectId) : '') + (checkPeopleId ? ('&userId=' + checkPeopleId) : '');
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    getPreviousIptEngineId(engineId: any){
        let tempUrl = this.getPreviousIptEngineIdApi + '?engineId=' + engineId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    getNextIptEngineId(engineId: any){
        let tempUrl = this.getNextIptEngineIdApi + '?engineId=' + engineId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    /**
     * 门诊详情
     */
    getOptRecipeData(id: string | number){
        let tempUrl = this.getOptRecipeDataApi + '/' + id;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    saveOptCheckResult(params: any){
        return this.http.post(this.saveOptCheckResultApi, params)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    getOptCheckResult(recipeId: any, projectId: any, checkPeopleId: string){
        let tempUrl = this.getOptCheckResultApi + '?recipeId=' + recipeId + (projectId ? ('&projectId=' + projectId) : '') + (checkPeopleId ? ('&userId=' + checkPeopleId) : '');
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    getPreviousOptEngineId(optRecipeId: any){
        let tempUrl = this.getPreviousOptEngineIdApi + '?optRecipeId=' + optRecipeId;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError)
    }
    getNextOptEngineId(optRecipeId: any){
        let tempUrl = this.getNextOptEngineIdApi + '?optRecipeId=' + optRecipeId;
        return this.http.get(tempUrl)
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