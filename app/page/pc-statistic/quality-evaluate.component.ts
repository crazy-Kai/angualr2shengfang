import { Component, OnInit, ViewChild }      from '@angular/core';
import { Router } from '@angular/router';

import { PaginationComponent } from '../common/pagination/pagination.component';
import { PromptComponent } from '../common/prompt/prompt.component';

import { AnalysisService } from './analysis.service';
import { ProjectService } from './project.service';
import { UserService } from '../../user.service';
@Component({
    selector: 'quality-evaluate',
    templateUrl: 'quality-evaluate.component.html',
    styleUrls: [ 'quality-evaluate.component.css' ],
    providers: [ AnalysisService ]
})
export class QualityEvaluateComponnet implements OnInit{
    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    private user: any;
    private _math: any = Math;
    private proList: any[] = [];
    private searchParams: any = {   //参数列表
        page: 1,
        pageSize: 20
    };  
    private pageInfo: any = {};
    constructor(
        private router: Router,
        private analysisService: AnalysisService,
        private projectService: ProjectService,
        private userService: UserService,
    ){}

    ngOnInit(){
        this.user = this.userService.user;
        this.getProjectList();
        this.projectService.project = null;
    }

    getProjectList(){
        let query: string = "";
        
        for(let attr in this.searchParams){
            if (this.searchParams[attr]) {
				query += query ? `&${attr}=${this.searchParams[attr]}` : `?${attr}=${this.searchParams[attr]}`;
			}
        }
        
        this.analysisService.getProjectList(query)
            .then(res => {
                if(res.code == 200){
                    if(res.data && res.data.recordList) this.proList = res.data.recordList;
                    this.pageInfo = {};
                    this.pageInfo.currentPage = res.data.currentPage;
                    this.pageInfo.totalPageCount = res.data.pageCount;
                    this.pageInfo.pageSize = res.data.pageSize;
                    this.pageInfo.recordCount = res.data.recordCount;
                }
            })
    }
    createProject(){
        sessionStorage.removeItem('projectId');
        this.router.navigate(['/page/review-project', 'new']);
    }
    goProject(proItme: any){
        sessionStorage.setItem('projectId', JSON.stringify(proItme.id));
        this.router.navigate(['/page/review-project', proItme.id]); 
    }
    goExportSheet(proItme: any){
        this.router.navigate(['page/export-sheets', proItme.id]);
    }
    deletProject(proItem: any){
        let that = this;
        this.promptComponent.prompt({
            title: '确认',
            icon: 'question-2.svg',
            tip: '你确定要删除该项目吗？',
            otherTip: '删除后，项目将无法通过任何途径恢复。',
            successCallback(){
                that.analysisService.deleteProject(proItem.id, proItem.projectSource)
                    .then(res => {
                        if(res.code == '200'){
                            that.getProjectList();
                        }
                    });
            }
        });
        
    }

    //分页控件交互
    setPage($event: any){
        this.searchParams.page = $event;
        this.getProjectList();
    }
    setPageSize($event: any){
        this.searchParams.pageSize = $event;
        this.getProjectList();
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
}