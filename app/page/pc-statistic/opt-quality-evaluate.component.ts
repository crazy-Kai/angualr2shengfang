import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { OptDetailsService } from '../ipt-opt-review/opt-details.service';
import { AnalysisService } from './analysis.service';
import { ProjectService } from './project.service';

import { OptRecipePatient } from '../ipt-opt-auditing/opt-recipe-patient';
import { OptRecipeDetails } from '../ipt-opt-auditing/opt-recipe-details';
import { OptRecipeDrugs } from '../ipt-opt-auditing/opt-recipe-drugs';
import { OptRecipeMap } from '../ipt-opt-auditing/opt-recipe-map';
import { OptRecipeRecordMap } from '../ipt-opt-auditing/opt-recipe-record-map';
import { OptRecipeRecordMessage } from '../ipt-opt-auditing/opt-recipe-record-message';
import { OptRecipeAuditResult } from '../ipt-opt-auditing/opt-recipe-audit-result';
import { OptRecipeExam } from '../ipt-opt-auditing/opt-recipe-exam';
import { OptRecipeExamIndicator } from '../ipt-opt-auditing/opt-recipe-exam-indicator';
import { OptRecipeSpecialExam } from '../ipt-opt-auditing/opt-recipe-special-exam';
import { OptRecipeImage } from '../ipt-opt-auditing/opt-recipe-image';
import { OptRecipeOperation } from '../ipt-opt-auditing/opt-recipe-operation';

import { OptRecipeDetailsExamPipe } from '../ipt-opt-auditing/opt-recipe-details-exam.pipe';
import { PatientAllergy } from '../ipt-opt-auditing/ipt-order-details/patient-allergy';

@Component({
    selector: 'opt-quality-evaluate',
    templateUrl: 'opt-quality-evaluate.component.html',
    styleUrls: ['../ipt-opt-review/opt-recipe-review-details.component.css', 'ipt-quality-evaluate.component.css', '../common/reset.css'],
    providers: [OptDetailsService, AnalysisService]
})

export class OptQualityEvaluateComponent implements OnInit {
    private optRecipeId: number;
    private relatedInfoShow: boolean = false;
    private relatedInfo: any;
    private noInfo: boolean;
    private optRecipenput: any = {};
    private patientInfo: OptRecipePatient = new OptRecipePatient();
    private patientAllergy: string = '';
    private patientAllergyList: any[] = [];
    private optRecipeList: OptRecipeMap[] = [];
    private checkedRecipe: any = {
        'checkedResult': {}
    };
    private recordMap: OptRecipeRecordMap[] = [];
    private recordCheckedMap: OptRecipeRecordMessage[] = [];
    private optRecipeDetails: OptRecipeDetails = new OptRecipeDetails();
    private optReciptDrugs: OptRecipeDrugs = new OptRecipeDrugs();
    private auditResultList: OptRecipeAuditResult[] = [];
    private examList: OptRecipeExam[] = [];
    private image: OptRecipeImage;
    private specialExam: OptRecipeSpecialExam;
    private operationList: OptRecipeOperation[] = [];
    private allergyList: PatientAllergy[] = [];
    private auditIndex: number = 0;
    private recordBoxDefaultText = '审核意见...';
    private curRecipeNo: number;        //当前选中的处方号
    //检验单浮层
    private isCheckListShow: boolean = false;
    //手术浮层
    private isOperationListShow: boolean = false;
    private window = window;
    //过敏列表浮层
    private isAllergyListShow: boolean = false;

    history = window.history;
    /**
     * 处方id
     * 用于获取警示信息  电子病历  检验单  手术
     */
    private recipeId: string;

    private menuDOM = <HTMLElement>document.getElementsByClassName("public-menu")[0];

    //过敏药物
    private onAllergyDrug:any[] = [];

    constructor(
        private optDetailsService: OptDetailsService,
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        private analysisService: AnalysisService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(optRecipenput => {
            this.optRecipenput = optRecipenput;
            //TODO - 处方 ID
            this.optRecipeId = this.optRecipenput.recipeId;
            this.getOptRecipe(this.optRecipenput.recipeId);
            //this.getAroundAuditResult(this.optRecipenput.recipeId);
            this.recipeId = this.optRecipenput.recipeId;
            this.handle = this.optRecipenput['handle'];
            this.checkPeopleId = this.optRecipenput['checkPeopleId'];
        });

        this.goToDrugDetail();

        if(this.handle == 'edit'){
            //复核
            if(this.projectService.project.projectId) this.projectId = this.projectService.project.projectId;
            //页面刷新的情况，从session获取
            if(this.projectId == undefined) this.projectId = sessionStorage.getItem('projectId');

            if(!this.projectId) this.authority = true;
        }
    }
    //查看详情
    goHisDetail(url: string){
        let tempUrl: string;
        if(this.patientInfo.hisUrl){
            tempUrl = encodeURI(this.patientInfo.hisUrl);
            window.open(tempUrl, '_blank');
        } 
    }

