import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

import { AuditReviewService } from './audit-review.service';
import { AuditReview } from './audit-review';
import { AuditPlanMap } from './audit-plan-map';


@Component({
    selector: 'audit-review',
    templateUrl: 'audit-review.component.html',
    styleUrls: ['audit-review.component.css'],
    providers: [AuditReview, AuditReviewService]
})

export class AuditReviewComponent implements OnInit {
    //参数列表
    private auditPlan: AuditReview = new AuditReview();
    private auditPlanMap: AuditPlanMap[];
    private auditPlanId: any;
    private drugs: any[] = [];
    private icd10: any[] = [];
    private depts: string = '';
    private doctors: string = '';
    private iptWards: string = '';

    private drugCategorys: string = '';
    private drugprops: string = '';

    constructor(
        private auditReviewService: AuditReviewService,
        private router: Router,
        private activeRouter: ActivatedRoute
    ) { }

    ngOnInit() {
        let id = this.activeRouter.params['value'].id;
        if (id) {
            this.getAuditPlan(id);
        }
    }

    getAuditPlan(auditPlanId: string): void {
        this.auditReviewService.getAuditPlan(auditPlanId)
            .then(auditPlan => {
                this.auditPlan = auditPlan;
                if(!this.auditPlan.infoList || this.auditPlan.infoList.length <= 0) this.auditPlan.infoList = [];
                if(!this.auditPlan.displayInfoList || this.auditPlan.displayInfoList.length <= 0) this.auditPlan.displayInfoList = [];

                if(!this.auditPlan['icd10']){
                    this.icd10 = [];
                }else{
                    try {
                        this.icd10 = JSON.parse(this.auditPlan['icd10']);
                    } catch (e) {
                        this.icd10 = [];
                    }
                }
                

                let deptList = this.auditPlan['deptList'] ? this.auditPlan['deptList'] : [],
                    deptResult = [];
                if(deptList){
                    for(let zone of deptList){
                        if(zone.idNamePairs){
                            for(let deptId in zone.idNamePairs){
                                deptResult.push(zone.idNamePairs[deptId]);
                            }
                        }
                    }
                }
                this.depts = deptResult.join(',');

                let doctorList = this.auditPlan.category == 1 ? (this.auditPlan['doctorList'] ? this.auditPlan['doctorList'] : []) : (this.auditPlan['groupList'] ? this.auditPlan['groupList'] : []),
                    doctorResult = [];
                if(doctorList){
                    for(let zone of doctorList){
                        if(zone.idNamePairs){
                            for(let doctorId in zone.idNamePairs){
                                doctorResult.push(zone.idNamePairs[doctorId]);
                            }
                        }
                    }
                }
                this.doctors = doctorResult.join(',');

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

                let drugResult = [];
                if(this.auditPlan['drugCategorys']){
                    try{
                        let _drugs = JSON.parse(this.auditPlan['drugCategorys']);
                        for(let _drug of _drugs){
                            drugResult.push(_drug.name);
                        }
                    }catch(e){}
                }
                this.drugCategorys = drugResult.join(',');

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
            });
    }
}