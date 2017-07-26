import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OptOrderAuditService } from './opt-order-audit.service';
import { OptRecipeDetailsService } from './opt-recipe-details.service';
import { OptOrderAudit } from './opt-order-audit';
import { PromptComponent } from '../common/prompt/prompt.component';

@Component({
    selector: 'opt-order-audit',
    templateUrl: 'opt-order-audit.component.html',
    styleUrls: ['opt-order-audit.component.css'],
    providers: [OptOrderAudit, OptOrderAuditService]
})


export class OptOrderAuditComponent implements OnInit {
     @ViewChild(PromptComponent) promptComponent: PromptComponent;
    //参数列表
    private optRecipeList: any[] = [];
    private checkedRecipes: any[] = [];
    private infos: any[] = [];
    private infosIds: number[] = [];
    //
    private refreshInterval: any;
    private beatingInterval: any;
    private workingInterval: any;
    private tipsTimeout: any;
    private receiveRecipe: boolean = true;
    private menuDOM = <HTMLElement>document.getElementsByClassName("public-menu")[0];

    private urgentFlag: number;

    constructor(
        private optOrderAuditService: OptOrderAuditService,
        private optRecipeDetailsService: OptRecipeDetailsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getOptOrderAudit();
        //每5秒刷新列表
        this.refreshInterval = setInterval(() => {
            this.urgentFlag = Math.floor(Math.random() * 4)
            this.getOptOrderAudit();
        }, 5000);
        // this.beatingInterval = setInterval(() => {
        //     this.auditBeatingStatus();
        // }, 2000);
        this.auditWorking();
        this.workingInterval = setInterval(() => {
            this.auditWorking();
        }, 10000);
    }

    ngOnDestroy() {
        clearInterval(this.refreshInterval);
        clearInterval(this.beatingInterval);
    }

    auditWorking() {
        this.optOrderAuditService.auditWorking()
            .then(res => {
                this.receiveRecipe = res.data;
            });
    }

    getOptOrderAudit() {
        this.optOrderAuditService.getOptRecipeList()
            .then(res => {
                if (res.code == '200' && res.data) {
                    this.optRecipeList = res.data;
                } else if (res.code == '200') {
                    this.optRecipeList = [];
                }
            })
    }
    auditBeatingStatus() {
        this.optOrderAuditService.auditBeatingStatus()
            .then(res => {

            });
    }

    /**
     * 选择逻辑
     */
    isAllCheck() {
        if (!this.isAllChecked()) {
            this.checkedRecipes = this.optRecipeList;
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
                if (this.checkedRecipes[i].optRecipe.id == recipe.optRecipe.id) {
                    return i;
                }
            }
            return -1;
        } else {
            return -1;
        }
    }
    isAllChecked() {
        if (this.checkedRecipes && this.optRecipeList.length > 0 && this.checkedRecipes.length == this.optRecipeList.length) return true;

        return false;
    }

    hasChecked($event: any) {
        if (this.checkedRecipes && this.checkedRecipes.length > 0) return true;

        return false;
    }

    goRecipeDetail(trow: any, id: string) {
        this.optOrderAuditService.getAuditing(id)
            .then(res => {
                if (res.data) {
                    this.router.navigate(['/page/opt-recipe-details', trow.optRecipe.id]);
                    this.menuDOM.style.display = 'none';    //隐藏左侧菜单栏
                } else {
                    this.promptComponent.alert({
                        title: '提示',
                        tip: '审核超时',
                        otherTip: '该处方已被超时自动通过',
                    });
                }
            })
    }

//通过
agreeOptOrderAudit(trow: any) {
    this.optOrderAuditService.getAuditAgree(trow.optRecipe.id)
        .then(res => {
            if (res.code == 200) {
                this.getOptOrderAudit();
                this.constructAuditOpt(res.data);
            }
        })
}
//打回
refuseOptOrderAudit(trow: any, i: number) {
    this.optOrderAuditService.getAuditRefuse(trow.optRecipe.id)
        .then(res => {
            if (res.code == 200) {
                this.getOptOrderAudit();
                this.constructAuditOpt(res.data);
            }
        })
}
//批量通过
batchAgree() {
    let ids = this.serializeParams(this.checkedRecipes);
    this.optOrderAuditService.auditBatchAgree(ids)
        .then(res => {
            if (res.code == 200) {
                this.getOptOrderAudit();
                this.constructAuditOpt(res.data);
                this.checkedRecipes = [];
            }
        })
}

/*BatchRefuse() {
    let agreeIds = this.serializeParamsAgree(this.checkedRecipes);
    let refuseIds = this.serializeParamsRefuse(this.checkedRecipes);
    if (refuseIds.length != agreeIds.length) {
        this.constructAuditOpt('因' + (agreeIds.length - refuseIds.length) + '张没有警示信息而无法打回，请取消勾选')
    } else {
        this.optOrderAuditService.auditBatchRefuse(refuseIds)
            .then(res => {
                if (res.code == 200 && this.optRecipeList) {
                    this.getOptOrderAudit();
                    this.constructAuditOpt(res.data);
                    this.checkedRecipes = [];
                }
            })
    }
}*/
// 批量打回
batchRefuse() {
    let ids = this.serializeParams(this.checkedRecipes);
    this.optOrderAuditService.auditBatchRefuse(ids)
        .then(res => {
            if (res.code == 200) {
                this.getOptOrderAudit();
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
        ids.push(recipe.optRecipe.id);
    });

    return ids;
}

/*  serializeParamsRefuse(oArr: any[]) {
        for (let i = 0; i < this.optRecipeList.length; i++) {
            if (this.optRecipeList[i].infos.length == 0) {
                this.infosIds.push(this.optRecipeList[i].optRecipe.id)
            }
        }
        let ids: number[] = [];
        this.checkedRecipes.map(recipe => {
            ids.push(recipe.optRecipe.id);
        });
        ids = ids.filter(e => {
            return this.infosIds.indexOf(e) < 0;
        })
        // console.log(ids);
        return ids;
    } 
*/

//结束审方
endAudit($event: any) {
    // console.log($event)
    if ($event) {
        this.optOrderAuditService.endAudit()
            .then(res => {
                if (res.code == '200') {
                    this.receiveRecipe = false;
                    //clearInterval(this.refreshInterval);
                    //clearInterval(this.beatingInterval);
                }

            })
    }
}

/**
 * 审核结果提示
 */
auditOptions: any = {};


}