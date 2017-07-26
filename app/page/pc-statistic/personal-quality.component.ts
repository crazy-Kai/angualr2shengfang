import { Component, OnInit, ViewChild }      from '@angular/core';
import { Router } from '@angular/router';

import { TablePlugin } from '../../plugin/ug-table/table.module';
import { AnalysisService } from './analysis.service';
import { ProjectService } from './project.service';
import { MultiChoosenComponent } from '../common/multi-choosen/multi-choosen.component';
class SearchParams{
    startTime: number = new Date().getTime() - 7 * 24 * 3600 * 1000;
    endTime: number = new Date().getTime();
    checkPeopleId: string[];
    source: string = '0';
    page: number = 1;
    pageSize: number = 20;
}

@Component({
    selector: 'personal-quality',
    templateUrl: 'personal-quality.component.html',
    styleUrls: [ 'quality-evaluate.component.css' ],
    providers: [ AnalysisService ]
})
export class PersonalQualityComponent implements OnInit{
    @ViewChild('iptTable') iptTable: TablePlugin;
    @ViewChild('optTable') optTable: TablePlugin;
    @ViewChild('checkPeople') auditChoose: MultiChoosenComponent;
    private auditDoctorList: any[];             //药师列表
    private searchParams: SearchParams = new SearchParams();
    private isInit: boolean = true;
    /**
     * 多选组件参数
     */
    private multiDataOpt: any = {
        api: '/api/v1/auditDoctorList'
    }
    constructor(
        private router: Router,
        private analysisService: AnalysisService,
        private projectService: ProjectService
    ){}

    ngOnInit(){
        if(this.projectService.routeType == 'back' && this.projectService.personalResultParam){
            this.isInit = false;
            this.searchParams = this.projectService.personalResultParam;
            this.auditChoose.initList(this.searchParams.checkPeopleId);
            this.projectService.routeType = undefined;
        }
    }

    ngAfterViewInit(){
        if(this.searchParams.source == '3'){
            this.iptTable.setPage(this.searchParams.page);
            this.iptTable.setPageSize(this.searchParams.pageSize);
        }else{
            this.optTable.setPage(this.searchParams.page);
            this.optTable.setPageSize(this.searchParams.pageSize);
        }
            
        this.search(this.isInit);
    }
    
    search(isSearch?: boolean){
        if(!this.searchParams.source){
            alert('必须选择一个来源！');
            return;
        }
        
        let query: string = '', url: string;
        for(let attr in this.searchParams){
            if(this.searchParams[attr] && attr != 'page' && attr != 'pageSize'){
                if(typeof(this.searchParams[attr]) != 'string' && typeof(this.searchParams[attr]) != 'number'){
                    for(let _id of this.searchParams[attr]){
                        query += `&${attr}=${_id}`;
                    }
                }else{
                    query += `&${attr}=${this.searchParams[attr]}`;
                }
            }
        }
        
        if(this.searchParams.source == '3'){
            url = '/api/v1/analysis/ipt/reviewResultList?pageSize={pageSize}&page={currentPage}' + query;
            this.iptTable.loadDataByUrl(url, isSearch);
        }else{
            url = '/api/v1/analysis/opt/reviewResultList?pageSize={pageSize}&page={currentPage}' + query;
            this.optTable.loadDataByUrl(url, isSearch);
        }
    }

    personalIptTable: any = {
        title: [
        {
            id: 'zoneName',
            name: '医院',
            width: '20%'
        },
        {
            id: 'areaName',
            name: '病区',
            width: '10%'
        },
        {
            id: 'deptName',
            name: '科室',
            width: '10%'
        },
        {
            id: 'checkPeopleName',
            name: '评价人',
            width: '10%'
        },
        {
            id: 'checkTime',
            name: '评价时间',
            width: '20%'
        },
        {
            id: 'patientId',
            name: '患者号',
            width: '10%'
        },
        {
            id: 'checkResult',
            name: '评价结果',
            width: '10%'
        },    
        {
            name: '操作'
        }],
        pageSize: 20,
        //url: "/api/v1/analysis/opt/reviewResultList?pageSize={pageSize}&page={currentPage}",
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };
    personalOptTable: any = {
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
            id: 'areaName',
            name: '医生',
            width: '10%'
        },
        {
            id: 'checkPeopleName',
            name: '评价人',
            width: '10%'
        },
        {
            id: 'checkTime',
            name: '评价时间',
            width: '20%'
        },
        {
            id: 'patientId',
            name: '患者号',
            width: '10%'
        },
        {
            id: 'checkResult',
            name: '评价结果',
            width: '10%'
        },    
        {
            name: '操作'
        }],
        pageSize: 20,
        //url: "/api/v1/analysis/opt/reviewResultList?pageSize={pageSize}&page={currentPage}",
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };

    reviewRecipe($event: any){
        this.projectService.personalResultParam = this.searchParams;
        if(this.searchParams.source == '3'){
            this.router.navigate(['page/ipt-quality-evaluate', $event.engineId, 'read', $event.checkPeopleId]);
        }else{
            this.router.navigate(['page/opt-quality-evaluate', $event.optRecipeId, 'read', $event.checkPeopleId]);
        }
    }
    /**
     * table 交互
     */
    //获取表格页码
    getPagination($event: any) {
        this.searchParams.page = $event.currentPage;
        this.searchParams.pageSize = $event.pageSize;
    }
    /**
     * 时间组件交互方法
     */
    updateSearchTime($event: any){
        if($event.startTime)
            this.searchParams.startTime = parseInt($event.startTime);
        if($event.endTime)
            this.searchParams.endTime = parseInt($event.endTime);
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
        this.searchParams.checkPeopleId = ids;
    }
}