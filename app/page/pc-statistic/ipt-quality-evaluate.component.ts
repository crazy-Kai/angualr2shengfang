import { Component, OnInit, Directive, HostListener, ViewChild }      from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { IptDetailsService } from '../ipt-opt-review/ipt-details.service';
import { AnalysisService } from './analysis.service';
import { ProjectService } from './project.service';

import { PatientInfo } from '../ipt-opt-auditing/ipt-order-details/patient-info';
import { PatientAllergy } from '../ipt-opt-auditing/ipt-order-details/patient-allergy';
import { PatientDiagnose } from '../ipt-opt-auditing/ipt-order-details/patient-diagnose';
import { PatientProgress } from '../ipt-opt-auditing/ipt-order-details/patient-progress';
import { PatientIptRecord } from '../ipt-opt-auditing/ipt-order-details/patient-ipt-record';
import { PatientExam } from '../ipt-opt-auditing/ipt-order-details/patient-exam';
import { PatientSpecialExam } from '../ipt-opt-auditing/ipt-order-details/patient-special-exam';
import { PatientImage } from '../ipt-opt-auditing/ipt-order-details/patient-image';
import { PatientOperation } from '../ipt-opt-auditing/ipt-order-details/patient-operation';
import { PatientVitalSign } from '../ipt-opt-auditing/ipt-order-details/patient-vital-sign';
import { PatientNonOrder } from '../ipt-opt-auditing/ipt-order-details/patient-non-order';
import { PatientEngineMap } from '../ipt-opt-auditing/ipt-order-details/patient-engine-map';
import { PatientEngineMessage } from '../ipt-opt-auditing/ipt-order-details/patient-engine-message';
import { AuditResult } from '../ipt-opt-auditing/ipt-order-details/audit-result';
import { IptOrder } from '../ipt-opt-auditing/ipt-order-details/ipt-order';

@Component({
    selector: 'ipt-quality-evaluate',
    templateUrl: 'ipt-quality-evaluate.component.html',
    styleUrls: [ '../ipt-opt-review/ipt-recipe-review-details.component.css', '../common/reset.css', 'ipt-quality-evaluate.component.css' ],
    providers: [ IptDetailsService, AnalysisService ]
})