    getOptAllergyList(recipeId: string) {
        this.optDetailsService.getAllergyList(recipeId).then(allergyList => {
            // for(let allergy of allergyList){
            //     this.patientAllergyList.push(allergy.allergyDrug);
            // }
            this.patientAllergyList = [];
            this.onAllergyDrug = [];
            this.patientAllergy = this.patientAllergyList.join(' ');
            if(allergyList && allergyList.length>0){
                for(let allergy of allergyList){
                    var allergyObj = {
                        'allergyDrug': allergy.allergyDrug,
                        'anaphylaxis': allergy.anaphylaxis
                    };
                    this.patientAllergyList.push(allergyObj);
                    this.onAllergyDrug.push(allergy.allergyDrug);
                    // console.log(this.onAllergyDrug);
                }
            }
            // this.allergyList = allergyList ? allergyList as PatientAllergy[] : [];
        });
    }
    getWarningList(recipeId: any): void {
        //this.curRecipeNo = recipe.recipeDetails.id;
        this.recordMap = [];
        this.optDetailsService.getWarningList(recipeId).then(resultList => {
            this.recordMap = resultList && resultList.length > 0 ? resultList as OptRecipeRecordMap[] : [];
        });
    }
    getAuditResultList(recipeId: string): void {
        this.auditResultList = [];
        this.optDetailsService.getAuditResultList(recipeId).then(auditResultList => {
            this.auditResultList = auditResultList;
        });
    }
    //切换处方的警示信息
    checkRecipe(recipe: any) {
        if (recipe) {
            this.recipeId = recipe.recipeDetails.id;
            this.checkedRecipe = recipe;
            this.curRecipeNo = recipe.recipeDetails.recipeNo;
        }

        this.getWarningList(this.recipeId);
        this.getAuditResultList(this.recipeId);
    }

    recordBoxBlur(box: any): void {
        if (!box.value) {
            this.recordBoxDefaultText = '审核意见...';
        }
    }


    goback() {
        window.history.back();
    }
    //查看检验单-------------
    sheetOptions: any = {
        APIType: 'string',
        APIs: {
            examList: '/api/v1/opt/all/optRecipeExamList',
            imageList: '/api/v1/opt/all/optRecipeImageList',
            specialExamList: '/api/v1/opt/all/optRecipeSpecialExamList',
            operationList: '/api/v1/opt/all/optRecipeOperationList'
        }
    }
    @ViewChild('sheets') laboratorySheets: any;
    showExam(recipeId: string) {
        this.laboratorySheets.show();
    }
    //查看手术-------------
    operationOptions: any = {
        APIType: 'string',
        APIs: {
            operation: '/api/v1/opt/all/optRecipeOperationList'
        }
    }
    @ViewChild('operation') operlationList: any;
    showOperation() {
        this.operlationList.show();
    }
    //电子病历------------
    elecMedOptions: any = {
        APIType: 'string',
        APIs: {
            electronicMedical: '/api/v1/opt/all/optRecipeElectronicMedical'
        }
    }
    @ViewChild('elecMedRecord') elecRecord: any;
    showElecRecord() {
        this.elecRecord.show();
    }

    //返回任务清单
    backToList(): void {
        if(this.handle == 'edit'){
            if(this.projectId){
                this.router.navigate(['/page/review-project', this.projectId]);
            }else{
                this.router.navigate(['/page/review-project', 'new']);
            }
        }else{
            this.projectService.routeType = 'back';
            this.router.navigate(['/page/personal-quality']);
        }
    }

    private drugUrl: string = '';
    goToDrugDetail() {
        this.optDetailsService.getDrugApi()
            .then(res => {
                if (res.code == '200' && res.data) {
                    this.drugUrl = res.data;
                }
            })
    }

