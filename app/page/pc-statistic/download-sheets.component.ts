import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MusetipsComponent } from '../common/mousetips/mousetips.component';
import { PaginationComponent } from '../common/pagination/pagination.component';

import { AnalysisService } from './analysis.service';
class SearchParams{
    page: number = 1;
    pageSize: number = 20;
}

@Component({
    selector: 'download-sheets',
    templateUrl: 'download-sheets.component.html',
    styleUrls: [ 'pharmacists-statistic.component.css', '../common/popup-add.css' ],
    providers: [ AnalysisService ]
})
export class DownloadSheetsComponent implements OnInit{
    private projectId: string | number;
    private reportList: any[] = [];
    private auditOptions: any = {};
    private searchParams: SearchParams = new SearchParams();
    posInfo: any = {};
    private pageInfo: any = {};
    titles: any[] = [
        {title: '样本数量', sortBy: 'pres_number', tips: '药师审查的处方数量，即药师审核通过或打回操作的处方，同一张多次审核算一张'},
        {title: '审核合理数量', sortBy: 'order_number', tips: '药师审查的医嘱数量，即药师做过通过或打回操作的医嘱，同一份医嘱多次审核算1张'},
        {title: '审核不合理数量', sortBy: 'review_number', tips: '药师通过或打回操作的次数，同一张处方或医嘱多次审核算多张'},
        {title: '审核合格率', sortBy: 'gy_number', tips: '药师打回的次数，同一张处方或医嘱多次打回算多次'}
    ]

    private downloadWin: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private analysisService: AnalysisService
    ) {}

    ngOnInit(){
        this.route.params.subscribe(params => {
            if(params['projectId']){
                this.projectId = params['projectId'];
            }
        });
        this.getReportList(this.projectId);
    }

    //获取药师工作统计列表
    getReportList(projectId: string | number){
        if(!projectId){
            console.log('error: 缺少必要参数！');
            return;
        }
        let query: string = "?projectId=" + projectId;
        for(let attr in this.searchParams){
            if (this.searchParams[attr]) {
				query += `&${attr}=${this.searchParams[attr]}`;
			}
        }

        this.analysisService.getReportList(query)
            .then(res => {
                if(res.code == 200){
                    if(res.data && res.data.recordList) this.reportList = res.data.recordList;
                    this.pageInfo = {};
                    this.pageInfo.currentPage = res.data.currentPage;
                    this.pageInfo.totalPageCount = res.data.pageCount;
                    this.pageInfo.pageSize = res.data.pageSize;
                    this.pageInfo.recordCount = res.data.recordCount;
                }
            })
    }
    //排序
    reloadByOrder(sortByObj: any, order: string){
        //TODO--接口暂时未实现排序接口
        return;
    }

    //导出报表
    exportExcel(){
        this.analysisService.exportSheet(this.projectId)
            .then(res => {
                if(res.code == '200'){
                    this.auditOptions.show = true;
                    this.auditOptions.string = '导出成功，请到下载列表下载！';
                    setTimeout(() => {
                        this.auditOptions.show = false;
                        this.auditOptions.string = "";
                    }, 3000);
                }
            })
    }
    //获取显示下载列表
    exportList(){
        this.downloadWin = true;
    }


    //分页控件交互
    setPage($event: any){
        this.searchParams.page = $event;
        this.getReportList(this.projectId);
    }
    setPageSize($event: any){
        this.searchParams.pageSize = $event;
        this.getReportList(this.projectId);
    }
    //鼠标提示
    // showTips($event: any, tar: any){
    //     tar.show = true;
    //     let pos = $event.target.getBoundingClientRect()
    //     this.exportTarPos(pos);
    // }
    // hideTips(tar: any){
    //     tar.show = false;
    // }
    // exportTarPos(pos: any){
    //     this.posInfo.left = pos.left;
    //     this.posInfo.top = pos.top;
    //     this.posInfo.offsetWidth = pos.width;
    // }
}