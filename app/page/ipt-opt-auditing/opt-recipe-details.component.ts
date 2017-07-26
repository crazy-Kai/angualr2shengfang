import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { OptRecipeDetailsService } from './opt-recipe-details.service';
import { OptRecipePatient } from './opt-recipe-patient';
import { OptRecipeDetails } from './opt-recipe-details';
import { OptRecipeDrugs } from './opt-recipe-drugs';
import { OptRecipeMap } from './opt-recipe-map';
import { OptRecipeRecordMap } from './opt-recipe-record-map';
import { OptRecipeRecordMessage } from './opt-recipe-record-message';
import { OptRecipeAuditResult } from './opt-recipe-audit-result';
import { OptRecipeExam } from './opt-recipe-exam';
import { OptRecipeExamIndicator } from './opt-recipe-exam-indicator';
import { OptRecipeSpecialExam } from './opt-recipe-special-exam';
import { OptRecipeImage } from './opt-recipe-image';
import { OptRecipeOperation } from './opt-recipe-operation';
import { OptRecipeMedical } from './opt-recipe-medical';
import { PromptComponent } from '../common/prompt/prompt.component';


import { OptRecipeDetailsExamPipe } from './opt-recipe-details-exam.pipe';

@Component({
    selector: 'opt-recipe-details',
    templateUrl: 'opt-recipe-details.component.html',
    styleUrls: ['opt-recipe-details.component.css', '../common/reset.css']
})

export class OptRecipeDetailsComponent implements OnInit {
    private relatedInfoShow: boolean = false;
    private relatedInfo: any;
    private noInfo: boolean;
    private OptRecipeDetailsComponent: any;
    private optReciptInput: any;
    private patientInfo: OptRecipePatient = new OptRecipePatient();
    private patientAllergyList: any[] = [];
    private optRecipeList: OptRecipeMap[] = [];
    private checkedRecipe: OptRecipeMap;
    private recordMap: OptRecipeRecordMap[] = [];
    private recordCheckedMap: OptRecipeRecordMessage[] = [];
    private optRecipeDetails: OptRecipeDetails = new OptRecipeDetails();
    private optReciptDrugs: OptRecipeDrugs = new OptRecipeDrugs();
    private auditResultList: OptRecipeAuditResult[] = [];
    private examList: OptRecipeExam[] = [];
    private image: OptRecipeImage = new OptRecipeImage();
    private specialExam: OptRecipeSpecialExam = new OptRecipeSpecialExam();
    private operationList: OptRecipeOperation[] = [];
    private electronicMedical: OptRecipeMedical = new OptRecipeMedical();
    private menuDOM = <HTMLElement>document.getElementsByClassName("public-menu")[0];
    private auditIndex: number = 0;
    //检验单浮层
    private isCheckListShow: boolean = false;
    //手术浮层
    private isOperationListShow: boolean = false;
    //过敏列表浮层
    private isAllergyListShow: boolean = false;
    //电子病历浮层
    private isElectronicMedicalShow: boolean = false;
    //重点关注浮层
    private isFocusShow: boolean = false;
    //是否全部审核完毕
    private isAllRecipeChecked: boolean = false;
    //通过状态
    private throughStatus: number = 0;
    //打回状态
    private backStatus: number = 1;
    //快捷回复模板
    private replyTemplate: string;
    //水印状态
    // private auditResult:string;
    //建议医生修改或双签名确认 operateStatus
    // private operateStatus: any;
    //快捷回复textarea
    private textAuditResult: string;
    private record: any = {
        auditResult: ''
    };
    //当前选中的处方号
    private curRecipeNo: any;
    /**
    * 处方id
    * 用于获取警示信息  电子病历  检验单  手术
    */
    private recipeId: string;
    private id: string;

    //处方类型
    private recipeType: string;
    //参数传递
    private parameterPassing: any;
    //警示信息
    private onWarning: any;
    //警示信息列表
    private onWarningList: any[] = [];
    // 警示信息选中数量
    private checkedNumber: number = 0;
    //警示信息选择
    private choiceInfo: any;
    //用户心跳
    private beatingInterval: any;
    private onAuditing: any;
    //处方状态
    private auditStatus: any;
    //处方ID集合
    private idAssemble: any[] = [];
    //过敏药物
    private onAllergyDrug: any[] = [];
    //关联点传参
    // private getDrugParams: any[] = [];
    // private hisUrl:string;