    //关联点
    getDrugRelated(recipeDrug) {
        this.relatedInfoShow = true;
        this.relatedInfo = null;
        this.noInfo = false;
        let getDrugParams = [];
        getDrugParams.push(recipeDrug.optRecipeId, recipeDrug.zoneId, recipeDrug.drugId);
        this.optDetailsService.getDrugRelated(getDrugParams).then(response => {
            if (response.code == '200') {
                if (response.data) {
                    this.noInfo = true;
                    this.relatedInfo = response.data;
                    for (let item in response.data) {
                        if (response.data[item] && response.data[item].length > 0) {
                            this.noInfo = false;
                        }
                    }
                } else {
                    this.noInfo = true;
                }
            } else {
                this.noInfo = true;
            }
        });
    }

    /**
     * 复核模块
     */
    private authority: boolean;
    private handle: string;
    private projectId: string;
    private checkPeopleId: string;
    private evaluateObj: any = {};
    private evaluateStatus: boolean = true;             //复核结果
    private evaluateRecommond: string;                  //复核意见
    private forbidList: any[] = [];
    private previousId: number;
    private nextId: number;
    //操作权限
    getAuthority(projectId: string | number){
        this.analysisService.getAuthority(projectId)
            .then(res => {
                if(res.code == '200'){
                    this.authority = res.data;
                }
            })
    }
    getOptRecipe(id: string): void {
        this.analysisService.getOptRecipeData(id).then(result => {
            this.patientInfo = result.data.outpatient || {};
            this.optRecipeList = [];
            this.checkedRecipe = null;
            this.getPrevious();
            this.getNext();
            
            if(this.projectId){
                this.getAuthority(this.projectId);
            }

            if (result.data.hasOwnProperty('optRecipe') && result.data.optRecipe) {
                for (let item of result.data.optRecipe) {
                    let optRecipe = new OptRecipeMap();
                    optRecipe.recipeDetails = item.optRecipe as OptRecipeDetails;
                    optRecipe.recipeDrugList = item.dtoSfOptRecipeItems as OptRecipeDrugs[];
                    this.optRecipeList.push(optRecipe);
                }
                // this.optRecipeList.map(item => {
                //     if (item.recipeDetails.id == id) {
                //         this.checkedRecipe = item;
                //     }
                // });
                if (!this.checkedRecipe) this.checkedRecipe = this.optRecipeList[0];
                
                this.checkRecipe(this.checkedRecipe);
                this.getOptAllergyList(this.checkedRecipe.recipeDetails.id);
                this.getOptCheckResult(id);
            }
        });
    }
    evaluate(){
        if(this.projectId)
            this.evaluateObj.projectId = this.projectId;
        this.evaluateObj.optRecipeId = this.recipeId;
     
        this.analysisService.saveOptCheckResult(this.evaluateObj)
            .then(res => {
                if(res.code == '200' && res.data){
                    this.checkedRecipe.resonable = this.evaluateObj.checkResult;
                }else{
                    alert(res.message)
                }
            })
    }
    getOptCheckResult(id: string){
        this.evaluateObj = {};
        this.analysisService.getOptCheckResult(id, this.projectId, this.checkPeopleId).then(result => {
            if(result.code == '200'){
                if(result.data){
                    this.evaluateObj = result.data;
                    this.checkedRecipe.resonable = this.evaluateObj.checkResult;
                    if(this.evaluateObj.checkResult != 0)
                        this.evaluateObj.checkResult = 1;
                }else{
                    this.evaluateObj.checkResult = 1;
                }

                // this.evaluateObj = result.data || {};
                // debugger
                // if(this.evaluateObj.id){
                //     this.checkedRecipe.resonable = this.evaluateObj.checkResult;
                // }
                // if(this.evaluateObj.checkResult === null){
                //     this.evaluateObj.checkResult = 1;
                // }
            }
        })
    }
    //获取上一张下一张id
    getPrevious(){
        this.analysisService.getPreviousOptEngineId(this.optRecipeId)
            .then(res => {
                if(res.code == '200'){
                    this.previousId = res.data;
                }
            })
    }
    getNext(){
        this.analysisService.getNextOptEngineId(this.optRecipeId)
            .then(res => {
                if(res.code == '200'){
                    this.nextId = res.data;
                }
            })
    }
    //切换上一张下一张
    goPrevious(){
        this.router.navigate(['page/opt-quality-evaluate', this.previousId, 'edit', '']);
    }
    goNext(){
        this.router.navigate(['page/opt-quality-evaluate', this.nextId, 'edit', '']);
    }
}