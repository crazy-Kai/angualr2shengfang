import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TablePlugin } from '../../plugin/ug-table/table.module';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { PromptComponent } from '../common/prompt/prompt.component';
import { MultiChoosenComponent } from '../common/multi-choosen/multi-choosen.component';

import { UserService } from '../../user.service';
import { AnalysisService } from './analysis.service';
import { ProjectService } from './project.service';
class ExtractParams {
    startTime: number = new Date().getTime() - 7 * 24 * 3600 * 1000;
    endTime: number = new Date().getTime();
    auditIdList: any[];
    source: string = '0';
    type: string = '1';
    randomNum: number | string;
    resultPercentage: number | string;
}
class ExtractResultParams {
    page: number | string = 1;
    pageSize: number | string = 20;
    start: number | string;
    checkStatus: number | string;
    projectId: number | string;
}

@Component({
    selector: 'review-project',
    templateUrl: 'review-project.component.html',
    styleUrls: [ 'quality-evaluate.component.css' ],
    providers: [ AnalysisService ]
})
export class ReviewProjectComponent implements OnInit{
    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    @ViewChild('iptTable') iptTable: TablePlugin;
    @ViewChild('optTable') optTable: TablePlugin;
    @ViewChild('audit') auditChoose: MultiChoosenComponent;
    private projectId: string | number;
    private user: any;
    private qualified: boolean;     //条件权限
    private authority: boolean;     //用户权限
    private isInit: boolean = true;
    private initialed: boolean;
    private forbidEditParam: boolean = false;
    private auditDoctorList: any[];             //药师列表
    private extractParams: ExtractParams = new ExtractParams();
    private curExtratedParams: any;          //当前抽取的条件，用于保存项目
    private extractResultParams: ExtractResultParams = new ExtractResultParams();
    private extractType: string;    //抽取类型 3 => 住院， 1 => 门/急诊 

    private checkedNum: number = 0; //已复核条数
    private totalNum: number = 0;   //抽取的条数
    private tabelType: number = 1;  //门诊 1， 住院 2

    private savePro: boolean = false;
    private projectName: string;
    private warningMsg: string;     //保存失败的提示信息
    private tipsOptions: any = {
        icon: 'success'
    };
    private exportSheet: boolean = false;
    
    /**
     * 多选组件参数
     */
    private multiDataOpt: any = {
        api: '/api/v1/auditDoctorList',
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private analysisService: AnalysisService,
        private projectService: ProjectService
    ){}

    ngOnInit(){
        this.user = this.userService.user;
        this.route.params.subscribe(params => {
            if(params['projectId'] && params['projectId'] != 'new'){
                this.projectId = params['projectId'];
                this.initComponent();
            }else{
                this.authority = true;
                if(this.projectService.project){
                    this.isInit = false;
                }else{
                    this.projectService.project = {};
                }
            }
        });
    }

    //操作权限
    getAuthority(projectId: string | number){
        this.analysisService.getAuthority(projectId)
            .then(res => {
                if(res.code == '200'){
                    this.authority = res.data;
                }
            })
    }

    ngAfterViewInit(){
        if(!this.isInit){
            if(this.projectId){
                this.reloadHistory();
            }else{
                this.initWithoutId();
            }
        }
            
    }
    initWithoutId(){
        if(this.projectService.project.extractParams)
            this.extractParams = this.projectService.project.extractParams;
        if(this.projectService.project.extractResultParams)
            this.extractResultParams = this.projectService.project.extractResultParams;
        if(this.projectService.project.totalNum)
            this.totalNum = this.projectService.project.totalNum;
        this.auditChoose.initList(this.extractParams.auditIdList);
        //this.getAlreadyCheckNum(this.extractParams.source);
        this.reloadHistory();
    }
    initComponent(){
        this.forbidEditParam = true;
        this.getAuthority(this.projectId);
        if(this.projectService.project && this.projectService.project.projectId == this.projectId){
            this.isInit = false;
            if(this.projectService.project.extractParams)
                this.extractParams = this.projectService.project.extractParams;
            if(this.projectService.project.extractResultParams)
                this.extractResultParams = this.projectService.project.extractResultParams;
            if(this.projectService.project.totalNum)
                this.totalNum = this.projectService.project.totalNum;
            this.auditChoose.initList(this.extractParams.auditIdList);
            //this.getAlreadyCheckNum(this.extractParams.source);
            //this.reloadHistory();
            return;
        }
        this.projectService.project = {};
        this.projectService.project.projectId = this.projectId;
        this.extractResultParams.projectId = this.projectId;
        this.getCheckResultQuery(this.projectId);
    }

