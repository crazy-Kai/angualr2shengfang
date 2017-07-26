import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuditSettingService } from './audit-setting.service';
import { TablePlugin } from '../../plugin/ug-table/table.module';   //表格组件

import { PromptComponent } from '../common/prompt/prompt.component';
import { UserService } from '../../user.service';



@Component({
    selector: 'audit-setting',
    templateUrl: 'audit-setting.component.html',
    styleUrls: ['audit-setting.component.css'],
    providers: [AuditSettingService]
})


export class AuditSettingComponent implements OnInit {
    //参数列表
    private auditPlanList: any[] = [];
    //搜索参数变量
    private str: string;
    //当前鼠标所在行
    private touchedTrow: any;
    //表格组件
    @ViewChild(TablePlugin) tablePlugin: TablePlugin;

    constructor(
        private auditSettingService: AuditSettingService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        
    }

    goOrderAudit(category: number) {
        if (category === 1) {
            this.router.navigate(['/page/opt-order-audit'])
        } else if (category === 2) {
            this.router.navigate(['/page/ipt-order-audit'])
        }
    }

    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    deleteAuditPlan(id: string) {
        let that = this;
        this.promptComponent.prompt({
            title: '确认',
            icon: 'question-2.svg',
            tip: '是否确认删除该条审方方案？',
            successCallback(){
                that.auditSettingService.deleteAuditPlan(id)
                    .then(result => {
                        if (result.code == 200) {
                            // that.promptComponent.alert('删除成功！');
                            that.search();
                            return true;
                        } else {
                            return false;
                        }
                    })
            }
        });
        
    }

    getAuditPlanSetting(id: string, category: number) {
        this.auditSettingService.getAuditPlanSetting(id)
            .then(data => {
                if (data.data === true) {
                    if (category === 1) {
                        this.router.navigate(['/page/opt-order-audit'])
                    } else if (category === 2) {
                        this.router.navigate(['/page/ipt-order-audit'])
                    }
                } else {
                    return false;
                }
            })
    }


    //搜索
    search() {
        let query: string = this.recipeListTable.url + (this.str ? ('&str=' + this.str) : '');

        this.tablePlugin.loadDataByUrl(query, true);
    }

    eKeydown($event){
        if( $event.keyCode == 13 ){
            this.search();
        }
    }

    //表格
    recipeListTable: any = {
        title: [{
            id: 'name',
            name: '方案名称',
            width: '30%'
        },
        {
            id: 'category',
            name: '类型',
            width: '10%'
        },
        {
            id: 'userName',
            name: '创建人',
            width: '15%'
        },
        {
            id: 'createdTime',
            name: '创建时间',
            width: '15%'
        },
        {
            id: 'updatedTime',
            name: '修改时间',
            width: '15%'
        },
        {
            name: '操作',
        }
        ],
        pageSize: 20,   //每页20行
        url: '/api/v1/auditPlanList?pageSize={pageSize}&page={currentPage}',
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };


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

    goAuditReview(trow){
        if(this.userService.user['userid'] != trow.userId){
            this.router.navigate(['/page/audit-review', trow.id]);
        }else{
            this.router.navigate(['/page/audit-plan', trow.id]);
        }
    }
}
