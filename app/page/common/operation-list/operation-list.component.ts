import 'rxjs/add/operator/switchMap';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { OptRecipeOperation } from '../../ipt-opt-auditing/opt-recipe-operation';

@Component({
    selector: 'operation-list',
    template: `
        <div class="popup-bg" id="popup" *ngIf="showOperation">
            <div class="popup-box flex column popup-operation" id="popupOperation">
                <div class="popup-header">
                    <a class="popup-close" (click)="hide()">x</a>
                    手术
                </div>
                <div class="popup-body-nav">
                    <a *ngFor="let operator of operationList;let i = index;" (click)="changeHash('operator'+i)">{{operator.operationName}}</a>
                </div>
                <div class="popup-body popup-operation-content">
                    <div class="popup-operation-table" *ngFor="let operator of operationList;let i = index;">
                        <div class="popup-operation-table-title"><a name="operator{{i}}">{{operator.operationName}}</a></div>
                        <ul class="patient-info">
                            <li>患者号 <span>{{patientInfo.patientId}}</span></li>
                            <li>患者姓名 <span>{{patientInfo.name}}</span></li>
                        </ul>
                        <table class="table operation-main-con">
                            <tbody>
                                <tr>
                                    <th>手术名称</th>
                                    <th>切口类型</th>
                                    <th>手术开始时间</th>
                                    <th>手术结束时间</th>
                                </tr>
                                <tr>
                                    <td>{{operator.operationName}}</td>
                                    <td>{{operator.operationIncisionType}}</td>
                                    <td>{{operator.operationStartTime|date:"yyyy-MM-dd HH:mm:ss"}}</td>
                                    <td>{{operator.operationEndTime|date:"yyyy-MM-dd HH:mm:ss"}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: [ 'operation-list.component.css' ],
})
export class OperationListComponent implements OnInit, OnChanges{
    @Input() patientInfo: any;
    @Input() recipeId: string;
    @Input() options: any;
    private operationList: OptRecipeOperation[] = [];

    //交互逻辑变量
    showOperation: boolean = false;

    constructor(
        private http: Http
    ) {}

    ngOnInit(){
        //this.getOptOperationList(this.recipeId)
    }

    ngOnChanges(changes: any){
        if(changes && changes.recipeId){
            this.getOptOperationList(this.recipeId);
        }
    }
    
    //手术
    getOptOperationList(recipeId: string): void {
        let apiUrl = this.options.APIType == 'string' ?  (this.options.APIs.operation + '/' + this.recipeId) : (this.options.APIs.operation + '?id=' + this.recipeId);
        this.http.get(apiUrl)
            .toPromise()
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                if(res.json().data && res.json().data.length > 0){
                    this.operationList = res.json().data as OptRecipeOperation[];
                }
            })
            .catch(this.handleError)
    }

    //交互方法
    show(){
        this.showOperation = true;
    }
    hide(){
        this.showOperation = false;
    }

    changeHash(value: string):void{
        window.location.hash = value;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