    reloadHistory(){
        if(this.extractParams.source == '3'){
            if(this.extractResultParams){
                this.iptTable.setPage(this.extractResultParams.page);
                this.iptTable.setPageSize(this.extractResultParams.pageSize);
            }
        }else{
            if(this.extractResultParams){
                this.optTable.setPage(this.extractResultParams.page);
                this.optTable.setPageSize(this.extractResultParams.pageSize);
            }
        }
        this.getAlreadyCheckNum(this.extractParams.source);
        this.getWorkStatistics();
    }
    /**
     * 获取项目的搜索条件
     * @param projectId 
     */
    getCheckResultQuery(projectId: string | number){
        this.analysisService.getCheckResultQuery(projectId)
            .then(res => {
                if(res.code == '200'){
                    this.extractParams = res.data ? res.data : this.extractParams;
                    this.projectService.project.extractParams = this.extractParams;
                    this.auditChoose.initList(this.extractParams.auditIdList);
                }
                this.getTotalNum(this.extractParams.source)
            })
    }
    /**
     * 抽取
     */
    changeType(type: string){
        this.extractParams.type = type;
        //清楚原来的数据
        this.extractParams.resultPercentage = undefined;
        this.extractParams.randomNum = undefined;
    }
    getCheckList(){
        if(!this.extractParams.source){
            this.promptComponent.alert('必须选择一个来源！');
            return;
        }
        
        if(this.extractParams && this.extractParams.type == '2'){
            if(!this.extractParams.resultPercentage){
                this.promptComponent.alert('请输入要抽取的百分比！');
                return;
            }
        }

        if(this.extractParams && this.extractParams.type == '3'){
            if(!this.extractParams.randomNum){
                this.promptComponent.alert('请输入要抽取的随机数！');
                return;
            }else{
                if(!/^\+?[1-9][0-9]*$/.test(this.extractParams.randomNum.toString())){
                    this.promptComponent.alert('随机数必须为正整数！');
                    return;
                }
            }
        }

        this.extractType = this.extractParams.source == '3' ? '3' : '1';
        
        this.analysisService.getCheckList(this.extractParams.source, this.extractParams)
            .then(res => {
                if(res.code == '200'){
                    this.curExtratedParams = {};
                    for(let attr in this.extractParams){
                        this.curExtratedParams[attr] = this.extractParams[attr];
                    }
                    //重新抽取后，projectId重置
                    this.projectId = undefined;
                    sessionStorage.removeItem('projectId');
                    this.projectService.project.projectId = undefined;
                    
                    this.projectService.project.extractParams = this.extractParams;
                    this.totalNum = res.data ? res.data : 0;
                    this.projectService.project.totalNum = this.totalNum;
                    this.getAlreadyCheckNum(this.extractParams.source);
                    this.getWorkStatistics(true);
                }
            })
    }
    //
    getTotalNum(type: string | number){
        this.analysisService.getTotalNum(type, this.projectId)
            .then(res => {
                console.log(res)
                if(res.code == '200'){
                    this.totalNum = res.data ? res.data : 0;
                    this.projectService.project.totalNum = this.totalNum;
                }
                this.getAlreadyCheckNum(this.extractParams.source);
                this.getWorkStatistics(true);
            })
    }
    //获取已复核的信息
    getAlreadyCheckNum(type: string | number){
        this.analysisService.getAlreadyCheckNum(type)
            .then(res => {
                console.log(res)
                if(res.code == '200'){
                    this.checkedNum = res.data ? res.data : 0;
                    this.initialed = true;
                }
            })
    }
    //获取列表
    getWorkStatistics(isSearch?: boolean){
        let query: string;
        this.projectService.project.extractResultParams = this.extractResultParams;
        
        if(this.extractType == '3' || (!this.extractType && this.extractParams.source == '3')){
            this.tabelType = 2;
            query = '/api/v1/analysis/ipt/getIptCheckData?pageSize={pageSize}&page={currentPage}';

            for(let attr in this.extractResultParams){
                if(this.extractResultParams[attr] && attr != 'page' && attr != 'pageSize')
                    query += `&${attr}=${this.extractResultParams[attr]}`
            }

            this.iptTable.loadDataByUrl(query, isSearch);
        }else if(this.extractType == '1' || (!this.extractType && this.extractParams.source != '3')){
            this.tabelType = 1;
            query = '/api/v1/analysis/opt/getCheckResultList?pageSize={pageSize}&page={currentPage}';

            for(let attr in this.extractResultParams){
                if(this.extractResultParams[attr] && attr != 'page' && attr != 'pageSize')
                    query += `&${attr}=${this.extractResultParams[attr]}`
            }

            this.optTable.loadDataByUrl(query, isSearch);   
        }
    }
    /**
     * 表单
     */
    resolveData($event: any){
        if($event.data && $event.data.recordCount > 0){
            this.qualified = true;
        }else{
            this.qualified = false;
        }
    }
    projectIptTable: any = {
        title: [
        {
            id: 'zoneName',
            name: '医院',
            width: '20%'
        },
        {
            id: 'inWardName',
            name: '病区',
            width: '10%'
        },
        {
            id: 'deptName',
            name: '科室',
            width: '10%'
        },
        {
            id: 'auditDoctorName',
            name: '审方药师',
            width: '10%'
        },
        {
            id: 'auditTime',
            name: '药师审核时间',
            width: '10%'
        },
        {
            id: 'patientId',
            name: '患者号',
            width: '10%'
        },
        {
            id: 'name',
            name: '患者姓名',
            width: '10%'
        },
        {
            id: 'checkStatus',
            name: '状态',
            width: '10%'
        },    
        {
            name: '操作'
        }],
        pageSize: 20,
        //url: "/api/v1/analysis/opt/getCheckResultList?pageSize={pageSize}&page={currentPage}",
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };

