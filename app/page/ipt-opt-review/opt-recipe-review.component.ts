import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { RecipeListService } from './recipe-list.service';
import { TablePlugin } from '../../plugin/ug-table/table.module';
import { MusetipsComponent } from '../common/mousetips/mousetips.component';
import { TimeIntervalComponent } from '../common/time-interval/time-interval.component';
import { RecipeSearchParams } from './recipe-search-param';
@Component({
    selector: 'opt-recipe-review',
    templateUrl: 'opt-recipe-review.component.html',
    styleUrls: ['recipe-review.component.css'],
    providers: [RecipeListService]
})
export class OptRecipeReviewComponent implements OnInit {
    //搜索参数变量
    // private searchParams: RecipeSearchParams = new RecipeSearchParams();
    private searchParams: any = {
        startTime: new Date().getTime(),
        endTime: new Date().getTime()
    };
    //参数列表对象
    private deptList: any[] = [];       //已选的科室列表
    private doctorList: any[] = [];
    private drugCategoryList: any[] = [];
    private drugList: any[] = [];
    private auditDoctorList: any[] = [];
    //展开收起全部条件
    fullMode: boolean = true;

    drugClassifyName: string = '';

    //药品名称
    private drugOption: any = {
        placeholder: '请输入药品名称',
        api: '/api/v1/drugList',
        width: '140px',
    };
    // 科室院区
    private activeZone: any[] = [];
    private activeDept: any[] = [];
    zoneId: string;
    deptId: string;
    zoneIdspure: string;        //用于加载选中院区的医生列表
    // 科室组件初始化属性
    private deptOptions: any = {
        isShow: false,
        inputType: 3,
        deviationWidth: 350,
        type: 1
    };
    //医生组件
    private doctorOption: any = {
        placeholder: '请输入药品名称',
        api: '/api/v1/doctorInZone',
        width: '140px',
        variable: {
            key: 'zoneIds',
            value: this.zoneId
        }
    }
    //页码
    private currentPage: any;
    private pagination: any;


    touchedTrow: any;

    @ViewChild(TablePlugin) tablePlugin: TablePlugin;

    constructor(
        private recipeListService: RecipeListService,
        private router: Router
    ) { }



    ngOnInit() {
        this.initSearchParam();
        let getSearchParams = sessionStorage.getItem('searchParams');
    }

    ngAfterViewInit(){
        this.reloadHistory();
    }

    reloadHistory(){
        let historyParam = sessionStorage.getItem('optRecipeReviewSearchParams');
        
        if(historyParam){
            historyParam = JSON.parse(historyParam);

            this.searchParams = historyParam['search'];
            this.deptList = historyParam['deptList'];
            this.pagination = historyParam['pagination'];

            this.transZoneDeptParam();

            sessionStorage.removeItem('optRecipeReviewSearchParams');
        }

        if(this.pagination){
            this.tablePlugin.setPage(this.pagination['currentPage']);
            this.tablePlugin.setPageSize(this.pagination['pageSize']);
        }
        let tempUrl =  this.recipeListTable.url + (this.zoneId ? ('&' + this.zoneId) : '') + (this.deptId ? ('&' + this.deptId) : '');
        for(let attr in this.searchParams){
            if (this.searchParams[attr]) {
                tempUrl += `&${attr}=${this.searchParams[attr]}`;
            }
        }
        this.tablePlugin.loadDataByUrl(tempUrl);
    }
    
    formatUrl(url: string, currentPage: number, pageSize: number){
        let patternCurr = /\{currentPage\}/;
        let patternSize = /\{pageSize\}/;

        if (url) {
            url = url.replace(patternCurr, currentPage + "");
            url = url.replace(patternSize, pageSize + "");
        }
        return url;
    }

    initSearchParam() {
        //加载审方药师
        this.recipeListService.getAuditDoctorList()
            .then(res => {
                if (res && res.length > 0)
                    this.auditDoctorList = res;
            })
    }
    updateSearchTime($event: any) {
        this.searchParams.startTime = $event.startTime || this.searchParams.startTime;
        this.searchParams.endTime = $event.endTime || this.searchParams.endTime;
    }
    //搜索
    search() {
        let query: string = this.recipeListTable.url + (this.zoneId ? ('&' + this.zoneId) : '') + (this.deptId ? ('&' + this.deptId) : '');

        for (let attr in this.searchParams) {
            if (this.searchParams[attr]) {
                if(attr == 'productName'){
                    query += `&${attr}=${encodeURIComponent(this.searchParams[attr])}`;
                }else{
                    query += `&${attr}=${this.searchParams[attr]}`;
                }
            }
        }
        
        this.tablePlugin.loadDataByUrl(query, true);
    }

