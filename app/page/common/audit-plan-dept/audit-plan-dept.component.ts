import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { AuditPlanZone } from './audit-plan-zone';
import { AuditPlanDept } from './audit-plan-dept';
import { AuditPlanDeptService } from './audit-plan-dept.service';

@Component({
    selector: 'audit-plan-dept',
    templateUrl: 'audit-plan-dept.component.html',
    styleUrls: ['audit-plan-dept.component.css', '../popup-add.css']
})
export class AuditPlanDeptComponent implements OnInit {
    @Input() lbWidth: string;
    @Input() IptWidth: string;
    @Input() IptHeight: string;
    @Input() winL: string;
    @Input() inputStr: string = '';
    @Input() inputType: string = ''; //1-单院区 2-集中平台 3-混合
    @Output() deptUpdate = new EventEmitter();

    private isPopupShow: boolean = false;
    private deptResultArr: string[] = [];
    private zoneResultArr: string[] = [];
    private deptList: AuditPlanDept[] = [];
    private deptOrginList: AuditPlanDept[] = [];
    private zoneList: AuditPlanZone[] = [];
    private zoneOrginList: AuditPlanZone[] = [];
    private checkedZone: string = '';
    private isDeptAllCheck: boolean = true;

    constructor(
        private auditPlanDeptService: AuditPlanDeptService
    ) { }
    initDeptList(): void {
        for(let dept of this.deptList){
            if(~this.deptResultArr.indexOf(dept.name)){
                dept.checked = true;
            } else {
                dept.checked = false;
                this.isDeptAllCheck = false;
            }
        }
    }
    initZoneList(): void {
        for(let zone of this.zoneList){
            if(~this.zoneResultArr.indexOf(zone.name)){
                zone.checked = true;
            } else {
                zone.checked = false;
            }
        }
    }
    getZoneList(): void {
        this.auditPlanDeptService.getZoneList().then(zoneList => {
            this.zoneList = zoneList;
            if(this.inputType == '1'){
                this.initZoneList();
            }
            this.zoneOrginList = this.zoneList;
        });
    }
    searchZone(keyWord: string): void {
        if(keyWord.trim()){
            this.auditPlanDeptService.searchZone(keyWord).then(zoneList => {
                this.zoneList = zoneList;
                if(this.inputType == '1'){
                    this.initZoneList();
                }
            });
        }
    }
    getDeptList(zoneId: string): void {
        this.auditPlanDeptService.getDeptList(zoneId).then(deptList => {
            this.deptList = deptList;
            this.initDeptList();
            this.deptOrginList = this.deptList;
        });
    }
    searchDept(keyWord: string): void {
        if(keyWord.trim()){
            this.auditPlanDeptService.searchDept(keyWord).then(deptList => {
                this.deptList = deptList;
                this.initDeptList();
            });
        }
    }
    getDeptResult(): void {
        if(this.inputStr && this.inputStr.length > 0){
            this.deptResultArr = this.inputStr.split(';');
        }
    }
    getZoneResult(): void {
        if(this.inputStr && this.inputStr.length > 0){
            this.zoneResultArr = this.inputStr.split(';');
        }
    }
    zoneClick(zone: AuditPlanZone):void {
        if(this.inputType == '3'){
            for(let zone of this.zoneList){
                zone.checked = false;
            }
        }
        zone.checked = !zone.checked;
        if(zone.checked){
            if(!~this.zoneResultArr.indexOf(zone.name)){
                this.zoneResultArr.push(zone.name);
            }
            this.checkedZone = zone.name;
            if(this.inputType != '1'){
                this.getDeptList(zone.id);
            }
        } else {
            this.zoneResultArr = this.zoneResultArr.filter(result => result !== zone.name);
        }
        if(this.inputType == '1'){
            if(zone.checked){
                if(!~this.zoneResultArr.indexOf(zone.name)){
                    this.zoneResultArr.push(zone.name);
                }
            } else {
                this.zoneResultArr = this.zoneResultArr.filter(result => result !== zone.name);
            }
            this.deptUpdate.emit(this.zoneResultArr.join(';'));
        }
    }
    deptClick(item: any): void {
        if(item){
            //check one
            item.checked = !item.checked;
            if(item.checked && !~this.deptResultArr.indexOf(item)){
                this.deptResultArr.push(item.name);
            } else {
                this.deptResultArr = this.deptResultArr.filter(result => result !== item.name);
            }
            this.isDeptAllCheck = true;
            for(let dept of this.deptList){
                if(!dept.checked){
                    this.isDeptAllCheck = false;
                }
            }
        } else {
            this.isDeptAllCheck = !this.isDeptAllCheck;
            if(this.isDeptAllCheck){
                for(let dept of this.deptList){
                    dept.checked = true;
                    if(!~this.deptResultArr.indexOf(dept.name)){
                        this.deptResultArr.push(dept.name);
                    }
                }
            } else {
                for(let dept of this.deptList){
                    dept.checked = false;
                }
                this.deptResultArr = [];
            }
        }
        this.deptUpdate.emit(this.deptResultArr.join(';'));
    }
    zoneDelete(event: MouseEvent ,value: string): void {
        event.stopPropagation();
        this.zoneResultArr = this.zoneResultArr.filter(result => result !== value);
        for(let zone of this.zoneList){
            if(zone.name == value){
                zone.checked = false;
            }
        }
    }
    deptDelete(event: MouseEvent ,value: string): void {
        event.stopPropagation();
        this.deptResultArr = this.deptResultArr.filter(result => result !== value);
        for(let dept of this.deptList){
            if(dept.name == value){
                dept.checked = false;
            }
        }
        this.isDeptAllCheck = false;
    }
    ngOnInit(){
        if(this.inputType == '1'){
            this.getZoneResult();
        } else {
            this.getDeptResult();
        }
        if(this.inputType != '2'){
            this.getZoneList();
        }
        if(this.inputType != '1'){
            this.getDeptList('');
        }
    }
}