import { Component, OnInit, Input, Output, HostListener, EventEmitter} from '@angular/core';

import { AuditPlanAnalysis } from './audit-plan-analysis';
import { AuditPlanAnalysisType } from './audit-plan-analysis-type';
import { AuditPlanWarningMap } from './audit-plan-warning-map';
import { AuditPlanWarningService } from './audit-plan-warning.service';

@Component({
    selector: 'audit-plan-warning',
    templateUrl: 'audit-plan-warning.component.html',
    styleUrls: [ 'audit-plan-warning.component.css', '../popup-add.css']
})

export class AuditPlanWarningComponent implements OnInit{
    
    @Input() warningMap: AuditPlanWarningMap[];
    @Input() label: string;
    @Output() select = new EventEmitter();

    private warning: AuditPlanWarningMap;
    //private isAnalysisBoxShow: false;
    private analysisMap: AuditPlanAnalysis[] = [];
    //private analysisTypeMap: AuditPlanAnalysisType[] = [];
    
    constructor(
        private warningService: AuditPlanWarningService
    ) { }

    warningInputClick(warningItem: AuditPlanWarningMap): void {
        if(warningItem.isAnalysisBoxShow) {
            this.closeAllWarningList();
            //TODO - test result
            this.getWarningResult();
        } else {
            this.closeAllWarningList();
            warningItem.isAnalysisBoxShow = true;
        }
    }
    changeWarningLevelType(warningLevelType: string, warningItem: AuditPlanWarningMap): void {
        warningItem.warningLevelType = warningLevelType;

        this.emit();
    }
    changeWarningLevel(warningLevel: string, warningItem: AuditPlanWarningMap): void {
        warningItem.warningLevel = warningLevel;

        this.emit();
    }
    changeAnalysis(analysisMap: AuditPlanAnalysis, warningItem: AuditPlanWarningMap): void {
        warningItem.analysis = analysisMap;
        if(analysisMap['children'] && (!analysisMap['children'].length || analysisMap['children'][0].name != '全部')){
            analysisMap['children'].unshift({
                id: '',
                name: '全部'
            });
        }
        warningItem.analysisTypeMap = analysisMap['children'];
        // this.getAnalysisTypeMap(analysisMap.name, warningItem);

        this.emit();
    }
    changeAnalysisType(analysisType: AuditPlanAnalysisType, warningItem: AuditPlanWarningMap): void {
        warningItem.analysisType = analysisType;

        this.emit();
    }
    emit(){
        this.select.emit(this.warningMap);
    }
    addWarning(): void {
        this.closeAllWarningList();
        this.warningMap.push(new AuditPlanWarningMap());
    }
    getAnalysisMap(): void {
        this.warningService.getAnalysisMap().then(analysisMap => {
            analysisMap.unshift({
                id: '',
                name: '全部',
                children: []
            });
            this.analysisMap = analysisMap;
        });
    }
    getAnalysisTypeMap(analysisName: string, warningMap: AuditPlanWarningMap): void {
        this.warningService.getAnalysisTypeMap(analysisName).then(analysisTypeMap => warningMap.analysisTypeMap = analysisTypeMap);
    }
    getWarningResult(): Array<Object> {
        let result = [];
        for(let warning of this.warningMap){
            result.push( {
                "analysisType": warning.analysis.name,
                "analysisResultType": warning.analysisType.name,
                "cautionStatus": warning.analysisStatus
                //TODO - 待加入条件和等级两个参数
            });
        }
        return result;
    }
    closeAllWarningList(): void {
        for(let warningMap of this.warningMap){
            warningMap.isAnalysisBoxShow = false;
        }
    }
    ngOnInit() {
        this.warning = this.warningMap[0];
        this.getAnalysisMap();
        //TODO - 验证analysis.name是否在analysisMap中，如果不存在如何处理。。
        // this.getAnalysisTypeMap(this.warning.analysis.name, this.warningMap[0]);
    }

    stopPropagation($event){
        $event.stopPropagation();
    }

    @HostListener('document:click',[])
    onDocumentClick(){
        this.closeAllWarningList();
    }

    delete(idx){
        this.warningMap.splice(idx,1);

        this.emit();
    }
}