    recipeListTable: any = {
        title: [{
            name: '',
            width: '5%'
        },
        {
            id: 'zoneName',
            name: '医院',
            width: '10%'
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
            id: 'recipeTime',
            name: '处方时间',
            width: '10%'
        },
        {
            id: 'optRecipeId',
            name: '处方号',
            width: '10%'
        },
        {
            id: 'patientId',
            name: '患者号',
            width: '10%'
        },
        {
            id: 'name',
            name: '姓名',
            width: '10%'
        },
        {
            id: 'sex',
            name: '性别',
            width: '10%'
        },
        {
            id: 'age',
            name: '年龄',
            width: '8%'
        },    
        {
            name: '操作'
        }],
        pageSize: 20,
        url: "/api/v1/opt/all/optRecipeList?pageSize={pageSize}&page={currentPage}",
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };

    /************************ 获取药品分类弹窗 ************************/
    drugCategoryResultList: any[];
    drugCategoryDialogOptions: any;
    @ViewChild('drugCategoryDialog') dialog: any;
    chooseDrug() {
        let choosedDrugsArr = [];
        if (this.drugCategoryResultList) {
            this.drugCategoryResultList.map(item => {
                choosedDrugsArr.push(item);
            });
        }

        this.drugCategoryDialogOptions = {
            mutipleChoose: true,
            // DRUG_ID: '0013921000',
            choosedDrugs: choosedDrugsArr
        }
        this.dialog.show();
    }
    chooseNewCategoryConfirm($event: any) {
        this.drugCategoryResultList = $event;

        let drugClassifyNames = [], drugClassifyIds = [];
        $event.map(item => {
            drugClassifyNames.push(item.name);
            drugClassifyIds.push(item.id);
        });
        this.drugClassifyName = drugClassifyNames.join(',');
        this.searchParams.drugIdArr = drugClassifyIds.join(',');

    }
    /************************ 获取药品分类弹窗结束 ************************/
    drugNameSelect($event) {
        //this.searchParams.drugId = $event.id;
        this.searchParams.productName = $event.name;
    }

    /* 科室选择事件 */
    deptclick($event) {
        this.deptOptions.isShow = !this.deptOptions.isShow;
        $event.stopPropagation();
    }
    fnDeptSelect($event) {
        this.deptList = $event;
        this.transZoneDeptParam();
    }

    fnZoneDeptDelete(type,zoneDept,$event){
        for(let zone of this.deptList){
            if(type == 'zone'){
                if(zone.zoneId == zoneDept.zoneId){
                    this.deptList.splice(this.deptList.indexOf(zone)-1,1);
                }
            }else{
                for(let deptId in zone.idNamePairs){
                    if(deptId == zoneDept.id){
                        delete zone.idNamePairs[deptId];
                    }
                }
            }
        }

        $event.cancelBubble = true;
        this.transZoneDeptParam();
    }

    transZoneDeptParam() {
        let zoneArr = [],
            deptArr = [],
            zoneArrPure = [];
        this.deptList.map(zone => {
            if(zone.checked){
                zoneArrPure.push(zone.zoneId)
                zoneArr.push('zoneId=' + zone.zoneId);
            }else{
                for (let attr in zone.idNamePairs) {
                    deptArr.push('deptId=' + attr);
                }
            }
        })

        this.zoneId = zoneArr.join('&');
        this.deptId = deptArr.join('&');
        this.doctorOption.variable.value = zoneArrPure.join(',');
    }

    trans2Arr(dept) {
        let result = [];
        for (let key in dept) {
            result.push({
                id: key,
                name: dept[key]
            });
        }
        return result;
    }

    doctorSelect($event: any) {
        this.searchParams.doctorName = $event.name;
    }

    goReview(trow) {
        let _param = {
            name: 'optRecipeReviewSearchParams',
            router: '/page/opt-recipe-review',
            searchParam: {
                deptList: this.deptList,
                search: this.searchParams,
                pagination: this.pagination
            }
        }
        sessionStorage.setItem('optRecipeReviewDetails', JSON.stringify(_param));

        this.router.navigate(['/page/opt-recipe-review-details', trow.optRecipeId]);
    }

    //获取表格页码
    getPagination($event: any) {
        // sessionStorage.setItem('onCurrentPage', JSON.stringify($event));
        this.pagination = $event;
    }

    /**
     * 鼠标提示
     * @param event 
     * @param tar => 对应元素
     */
    posInfo: any = {};
    showTips($event: any, tar: any) {
        tar.show = true;
        let pos = $event.target.getBoundingClientRect()
        this.exportTarPos(pos);
    }
    exportTarPos(pos: any) {
        this.posInfo.left = pos.left;
        this.posInfo.top = pos.top;
        this.posInfo.offsetWidth = pos.width;
    }
}