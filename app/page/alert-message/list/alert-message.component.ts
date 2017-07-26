import { Component, ViewChild, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TablePlugin } from '../../../plugin/ug-table/table.module';
import { TimeIntervalComponent } from '../../common/time-interval/time-interval.component';
import { ZoneDeptWrapComponent } from '../../common/zone-dept/zone-dept-wrap/zone-dept-wrap.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { PromptComponent } from '../../common/prompt/prompt.component';
import { AuditPlanDoctorComponent } from '../../common/audit-plan-doctor/audit-plan-doctor.component';

@Component({
    selector: 'alert-message',
    templateUrl: 'alert-message.component.html',
    styleUrls: ['alert-message.component.css', '../../common/popup-add.css']
})

export class AlertMessageComponent implements OnInit {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private drugCategoryResultList: any[];
    //展开收起全部条件
    private fullMode: boolean = true;
    //控制具体哪个页面
    private pathNum: number;
    // 自动填充－医生
    // private doctorOption: any = {
    //     placeholder: '请输入医生名称',
    //     api: '/api/v1/doctorInZone'
    // };
    // 自动填充－药品名称
    // private drugOption: any = {
    //     placeholder: '请输入药品名称',
    //     api: '/api/v1/drugList'
    // };
    // 科室院区
    private activeZone: any[] = [];
    private activeDept: any[] = [];
    // 分析类型，提示类型－提示类型从分析类型children取
    private analysisTypeOption: any = {
        width: '80%',
        api: '/api/v1/analysisType'
    };
    // 提示类型
    private analysisResultTypeList: any[] = [];
    // 查询条件封装对象
    private searchParams: any = {
        startDate: new Date().getTime() - 7 * 24 * 3600 * 1000,               //开始时间
        endDate: new Date().getTime(),                 //结束时间
        auditObject: '1',            //审核对象
        recipeSource: '',           //来源
        drugIds: '',                  //药品分类
        productName: '',              //药品名称
        zoneId: '',                   //院区
        deptId: '',                   //科室
        wardId: '',                   //科室
        analysisType: '',            //分析类型
        analysisResultType: '',      //提示类型
        doctorId: '',                 //医生
        severitySymbol: '',          //警示信息类型
        severity: '',                //警示等级
        messageStatus: '',           //警示状态
        userAppliedStatus: ''        //申请状态
    };
    // 分页相关
    private pageSize: number = 20;
    private currentPage: number = 0;
    private downloadWin: boolean = false;
    private downloadList: any[] = [];
    private dataListUrl: string = "/api/v1/medicationinfo?pageSize={pageSize}&page={currentPage}";
    private helpApi: string = "/api/v1/getInsttips";
    private helpUrl: string = '';
    // 科室组件初始化属性
    private deptOptions: any = {
        isShow: false,
        inputType: 3,
        deviationWidth: 200,
        type: this.searchParams.auditObject == 3 ? 2 : 1
    };
    private deptList: any[] = [];
    private docName: string = '';
    private iptWardList: any[] = [];
    private iptWardStr: string = '';
    private window = window;
    private auditOptions: any = {};