    constructor(
        private optRecipeDetailsService: OptRecipeDetailsService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    titles: any[] = [
        {
            title: '审核操作说明', tips: '1)若您认为处方正确合理，请点击通过按钮所有的警示信\n息被自动忽略，处方通过审核;\n2)若您认为处方不合理，请勾选需要打回给医生处理的警示信息，或在下方输入审核意见后，点击“打回”按钮；\n3)被打回的处方将回到医生工作站，医生可以查看到您勾选的警示信息和审核意见，未被勾选的警示信息被自动忽略，不显示给医生。'
        }]

    /**
     * 鼠标提示
     * @param event 
     * @param tar => 对应元素
     */
    posInfo: any = {};
    showTips($event: any, tar: any){
        tar.show = true;
        let pos = $event.target.getBoundingClientRect()
        this.exportTarPos(pos);
    }
    exportTarPos(pos: any){
        this.posInfo.left = pos.left;
        this.posInfo.top = pos.top;
        this.posInfo.offsetWidth = pos.width;
    }
    ngOnInit() {
        this.route.params.subscribe(optReciptInput => {
            this.optReciptInput = optReciptInput;
            //TODO - 患者的处方列表需要与警示信息列表对应
            this.getOptRecipe(this.optReciptInput.recipeId);
            // this.auditing(this.optReciptInput.recipeId);
            this.recipeId = this.optReciptInput.recipeId;
            this.menuDOM.style.display = 'none';
        });
        // this.replyTemplate=this.auditResult;
        this.beatingInterval = setInterval(() => {
            this.auditBeatingStatus();
            this.auditing(this.idAssemble);
        }, 2000);

    }
    ngOnDestroy() {
        clearInterval(this.beatingInterval);
        if (this.menuDOM) {
            this.menuDOM.style.display = 'block';
        }
        // clearInterval(this.onAuditing);
    }
    auditBeatingStatus() {
        this.optRecipeDetailsService.auditBeatingStatus()
            .then(res => {

            });
    }
    auditing(idAssemble) {
        this.optRecipeDetailsService.getAuditing(idAssemble)
            .then(res => {

            });
    }

    @ViewChild('fastReplyTemplate') reply: any;
    @ViewChild('prescriptionInfoTable') prescriptionInfoTable: any;
    @ViewChild(PromptComponent) promptComponent: PromptComponent;

    ngAfterViewInit() { }



    //获取fast-reply-component 子元素传过来的值
    replySelect($event) {
        this.replyTemplate = $event;
        // this.auditResult = this.replyTemplate;
        // this.reply.innerText = this.replyTemplate;
        // this.textAuditResult = this.replyTemplate;
        this.textAuditResult = this.replyTemplate;
    }
    //查看详情
    goHisDetail(url: string) {
        let tempUrl: string;
        if (this.patientInfo.hisUrl) {
            tempUrl = encodeURI(this.patientInfo.hisUrl);
            window.open(tempUrl, '_blank');
        }
    }

    getOptRecipe(id: string): void {
        //if(id.trim()){
        this.optRecipeDetailsService.getOptRecipe(id).then(result => {
            if (result != null) {
                this.patientInfo = result.outpatient as OptRecipePatient;
                if (result.hasOwnProperty('optRecipe')) {
                    for (let item of result.optRecipe) {
                        let optRecipe = new OptRecipeMap();
                        optRecipe.recipeDetails = item.optRecipe as OptRecipeDetails;
                        optRecipe.recipeDrugList = item.dtoSfOptRecipeItems as OptRecipeDrugs[];
                        this.optRecipeList.push(optRecipe);
                        //警示信息列表 处方号
                        this.curRecipeNo = optRecipe.recipeDetails.recipeNo;
                        this.idAssemble.push(item.optRecipe.id)
                    }
                }
                this.checkedRecipe = this.optRecipeList[0];//默认选中的处方
                this.auditStatus = this.optRecipeList[0].recipeDetails.auditStatus;//默认选中的处方的的状态
                this.id = this.optRecipeList[0].recipeDetails.id;
                // this.recipeId = this.optRecipeList[0].recipeDetails.recipeId;//默认选中的处方的recipeId
                // this.getOptRecipeImageList(this.patientInfo.patientId);
                // this.getOptRecipeSpecialExamList(this.patientInfo.patientId);
                this.getOptAllergyList(this.checkedRecipe.recipeDetails.id); //过敏药物
                //this.getOptRecipeImageList(this.checkedRecipe.recipeDetails.id);
                //this.getOptRecipeSpecialExamList(this.checkedRecipe.recipeDetails.id);
                // this.getElectronicMedical(this.patientInfo.patientId); //查看电子病例
                // this.getOptRecipeExamList(this.patientInfo.patientId); //查看检验单
                // this.getOptOperationList(this.patientInfo.patientId);   //查看手术
                // this.getElectronicMedical(this.checkedRecipe.recipeDetails.id); //查看电子病例
                // this.getOptRecipeExamList(this.checkedRecipe.recipeDetails.id); //查看检验单
                // this.getOptOperationList(this.checkedRecipe.recipeDetails.id); //查看手术
                this.getAuditResultList(this.record,this.checkedRecipe.recipeDetails.id);//审核记录
                this.getWarningList(this.checkedRecipe.recipeDetails.id);//警示信息列表
            }
        });
    }

    //获取过敏药物列表
    getOptAllergyList(recipeId: string) {
        this.patientAllergyList = [];
        this.onAllergyDrug = [];
        this.optRecipeDetailsService.getOptAllergyList(recipeId).then(allergyList => {
            if (allergyList.length != 0) {
                if (allergyList && allergyList.length > 0) {
                    for (let allergy of allergyList) {
                        var allergyObj = {
                            'allergyDrug': allergy.allergyDrug,
                            'anaphylaxis': allergy.anaphylaxis
                        };
                        this.patientAllergyList.push(allergyObj);
                        this.onAllergyDrug.push(allergy.allergyDrug);
                    }
                }
            }
        });
    }
    //警示信息
    getWarningList(id: string): void {
        this.onWarningList = [];
        this.recordMap = [];
        this.optRecipeDetailsService.getWarningList(id).then(response => {
            // if(resultList && resultList.hasOwnProperty('recordList') && resultList.recordList.length > 0){
            //     this.recordMap = resultList.recordList as OptRecipeRecordMap[];
            if (response.data != null) {
                this.onWarningList = response.data;
                if (response.data && response.data.length > 0) {
                    this.recordMap = response.data as OptRecipeRecordMap[];
                    for (let record of this.recordMap) {
                        console.log(record)
                        // for(let message of record.messageList) {
                        // }
                        // this.onWarning = record;
                        this.getAuditResultList(record, id);
                        record.recordCheckedMap = [];
                    }
                } else {
                    // alert('暂无信息');
                }
            }
        });
    }
    //审核医师交互结果
    getAuditResultList(record: OptRecipeRecordMap, id: string): void {
        if (record && id) {
            this.optRecipeDetailsService.getAuditResultList(id).then(auditResultList => {
                if (auditResultList != null) {
                    if (auditResultList && auditResultList.length > 0) {
                        this.auditResultList = auditResultList;
                    } else {
                        this.auditResultList = [];
                    }
                }
            });
        }
    }
    //选择警示信息
    recordChecked(isChecked: boolean, message: OptRecipeRecordMessage, record: OptRecipeRecordMap): void {
        let me = this;
        if (isChecked) {
            record.recordCheckedMap.push(message);
        } else {
            record.recordCheckedMap = record.recordCheckedMap.filter(item => item.msgId != message.msgId);
        }

        //计算选择警示信息的条数
        let onRecordCheckedMap = this.recordMap;
        me.checkedNumber = 0;
        onRecordCheckedMap.forEach(function (i, e) {
            me.checkedNumber += i.recordCheckedMap.length;
        });
    }
    // recordBoxBlur(box: any): void {
    //     if(!box.value){
    //         this.recordBoxDefaultText = '审核意见...';
    //     }
    // }
    //警示信息操作 通过 打回
    //0 打回 1通过 2超时通过 3自动通过
    alertsOperation(recordMap, onStatus: number, textAuditResult) {
        // 未勾选警示信息 ， 审核意见为空 判断
        if (onStatus == 0 && (textAuditResult == '' || textAuditResult == '审核意见...' || textAuditResult == undefined) && this.checkedNumber <= 0) {
            this.promptComponent.alert('请选择警示信息或添加审核意见。')
            return;
        }
        // let recipeId = record.recipeId;
        //警示信息操作状态
        let me = this;
        let recordArr = [];
        let optRecipeId = this.recipeId;
        // let auditResult = record.auditResult;
        let auditResult = textAuditResult;
        let params = { optRecipeId: optRecipeId, auditResult: auditResult, operationRecordList: recordArr };
        for (let record of recordMap) {
            for (let recordDoc of record.recordCheckedMap) {
                let status, msgId;
                if (recordDoc.operateStatus) {
                    status = '1';
                } else {
                    status = '2';
                };
                msgId = recordDoc.msgId;
                recordArr.push({ operateStatus: status, msgId: msgId });
            }
        }
        if (onStatus == 0) {
            this.optRecipeDetailsService.refuseRecipe(params).then(res => {
                let recipeId = this.checkedRecipe.recipeDetails.recipeId;
                if (res.code == 200) {
                    //success
                    me.isAllRecipeChecked = true;
                    //切换成功后判断切换到下一张处方
                    for (let i = 0; i < me.optRecipeList.length; i++) {
                        let recipe = me.optRecipeList[i];
                        // }
                        // for (let recipe of me.optRecipeList) {
                        if (recipe.recipeDetails.recipeId == recipeId) {
                            recipe.recipeDetails.auditStatus = 0; //打回
                        }
                        if (recipe.recipeDetails.auditStatus == -1) {
                            me.isAllRecipeChecked = false;
                            // let index = me.optRecipeList.indexOf(recipe);
                            me.optRecipeChecked(recipe, i);
                            break;
                        }
                    }
                    if (me.isAllRecipeChecked) {
                        setTimeout(function () {
                            me.getNextRecipe();
                        }, 1500);
                    }
                } else if (res.code == '10010') {
                    this.promptComponent.alert({
                        title: '提示',
                        tip: '审核失败',
                        otherTip: res.message,
                        successCallback() {
                            me.getNextRecipe();
                        },
                    });
                } else {
                    alert(res.message)
                }
                this.getAuditResultList(this.record, this.checkedRecipe.recipeDetails.id);
                this.getWarningList(this.checkedRecipe.recipeDetails.id)
            });
        } else if (onStatus == 1) {
            this.optRecipeDetailsService.agreeRecipe(params).then(res => {
                // this.auditResult = res.data;
                let recipeId = this.checkedRecipe.recipeDetails.recipeId;
                if (res.code == 200) {
                    //success
                    me.isAllRecipeChecked = true;
                    //切换成功后判断切换到下一张处方
                    for (let i = 0; i < me.optRecipeList.length; i++) {
                        let recipe = me.optRecipeList[i];
                        // }
                        // for (let recipe of me.optRecipeList) {
                        if (recipe.recipeDetails.recipeId == recipeId) {
                            recipe.recipeDetails.auditStatus = 1;//通过
                        }
                        if (recipe.recipeDetails.auditStatus == -1) {
                            me.isAllRecipeChecked = false;
                            // let index = me.optRecipeList.indexOf(recipe);
                            me.optRecipeChecked(recipe, i);
                            break;
                        }
                    }
                    if (me.isAllRecipeChecked) {
                        setTimeout(function () {
                            me.getNextRecipe();
                        }, 1500);
                    }
                } else if (res.code == '10010') {
                    this.promptComponent.alert({
                        title: '提示',
                        tip: '审核失败',
                        otherTip: res.message,
                        successCallback() {
                            me.getNextRecipe();
                        },
                    });
                } else {
                    alert(res.message)
                }
                this.getAuditResultList(this.record, this.checkedRecipe.recipeDetails.id);
                this.getWarningList(this.checkedRecipe.recipeDetails.id)
            });
        }
    }
    //检查单 - 检验及检验明细
    // getOptRecipeExamList(recipeId: string): void {
    //     this.optRecipeDetailsService.getOptRecipeExamList(recipeId).then(resultList => {
    //         if (resultList && resultList.length > 0) {
    //             for (let record of resultList.recordList) {
    //                 let exam = new OptRecipeExam();
    //                 exam = record.masterObj as OptRecipeExam;
    //                 exam.indicatorList = record.followerObj as OptRecipeExamIndicator[];
    //                 this.examList.push(exam);
    //             }
    //         }
    //     });
    // }
    //检查单 - 影像
    // getOptRecipeImageList(recipeId: string): void {
    //     this.optRecipeDetailsService.getOptRecipeImageList(recipeId).then(resultList => {
    //         if(resultList && resultList.length > 0){
    //             this.image = resultList.recordList[0] as OptRecipeImage;
    //         }
    //     });
    // }
    //检查单 - 特殊检查项
    // getOptRecipeSpecialExamList(recipeId: string): void {
    //     this.optRecipeDetailsService.getOptRecipeSpecialExamList(recipeId).then(resultList => {
    //         if(resultList && resultList.length > 0){
    //             this.specialExam = resultList.recordList[0] as OptRecipeSpecialExam;
    //         }
    //     });
    // }
    //手术
    // getOptOperationList(recipeId: string): void {
    //     this.optRecipeDetailsService.getOptOperationList(recipeId).then(resultList => {
    //         if (resultList && resultList.length > 0) {
    //             this.operationList = resultList.recordList as OptRecipeOperation[];
    //         }
    //     });
    // }
    //电子病历
    // getElectronicMedical(recipeId: string): void {
    //     this.optRecipeDetailsService.getElectronicMedical(recipeId).then(resultList => {
    //         if (resultList && resultList.length > 0) {
    //             this.electronicMedical = resultList as OptRecipeMedical;
    //         }
    //     });
    // }
    //选中处方
    optRecipeChecked(recipe: OptRecipeMap, index: number): void {
        this.textAuditResult = "";
        if (recipe) {
            this.id = recipe.recipeDetails.id;
            this.curRecipeNo = recipe.recipeDetails.recipeNo;
            this.checkedRecipe = recipe;
            this.recipeId = recipe.recipeDetails.id;
            this.auditStatus = recipe.recipeDetails.auditStatus;
            // this.recordMap = recipe;
        }
        this.getWarningList(this.id); //传警示信息list
        this.getAuditResultList(this.record, this.id);//审核记录
        // this.getAroundAuditResult(this.id);
        this.checkedRecipe = recipe;
        this.changeHash('recipe-warning');
    }
    changeHash(value: string): void {
        window.location.hash = value;
    }
    //下一张处方
    getNextRecipe(): void {
        let me = this;
        let type = 1;
        let params = { id: this.optReciptInput.recipeId, type: type }
        this.textAuditResult = "";
        this.optRecipeDetailsService.getNextRecipe(params).then(result => {
            this.isAllRecipeChecked = false;
            if (result) {
                me.optRecipeList = [];
                me.patientAllergyList = [];
                me.onAllergyDrug = [];
                me.router.navigate(['/page/opt-recipe-details/' + result]);
                me.getOptAllergyList(result);
                me.menuDOM.style.display = 'none';
            } else {
                me.backToList();
            }
        });
    }
    //返回任务清单
    backToList(): void {
        if (this.menuDOM) {
            this.menuDOM.style.display = 'block';
        }
        this.router.navigate(['/page/opt-order-audit']);
    }
    // returnTaskList(){
    //     // this.router.navigate(['/opt-order-audit'],{relativeTo:this.route});
    //     // $state.go('/opt-order-audit');
    //     //  window.history.back(); 
    //      window.history.go(-1);
    // }

    //查看检验单-------------
    sheetOptions: any = {
        APIType: 'string',
        APIs: {
            examList: '/api/v1/opt/optRecipeExamList',
            imageList: '/api/v1/opt/optRecipeImageList',
            specialExamList: '/api/v1/opt/optRecipeSpecialExamList',
        }
    }
    @ViewChild('sheets') laboratorySheets: any;
    showExam() {
        this.laboratorySheets.show();
    }
    //查看手术-------------
    operationOptions: any = {
        APIType: 'string',
        APIs: {
            operation: '/api/v1/opt/optOperationList'
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
            electronicMedical: '/api/v1/opt/optElectronicMedical'
        }
    }
    @ViewChild('elecMedRecord') elecRecord: any;
    showElecRecord() {
        this.elecRecord.show();
    }

    //关联点
    getDrugRelated(recipeDrug) {
        this.relatedInfoShow = true;
        this.relatedInfo = null;
        this.noInfo = false;
        let getDrugParams = [];
        getDrugParams.push(recipeDrug.optRecipeId, recipeDrug.zoneId, recipeDrug.drugId);
        this.optRecipeDetailsService.getDrugRelated(getDrugParams).then(response => {
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
}