import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertMessageDetailsService } from './alert-message-details.service';
import { AlertMessageDetails } from './alert-message-details';
import { TablePlugin } from '../../plugin/ug-table/table.module';
import { PromptComponent } from '../common/prompt/prompt.component';

@Component({
    selector: 'audit-plan-choose',
    templateUrl: 'alert-message-details.component.html',
    styleUrls: ['alert-message-details.component.css', '../common/popup-add.css'],
    providers: [
                AlertMessageDetails,
                AlertMessageDetailsService
                ]
})

export class AlertMessageDetailsComponent implements OnInit {

    //控制页面序号
    private pathNum: number;
    private msg: Object = {
        drugId: '',    //警示名称
        analysisType: '', //分析类型
        analysisResultType: '',  //提示类型
        severity: '',    //警示等级
        advice: '',    //建议
        message: '',    //警示内容
        messageId: '',
        expertStatus: '',      //警示状态
        applyStatus: '',         //申请状态
        statusIn: '',
        statusOut: '',
        statusRecipe: ''
    };
    //确认按钮
    //private isAgree: boolean = true;
    //待查按钮
    //private isLook: boolean = true;
    //描述按钮
    private isDescribe: boolean = true;

    private param: any;

    private status: any;
    private statusStr: any;

    private remark: any = '';

    private currentApi: string;
    private msgList: any[] = [];
    pageInfo: any = {};

    private window = window;
    private ruleUrl: string = '';

    private searchParams: any;

    //表格组件
    @ViewChild(TablePlugin) tablePlugin: TablePlugin;
    @ViewChild(PromptComponent) promptComponent: PromptComponent;

    constructor(
        private alertMessageDetailsService: AlertMessageDetailsService,
        private router: Router,
        private activeRouter: ActivatedRoute
    ) { }


    //根据URl中的hash值来控制警示信息详情两个界面
    ngOnInit() {
        let path = this.activeRouter.url['value'][0].path;
        switch(path){
            case 'alert-message-details':
                this.pathNum = 0;
                break;
            case 'alert-message-details-person':
                this.pathNum = 1;
                break;
            default:
                break;
        }

        this.param = this.activeRouter.params['value'];
        this.getAlertMessageDetails(this.param.messageId,() => {
            let partApi =  '';
            switch(this.param.auditObject){
                case '1':
                    partApi = 'opt/all/msgOptRecipeList';
                    this.status = this.msg['statusRecipe'];
                    break;
                case '2':
                    partApi = 'opt/all/msgOptPatientList';
                    this.status = this.msg['statusOut'];
                    break;
                case '3':
                    partApi = 'ipt/all/iptMsgPatientList';
                    this.status = this.msg['statusIn'];
                    break;
                default:
                    break;
            }
            switch(this.status){
                case 0:
                    this.statusStr = '未处理';
                    break;
                case 1:
                    this.statusStr = '确认';
                    break;
                case 2:
                    this.statusStr = '待查';
                    break;
                default:
                    this.statusStr = '未知状态';
                    break;
            }
            this.currentApi = '/api/v1/' + partApi;
            this.getMsgList(this.currentApi + '?pageSize=20&page=1');

            this.getRuleUrl();
        });
    }

    getMsgList(Api: string){
        let params = {}; 
        try{
            params = JSON.parse(window.sessionStorage.getItem('alertMsgSearchParams'));
            params['startTime'] = params['startTime'] || params['startDate'];
            params['endTime'] = params['endTime'] || params['endDate'];

            delete params['startDate'];
            delete params['endDate'];
        }catch(e){}

        this.searchParams = params;
        
        for(let attr in params){
            if (params[attr]) {
                Api += `&${attr}=${params[attr]}`;
            }
        }

        Api += '&messageId=' + this.msg['messageId'] + '&drugId=' +(this.param['productId']?this.param['productId']:'');

        this.alertMessageDetailsService.getMsgList(Api)
            .then(res => {
                if(res.code == '200' && res.data){
                    this.pageInfo = new Object();
                    this.pageInfo.currentPage = res.data.currentPage;
                    this.pageInfo.totalPageCount = res.data.pageCount;
                    this.pageInfo.pageSize = res.data.pageSize;
                    this.pageInfo.recordCount = res.data.recordCount;

                    this.msgList = res.data.recordList || [];
                }
            })
    }

    //分页控件交互
    setPage($event: any){
        this.pageInfo.currentPage = $event;
        this.getMsgWithPageInfo(this.pageInfo);
    }
    setPageSize($event: any){
        this.pageInfo.pageSize = $event;
        this.getMsgWithPageInfo(this.pageInfo);
    }
    getMsgWithPageInfo(pageInfo: any){
        let tempUrl = "";
        tempUrl = this.currentApi + '?pageSize=' + this.pageInfo.pageSize + '&page=' + this.pageInfo.currentPage;
        this.getMsgList(tempUrl);
    }

    getAlertMessageDetails(id: number, success: any) {
        this.alertMessageDetailsService.getIptPatientMsgList(id)
            .then(res => {
                this.msg = res.data;

                success();
            });
    }

    alertMssageStatus(status){
        let param = {
            messageId: new Number(this.msg['messageId']),
            status: status
        };
        this.alertMessageDetailsService.alertMssageStatus(param)
        .then(res => {
            if(res.code == 200){
                this.msg['applyStatus'] = status;
                this.promptComponent.alert('申请操作成功!');
                return;
            }
            if(res.message){
                this.promptComponent.alert(res.message);
            }
        });
    }

    goRecipeDetail(trow){
        let _param = {
            name: 'alertMsgSearchParams',
            router: `/page/alert-message-details/${this.param.messageId}/${this.param.auditObject}/`+(this.param.productId?this.param.productId:''),
            searchParam: this.searchParams
        }
        sessionStorage.setItem((this.param.auditObject!='3'?'optRecipeReviewDetails':'iptRecipeReviewDetails'),JSON.stringify(_param));

        this.router.navigate([this.param.auditObject!='3'?'/page/opt-recipe-review-details':'/page/ipt-recipe-review-details', this.param.auditObject!='3'?trow.optRecipeId:trow.runEngineId]);
    }

    describe(){
        let param = {
            messageId: this.msg['messageId'],
            // applyType: this.msg['applyType']
            applyType: 3
        };
        this.alertMessageDetailsService.openAlertMsgDpRemark(param)
        .then(res => {
            if(res.code == 200){
                this.isDescribe = false;
            }else{
                if(res.message){
                    this.promptComponent.alert(res.message);
                }
            }
        });
    }
    
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

    saveDescribe(remark){
        if(remark.length > 256){
            this.promptComponent.alert('描述内容最多256个字符！');
            return;
        }

        let param = {
            messageId: this.msg['messageId'],
            // applyType: this.msg['applyType'],
            applyType: 3,
            remark: remark
        };
        this.alertMessageDetailsService.alertMsgDpRemark(param)
        .then(res => {
            if(res.message){
                this.promptComponent.alert(res.message);
            }
            if(res.code == 200){
                this.isDescribe = true;
                this.msg['remark'] = remark;
            }
        });
    }

    getRuleUrl(){
        this.alertMessageDetailsService.checkRule()
        .then(res => {
            if(res.code == 200){
                this.ruleUrl = res.data+'?messageId='+this.msg['messageId']+'&token='+res.token;
            }else{
                this.promptComponent.alert(res.message);
            }
        });
    }

    backToList(){
        this.router.navigate(['/page/alert-message',true]);
    }
}
