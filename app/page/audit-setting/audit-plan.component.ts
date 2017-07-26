import { Component, OnInit, Pipe, PipeTransform, ViewChild, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Subject } from 'rxjs/Subject';

import { AuditPlanService } from './audit-plan.service';

import { AuditPlan } from './audit-plan';
import { AuditPlanMap } from './audit-plan-map';
import { AuditPlanICD10 } from './audit-plan-icd10/audit-plan-icd10';
import { AuditPlanWarning } from '../common/audit-plan-warning/audit-plan-warning';
import { AuditPlanWarningMap } from '../common/audit-plan-warning/audit-plan-warning-map';
import { AuditPlanAnalysis } from '../common/audit-plan-warning/audit-plan-analysis';
import { AuditPlanAnalysisType } from '../common/audit-plan-warning/audit-plan-analysis-type';
import { PromptComponent } from '../common/prompt/prompt.component';

@Component({
    selector: 'audit-plan',
    templateUrl: 'audit-plan.component.html',
    styleUrls: ['audit-plan.component.css', '../common/popup-add.css']
})
export class AuditPlanComponent implements OnInit {
    auditPlan: AuditPlan = new AuditPlan();
    auditPlanMapOrgin: AuditPlanMap[];
    auditPlanMap: AuditPlanMap[];
    icdResultList: any[] = [];
    //auditPlanDeptList: AuditPlanDept[];
    //auditPlanICD10List: AuditPlanICD10[] = [];
    //auditPlanICD10OrginList: AuditPlanICD10[] = [];
    //auditPlanICD10ResultList: AuditPlanICD10[] = [];
    //auditPlanICD10ChooseList: AuditPlanICD10[] = [];
    //isICD10Show: boolean = false;
    //isICD10AllChecked: boolean = true;
    warningMap: AuditPlanWarningMap[] = [];
    displayWaringMap: AuditPlanWarningMap[] = [];
    deptOptions: any = {
        isShow: false,
        inputType: 3,
        deviationWidth: 200,
        type: this.auditPlan.category
    };
    doctorIds: string = '';
    iptWardIds: string = '';
    history: any = window.history;

    private payType: string = '';
    private drugProperty: string = '';
    private drugCategory: string = '';
    private doctor: string = '';
    private deptType: string = '3';
    private drugCategoryResultList: any[] = [];
    //科室院区
    private activeZone: any[] = [];
    private activeDept: any[] = [];
    //特殊字符
    private specialPattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");

    private isEdit: boolean = false;

    private auditOptions: any = {};

    private drugPropertiesArr: any = [];

    constructor(
        private auditPlanService: AuditPlanService,
        private router: Router,
        private activeRouter: ActivatedRoute,
        private renderer: Renderer
    ) {
        renderer.listenGlobal('document', 'click', ($event) => {
            if ($event.target.className != 'audit-plan-old') {
                this.isShowAuditPlanOld = false;
            }
        });
    }

    categoryChange(category: number): void {
        this.deptOptions.type = this.auditPlan.category = category;

        if (category == 1) {
            this.auditPlan.isOuvas = 0;
            this.auditPlan.isPivas = 0;
        } else {
            this.auditPlan.isOuvas = 0;
            this.auditPlan.isPivas = 0;
        }

        this.auditPlan.deptList = [];
    }
    onInputDays(value: any, type: boolean): void {
        if (value && !isNaN(value)) {
            if (type) {
                this.auditPlan.minStay = value;
            } else {
                this.auditPlan.maxStay = value;
            }
        }else{
            if (type) {
                this.auditPlan.minStay = null;
            } else {
                this.auditPlan.maxStay = null;
            }
        }
    }
    onInputAge(value: number, type: boolean): void {
        if (value && !isNaN(value)) {
            if (type) {
                this.auditPlan.minAge = value;
            } else {
                this.auditPlan.maxAge = value;
            }
        }else{
            if (type) {
                this.auditPlan.minAge = null;
            } else {
                this.auditPlan.maxAge = null;
            }
        }
    }
    onChangeAge(value: any): void {
        this.auditPlan.ageUnit = value;
    }
    getAuditPlanMap(): void {
        this.auditPlanService.getAuditPlanMap((this.auditPlan&&this.auditPlan.category) || 1).then(auditPlanMap => {
            this.auditPlanMap = auditPlanMap;
            this.auditPlanMapOrgin = auditPlanMap;
        });
    }
    changeAuditPlanMap(event: Event): void {
        const selectedIndex: number = (<HTMLSelectElement>event.srcElement).selectedIndex;
        if (selectedIndex != 0) {
            this.getAuditPlan(selectedIndex);
        }
    }

