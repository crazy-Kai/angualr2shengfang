// import { Injectable } from '@angular/core';
// import { Headers, Http, Response } from '@angular/http';

// import 'rxjs/add/operator/toPromise';

// @Injectable()
// export class LaboratorySheetService {

//     //检查单 - 检验及检验明细
//     private optRecipeExamListUrl = '/api/v1/opt/all/optRecipeExamList';
//     //检查单 - 影像
//     private optRecipeImageListUrl = '/api/v1/opt/all/optRecipeImageList';
//     //检查单 - 特殊检查项
//     private optRecipeSpecialExamListUrl = '/api/v1/opt/all/optRecipeSpecialExamList';
//     //手术
//     private optOperationListUrl = '/api/v1/opt/all/optRecipeOperationList';
//     //电子病历
//     private optRecipeElectronicMedicalUrl = '/api/v1/opt/all/optRecipeElectronicMedical';

//     constructor(private http: Http) { }

    
//     //获取检查单 - 检验及检验明细
//     getOptRecipeExamList(optRecipeId: string){
//         return this.http.get(this.optRecipeExamListUrl + '/' + optRecipeId)
//             .toPromise()
//             .then(this.extractData)
//             .catch(this.handleError)
//     }
//     //获取检查单 - 影像
//     getOptRecipeImageList(optRecipeId: string){
//         return this.http.get(this.optRecipeImageListUrl + '/' + optRecipeId)
//             .toPromise()
//             .then(this.extractData)
//             .catch(this.handleError)
//     }
//     //获取检查单 - 特殊检查项
//     getOptRecipeSpecialExamList(optRecipeId: string){
//         return this.http.get(this.optRecipeSpecialExamListUrl + '/' + optRecipeId)
//             .toPromise()
//             .then(this.extractData)
//             .catch(this.handleError)
//     }
//     //获取检查单 - 手术
//     getOptOperationList(optRecipeId: string){
//         return this.http.get(this.optOperationListUrl + '/' + optRecipeId)
//             .toPromise()
//             .then(this.extractData)
//             .catch(this.handleError)
//     }
//     //获取电子病历 
//     getRecipeElectronicMedical(optRecipeId: string){
//         return this.http.get(this.optRecipeElectronicMedicalUrl + '/' + optRecipeId)
//             .toPromise()
//             .then(this.extractData)
//             .catch(this.handleError)
//     }

    
//     /**
//      * promise预处理
//      */
//     private extractJson(res: Response) {
//         if (res.status < 200 || res.status >= 300) {
//             throw new Error('Bad response status: ' + res.status);
//         }
//         let body = res.json();
//         return body || {};
//     }
//     private extractData(res: Response) {
//         if (res.status < 200 || res.status >= 300) {
//             throw new Error('Bad response status: ' + res.status);
//         }
//         let body = res.json();
//         return body.data || {};
//     }
//     private handleError(error: any): Promise<any> {
//         console.error('An error occurred', error); // for demo purposes only
//         return Promise.reject(error.message || error);
//     }
// }