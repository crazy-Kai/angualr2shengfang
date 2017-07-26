import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IptOrderAuditService } from './ipt-order-audit.service';
import { IptOrderAudit } from './ipt-order-audit';
import { PromptComponent } from '../common/prompt/prompt.component';
@Component({
    selector: 'ipt-order-audit',
    templateUrl: 'ipt-order-audit.component.html',
    styleUrls: ['ipt-order-audit.component.css'],
    providers: [IptOrderAudit, IptOrderAuditService]
})

export class IptOrderAuditComponent implements OnInit {
    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    //参数列表
    private waitAuditIptList: any[] = [];
    private checkedRecipes: any[] = [];
    //
    private refreshInterval: any;
    private beatingInterval: any;
    private workingInterval: any;
    private tipsTimeout: any;
    private receiveOrder: boolean = true;
    private menuDOM = <HTMLElement>document.getElementsByClassName("public-menu")[0];
    
    constructor(
        private iptOrderAuditService: IptOrderAuditService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {//12
        this.getIptOrderAudit();
        this.auditWorkingStatus();
        // 每5秒刷新列表 
        this.refreshInterval = setInterval(() => {
            this.getIptOrderAudit();
        }, 5000);
        // this.beatingInterval = setInterval(() => {
        //     this.auditBeatingStatus();
        // }, 2000);
        this.workingInterval = setInterval(() => {
            this.auditWorkingStatus();
        }, 10000);

        this.menuDOM.style.display = 'block';
    }

    ngOnDestroy() {
        clearInterval(this.refreshInterval);
        clearInterval(this.workingInterval);
    }

    getIptOrderAudit() {
        this.iptOrderAuditService.getWaitAuditIptList()
            .then(res => {
                if (res.code == '200' && res.data) {
                    this.waitAuditIptList = res.data;
                } else if (res.code == '200') {
                    this.waitAuditIptList = [];
                }
            })
    }
    //心跳
    auditBeatingStatus() {
        this.iptOrderAuditService.auditBeatingStatus()
            .then(res => {
                
            });
    }
    //工作状态
    auditWorkingStatus(){
        this.iptOrderAuditService.auditWorkingStatus()
            .then(res => {
                if(res.code == '200'){
                    this.receiveOrder = res.data;
                }
            })
    }
    /**
     * 选择逻辑
     */
    isAllCheck() {
        if (!this.isAllChecked()) {
            this.checkedRecipes = this.waitAuditIptList;
        } else {
            this.checkedRecipes = [];
        }
    }

    putInCheckList(recipe: any) {
        if (this.isChecked(recipe) >= 0) {
            this.checkedRecipes.splice(this.isChecked(recipe), 1);
        } else {
            this.checkedRecipes.push(recipe);
        }
    }
    isChecked(recipe: any): any {
        if (this.checkedRecipes && this.checkedRecipes.length > 0) {
            for (let i = 0; i < this.checkedRecipes.length; i++) {
                if (this.checkedRecipes[i].id == recipe.id) {
                    return i;
                }
            }
            return -1;
        } else {
            return -1;
        }
    }
    isAllChecked() {
        if (this.checkedRecipes && this.waitAuditIptList.length > 0 && this.checkedRecipes.length == this.waitAuditIptList.length) return true;

        return false;
    }

    hasChecked($event: any) {
        if (this.checkedRecipes && this.checkedRecipes.length > 0) return true;

        return false;
    }

    onDblClick(trow: any) {
        this.iptOrderAuditService.auditing(trow.id)
            .then(res => {
                if(res.code == '200' && res.code){
                    this.router.navigate(['/page/ipt-order-details', trow.id]);
                    this.menuDOM.style.display = 'none';
                }else{
                    this.promptComponent.alert({
                        title: '提示',
                        tip: '审核超时',
                        otherTip: '该医嘱已被超时自动通过',
                    });
                }
            })
    }

    // 通过
    agreeIptOrderAudit(trow: any) {
        this.iptOrderAuditService.getAuditAgree(trow.id)
            .then(res => {
                if (res.code == 200) {
                    this.getIptOrderAudit();
                    this.constructAuditOpt(res.data);
                }
            })
    }
    // 打回
    refuseIptOrderAudit(trow: any) {
        if (!trow.engineMsg) return;
        this.iptOrderAuditService.getAuditRefuse(trow.id)
            .then(res => {
                if (res.code == 200) {
                    this.getIptOrderAudit();
                    this.constructAuditOpt(res.data);
                }
            })
    }
    // 批量通过
    batchAgree() {
        let ids = this.serializeParams(this.checkedRecipes);
        this.iptOrderAuditService.auditBatchAgree(ids)
            .then(res => {
                if (res.code == 200) {
                    this.getIptOrderAudit();
                    this.constructAuditOpt(res.data);
                    this.checkedRecipes = [];
                }
            })
    }
    // 批量打回
    batchRefuse() {
        let ids = this.serializeParams(this.checkedRecipes);
        this.iptOrderAuditService.auditBatchRefuse(ids)
            .then(res => {
                if (res.code == 200) {
                    this.getIptOrderAudit();
                    this.constructAuditOpt(res.data);
                    this.checkedRecipes = [];
                }
            })
    }
    // 批量挂起
    batchPending() {
        let ids = this.serializeParams(this.checkedRecipes);
        this.iptOrderAuditService.auditBatchPending(ids)
            .then(res => {
                if (res.code == 200) {
                    this.getIptOrderAudit();
                    this.constructAuditOpt(res.data);
                    this.checkedRecipes = [];
                }
            })
    }


    //构建一个有时效的tips
    constructAuditOpt(str: string) {
        this.auditOptions.show = true;
        this.auditOptions.string = str;
        this.tipsTimeout = setTimeout(() => {
            this.auditOptions.show = false;
            this.auditOptions.string = "";
        }, 3000);
    }

    serializeParams(oArr: any[]) {
        let ids: number[] = [];
        this.checkedRecipes.map(recipe => {
            ids.push(recipe.id);
        });
        
        return ids;
    }

    //结束审方
    endAudit($event: any) {
        if ($event) {
            this.iptOrderAuditService.endAudit()
                .then(res => {
                    if (res.code == '200')
                        this.receiveOrder = false;
                    //clearInterval(this.refreshInterval);
                    //clearInterval(this.beatingInterval);
                })
        }
    }

    /**
     * 审核结果提示
     */
    auditOptions: any = {};
}