    getAuditPlan(auditPlanId: number): void {
        // this.auditPlan.id = this.auditPlanMap[auditPlanId - 1].id;
        this.ajaxAuditPlan(this.auditPlanMap[auditPlanId - 1].id);
    }
    ajaxAuditPlan(auditPlanId: string): void {
        if(auditPlanId){
            this.auditPlanService.getAuditPlan(auditPlanId).then(auditPlan => {
                this.packAuditPlan(auditPlan);
            });
        }else{
            let copyAuditPlan = new AuditPlan();
            copyAuditPlan.category = this.auditPlan.category;
            this.packAuditPlan(copyAuditPlan);
        }
    }
    packAuditPlan(auditPlan){
        let oldProperty = {
            name: '',
            category: '',
            id: '',
            userId: ''
        }

        for(let prop in oldProperty){
            oldProperty[prop] = this.auditPlan[prop];
        }

        this.auditPlan = new AuditPlan();
        this.auditPlan = auditPlan;
        
        if(!this.isEdit){
            delete this.auditPlan.id;
            this.auditPlan.name = oldProperty.name;
        }else{
            if(oldProperty.name){
                for(let p in oldProperty){
                    this.auditPlan[p] = oldProperty[p];
                }
            }
        }

        //TODO - 
        this.warningMap = [];
        if (this.auditPlan.infoList && this.auditPlan.infoList.length >= 0) {
            for (let item of this.auditPlan.infoList) {
                let warning = new AuditPlanWarningMap();
                warning.analysis.name = item.analysisType;
                warning.analysisType.name = item.message;
                warning.analysisStatus = item.cautionStatus;
                warning.warningLevelType = item.symbol;
                warning.warningLevel = item.severity;
                this.warningMap.push(warning);
            }
        }

        this.displayWaringMap = [];
        if (this.auditPlan.displayInfoList && this.auditPlan.displayInfoList.length >= 0) {
            for (let item of this.auditPlan.displayInfoList) {
                let warning = new AuditPlanWarningMap();
                warning.analysis.name = item.analysisType;
                warning.analysisType.name = item.message;
                warning.analysisStatus = item.cautionStatus;
                warning.warningLevelType = item.symbol;
                warning.warningLevel = item.severity;
                this.displayWaringMap.push(warning);
            }
        }
        
        if (!this.auditPlan.icd10) {
            this.icdResultList = [];
        } else {
            try {
                this.icdResultList = JSON.parse(this.auditPlan.icd10);
            } catch (e) {
                this.icdResultList = [];
            }
        }

        // try{
        //     this.icdResultList = JSON.parse(this.auditPlan.icd10);
        // }catch(e){
        //     this.icdResultList = [];
        // }

        if (!this.auditPlan.drugCategorys) {
            this.drugCategoryResultList = []
        } else {
            try {
                this.drugCategoryResultList = JSON.parse(this.auditPlan.drugCategorys);
            } catch (e) {
                this.drugCategoryResultList = [];
            }
        }


        // let _doctorIds = [],
        //     dataSource = this.auditPlan.category == 1 ? (this.auditPlan.doctorList ? this.auditPlan.doctorList : []) : (this.auditPlan.groupList ? this.auditPlan.groupList : []);
        // for (let _zone of dataSource) {
        //     if (_zone.idNamePairs) {
        //         for (let id in _zone.idNamePairs) {
        //             _doctorIds.push(id);
        //         }
        //     }
        // }
        // this.doctorIds = _doctorIds.join(';');

        this.packDoctorIds();

        if(this.auditPlan.drugProperties){
            try {
                this.drugPropertiesArr = JSON.parse(this.auditPlan.drugProperties);
            } catch (e) {
                this.drugPropertiesArr = [];
            }
        }else{
            this.drugPropertiesArr = [];
        }

        this.deptOptions.type = this.auditPlan.category;


        this.packIptWardIds();
    }
    clearAuditPlanName(name) {
        if (!name || name.length <= 0) return;
        let replaceName = "";
        for (let i = 0; i < name.length; i++) {
            replaceName = replaceName + name.substr(i, 1).replace(this.specialPattern, '');
        }
        return replaceName;
    }
    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    saveAuditPlan(): void {
        //去除特殊字符
        // this.auditPlan.name = this.clearAuditPlanName(this.auditPlan.name);
        if (this.specialPattern.test(this.auditPlan.name)) {
            this.promptComponent.alert("方案名称不能含有特殊字符：[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]");
            return;
        }

        if (!this.auditPlan.name) {
            this.promptComponent.alert('方案名称不能为空！');
            return;
        }

        if (this.auditPlan.name && 　this.auditPlan.name.length > 60) {
            this.promptComponent.alert('方案名称最多60个字符！');
            return;
        }

        if (this.auditPlan.minAge > this.auditPlan.maxAge) {
            this.auditPlan.minAge = [this.auditPlan.maxAge, this.auditPlan.maxAge = this.auditPlan.minAge][0];
        }
        
        if (this.auditPlan.minStay > this.auditPlan.maxStay) {
            this.auditPlan.minStay = [this.auditPlan.maxStay, this.auditPlan.maxStay = this.auditPlan.minStay][0];
        }

        if (this.auditPlan.name.trim()) {
            if (this.auditPlan.id) {
                this.auditPlanService.updateAuditPlan(this.auditPlan).then(data => {
                    if (data.code == 200) {
                        //save success
                        // this.history.back();

                        this.auditOptions.show = true;
                        this.auditOptions.string = '保存成功';
                        setTimeout(() => {
                            this.auditOptions.show = false;
                            this.auditOptions.string = "";

                            this.router.navigate(['/page/audit-setting']);
                        }, 1500);
                    } else {
                        //save error
                        //TODO - 显示保存失败浮层
                        this.auditOptions.show = true;
                        this.auditOptions.string = `保存失败！ ${data.message}`;
                        setTimeout(() => {
                            this.auditOptions.show = false;
                            this.auditOptions.string = "";
                        }, 1500);
                    }
                });
            } else {
                this.auditPlanService.addAuditPlan(this.auditPlan).then(data => {
                    if (data.code == 200) {
                        //save success
                        // this.router.navigate(['/audit-setting']);
                        this.auditOptions.show = true;
                        this.auditOptions.string = '保存成功';
                        setTimeout(() => {
                            this.auditOptions.show = false;
                            this.auditOptions.string = "";

                            this.history.back();
                        }, 1500);
                    } else {
                        //save error
                        //TODO - 显示保存失败浮层
                        this.auditOptions.show = true;
                        this.auditOptions.string = `保存失败！ ${data.message}`;
                        setTimeout(() => {
                            this.auditOptions.show = false;
                            this.auditOptions.string = "";
                        }, 1500);
                    }
                });
            }
        }
    }

