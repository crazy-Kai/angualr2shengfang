import 'rxjs/add/operator/switchMap';
import { Component, OnInit, OnChanges, Input }      from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { OptRecipeDetailsExamPipe } from '../../ipt-opt-auditing/opt-recipe-details-exam.pipe';
@Component({
    selector: 'elec-med-record',
    template: `
        <div class="popup-bg" id="popup" *ngIf="showRecord">
            <div class="popup-box popup-elecrecord" id="popupOperation">
                <div class="popup-header" style="border-bottom: 1px solid #ccc">
                    <a class="popup-close" (click)="hide()">x</a>
                    电子病历
                </div>
                <div class="popup-body popup-elecrecord-content">
                    <ul>
                        <li>主诉：<span>{{eleMedRecord.chiefComplaint}}</span></li>
                        <li>现病史：<span>{{eleMedRecord.medicalHistory}}</span></li>
                        <li>既往史：<span>{{eleMedRecord.pastHistory}}</span></li>
                        <li>个人史：<span>{{eleMedRecord.personalHistory}}</span></li>
                        <li>家族史：<span>{{eleMedRecord.familyDiseaseHistory}}</span></li>
                        <li>月经史：<span>{{eleMedRecord.menstrualHistory}}</span></li>
                        <li>婚育史：<span>{{eleMedRecord.obstericalHistory}}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    styleUrls: [ 'elec-med-record.component.css' ],
})
export class ElecMedRecordComponent implements OnInit, OnChanges{
    @Input() patientInfo: any;
    @Input() recipeId: string;
    @Input() options: any;

    eleMedRecord: any;
    //交互逻辑变量
    showRecord: boolean = false;


    constructor(
        private http: Http
    ) {}
    ngOnInit(){
        
    }

    ngOnChanges(changes: any){
        if(changes && changes.recipeId){
            this.getOptOperationList(this.recipeId);
        }
    }
    
    //电子病历
    getOptOperationList(recipeId: string): void {
        let apiUrl = this.options.APIType == 'string' ?  (this.options.APIs.electronicMedical + '/' + this.recipeId) : (this.options.APIs.electronicMedical + '?id=' + this.recipeId);
        // console.log('this.options.APIs.electronicMedical = ' + this.options.APIs.electronicMedical);
        this.http.get(apiUrl)
            .toPromise()
            .then(res => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('Bad response status: ' + res.status);
                }

                this.eleMedRecord = res.json().data;
            })
            .catch(this.handleError)
    }

    //交互方法
    show(){
        this.showRecord = true;
    }
    hide(){
        this.showRecord = false;
    }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

