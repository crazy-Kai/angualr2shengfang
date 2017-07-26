import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class RecipeListService{
    constructor(private http: Http) { }
    /**
     * 门诊处方，住院医嘱查看两个列表页
     * 包括查询条件接口 & 查询接口
     */
    //科室树
    private deptListUrl = '/api/v1/deptList';
    //医生 => 根据选择的科室自动加载
    private doctorListUrl = '/api/v1/doctorInZone';
    //药品分类树
    private drugCategoryListUrl = '/api/v1/childDrugCategoryList';
    //药品名称 => 根据选择的药品分类自动加载 
    private drugListUrl = '/api/v1/drugList';
    //审核药师列表
    private auditDoctorListUrl = '/api/v1/auditDoctorList';

    //已审门诊处方(列表+统计)  
    private getOptRecipeListUrl = '/api/opt/all/v1/optRecipeList';
    //已审住院医嘱(列表+统计)
    private getIpeRecipeListUrl = '/api/v1/ipt/all/queryIptByPage';  
    //暂缺

    //获取科室树
    getDeptList(id?: string){
        return this.http.get(this.deptListUrl + (id ? '?keyword=' + id : ''))
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //根据科室id 获取医生列表
    getDoctorList(zoneIds: string, keyword: string){
        return this.http.get(this.doctorListUrl + "?" + (zoneIds ? ('zoneId=' + zoneIds) : '') + (keyword ? ('keyword=' + keyword) : ''))
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取药品分类树
    getDrugCategoryList(id?: string){
        return this.http.get(this.drugCategoryListUrl + (id ? '?parentId=' + id : ''))
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //根据药品分类id 获取药品树
    getDrugList(id: string){
         return this.http.get(this.drugListUrl + '?keyword=' + id)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError)
    }
    //获取审核药师列表
    getAuditDoctorList(id?: string){
         return this.http.get(this.auditDoctorListUrl + (id ? '?keyword=' + id : ''))
            .toPromise()
            .then(this.extractData)
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