    handlePayTypeUpdate(value): void {
        this.auditPlan.costTypes = value;
    }

    handleDrugPropertyUpdate(value): void {
        this.auditPlan.drugProperties = JSON.stringify(value);
    }
    handleDrugCategoryUpdate(value): void {

        var result = [];
        for (let drug of value) {
            result.push({
                id: drug.id,
                name: drug.name
            });
        }

        this.auditPlan.drugCategorys = JSON.stringify(result);
    }
    handleDoctorUpdate(value): void {
        this.auditPlan[value.searchType == 1 ? 'doctorList' : 'groupList'] = value.arr;
        this.auditPlan[value.searchType == 2 ? 'doctorList' : 'groupList'] = [];

        this.packDoctorIds();
    }
    packDoctorIds(){
        let _doctorIds = [],
            dataSource = this.auditPlan.category == 1 ? (this.auditPlan.doctorList ? this.auditPlan.doctorList : []) : (this.auditPlan.groupList ? this.auditPlan.groupList : []);
        for (let _zone of dataSource) {
            if (_zone.idNamePairs) {
                for (let id in _zone.idNamePairs) {
                    _doctorIds.push(id);
                }
            }
        }
        this.doctorIds = _doctorIds.join(';');
    }
    // handleDeptUpdate(value): void {
    //     console.log('科室：' + value);
    //     this.auditPlan.deptIds = value;
    // }
    handleICD10Update(value): void {

        let result = [];

        for (let icd of value) {
            result.push({
                id: icd.id,
                name: icd.name
            });
        }

        this.auditPlan.icd10 = JSON.stringify(result);
    }

    /************************ 获取ICD10弹窗 ************************/
    icd10DialogOptions: any;
    @ViewChild('icd10Dialog') icd10Dialog: any;
    chooseICD10() {
        this.icd10DialogOptions = {
            mutipleChoose: true,
            ICD10_ID: this.auditPlan.icd10,
            choosedICD10s: this.icdResultList
        }
        this.icd10Dialog.show();
    }
    chooseNewICD10Confirm($event: any) {
        this.icdResultList = $event;
        this.handleICD10Update(this.icdResultList);
    }
    icd10ResultDelete(id) {
        this.icdResultList = this.icdResultList.filter(function (item) {
            return item.id != id;
        });
        this.handleICD10Update(this.icdResultList);
    }
    /************************ 获取ICD10弹窗 ************************/