    projectOptTable: any = {
        title: [
        {
            id: 'zoneName',
            name: '医院',
            width: '20%'
        },
        {
            id: 'deptName',
            name: '科室',
            width: '10%'
        },
        {
            id: 'recipeDocName',
            name: '医生',
            width: '10%'
        },
        {
            id: 'auditDoctorName',
            name: '审方药师',
            width: '10%'
        },
        {
            id: 'auditTime',
            name: '药师审核时间',
            width: '10%'
        },
        {
            id: 'patientId',
            name: '患者号',
            width: '10%'
        },
        {
            id: 'name',
            name: '患者姓名',
            width: '10%'
        },
        {
            id: 'checkStatus',
            name: '状态',
            width: '10%'
        },    
        {
            name: '操作'
        }],
        pageSize: 20,
        //url: "/api/v1/analysis/opt/getCheckResultList?pageSize={pageSize}&page={currentPage}",
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };

    goEvaluate($event: any){
        if(this.extractParams.source == '3'){
            this.router.navigate(['page/ipt-quality-evaluate', $event.engineId, 'edit', '']);
        }else{
            this.router.navigate(['page/opt-quality-evaluate', $event.optRecipeId, 'edit', '']);
        }
    }
    /**
     * 保存项目和生成报表
     */
    startSaveProcess(){
        this.warningMsg = undefined;
        this.savePro = true;
        this.projectName = this.setDateString() + this.user.username;
    }
    saveProject(){
        this.curExtratedParams = this.curExtratedParams || this.extractParams;
        this.analysisService.saveProject(this.projectName, this.curExtratedParams)
            .then(res => {
                if(res.code == '200'){
                    this.projectId = res.data;
                    sessionStorage.setItem('projectId', JSON.stringify(this.projectId));
                    this.projectService.project.projectId = this.projectId;
                    this.extractParams = this.curExtratedParams;            //将页面展示的抽取条件设置回抽取时的条件
                    this.forbidEditParam = true;                            //设置条件不可编辑

                    this.extractResultParams.projectId = this.projectId;
                    this.tipsOptions.string = '保存成功';
                    this.tipsOptions.icon = 'success';
                    
                    this.warningMsg = undefined;
                    this.savePro = false;
                    this.tipsOptions.show = true;
                    
                    setTimeout(() => {
                        this.tipsOptions.show = false;
                        this.tipsOptions.string = "";
                    }, 3000);
                }else{
                    // this.tipsOptions.string = '保存失败，请重试。';
                    // this.tipsOptions.icon = 'fail';
                    this.warningMsg = res.message;
                    this.promptComponent.alert(res.message);
                }
            })
    }
    //生成报表
    startExport(){
        if(this.totalNum == this.checkedNum){
            this.createProSheet();
            return;
        }
        let that = this;
        this.promptComponent.prompt({
            title: '确认',
            icon: 'question-2.svg',
            tip: '当前有'+ (this.totalNum - this.checkedNum) +'条未复核，确定要生成报表？',
            otherTip: '未复核的处方或医嘱将会标记为合理。',
            successCallback(){
                that.createProSheet();
            }
        });
    }
    createProSheet(){
        if(!this.projectId) {
            console.log('error: 需要项目ID。');
            return;
        }
        let type = this.extractType || this.extractParams.source;
        this.analysisService.createSheet(this.projectId, type)
            .then(res => {
                if(res.code == '200'){
                    this.tipsOptions.string = '导出报表成功';
                    this.tipsOptions.icon = 'success';
                    this.reloadHistory();
                }else{
                    this.tipsOptions.string = '导出报表失败，请重试。';
                    this.tipsOptions.icon = 'fail';
                }
                this.exportSheet = false;
                this.tipsOptions.show = true;
                
                setTimeout(() => {
                    this.tipsOptions.show = false;
                    this.tipsOptions.string = "";
                }, 3000);
            })
    }
    private setDateString(){
        let curDate = new Date();
        return curDate.getFullYear() + this.fixTimeType(curDate.getMonth() + 1) + this.fixTimeType(curDate.getDate()) + this.fixTimeType(curDate.getHours()) + this.fixTimeType(curDate.getMinutes());
    }
    private fixTimeType(time: number){
        return time < 10 ? '0' + time : time.toString();
    }

    //返回列表
    backToList(){
        this.router.navigate(['page/quality-evaluat']);
    }
    /**
     * table 交互
     */
    //获取表格页码
    getPagination($event: any) {
        this.extractResultParams.page = $event.currentPage;
        this.extractResultParams.pageSize = $event.pageSize;
    }
    /**
     * 时间组件交互方法
     */
    updateSearchTime($event: any){
        if($event.startTime)
            this.extractParams.startTime = parseInt($event.startTime);
        if($event.endTime)
            this.extractParams.endTime = parseInt($event.endTime);
    }
    /**
     * 药师组件交互方法
     */
    getPharmacists($event: any){
        let ids = [];
        if($event && $event.length > 0){
            $event.forEach(element => {
                ids.push(element.id);
            });
        }
        this.extractParams.auditIdList = ids;
    }
}