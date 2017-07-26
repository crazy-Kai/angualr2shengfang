import 'rxjs/add/operator/switchMap';
import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { OptRecipeExam } from '../../ipt-opt-auditing/opt-recipe-exam';
import { OptRecipeExamIndicator } from '../../ipt-opt-auditing/opt-recipe-exam-indicator';
import { OptRecipeSpecialExam } from '../../ipt-opt-auditing/opt-recipe-special-exam';
import { OptRecipeImage } from '../../ipt-opt-auditing/opt-recipe-image';
import { OptRecipeOperation } from '../../ipt-opt-auditing/opt-recipe-operation';

import { OptRecipeDetailsExamPipe } from '../../ipt-opt-auditing/opt-recipe-details-exam.pipe';
@Component({
    selector: 'laboratory-sheet',
    templateUrl: 'laboratory-sheet.component.html',
    styleUrls: [ 'laboratory-sheet.component.css' ],
})
export class LaboratorySheetComponent implements OnInit, OnChanges{
    @Input() patientInfo: any;
    @Input() recipeId: string;
    @Input() options: any;

    private examList: OptRecipeExam[] = [];
    private images: OptRecipeImage[] = [];
    private specialExams: OptRecipeSpecialExam[] = [];
    private operationList: OptRecipeOperation[] = [];

    //交互逻辑变量
    showSheet: boolean = false;

    constructor(
        private http: Http
    ) {}
    ngOnInit(){
        //this.loadData();
    }

    ngOnChanges(changes: any){
        if(changes && changes.recipeId){
            this.loadData();
        }
    }
    //数据统一加载
    loadData(){
        if(this.options.APIs.examList)
            this.getOptRecipeExamList(this.recipeId);
        if(this.options.APIs.imageList)
            this.getOptRecipeImageList(this.recipeId);
        if(this.options.APIs.specialExamList)
            this.getOptRecipeSpecialExamList(this.recipeId);
    }
    //检查
    getOptRecipeExamList(recipeId: string): void {
        let apiUrl = this.options.APIType == 'string' ?  (this.options.APIs.examList + '/' + this.recipeId) : (this.options.APIs.examList + '?id=' + this.recipeId);
        this.http.get(apiUrl)
            .toPromise()
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                if(res.json().data && res.json().data.length > 0){
                    this.examList = [];
                    for(let record of res.json().data){
                        let exam = new OptRecipeExam();
                        exam = record.masterObj as OptRecipeExam;
                        exam.indicatorList = record.followerObj ? record.followerObj as OptRecipeExamIndicator[] : [];
                        this.examList.push(exam);
                    }
                }
            })
            .catch(this.handleError);
    }
    //影像
    getOptRecipeImageList(recipeId: string): void {
        let apiUrl = this.options.APIType == 'string' ?  (this.options.APIs.imageList + '/' + this.recipeId) : (this.options.APIs.imageList + '?id=' + this.recipeId);
        this.http.get(apiUrl)
            .toPromise()
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                if(res.json().data && res.json().data.length > 0){
                    this.images = res.json().data ? res.json().data as OptRecipeImage[] : [];
                }
            })
            .catch(this.handleError);
    }
    //特殊检查
    getOptRecipeSpecialExamList(recipeId: string): void {
        let apiUrl = this.options.APIType == 'string' ?  (this.options.APIs.specialExamList + '/' + this.recipeId) : (this.options.APIs.specialExamList + '?id=' + this.recipeId);
        this.http.get(apiUrl)
            .toPromise()
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }
                if(res.json().data && res.json().data.length > 0){
                    this.specialExams = res.json().data ? res.json().data as OptRecipeSpecialExam[] : [];
                }
            })
            .catch(this.handleError)
    }

    //交互方法
    show(){
        this.showSheet = true;
    }
    hide(){
        this.showSheet = false;
    }

    changeHash(value: string):void{
        window.location.hash = value;
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