    /************************ 获取药品分类弹窗 ************************/
    drugCategoryDialogOptions: any;
    @ViewChild('drugCategoryDialog') dialog: any;
    chooseDrug() {
        this.drugCategoryDialogOptions = {
            mutipleChoose: true,
            // DRUG_ID: this.auditPlan.category,
            // DRUG_ID: '0013921000',
            choosedDrugs: this.drugCategoryResultList
        }
        this.dialog.show();
    }
    chooseNewCategoryConfirm($event: any) {
        this.drugCategoryResultList = $event;
        this.handleDrugCategoryUpdate(this.drugCategoryResultList);
    }
    drugCategoryResultDelete(id) {
        this.drugCategoryResultList = this.drugCategoryResultList.filter(function (item) {
            return item.id != id;
        });
        this.handleDrugCategoryUpdate(this.drugCategoryResultList);
    }
    /************************ 获取药品分类弹窗 ************************/

    /* 科室选择事件 */
    fnDeptSelect($event) {
        this.auditPlan.deptList = $event;
    }

    fnZoneDeptDelete(type, zoneDept, $event) {
        for (let zone of this.auditPlan.deptList) {
            if (type == 'zone') {
                if (zone.zoneId == zoneDept.zoneId) {
                    this.auditPlan.deptList.splice(this.auditPlan.deptList.indexOf(zone) - 1, 1);
                }
            } else {
                for (let deptId in zone.idNamePairs) {
                    if (deptId == zoneDept.id) {
                        delete zone.idNamePairs[deptId];
                    }
                }
            }
        }

        $event.cancelBubble = true;
    }

    ngOnInit() {
        this.getAuditPlanMap();

        let id = this.activeRouter.params['value'].id;

        if (id) {
            this.ajaxAuditPlan(id);

            this.isEdit = true;
        }
    }

    private isShowAuditPlanOld = false;
    selectAuditPlanOld() {
        this.isShowAuditPlanOld = !this.isShowAuditPlanOld;
    }

    private auditPlanOldSelected: Object = {
        id: '',
        name: ''
    };
    //加载已有方案事件
    auditPlanOldSel($event) {
        this.auditPlanOldSelected = $event;
        this.ajaxAuditPlan($event['id']);
    }
    //选择警示信息事件
    selectWaringMap($event) {
        let result = [];
        for (var info of $event) {
            let obj = {
                analysisType: info.analysis.name,
                message: info.analysisType.name,
                cautionStatus: info.analysisStatus,
                symbol: info.warningLevelType,
                severity: info.warningLevel
            };
            result.push(obj);
        }
        this.auditPlan.infoList = result;
    }

    //选择展示警示信息事件
    selectDisplayWaringMap($event) {
        let result = [];
        for (var info of $event) {
            let obj = {
                analysisType: info.analysis.name,
                message: info.analysisType.name,
                cautionStatus: info.analysisStatus,
                symbol: info.warningLevelType,
                severity: info.warningLevel
            };
            result.push(obj);
        }
        this.auditPlan.displayInfoList = result;
    }

    trans2Arr(dept) {
        let keys = Object.keys(dept),
            result = [];
        for (let key of keys) {
            result.push({
                id: key,
                name: dept[key]
            });
        }
        return result;
    }

    deptclick($event) {
        this.deptOptions.isShow = !this.deptOptions.isShow;
        $event.stopPropagation();
    }

    cancel(){
        let that = this;
        this.promptComponent.prompt({
            title: '确认',
            icon: 'question-2.svg',
            tip: '你确认不保存当前编辑的内容？',
            otherTip: '若不保存，当前编辑的内容将会丢失',
            successCallback(){
                if(that.isEdit){
                    that.router.navigate(['/page/audit-setting']);
                }else{
                    that.history.back();
                }
            }
        });
    }

    patientUpdate($event){
        this.auditPlan.patientCondition = $event;
    }

    handleIptWardUpdate($event){
        this.auditPlan.iptWardList = $event.arr;

        this.packIptWardIds();
    }

    packIptWardIds(){
        let _iptWardIds = [];
        if(this.auditPlan.iptWardList){
            for (let _zone of this.auditPlan.iptWardList) {
                if (_zone.idNamePairs) {
                    for (let id in _zone.idNamePairs) {
                        _iptWardIds.push(id);
                    }
                }
            }
        }
        this.iptWardIds = _iptWardIds.join(';');
    }

    ouvasCheck($event){
        this.auditPlan.isOuvas = $event.target.checked ? 1 : 0;
    }

    pivasCheck($event){
        this.auditPlan.isPivas = $event.target.checked ? 1 : 0;
    }
}