    @ViewChild(TablePlugin) tablePlugin: TablePlugin;
    @ViewChild(PromptComponent) promptComponent: PromptComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: Http
    ) { }

    // 根据url中hash值去控制警示信息管理三个界面
    ngOnInit() {
        let path = this.route.url['value'][0].path;
        switch (path) {
            case 'alert-message':
                this.pathNum = 0;
                break;
            case 'alert-message-person':
                this.pathNum = 1;
                break;
            case 'alert-message-master':
                this.pathNum = 2;
                break;
            default:
                break;
        }

        this.forHelp();
    }

    // 搜索
    search() {
        let query = this.packQueryStr();

        this.tablePlugin.loadDataByUrl(query, true);
    }

    packQueryStr() {
        let query: string = this.dataListUrl;

        let params = {};
        try {
            let paramStr = window.sessionStorage.getItem('alertMsgSearchParams');
            if (paramStr) {
                params = JSON.parse(paramStr);

                this.searchParams = params['search'];
                this.deptList = params['deptList']

                this.coloctZoneDept();

                delete sessionStorage['alertMsgSearchParams'];
            }
        } catch (e) { }

        // for (let attr in params) {
        //     if (params[attr]) {
        //         this.searchParams[attr] = params[attr];
        //     }
        // }

        for (let attr in this.searchParams) {
            if (this.searchParams[attr]) {
                if (attr == 'deptId' || attr == 'zoneId' || attr == 'wardId') {
                    let arr = this.searchParams[attr].split(',');
                    for (let item of arr) {
                        query += `&${attr}=${item}`;
                    }
                } else {
                    query += `&${attr}=${this.searchParams[attr]}`;
                }
            }
        }

        return query;
    }

    // 列表信息
    AMListTable: any = {
        title: [{
            id: 'hisDrugName',
            name: '药品名称',
            width: '15%'
        },
        {
            id: 'analysisResultType',
            name: '提示类型',
            width: '10%'
        },
        {
            id: 'severity',
            name: '警示等级',
            width: '7%'
        },
        {
            id: 'type',
            name: '警示内容',
        },
        {
            id: 'messageStatus',
            name: '警示状态',
            width: '10%'
        },
        {
            id: 'userAppliedStatus',
            name: '申请状态',
            width: '10%'

        },
        {
            id: 'count',
            name: '数量',
            width: '7%'
        },
        {
            name: '操作',
            width: '8%'
        }],
        pageSize: 20,
        url: this.packQueryStr(),
        dataListPath: "recordList",
        itemCountPath: "recordCount"
    };

    updateSearchTime($event) {
        this.searchParams.startDate = $event.startTime || this.searchParams.startDate;
        this.searchParams.endDate = $event.endTime || this.searchParams.endDate;
    }

    // 获取药品分类弹窗
    drugCategoryDialogOptions: any;
    @ViewChild('drugCategoryDialog') dialog: any;
    chooseDrug() {
        this.drugCategoryDialogOptions = {
            mutipleChoose: true,
            // DRUG_ID: '0013921000'
        }
        this.dialog.show();
    }
    chooseNewCategoryConfirm($event: any) {
        this.drugCategoryResultList = $event;
        this.collectType();
    }
    // 药品删除事件
    drugCategoryResultDelete($event, id) {
        this.drugCategoryResultList = this.drugCategoryResultList.filter(function (item) {
            return item.id != id;
        });

        this.collectType();
        $event.stopPropagation();
    }
    collectType() {
        let result = [];
        for (let drug of this.drugCategoryResultList) {
            result.push(drug.id);
        }
        this.searchParams.drugIds = result.join(',');
    }

    // 科室选择事件
    // fnDeptSelect($event){
    //     this.activeZone = $event.activeZone;
    //     this.activeDept = $event.activeDept;

    //     this.coloctZoneDept();
    // }

    // // 科室删除事件
    // fnZoneDeptDelete(zoneDept,$event){
    //     for(var i=0,len=this.activeZone.length; i<len; i++){
    //         if(this.activeZone[i].id == zoneDept.id){
    //             this.activeZone.splice(i,1);
    //         }
    //     }
    //     for(var i=0,len=this.activeDept.length; i<len; i++){
    //         if(this.activeDept[i].id == zoneDept.id){
    //             this.activeDept.splice(i,1);
    //         }
    //     }

    //     $event.stopPropagation();

    //     this.coloctZoneDept();
    // }

    /* 科室选择事件 */
    fnDeptSelect($event) {
        this.deptList = $event;
        this.coloctZoneDept();
    }

    fnZoneDeptDelete(type, zoneDept, $event) {
        for (let zone of this.deptList) {
            if (type == 'zone') {
                if (zone.zoneId == zoneDept.zoneId) {
                    this.deptList.splice(this.deptList.indexOf(zone) - 1, 1);
                }
            } else {
                for (let deptId in zone.idNamePairs) {
                    if (deptId == zoneDept.id) {
                        delete zone.idNamePairs[deptId];
                    }
                }
            }
        }

        $event.cancelBubble = true;
        this.coloctZoneDept();
    }

    trans2Arr(dept) {
        let keys = Object.keys(dept),
            result = [];
        for (let key of keys) {
            result.push({
                id: key,
                name: dept[key]
            });
        }
        return result;
    }

    private coloctZoneDept() {
        let _zList = [],
            _dList = [];

        for (let zone of this.deptList) {
            if (zone.checked) {
                _zList.push(zone.zoneId);
            } else {
                for (let deptId in zone.idNamePairs) {
                    _dList.push(deptId);
                }
            }
        }

        this.searchParams.zoneId = _zList.join(',');
        this.searchParams.deptId = _dList.join(',');
    }

    // 分析类型选择事件
    private analysisTypeSelect($event) {
        this.analysisResultTypeList = $event.children || [];
        
        this.searchParams.analysisResultType = '';

        this.searchParams.analysisType = $event.id;
    }

    // 药品名称选择事件
    private drugNameSelect($event) {
        this.searchParams.productName = $event.name;
    }

    // 医生选择事件
    private doctorSelect($event) {
        this.searchParams.doctorId = $event.id;

        this.docName = $event.name;
    }

    goAlertMsgDetail(trow: any) {
        window.sessionStorage.setItem('alertMsgSearchParams', JSON.stringify({
            search: this.searchParams,
            deptList: this.deptList
        }));
        this.router.navigate(['/page/alert-message-details', trow.messageId, this.searchParams.auditObject, trow.productId]);
    }

    private export() {
        let query: string = this.AMListTable.url;

        for (let attr in this.searchParams) {
            if (this.searchParams[attr]) {
                query += `&${attr}=${this.searchParams[attr]}`;
            }
        }

        this.http.get('/api/v1/medicationinfo/export?' + query, { headers: this.headers })
            .toPromise()
            .then(res => {
                var _msg = res.json().message;
                if (res.json().code == '200') {
                    // this.promptComponent.alert('导出成功，请到下载列表下载！');
                    this.auditOptions.show = true;
                    this.auditOptions.string = '导出成功，请到下载列表下载！';
                    setTimeout(() => {
                        this.auditOptions.show = false;
                        this.auditOptions.string = "";
                    }, 3000);
                } else {
                    this.promptComponent.alert(_msg);
                }
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    exportList() {
        this.downloadWin = true;
    }

    private extractJson(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }

    deptclick($event) {
        this.deptOptions.isShow = !this.deptOptions.isShow
        $event.stopPropagation();
    }

    auditObjChange() {
        this.deptOptions.type = this.searchParams.auditObject == 3 ? 2 : 1;

        this.searchParams.recipeSource = '';
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

    handleIptWardUpdate($event) {
        this.iptWardList = $event.arr;

        let iptWardArr = [];
        for (let zone of this.iptWardList) {
            for (let deptId in zone.idNamePairs) {
                iptWardArr.push(deptId);
            }
        }

        this.iptWardStr = iptWardArr.join(';');

        this.coloctZoneIptWard();
    }

    private coloctZoneIptWard() {
        let _zList = [],
            _iList = [];

        for (let zone of this.iptWardList) {
            _zList.push(zone.zoneId);

            for (let deptId in zone.idNamePairs) {
                _iList.push(deptId);
            }
        }

        this.searchParams.zoneId = _zList.join(',');
        this.searchParams.wardId = _iList.join(',');
    }

    fnZoneIptWardDelete(type, zoneDept, $event) {
        for (let zone of this.iptWardList) {
            if (type == 'zone') {
                if (zone.zoneId == zoneDept.zoneId) {
                    this.iptWardList.splice(this.deptList.indexOf(zone) - 1, 1);
                }
            } else {
                for (let deptId in zone.idNamePairs) {
                    if (deptId == zoneDept.id) {
                        delete zone.idNamePairs[deptId];
                    }
                }
            }
        }

        let iptWardArr = [];
        for (let zone of this.iptWardList) {
            for (let deptId in zone.idNamePairs) {
                iptWardArr.push(deptId);
            }
        }

        this.iptWardStr = iptWardArr.join(';');

        $event.cancelBubble = true;
        this.coloctZoneIptWard();
    }

    @ViewChild(AuditPlanDoctorComponent) auditPlanDortoc: any;
    iptwardPopup() {
        this.auditPlanDortoc.popup();
    }

    forHelp() {
        this.http.get(this.helpApi)
            .toPromise()
            .then(res => {
                // this.helpUrl = res.json().data+'?webHisId='+trow.productId;

                this.helpUrl = res.json().data;
            })
            .catch(this.handleError)
    }
}
