import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AuditPlanZone } from './audit-plan-zone';
import { AuditPlanDoctor } from './audit-plan-doctor';
import { AuditPlanDoctorService } from './audit-plan-doctor.service';

@Component({
    selector: 'audit-plan-doctor',
    templateUrl: 'audit-plan-doctor.component.html',
    styleUrls: ['audit-plan-doctor.component.css', '../popup-add.css']
})
export class AuditPlanDoctorComponent implements OnInit {
    @Input() doctorStr: string = '';
    @Input() searchType: number; //1 - 医生 2 - 医疗组 3 - 病区
    @Input() justNeedDialog: boolean = false;
    @Output() doctorUpdate = new EventEmitter();

    private isPopupShow: boolean = false;
    private zoneId: string = '';
    private zoneList: AuditPlanZone[] = [];
    private doctorList: AuditPlanDoctor[] = [];
    private doctorChooseList: AuditPlanDoctor[] = [];
    private doctorResultList: AuditPlanDoctor[] = [];
    private allDoctorList: AuditPlanDoctor[] = [];
    private timeout: any = {};

    constructor(
        private auditPlanDoctorService: AuditPlanDoctorService
    ) { }

    getDoctorList(): void {
        let api =  this.searchType == 1 ? 'getDoctorList' : (this.searchType == 2 ? 'getGroupList' : 'getIptWardList')
        this.auditPlanDoctorService[api](this.zoneId).then(doctorList => {
            // if((!zoneName || zoneName == '全部') && this.allDoctorList.length <= 0){
            //     this.allDoctorList = doctorList;
            // }
            for (var doctor of doctorList) {
                if (this.searchType == 2) {
                    doctor.name = doctor.docGroup;
                }
                if (this.searchType == 3) {
                    doctor.name = doctor.inWardName;
                }
            }
            this.doctorInit(doctorList);
        });
    }
    doctorInit(newList: AuditPlanDoctor[]): void {
        this.doctorChooseList = [];
        this.doctorResultList = [];
        let doctorArr = this.doctorStr ? this.doctorStr.split(';') : [];
        for (let doctor of newList) {
            if (doctorArr.indexOf(doctor.id + '') != -1) {
                doctor.checked = true;
                this.doctorChooseList.push(doctor);
                this.doctorResultList.push(doctor);
            } else {
                doctor.checked = false;
            }
        }
        this.doctorList = newList;
    }
    getZoneList(): void {
        this.auditPlanDoctorService.getZoneList().then(zoneList => {
            this.zoneList = zoneList;
            if (zoneList.length) {
                this.zoneId = zoneList[0].id;
            }

            this.getDoctorList();
        });
    }
    zoneChange(zoneId: string): void {
        if (zoneId.trim()) {
            this.zoneId = zoneId;
            this.getDoctorList();
        }
    }
    searchDoctor(keyWord: string): void {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            if (keyWord.trim()) {
                // let api =  (this.searchType != 1 && this.searchType != 2) ? 'searchIptWardList' : 'searchDoctor';
                let api =  this.searchType == 1 ? 'searchDoctor' : (this.searchType == 2 ? 'searchGroup' : 'searchIptWardList')
                this.auditPlanDoctorService[api](keyWord).then(doctorList => {
                    for (var doctor of doctorList) {
                        if (this.searchType == 2) {
                            doctor.name = doctor.docGroup;
                        }
                        if (this.searchType == 3) {
                            doctor.name = doctor.inWardName;
                        }
                    }
                    this.doctorInit(doctorList);
                })
            }
        }, 500);
    }
    doctorClick(doctor: AuditPlanDoctor): void {
        doctor.checked = !doctor.checked;
        if (doctor.checked && !~this.doctorChooseList.indexOf(doctor)) {
            this.doctorChooseList.push(doctor);
        } else {
            this.doctorChooseList = this.doctorChooseList.filter(item => item.id !== doctor.id);
        }
    }
    doctorDelete(doctor: AuditPlanDoctor): void {
        doctor.checked = false;
        this.doctorChooseList = this.doctorChooseList.filter(item => item.id !== doctor.id);
    }
    doctorResultDelete(doctor: AuditPlanDoctor): void {
        this.doctorChooseList = this.doctorChooseList.filter(item => item.id !== doctor.id);
        this.doctorResultList = this.doctorResultList.filter(item => item.id !== doctor.id);

        //change checked value in doctorList
        for (let item of this.doctorList) {
            if (item.name == doctor.name && item.id == doctor.id) {
                item.checked = false;
            }
        }

        //get result string
        // let resultArr = [];
        // for(let item of this.doctorResultList){
        //     resultArr.push(item.name);
        // }
        // //TODO - 是否需要对结果排序？
        // this.doctorStr = resultArr.join(';');
        // this.doctorUpdate.emit(this.doctorStr);

        this.emit(this.doctorResultList);
    }
    emit(targetList: any[]) {
        let doctorMap = {};
        for (let item of targetList) {
            doctorMap[item.id] = item.name;
        }

        let currentZone = {
            id: '',
            name: ''
        };
        for (let zone of this.zoneList) {
            if (zone.id == this.zoneId) {
                currentZone = zone;
            }
        }

        this.doctorUpdate.emit({
            searchType: this.searchType,
            arr: [{
                zoneId: currentZone.id || '',
                zoneName: currentZone.name || '',
                idNamePairs: doctorMap
            }]
        });
    }
    canclePopup($event): void {
        this.isPopupShow = false;
        // this.doctorInit(this.allDoctorList);  //reset
        $event.stopPropagation();
    }
    popup() {
        this.isPopupShow = !this.isPopupShow;
        this.getZoneList();
    }
    submitPopup($event): void {
        this.isPopupShow = false;
        this.doctorResultList = [];
        // let resultArr = [];
        for (let doctor of this.doctorChooseList) {
            this.doctorResultList.push(doctor);
            // resultArr.push(doctor.id);
        }
        // //TODO - 是否需要对结果排序？
        // this.doctorStr = resultArr.join(';');
        // this.doctorUpdate.emit(this.doctorStr);

        this.emit(this.doctorChooseList);

        $event.stopPropagation();
    }
    ngOnChanges() {
        this.getZoneList();
    }
    ngOnInit() {
        // this.getZoneList();
        // this.getDoctorList('');
    }

    stopPropagation($event){
        $event.stopPropagation();
    }
}