export class IptQualityEvaluateComponent implements OnInit {
    private enginId: any;
    private iptOrderInput: any;
    //生命体征浮层相关参数 - svg的高度需固定
    private vitalSignStartDate: number;
    private vitalSignWidth: number = 0;
    private vitalSignHeight: number = 0;
    private vitalSignDate: any[] = [];
    private vitalSignOptionList: any[] = [{series:{name:"体温",data:[],},color:"#2BB5F5",unit:"°C",normal:"36.7°C",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"收缩压",data:[],},color:"#FF6C8A",unit:"",normal:"140",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"舒张压",data:[],},color:"#F9A735",unit:"",normal:"90",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"脉率",data:[],},color:"#93B6FF",unit:"次/min",normal:"100",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"心率",data:[],},color:"#FF4800",unit:"次/min",normal:"20",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"呼吸频率",data:[],},color:"#53BF0F",unit:"次/min",normal:"70",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}}];
    
    private dialog: any = {
        show: false
    };

    //住院信息汇总相关参数 - svg的高度需固定
    private summaryList: any = {
        monthList: [],
        dateList: [],
        vitalSignList: {
            vitalSignWidth: 0,
            vitalSignHeight: 0,
            vitalSignOptionList: [{series:{name:"体温",data:[],},color:"#2BB5F5",unit:"°C",normal:"36.7°C",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"收缩压",data:[],},color:"#FF6C8A",unit:"",normal:"140",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"舒张压",data:[],},color:"#F9A735",unit:"",normal:"90",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"脉率",data:[],},color:"#93B6FF",unit:"次/min",normal:"100",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"心率",data:[],},color:"#FF4800",unit:"次/min",normal:"20",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"呼吸频率",data:[],},color:"#53BF0F",unit:"次/min",normal:"70",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}}]
        },
        orderList: {
            orderWidth: 0,
            orderHeight: 0,
            orderOptionList: []
        },
        diagnoseList: [],
        examList: [],
        inspectList: [],
        drugList: [],
        nonOrderList: [],
        operationList: [],
        progressList: []
    };
    private summaryTableWidth = 0;
    private summaryTableHeight = 0;
    private summaryTDWidth = 0;
    
    //滑动 bar 相关参数
    positionArr: any[] = [];
    positionStr: string = '';
    barWidth: number;
    handleWidth: number;
    handlePos: string = '0px';
    totalDays = 0;
    disX = 0;
    offsetLeft = 0;
    nowDate = new Date();
    startDate = new Date();

    private patientInfo: PatientInfo = new PatientInfo();
    private allergyList: PatientAllergy[] = [];
    private diagnoseList: PatientDiagnose[] = [];
    private diagnoseStr = '';
    private progressList: PatientProgress[] = [];
    private recordList: PatientIptRecord[] = [];
    private examList: PatientExam[] = [];
    private image: PatientImage[] = [];
    private specialExam: PatientSpecialExam[] = [];
    private operationList: PatientOperation[] = [];
    private vitalSignList: PatientVitalSign[] = [];
    private nonOrderList: PatientNonOrder[] = [];
    private engineMsgList: any[] = [];
    private auditResultList: AuditResult[] = [];
    private iptOrderList: any[] = [];
    
    private isPopupShow: boolean = false;
    private isAllergyShow: boolean = false;
    private isDiagnoseShow: boolean = false;
    private isProgressShow: boolean = false;
    private isRecordShow: boolean = false;
    private isExamShow: boolean = false;
    private isOperationShow: boolean = false;
    private isVitalSignShow: boolean = false;
    private isNonOrderShow: boolean = false;
    private isImageShow:boolean = false;
    private isSpecialExamShow:boolean = false;
    private isHerbOrderShow: boolean = false;
    
    private isOrderShow: boolean = true;
    private isSummaryShow: boolean = false;
    //
    private interValTime: any;

    //警示信息checkbox
    private isAllRecipeChecked: boolean = false;
    private checkedRecipe: any = {
        'checkedResult': {}
    };
    //上一次记录 下一次记录
    //private aroundIdx: any = {};
    //默认日期  没有住院日期返回的时候设定为最近7天
    private defaultDate: any;
    private window = window;
    constructor(
        private iptDetailsService: IptDetailsService,
        private analysisService: AnalysisService,
        private activatedRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private projectService: ProjectService
    ) {}
    
    ngOnInit(){
        //生命体征弹窗显示最近7天的
        this.defaultDate = new Date();
        this.defaultDate = new Date(this.defaultDate.getFullYear(), this.defaultDate.getMonth(), this.defaultDate.getDate());
        this.defaultDate.setDate(this.defaultDate.getDate() - 6);

        this.activatedRoute.params.subscribe(iptOrderInput => {
            this.iptOrderInput = iptOrderInput; //7052 test data
            this.enginId = this.iptOrderInput.recipeId;
            this.handle = this.iptOrderInput['handle'];
            this.checkPeopleId = this.iptOrderInput['checkPeopleId'];
            this.getVitalStartDate(this.enginId);
            this.initPage(this.enginId);
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

    initPage(recipeId: any){
        this.enginId = recipeId;
        this.getPatientInfo(recipeId);
        //this.getAroundAuditResult(recipeId);
        this.getAllergyList(recipeId);
        this.getDiagnoseList(recipeId, '', 0);
        //this.getOrderList(recipeId, '', 0);
        this.getIptOrderData(recipeId);
        this.getProgressList(recipeId, '', 0);
        this.getRecordList(recipeId);
        this.getExamList(recipeId, '', 0);
        this.getImageList(recipeId, '', 0);
        this.getSpecialExamList(recipeId, '', 0);
        this.getOpeartionList(recipeId, '', 0);
        
        //this.getVitalSignList(recipeId, this.defaultDate.getTime().toString(), 7, true);
        this.getNonOrderList(recipeId, '', 0);
    }

    getPatientInfo(recipeId: string): void {
        this.iptDetailsService.getIptOrder(recipeId)
            .then(res => {
                this.patientInfo = res ? res : {};
                this.totalDays = Math.ceil(((new Date().getTime()) - (this.patientInfo.hospitalizedTime || this.defaultDate.getTime()) ) / 1000 / 60 / 60 / 24);   //获取住院天数
                this.getSummaryMonthList();
                this.getSummaryDateList(new Date());
            })
    }
    //获取上一个和下一个审核
    // getAroundAuditResult(id: string){
    //     this.iptDetailsService.getAroundAuditResult(id)
    //         .then(res => {
    //             if(res.code == '200' && res.data){
    //                 this.aroundIdx = res.data;
    //             }
    //         })
    // }
    //查看详情
    goHisDetail(url: string){
        let tempUrl: string;
        if(this.patientInfo.hisUrl){
            tempUrl = encodeURI(this.patientInfo.hisUrl);
            window.open(tempUrl, '_blank');
        } 
    }
    getSummaryMonthList():void {
        let startTime = this.patientInfo.hospitalizedTime || this.defaultDate.getTime();             //住院开始时间
        let startYear = new Date(startTime).getFullYear(),                      //住院开始时的年份
            endYear = new Date().getFullYear(),                                 //当前年份
            startMonth = new Date(startTime).getMonth() + 1,                    //住院开始时月份
            endMonth = (endYear - startYear)*12 + (new Date().getMonth()) + 1;  //住院结束时月份，不是同一年则+12个月
            /**
             * 获取所有涉及的月份的第一天在进度条中的位置百分比
             */
            do{
                do{
                    let days = Math.ceil(((new Date(startYear, (startMonth - 1)).getTime()) - (this.patientInfo.hospitalizedTime || this.defaultDate.getTime()) ) / 1000 / 60 / 60 / 24);
                    this.summaryList.monthList.push({
                        'month': startMonth,
                        'width': (days / this.totalDays) * 100
                    });
                    if(startMonth == 12){
                        startMonth = 1;
                        endMonth -= 12;
                        break;
                    }
                }while(endMonth > startMonth++)
            }while(endYear > startYear++)
            this.summaryList.monthList = this.summaryList.monthList.slice(1);   //删除第一个月份的位置信息
    }
    getSummaryDateList(nowDate: Date):void {
        this.summaryList.dateList = [];
        let startDate = new Date((this.patientInfo.hospitalizedTime || this.defaultDate.getTime())),            //住院日期
            endDate = new Date();                                               //当前日期
        /**
         * 根据传入时间值计算当前时间段的开始时间
         */
        endDate.setDate(endDate.getDate() - 6);
        nowDate.setDate(nowDate.getDate() - 6);
        if(nowDate.getTime() < startDate.getTime()){
            nowDate = startDate;
        } else if(nowDate.getTime() > endDate.getTime()){
            nowDate = endDate;
        }
        this.nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
        let dateTemp = null;
        /**
         * 获取当前显示的7天日期值
         */
        for (let i = 0; i < 7; i++) {
            dateTemp = (nowDate.getMonth() + 1) + "/" + nowDate.getDate();
            this.summaryList.dateList.push({
                date: dateTemp,
                year: nowDate.getFullYear()
            });
            nowDate.setDate(nowDate.getDate() + 1);                         //+一天，用于循环的过程中获得正确的月份。
        }
    }
    //获取过敏药物列表
    getAllergyList(orderId: string): void {
        this.iptDetailsService.getAllergyList(orderId).then( result => {
            this.allergyList = result ? result as PatientAllergy[] : [];
        });
    }
    //获取诊断记录
    getDiagnoseList(orderId: number, startDate: string, period: number): void {
        this.iptDetailsService.getDiagnoseList(orderId, startDate, period).then( result => {
            if(startDate != '' && period != 0){
                let diagnoseList = result ? result as PatientDiagnose[] : [];
                this.summaryList.diagnoseList = [];
                for(let dateObj of this.summaryList.dateList){
                    let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                    let tempDiagnose = new PatientDiagnose();
                    for(let diagnose of this.diagnoseList){
                        let diagnoseDate = new Date(diagnose.diagDate);
                        if(diagnoseDate.getFullYear() == dateTemp.getFullYear() && diagnoseDate.getMonth() == dateTemp.getMonth() && diagnoseDate.getDate() == dateTemp.getDate()){
                            tempDiagnose = diagnose;
                            break;
                        }
                    }
                    this.summaryList.diagnoseList.push(tempDiagnose);
                }
            } else {
                this.diagnoseList = result ? result as PatientDiagnose[] : [];
                let diagnoseArr = [];
                for(let diagnose of this.diagnoseList){
                    diagnoseArr.push(diagnose.diagName);
                }
                this.diagnoseStr = diagnoseArr.join('、');
            }
        });
    }
    //获取病程记录列表
    getProgressList(orderId: number, startDate: string, period: number):void {
        this.iptDetailsService.getProgress(orderId, startDate, period).then(result => {
            if(startDate != '' && period != 0){
                let progressList = result ?  result as PatientProgress[] : [];
                this.summaryList.progressList = [];
                for(let dateObj of this.summaryList.dateList){
                    let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                    let tempProgress = new PatientProgress();
                    for(let progress of progressList){
                        let progressDate = new Date(progress.recordTime);
                        if(progressDate.getFullYear() == dateTemp.getFullYear() && progressDate.getMonth() == dateTemp.getMonth() && progressDate.getDate() == dateTemp.getDate()){
                            tempProgress = progress;
                            break;
                        }
                    }
                    this.summaryList.progressList.push(tempProgress);
                }
            } else {
                this.progressList = result ? result as PatientProgress[] : [];
            }
        });
    }
    //获取入院记录列表
    getRecordList(patientId: string):void {
        this.iptDetailsService.getIptRecordList(patientId).then(result => {
            this.recordList = result ? result as PatientIptRecord[] : [];
        });
    }
    //获取药嘱列表
    getOrderList(orderId: number, startDate: string, period: number){
        if(!(startDate != '' && period != 0)){
            this.iptOrderList = [];
        }else{
            this.summaryList.orderList.orderOptionList = [];
        }
        
        this.getIptOrderList(orderId, startDate, period);
        this.getHerbIptOrderList(orderId, startDate, period);
    }
    getIptOrderList(orderId: number, startDate: string, period: number):void {
        this.iptDetailsService.getOrderList(orderId, startDate, period).then(resultList => {
            this.summaryList.orderList.orderOptionList[0] = [];
            if(startDate != '' && period != 0){
                //this.summaryList.orderList.orderOptionList = [];
                let validDate = new Date(this.summaryList.dateList[0].year + '/' + this.summaryList.dateList[0].date);
                let invalidDate = new Date(this.summaryList.dateList[6].year + '/' + this.summaryList.dateList[6].date);
                for(let groupNum in resultList){
                    for(let order of resultList[groupNum]){
                        if(!(order.orderValidTime > (invalidDate.getTime() + 86400000) || (order.orderInvalidTime ? (order.orderInvalidTime < validDate.getTime()) : false))){
                            this.changeOrder(order, validDate, invalidDate, 0);
                        }
                    }
                }
                for(let orderOption of this.summaryList.orderList.orderOptionList[0]){
                    this.getPositionArr(orderOption, this.summaryList.orderList.orderWidth - (orderOption.leftPos + orderOption.rightPos) * document.getElementById("summaryBoxTH").offsetWidth, this.summaryList.orderList.orderHeight);
                }
            }
        });
    }
    getHerbIptOrderList(orderId: number, startDate: string, period: number): void{
        this.iptDetailsService.getHerbOrderList(orderId, startDate, period).then(resultList => {
            this.summaryList.orderList.orderOptionList[1] = [];
            if(startDate != '' && period != 0){
                //this.summaryList.orderList.orderOptionList = [];
                let validDate = new Date(this.summaryList.dateList[0].year + '/' + this.summaryList.dateList[0].date);
                let invalidDate = new Date(this.summaryList.dateList[6].year + '/' + this.summaryList.dateList[6].date);
                
                for(let groupNum in resultList){
                    let resultListArr = [];
                    resultListArr.push(resultList[groupNum])
                    for(let order of resultListArr){
                        if(!(order.orderValidTime > (invalidDate.getTime() + 86400000) || (order.orderInvalidTime ? (order.orderInvalidTime < validDate.getTime()) : false))){
                            order.drugName = '草药嘱' + (parseInt(groupNum) + 1);
                            this.changeOrder(order, validDate, invalidDate, 1);
                        }
                    }
                }
                for(let orderOption of this.summaryList.orderList.orderOptionList[1]){
                    this.getPositionArr(orderOption, this.summaryList.orderList.orderWidth - (orderOption.leftPos + orderOption.rightPos) * this.summaryTDWidth, this.summaryList.orderList.orderHeight);
                }
            }
        })
    }
    
    changeCheckedOrder(order: any): void {
        this.checkedRecipe = order;
    }
    changeOrder(order: IptOrder, validDate: Date, invalidDate: Date, arrayNo: number): void{
        let minDate, maxDate, leftPos = 0, rightPos = 0;
        if(order.orderValidTime < validDate.getTime()){
            minDate = validDate;
        } else {
            let orderDate = new Date(order.orderValidTime);
            minDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
            leftPos = Math.ceil((minDate.getTime() - validDate.getTime()) / 1000 / 60 / 60 / 24);
        }
        if(order.orderInvalidTime === null || order.orderInvalidTime > invalidDate.getTime()){
            maxDate = invalidDate;
        } else {
            let orderDate = new Date(order.orderInvalidTime);
            maxDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
            rightPos = Math.ceil((invalidDate.getTime() - maxDate.getTime()) / 1000 / 60 / 60 / 24);
        }
        this.summaryList.orderList.orderOptionList[arrayNo].push({
            series: {
                orderId: order.id,
                name: order.drugName || order.orderName,
                data: [[minDate, 1], [maxDate, 1]],
            },
            maxDataY: 0,
            minDataY: 0,
            maxDataX: maxDate,
            minDataX: minDate,
            leftPos: leftPos > 0 ? leftPos : 0,
            rightPos: rightPos > 0 ? rightPos : 0,
            top: 0,
            positionArr: [],
            positionStr: '',
            dialog: {
                show: false,
                x: 0,
                y: 0,
                msg: '',
                startTime: order.orderValidTime,
                endTime: order.orderInvalidTime ? order.orderInvalidTime : '长期',
                dept: order.orderDeptName,
                doc: order.orderDocName
            }
        });
    }
    
    //获取检验单
    getExamList(orderId: number, startDate: string, period: number):void {
        this.iptDetailsService.getIptExamList(orderId, startDate, period).then(result => {
            if(startDate != '' && period != 0){
                let examList = result as PatientExam[];
                let flag = 0;
                for(let dateObj of this.summaryList.dateList){
                    this.summaryList.examList[flag][0] = [];
                    let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                    let tempExam = new PatientExam();
                    for(let exam of examList){
                        let examDate = new Date(exam.reportTime);
                        if(examDate.getFullYear() == dateTemp.getFullYear() && examDate.getMonth() == dateTemp.getMonth() && examDate.getDate() == dateTemp.getDate()){
                            tempExam = exam;
                            this.summaryList.examList[flag][0].push(tempExam);
                        }
                    }
                    flag++;
                }
            } else {
                this.examList = result as PatientExam[] || [];
            }
        });
    }
    //获取影像
    getImageList(orderId: number, startDate: string, period: number): void {
        this.iptDetailsService.getImageList(orderId, startDate, period).then(resultList => {
            if(resultList && resultList.length > 0){
                if(startDate != '' && period != 0){
                    let imageList = resultList as PatientImage[];
                    let flag = 0;
                    for(let dateObj of this.summaryList.dateList){
                        this.summaryList.examList[flag][1] = [];
                        let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                        for(let image of imageList){
                            let imageDate = new Date(image.reportTime);
                            if(imageDate.getFullYear() == dateTemp.getFullYear() && imageDate.getMonth() == dateTemp.getMonth() && imageDate.getDate() == dateTemp.getDate()){
                                this.summaryList.examList[flag][1].push(image);
                            }
                        }
                        flag++;
                    }
                } else {
                    this.image = resultList as PatientImage[] || [];
                }
            }
        });
    }
    //获取特殊检验
    getSpecialExamList(orderId: number, startDate: string, period: number): void {
        this.iptDetailsService.getSpecialExamList(orderId, startDate, period).then(resultList => {
            if(resultList && resultList.length > 0){
                if(startDate != '' && period != 0){
                    let specialExamList = resultList as PatientSpecialExam[];
                    let flag = 0;
                    for(let dateObj of this.summaryList.dateList){
                    this.summaryList.examList[flag][2] = [];
                        let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                        for(let specialExam of specialExamList){
                            let specialExamDate = new Date(specialExam.reportTime);
                            if(specialExamDate.getFullYear() == dateTemp.getFullYear() && specialExamDate.getMonth() == dateTemp.getMonth() && specialExamDate.getDate() == dateTemp.getDate()){
                                this.summaryList.examList[flag][2].push(specialExam);
                            }
                        }
                        flag++;
                    }
                } else {
                    this.specialExam = resultList as PatientSpecialExam[] || [];
                }
            }
        });
    }
    //获取手术列表
    getOpeartionList(orderId: number, startDate: string, period: number):void {
        this.iptDetailsService.getIptOperationList(orderId, startDate, period).then(result => {
            if(startDate != '' && period != 0){
                let operationList = result as PatientOperation[];
                this.summaryList.operationList = [];
                for(let dateObj of this.summaryList.dateList){
                    let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                    let tempOperation = new PatientOperation();
                    for(let operation of operationList){
                        let operationDate = new Date(operation.operationStartTime);
                        if(operationDate.getFullYear() == dateTemp.getFullYear() && operationDate.getMonth() == dateTemp.getMonth() && operationDate.getDate() == dateTemp.getDate()){
                            tempOperation = operation;
                            break;
                        }
                    }
                    this.summaryList.operationList.push(tempOperation);
                }
            } else {
                this.operationList = result as PatientOperation[];
            }
        });
    }
    //将病程记录数据填充到住院信息汇总中的
    getSummaryProgressList(): void {
        this.summaryList.progressList = [];
        for(let dateObj of this.summaryList.dateList){
            let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
            let tempProgress = new PatientProgress();
            for(let progress of this.progressList){
                let progressDate = new Date(progress.recordTime);
                if(progressDate.getFullYear() == dateTemp.getFullYear() && progressDate.getMonth() == dateTemp.getMonth() && progressDate.getDate() == dateTemp.getDate()){
                    tempProgress = progress;
                    break;
                }
            }
            this.summaryList.progressList.push(tempProgress);
        }
    }
    
    getSummaryExamList(): void {
        this.summaryList.examList = [];
        for(let dateObj of this.summaryList.dateList){
            let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
            let tempExam = new PatientExam();
            for(let exam of this.examList){
                let examDate = new Date(exam.reportTime);
                if(examDate.getFullYear() == dateTemp.getFullYear() && examDate.getMonth() == dateTemp.getMonth() && examDate.getDate() == dateTemp.getDate()){
                    tempExam = exam;
                    break;
                }
            }
            this.summaryList.examList.push(tempExam);
        }
    }
    getVitalSignList(orderId: number, startDate: string, period: number, isPopup: boolean):void {
        this.iptDetailsService.getVitalSignList(orderId, startDate, period).then(result => {
            if(result && result.length){
                result.sort(function(item1, item2){
                    return item1.testTime - item2.testTime;
                });
            }
            if(!isPopup){
                let vitalSignList = result as PatientVitalSign[];
                this.summaryList.vitalSignList.vitalSignOptionList = [{series:{name:"体温",data:[],},color:"#2BB5F5",unit:"°C",normal:"36.7°C",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"收缩压",data:[],},color:"#FF6C8A",unit:"",normal:"140",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"舒张压",data:[],},color:"#F9A735",unit:"",normal:"90",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"脉率",data:[],},color:"#93B6FF",unit:"次/min",normal:"100",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"心率",data:[],},color:"#FF4800",unit:"次/min",normal:"20",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"呼吸频率",data:[],},color:"#53BF0F",unit:"次/min",normal:"70",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}}];
                for(let dateObj of this.summaryList.dateList){
                    let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                    for(let vitalSign of vitalSignList){
                        let vitalSignDate = new Date(vitalSign.testTime);
                        if(vitalSignDate.getFullYear() == dateTemp.getFullYear() && vitalSignDate.getMonth() == dateTemp.getMonth() && vitalSignDate.getDate() == dateTemp.getDate()){
                            this.changeVitalSign(vitalSign, this.summaryList.vitalSignList.vitalSignOptionList);
                        }
                    }
                }
                let dateNum = this.summaryList.dateList.length;
                this.getSvgPos(this.nowDate.getTime(), new Date(this.summaryList.dateList[dateNum - 1].year + '/' + this.summaryList.dateList[dateNum - 1].date).getTime() ,this.summaryList.vitalSignList.vitalSignOptionList);
                for(let vitalSignOption of this.summaryList.vitalSignList.vitalSignOptionList){
                    this.getPositionArr(vitalSignOption, this.summaryList.vitalSignList.vitalSignWidth - (vitalSignOption.leftPos + vitalSignOption.rightPos) * document.getElementById("summaryBoxTH").offsetWidth, this.summaryList.vitalSignList.vitalSignHeight);
                }
            } else {
                let dateTemp = new Date(parseInt(startDate));
                this.vitalSignDate = [];    //将生命体征弹窗的时间数组清空
                this.vitalSignOptionList = [{series:{name:"体温",data:[],},color:"#2BB5F5",unit:"°C",normal:"36.7°C",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"收缩压",data:[],},color:"#FF6C8A",unit:"",normal:"140",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"舒张压",data:[],},color:"#F9A735",unit:"",normal:"90",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"脉率",data:[],},color:"#93B6FF",unit:"次/min",normal:"100",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"心率",data:[],},color:"#FF4800",unit:"次/min",normal:"20",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"呼吸频率",data:[],},color:"#53BF0F",unit:"次/min",normal:"70",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}}];
                for (let i = 0; i < 7; i++) {
                    this.vitalSignDate.push(dateTemp.getTime());
                    dateTemp.setDate(dateTemp.getDate() + 1);
                }
                this.vitalSignList = result as PatientVitalSign[];
                // let testDate = null, testTime = 0;
                if(this.vitalSignList.length > 0){
                    for(let vitalSign of this.vitalSignList){
                        // testDate = new Date(vitalSign.testTime);
                        // testTime = new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate()).getTime();
                        // if(!~this.vitalSignDate.indexOf(testTime)){
                        //     this.vitalSignDate.push(testTime);
                        // }
                        this.changeVitalSign(vitalSign, this.vitalSignOptionList);
                    }
                    // this.vitalSignDate = this.vitalSignDate.sort();
                    let dateNum = this.vitalSignDate.length;
                    this.getSvgPos(this.vitalSignDate[0], this.vitalSignDate[dateNum - 1], this.vitalSignOptionList);
                }
            }
        });
    }
    
    //将生命体征对象转为 svg 所需数据格式
    changeVitalSign(vitalSign: PatientVitalSign, list: any[]):void {
        let vitalTime = new Date(vitalSign.testTime);
        if(vitalSign.hasOwnProperty('temperature') && vitalSign.temperature){
            this.pushVitalSign(vitalTime, vitalSign.temperature, list[0]);
        }
        if(vitalSign.hasOwnProperty('sbp') && vitalSign.sbp){
            this.pushVitalSign(vitalTime, vitalSign.sbp, list[1]);
        }
        if(vitalSign.hasOwnProperty('dbp') && vitalSign.dbp){
            this.pushVitalSign(vitalTime, vitalSign.dbp, list[2]);
        }
        if(vitalSign.hasOwnProperty('pulseRate') && vitalSign.pulseRate){
            this.pushVitalSign(vitalTime, parseFloat(vitalSign.pulseRate.replace('次/min','')), list[3]);
        }
        if(vitalSign.hasOwnProperty('heartRate') && vitalSign.heartRate){
            this.pushVitalSign(vitalTime, parseFloat(vitalSign.heartRate.replace('次/min','')), list[4]);
        }
        if(vitalSign.hasOwnProperty('breathingRate') && vitalSign.breathingRate){
            this.pushVitalSign(vitalTime, parseFloat(vitalSign.breathingRate.replace('次/min','')), list[5]);
        }
        // if(vitalSign.painScore){
        //     this.pushVitalSign(vitalTime, parseFloat(vitalSign.painScore.replace('次/min','')), list[5]);
        // }
    }
    pushVitalSign(date: Date, value: number, vitalSignOption: any): void {
        vitalSignOption.series.data.push([date, value]);
        if(vitalSignOption.maxDataX == 0 || date.getTime() > new Date(vitalSignOption.maxDataX).getTime()){
            vitalSignOption.maxDataX = new Date(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() + 86400000);
        }
        if (vitalSignOption.minDataX == 0 || date.getTime() < new Date(vitalSignOption.minDataX).getTime()){
            vitalSignOption.minDataX = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        if(vitalSignOption.maxDataY == 0 || value > vitalSignOption.maxDataY){
            vitalSignOption.maxDataY = value;
        }
        if(vitalSignOption.minDataY == 0 || value < vitalSignOption.minDataY){
            vitalSignOption.minDataY = value;
        }
    }
    //获取 svg 的起点位置和终点位置
    getSvgPos(startTime: number, endTime: number, vitalSignList: any[]): void {
        for(let vitalSign of vitalSignList){
            let minDate = vitalSign.minDataX;
            let maxDate = new Date(new Date(vitalSign.maxDataX).getTime() - 86400000);
            let startDate = new Date(startTime);
            let endDate = new Date(endTime);
            vitalSign.leftPos = Math.round((new Date(minDate).getTime() - new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()) / 1000 / 60 / 60 / 24);
            vitalSign.rightPos = Math.round((new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() - new Date(maxDate).getTime()) / 1000 / 60 / 60 / 24);
        }
    }
    //获取非药医嘱列表
    getNonOrderList(orderId: number, startDate: string, period: number):void {
        this.iptDetailsService.getNonOrderList(orderId, startDate, period).then(result => {
            this.summaryList.orderList.orderOptionList[2] = [];
            if(startDate != '' && period != 0){
                // let nonOrderList = result ? result as PatientNonOrder[] : [];
                // this.summaryList.nonOrderList = [];
                // for(let dateObj of this.summaryList.dateList){
                //     let dateTemp = new Date(dateObj.year + '/' + dateObj.date);
                //     let tempNonOrder = new PatientNonOrder();
                //     for(let nonOrder of nonOrderList){
                //         let nonOrderDate = new Date(nonOrder.orderTime);
                //         if(nonOrderDate.getFullYear() == dateTemp.getFullYear() && nonOrderDate.getMonth() == dateTemp.getMonth() && nonOrderDate.getDate() == dateTemp.getDate()){
                //             tempNonOrder = nonOrder;
                //             break;
                //         }
                //     }
                //     this.summaryList.nonOrderList.push(tempNonOrder);
                // }
                let validDate = new Date(this.summaryList.dateList[0].year + '/' + this.summaryList.dateList[0].date);
                let invalidDate = new Date(this.summaryList.dateList[6].year + '/' + this.summaryList.dateList[6].date);
                for(let groupNum in result){
                    let resultListArr = [];
                    resultListArr.push(result[groupNum])
                    for(let order of resultListArr){
                        if(!(order.orderValidTime > (invalidDate.getTime() + 86400000) || (order.orderInvalidTime ? (order.orderInvalidTime < validDate.getTime()) : false))){
                            this.changeOrder(order, validDate, invalidDate, 2);
                        }
                    }
                }
                for(let orderOption of this.summaryList.orderList.orderOptionList[2]){
                    this.getPositionArr(orderOption, this.summaryList.orderList.orderWidth - (orderOption.leftPos + orderOption.rightPos) * this.summaryTDWidth, this.summaryList.orderList.orderHeight);
                }
            } else {
                this.nonOrderList = result ? result as PatientNonOrder[] : [];
            }
        });
    }

    //获取警示信息
    getEngineMsgList(id: string, groupNo: string, orderIdList: any, hisOrderIdList:any, herbOrderIdList: any, hisHerbOrderIdList:any):void {
        let drugMsgList = [];
        this.iptDetailsService.getEngineMsgList(id, groupNo, orderIdList, hisOrderIdList, herbOrderIdList, hisHerbOrderIdList).then(result => {
            /**
             * 操作记录逻辑
             */
            if(result){
                for(let iptOrder of this.iptOrderList){
                    if(iptOrder.groupNum == groupNo){
                        iptOrder.auditHandle = result;
                    }
                }
            }
            /**
             * 警示信息逻辑
             */
            if(result && result.hasOwnProperty('drugMsgMap')){
                for(let drugName in result.drugMsgMap){
                    let drugMsg = [];
                    for(let msg of result.drugMsgMap[drugName]){
                        drugMsg.push({
                            'msg': msg,
                            'resultMsg': {
                                "engineMsgId": msg.engineMsgId,
                                "orderId": msg.orderId,
                                "orderType": 1,
                                "operateStatus": 3
                            }
                        });
                    }
                    drugMsgList.push({
                        'drugName': drugName,
                        'drugMsg': drugMsg
                    });
                }
            }
            for(let iptOrder of this.iptOrderList){
                if(iptOrder.groupNum == groupNo){
                    iptOrder.engineMsgs = drugMsgList;
                }
            }
        });
    }
    
    closePopup(): void {
        this.isPopupShow = false;
        this.isSingle = false;

        this.isAllergyShow = false;
        this.isDiagnoseShow = false;
        this.isProgressShow = false;
        this.isRecordShow = false;
        this.isExamShow = false;
        this.isOperationShow = false;
        this.isVitalSignShow = false;
        this.isNonOrderShow = false;
        this.isImageShow = false;
        this.isSpecialExamShow = false;
        this.isHerbOrderShow = false;
    }
    changeHash(value: string):void{
        window.location.hash = value;
    }
    vitalSignShow(): void {
        document.getElementById("popupVital").style.display = 'block';
        let vitalSignDom = document.getElementById("popupVitalBox");
        if(vitalSignDom){
            this.vitalSignWidth = document.getElementById("vitalSignTR").offsetWidth - document.getElementById("vitalSignTDTitle").offsetWidth - 20;
            this.vitalSignHeight = document.getElementById("vitalSignTR").offsetHeight - 20;
            for(let vitalSignOption of this.vitalSignOptionList){
                this.getPositionArr(vitalSignOption, this.vitalSignWidth - (vitalSignOption.leftPos + vitalSignOption.rightPos) * document.getElementById("vitalSignTDTitle").offsetWidth, this.vitalSignHeight);
            }
        }
    }
    vitalSignHide(): void {
        document.getElementById("popupVital").style.display = 'none';
    }
    orderClick(): void {
        this.isOrderShow = true;
        this.isSummaryShow = false;
        document.getElementById("orderBox").style.display = 'flex';
        document.getElementById("summaryBox").style.display = 'none';
    }
    summaryClick(): void {
        if(this.isOrderShow){
            this.isOrderShow = false;
            this.isSummaryShow = true;
            this.summaryTableWidth = document.getElementById("orderBox").offsetWidth - 20;
            this.summaryTDWidth = Math.round(this.summaryTableWidth * 0.125);
            document.getElementById("orderBox").style.display = 'none';
            document.getElementById("summaryBox").style.display = 'flex';
            if(this.summaryList.vitalSignList.vitalSignWidth == 0){
                this.summaryList.vitalSignList.vitalSignWidth = document.getElementById("summaryBoxTR").offsetWidth - document.getElementById("summaryBoxTH").offsetWidth - 20;
                this.summaryList.vitalSignList.vitalSignHeight = document.getElementById("summaryBoxTR").offsetHeight - 20;
                
                this.summaryList.orderList.orderWidth = document.getElementById("summaryBoxTR").offsetWidth - document.getElementById("summaryBoxTH").offsetWidth - 20;
                this.summaryList.orderList.orderHeight = document.getElementById("summaryBoxTR").offsetHeight - 20;

                this.barWidth = document.getElementById('timeline').offsetWidth;
                this.handleWidth = 7 * (this.barWidth - 5) / this.totalDays;
                document.getElementById('handle').style.left = (this.barWidth - (this.handleWidth - 4) - 5) + "px";
                this.disX = document.getElementById('timeline').getBoundingClientRect().left;
                this.getSummaryData(this.nowDate.getTime().toString(), this.summaryList.dateList.length);
            }
        }
    }
    getSummaryData(startDate: string, period: number): void {
        this.getVitalSignList(this.enginId, startDate, period, false);
        this.getDiagnoseList(this.enginId, startDate, period);
        this.summaryList.examList = [[],[],[],[],[],[],[]];
        this.getExamList(this.enginId, startDate, period);
        this.getImageList(this.enginId, startDate, period);
        this.getSpecialExamList(this.enginId, startDate, period);
        this.getOrderList(this.enginId, startDate, period);
        //this.getIptOrderData(this.enginId, startDate, period);
        this.getNonOrderList(this.enginId, startDate, period);
        this.getOpeartionList(this.enginId, startDate, period);
        this.getProgressList(this.enginId, startDate, period);
    }
    /**
     * 返回位置数列
     */
    getPositionArr(vitalSignOption: any, vitalSignWidth: number, vitalSignHeight: number) {
        let dataArr = vitalSignOption.series.data;
        vitalSignOption.positionArr = [];
        vitalSignOption.positionStr = '';
        let spacingY: number = (vitalSignOption.maxDataY == vitalSignOption.minDataY) ? 0 : (vitalSignHeight * 1.0 / (vitalSignOption.maxDataY - vitalSignOption.minDataY));
        let spacingX: number = (vitalSignOption.maxDataX - vitalSignOption.minDataX == 0) ? 0 : (vitalSignWidth * 1.0 / (vitalSignOption.maxDataX - vitalSignOption.minDataX));
        for (let i = 0; i < vitalSignOption.series.data.length; i++) {
            let data: any = {};
            data.y = 10 + (vitalSignHeight - (vitalSignOption.series.data[i][1] - vitalSignOption.minDataY) * spacingY);
            data.x = 10 + ((vitalSignOption.series.data[i][0] - vitalSignOption.minDataX) * spacingX);
            if(spacingY == 0){
                data.y = 10 + vitalSignHeight / 2;
            }
            vitalSignOption.positionStr += data.x + ',' + data.y + ' ';
            vitalSignOption.positionArr.push(data);
        }
    }
    vitalSignPopupDetail(vitalSign: any, data: any, i: number) {
        vitalSign.dialog.x = data.x - 50;
        vitalSign.dialog.y = data.y - 70;
        vitalSign.dialog.msg1 = vitalSign.series.data[i][1];
        vitalSign.dialog.msg2 = new Date(vitalSign.series.data[i][0]);
        vitalSign.dialog.show = true;
    }
    showDetail(vitalSign: any, data: any, i: number) {
        vitalSign.dialog.x = data.x - 50;
        vitalSign.dialog.y = data.y - 70;
        vitalSign.dialog.msg1 = vitalSign.series.data[i][1];
        vitalSign.dialog.msg2 = new Date(vitalSign.series.data[i][0]);
        vitalSign.dialog.show = true;
    }
    orderDetail(vitalSign: any, $event: any){
        vitalSign.posLeft = $event.pageX - 100 + 'px';
        vitalSign.posTop = $event.pageY - 105 + 'px';
        this.interValTime = setTimeout(() => {
            vitalSign.dialog.show = true;
        }, 250)
    }
    hideDetail(vitalSign: any) {
        clearInterval(this.interValTime);
        vitalSign.dialog.show = false;
    }
    //拖动切换时间段
    mouseEventFlag: number;
    mouseDown($event: any):void {
        $event.preventDefault();
        this.mouseEventFlag = 1;
        this.offsetLeft = $event.clientX - document.getElementById('handle').getBoundingClientRect().left;
    }
    mouseMove($event: any):void{
        if(this.mouseEventFlag != 1){
            return;
        }
        let L = $event.clientX - this.disX - this.offsetLeft;
            if (L < 5) {
                L = 5;  //最短距离
            } else if (L > this.barWidth - (this.handleWidth - 4) - 5) {
                L = this.barWidth - (this.handleWidth - 4) - 5;  //最长距离
            } 
            document.getElementById('handle').style.left = L + "px";
    }
    mouseUp($event: any, handleBlock: any, type: string):void{
        if(this.mouseEventFlag != 1){
            return;
        }
        this.mouseEventFlag = 2;
        handleBlock.onmousemove = null;
        handleBlock.onmouseleave = null;
        let L = $event.clientX - this.disX - this.offsetLeft;
        let daysNum = Math.floor(L / (this.barWidth-5) * this.totalDays) + 6;
        if(L < 5){
            daysNum = 0;
        } else if (L > this.barWidth - (this.handleWidth - 4) - 5){
            daysNum = this.totalDays;
        }
        let startDate = new Date((this.patientInfo.hospitalizedTime || this.defaultDate.getTime()));
        startDate.setDate(startDate.getDate() + daysNum);
        this.getSummaryDateList(startDate);
        this.getSummaryData(this.nowDate.getTime().toString(), this.summaryList.dateList.length);
    }

    //点击左右切换时间段
    leftDateClick(): void {
        this.nowDate.setDate(this.nowDate.getDate() - 1 + 6);
        this.getSummaryDateList(this.nowDate);
        let L = document.getElementById('handle').offsetLeft - (this.barWidth - 5) / this.totalDays;
        if (L < 5) {
            L = 5;  //最短距离
        } else if (L > this.barWidth - (this.handleWidth - 4) - 5) {
            L = this.barWidth - (this.handleWidth - 4) - 5;  //最长距离
        } 
        document.getElementById('handle').style.left = L + "px";
        this.getSummaryData(this.nowDate.getTime().toString(), this.summaryList.dateList.length);
    }
    rightDateClick(): void {
        this.nowDate.setDate(this.nowDate.getDate() + 1 + 6);
        this.getSummaryDateList(this.nowDate);
        let L = document.getElementById('handle').offsetLeft + (this.barWidth - 5) / this.totalDays;
        if (L < 5) {
            L = 5;  //最短距离
        } else if (L > this.barWidth - (this.handleWidth - 4) - 5) {
            L = this.barWidth - (this.handleWidth - 4) - 5;  //最长距离
        } 
        document.getElementById('handle').style.left = L + "px";
        this.getSummaryData(this.nowDate.getTime().toString(), this.summaryList.dateList.length);
    }

    //返回列表页
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

    // showCurrent(showTypeStatus: boolean, data: any[], curInfo: any){
    //     showTypeStatus = true;

    //     if(curInfo){

    //     }
    // }

    /**
     * 住院信息汇总的弹窗显示
     */
    private isSingle: boolean = false;
    private specdDiagnostic: any;       //指定诊断
    private specOperation: any;         //指定手术
    private specProgress: any;          //指定病程记录  
    private specExam: any;              //指定检查
    private specImage: any;             //影像检查
    private specSpecialExam: any;       //特殊检查

    showSpecInfo(data: any, type: string){
        this.isPopupShow = true;
        this.isSingle = true;
        this[type] = true;
        switch(type){
            case 'isDiagnoseShow':
                this.specdDiagnostic = data;
            case 'isOperationShow':
                this.specOperation = data;
            case 'isProgressShow':
                this.specProgress = data;
            case 'isExamShow':
                this.specExam = data;
            case 'isImageShow':
                this.specImage = data;
            case 'isSpecialExamShow':
                this.specSpecialExam = data;
        }
    }

    /**
     * 获取生命体征开始时间
     */
    getVitalStartDate(id: number){
        this.iptDetailsService.getVitalStartDate(id)
            .then(res => {
                if(res.code == '200' && res.data){
                    this.vitalSignStartDate = res.data;
                    this.getVitalSignList(this.enginId, res.data, 7, true);
                }else{
                    this.getVitalSignList(this.enginId, this.defaultDate.getTime().toString(), 7, true);
                }
            })
    }
    /**
     * 
     */
    private drugUrl: string = '';
    goToDrugDetail(){
        this.iptDetailsService.getDrugApi()
            .then(res => {
                if(res.code == '200' && res.data){
                    this.drugUrl = res.data;
                }
            })
    }
    /**
     * 住院医嘱详情显示草药嘱
     */
    private curHerbOrder: any = {};
    showHerbOrder(order: any){
        for(let herbOrder of this.iptOrderList){
            if(order.series.orderId == herbOrder.drugOrder[0].id){
                this.curHerbOrder = herbOrder;
                this.isPopupShow = true;
                this.isHerbOrderShow = true;
            }
        }
    }
    /**
     * 获取关联点数据
     * @param id
     * @param zoneId => 机构id
     * @param productId => 标准产品id
     */
    private relatedInfoShow: boolean = false;
    private relatedInfo: any;
    private noInfo: boolean;
    private relatedVitalSignDate: any;
    private relatedvitalSignOptionList: any;
    private relatedVitalSignWidth: number = 0;
    private relatedVitalSignHeight: number = 0;
    getDrugRelated(drugOrder: any){
        let dateTemp;
        dateTemp = this.vitalSignStartDate || new Date(this.defaultDate);
        this.relatedInfoShow = true;
        this.relatedInfo = null;
        this.noInfo = false;
        this.iptDetailsService.getDrugRelated(this.enginId, drugOrder.zoneId, drugOrder.drugId, dateTemp, 7)
            .then(res => {
                if(res.code == '200'){
                    if(res.data){
                        this.noInfo = true;
                        this.relatedInfo = res.data;
                        for(let item in res.data){
                            if(res.data[item] && res.data[item].length > 0){
                                this.noInfo = false;
                            }
                        }
                        if(this.relatedInfo.vitalSignList){
                            this.calcRelatedVitalSign(this.relatedInfo.vitalSignList);
                        }
                    }else{
                        this.noInfo = true;
                    }
                }else{
                    this.noInfo = true;
                }
            })
    }
    calcRelatedVitalSign(result: any){
        //按照时间排序
        if(result && result.length > 1){
            result.sort(function(item1, item2){
                return item1.testTime - item2.testTime;
            });
        }
        let dateTemp;
        let transitionArr = [];
        if(this.vitalSignStartDate){
            dateTemp = new Date(this.vitalSignStartDate);
        }else{
            dateTemp = new Date(this.defaultDate);
        }
        
        this.relatedVitalSignDate = [];    //将生命体征弹窗的时间数组清空
        this.relatedvitalSignOptionList = [{series:{name:"体温",data:[],},color:"#2BB5F5",unit:"°C",normal:"36.7°C",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"收缩压",data:[],},color:"#FF6C8A",unit:"",normal:"140",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"舒张压",data:[],},color:"#F9A735",unit:"",normal:"90",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"脉率",data:[],},color:"#93B6FF",unit:"次/min",normal:"100",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"心率",data:[],},color:"#FF4800",unit:"次/min",normal:"20",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}},{series:{name:"呼吸频率",data:[],},color:"#53BF0F",unit:"次/min",normal:"70",maxDataY:0,minDataY:0,maxDataX:0,minDataX:0,leftPos:0,rightPos:0,positionArr:[],positionStr:"",dialog:{show:false,x:0,y:0,msg1:"",msg2:""}}];
        for (let i = 0; i < 7; i++) {
            this.relatedVitalSignDate.push(dateTemp.getTime());
            dateTemp.setDate(dateTemp.getDate() + 1);
        }
        this.vitalSignList = result as PatientVitalSign[];
    
        if(this.vitalSignList.length > 0){
            for(let vitalSign of this.vitalSignList){
                this.changeVitalSign(vitalSign, this.relatedvitalSignOptionList);
            }
            let dateNum = this.relatedVitalSignDate.length;
            this.getSvgPos(this.relatedVitalSignDate[0], this.relatedVitalSignDate[dateNum - 1], this.relatedvitalSignOptionList);
        }

        
        this.relatedVitalSignWidth = 725;
        this.relatedVitalSignHeight = 40;
        for(let vitalSignOption of this.relatedvitalSignOptionList){
            this.getPositionArr(vitalSignOption, this.relatedVitalSignWidth - (vitalSignOption.leftPos + vitalSignOption.rightPos) * 107, this.relatedVitalSignHeight);
        }
        
        //保留有关联点数据的项目
        for(let i = 0; i < this.relatedvitalSignOptionList.length; i++){
            if(this.relatedvitalSignOptionList[i].maxDataX != 0){
                transitionArr.push(this.relatedvitalSignOptionList[i]);
            }
        }
        this.relatedvitalSignOptionList = transitionArr;
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
    getIptOrderData(orderId: number){
        this.analysisService.getIptOrderData(orderId)
            .then(res => {
                if(res.code == '200' && res.data){
                    this.transIptOrderData(res.data);
                    this.getPrevious();
                    this.getNext();
                    if(this.projectId){
                        this.getAuthority(this.projectId);
                    }
                }
            })
    }
    transIptOrderData(data: any){
        let orders, herbOrders, noOrders, noHerbOrders;
        //本次XML药嘱
        if(data.basisMedicalOrderMap){
            orders = data.basisMedicalOrderMap;
        }
        //本次XML草药嘱
        if(data.basisHerbMedicalOrderList){
            herbOrders = data.basisHerbMedicalOrderList;
        }
        //合并XML药嘱
        if(data.noBasisMedicalOrderMap){
            noOrders = data.noBasisMedicalOrderMap;
        }
        //合并XML草药嘱
        if(data.noBasisHerbMedicalOrderList){
            noHerbOrders = data.noBasisHerbMedicalOrderList;
        }
        
        this.iptOrderList = [];
        //药嘱
        if(orders){
            for(let groupNum in orders){
                let group = {
                    'groupNum': groupNum,
                    'drugOrder': orders[groupNum],
                    'engineMsgs': [],
                    'isChecked': false,
                    'status': -1,
                    'checkedNum': 0,
                    'checkedResult': {}
                }
                let orderIdList = [];
                let hisOrderIdList = [];
                for(let order of orders[groupNum]){
                    orderIdList.push(order.id);
                    hisOrderIdList.push(order.orderId);                        
                }
                this.iptOrderList.push(group);
                this.getEngineMsgList(this.enginId, groupNum, orderIdList, hisOrderIdList, null, null);
                this.getCheckResult(group, this.enginId, groupNum, this.projectId, this.checkPeopleId);
            }
            this.checkedRecipe = this.iptOrderList[0] || this.checkedRecipe;
        }
        //草药嘱
        if(herbOrders){
            for(let groupNum in herbOrders){
                let resultListArr = [];
                resultListArr.push(herbOrders[groupNum]);
                let group = {
                    'groupNum': herbOrders[groupNum].id,
                    'drugOrder': resultListArr,
                    'engineMsgs': [],
                    'isChecked': false,
                    'status': -1,
                    'checkedNum': 0,
                    'checkedResult': {}
                }
                let herbOrderIdList = [];
                let hisHerbOrderIdList = [];
                for(let order of resultListArr){
                    if(order.itemList && order.itemList.length > 0){
                        for(let item of order.itemList){
                            herbOrderIdList.push(item.id);
                            hisHerbOrderIdList.push(item.orderId);
                        }
                    }
                }
                
                this.iptOrderList.push(group);
                this.getEngineMsgList(this.enginId, group.groupNum, null, null, herbOrderIdList, hisHerbOrderIdList);
                this.getCheckResult(group,this.enginId, group.groupNum, this.projectId, this.checkPeopleId);
            }
            this.checkedRecipe = this.iptOrderList[0] || this.checkedRecipe;
        }
        //其他合并药嘱处理
        if(noOrders){
            for(let groupNum in noOrders){
                let order:any = {};
                order.drugOrder = noOrders[groupNum];
                this.forbidList.push(order);
            }
        }
        if(noHerbOrders){
            for(let groupNum in noHerbOrders){
                this.forbidList.push(noHerbOrders[groupNum]);
            }
        }
    }
    evaluate(){
        this.checkedRecipe.checkedResult.projectId = this.projectId;
        this.checkedRecipe.checkedResult.engineId = this.enginId;
        
        if(this.checkedRecipe.drugOrder[0].hasOwnProperty('herbUnitPrice')){
            this.checkedRecipe.checkedResult.groupNo = this.checkedRecipe.groupNum;
        }else{
            this.checkedRecipe.checkedResult.groupNo = this.checkedRecipe.groupNum;
        }
        
        this.analysisService.saveIptCheckResult(this.checkedRecipe.checkedResult)
            .then(res => {
                if(res.code == '200' && res.data){
                    this.checkedRecipe.resonable = this.checkedRecipe.checkedResult.checkResult;
                }else{
                    alert(res.message)
                }
            })
    }
    getCheckResult(recipe: any, engineId: any, groupNo: any, projectId: any, checkPeopleId: string){
        this.analysisService.getIptCheckResult(engineId, groupNo, projectId, checkPeopleId)
            .then(res => {
                if(res.code == '200'){
                    recipe.checkedResult = res.data || {};
                    if(recipe.checkedResult.id){
                        recipe.resonable = recipe.checkedResult.checkResult;
                    }else{
                        recipe.checkedResult.checkResult = 1;   
                    }
                }
            })
    }
    //获取上一张下一张id
    getPrevious(){
        this.analysisService.getPreviousIptEngineId(this.enginId)
            .then(res => {
                if(res.code == '200'){
                    this.previousId = res.data;
                }
            })
    }
    getNext(){
        this.analysisService.getNextIptEngineId(this.enginId)
            .then(res => {
                if(res.code == '200'){
                    this.nextId = res.data;
                }
            })
    }
    //切换上一张下一张
    goPrevious(){
        this.router.navigate(['page/ipt-quality-evaluate', this.previousId, 'edit', '']);
    }
    goNext(){
        this.router.navigate(['page/ipt-quality-evaluate', this.nextId, 'edit', '']);
    }
}