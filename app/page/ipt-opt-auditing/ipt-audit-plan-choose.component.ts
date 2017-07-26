import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IptAuditPlanChooseService } from './ipt-audit-plan-choose.service';
import { IptAuditPlanChoose } from './ipt-audit-plan-choose';
import { AuditPlanChooseMap } from './audit-plan-choose-map';
import { UserService } from '../../user.service';
import { PromptComponent } from '../common/prompt/prompt.component';

@Component({
    selector: 'audit-plan-choose',
    templateUrl: 'ipt-audit-plan-choose.component.html',
    styleUrls: ['ipt-audit-plan-choose.component.css'],
    providers: [ 
                IptAuditPlanChoose, 
                IptAuditPlanChooseService,
                AuditPlanChooseMap  
                ]
})
export class IptAuditPlanChooseComponent implements OnInit {
    auditPlanMap: IptAuditPlanChoose[];
    //参数列表
    private auditPlan: any = {};
    private auditPlanTypeName: string;
    private icd10: string = '';
    private depts: string = '';
    private doctors: string = '';
    private iptWards: string = '';
    private drugCategorys: string = '';
    private drugprops: string = '';
    private auditPlanInfo: any;
    private auditPlans: any[] = [];

    constructor(
        private iptAuditPlanChooseService: IptAuditPlanChooseService,
        private router: Router,
        private userService: UserService,
    )   { }



    ngOnInit() {
        this.initAuditPlanMap();
    }

    addPlan(){
        this.fnPlanDelete(this.auditPlan);
        this.auditPlans.push(this.auditPlan);
    }

    fnPlanDelete(_auditPlan){
        this.auditPlans = this.auditPlans.filter(item => item.id != _auditPlan.id);
    }

    getAuditPlan($event){
        if(!$event.id){
            return;
        }
        this.auditPlanTypeName = $event.name;
        this.iptAuditPlanChooseService.getAuditPlan($event.id)
            .then(res => {
                this.auditPlan = res.data;
                // console.log(this.auditPlan)


                let icd10Arr = [];
                if(this.auditPlan['icd10']){
                    try{
                        let _icds = JSON.parse(this.auditPlan['icd10']);
                        for(let _icd of _icds){
                            icd10Arr.push(_icd.name);
                        }
                    }catch(e){}
                    this.icd10 = icd10Arr.join(',');
                }

                let deptList = this.auditPlan['deptList'],
                    deptResult = [];
                if(deptList){
                    for(let zone of deptList){
                        for(let deptId in zone.idNamePairs){
                            deptResult.push(zone.idNamePairs[deptId]);
                        }
                    }
                    this.depts = deptResult.join(',');
                }

                let doctorList = this.auditPlan.category == 1 ? this.auditPlan['doctorList'] : this.auditPlan['groupList'],
                    doctorResult = [];
                if(doctorList){
                    for(let zone of doctorList){
                        for(let doctorId in zone.idNamePairs){
                            doctorResult.push(zone.idNamePairs[doctorId]);
                        }
                    }
                    this.doctors = doctorResult.join(',');
                }

                let drugResult = [];
                if(this.auditPlan['drugCategorys']){
                    try{
                        let _drugs = JSON.parse(this.auditPlan['drugCategorys']);
                        for(let _drug of _drugs){
                            drugResult.push(_drug.name);
                        }
                    }catch(e){}
                    this.drugCategorys = drugResult.join(',');
                }

                let drugPropResult = [];
                if(this.auditPlan['drugProperties']){
                    try{
                        let _drugprops = JSON.parse(this.auditPlan['drugProperties']);
                        for(let _drugprop of _drugprops){
                            drugPropResult.push(_drugprop.name);
                        }
                    }catch(e){}
                }
                this.drugprops = drugPropResult.join(',');

                let iptWardList = this.auditPlan.iptWardList,
                    iptWardResult = [];
                if(iptWardList){
                    for(let zone of iptWardList){
                        if(zone.idNamePairs){
                            for(let iptWardId in zone.idNamePairs){
                                iptWardResult.push(zone.idNamePairs[iptWardId]);
                            }
                        }
                    }
                }
                this.iptWards = iptWardResult.join(',');
            })
    }

    initAuditPlanMap(){
        this.iptAuditPlanChooseService.getAuditPlanMap()
            .then(auditPlanMap => {
                if(auditPlanMap && auditPlanMap[0]){
                    this.auditPlanInfo = auditPlanMap[0];

                    this.getAuditPlan(this.auditPlanInfo);

                }
            })
    }

    //开始审方
    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    getAuditPlanSetting(id: string, category: number) {
        let ids = [];
        if(this.auditPlans.length){
            for(let ap of this.auditPlans){
                ids.push(ap.id);
            }
        }else{
            ids.push(id);
        }
        if(!ids.length){
            this.promptComponent.alert('请先选择审方方案！');
            return;
        }
        this.iptAuditPlanChooseService.getAuditPlanSetting(ids.join(','))
            .then(data => {
                if (data.data === true) {
                    this.userService.activeAuditPlan.id = id;
                    this.userService.activeAuditPlan.status = true;
                    this.router.navigate(['/page/ipt-order-audit'])
                } else {
                    return false;
                }
            })
    }
}