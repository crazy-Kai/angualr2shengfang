import { Component, OnInit, Input, Output, EventEmitter, ViewChild }      from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { PromptComponent } from '../prompt/prompt.component';
@Component({
    selector: 'iph-download',
    templateUrl: 'iph-download.component.html',
    styleUrls: ['iph-download.component.css'],
})
export class IphDownloadComponent implements OnInit{
    @Input() options: any;
    @Output() closeWin = new EventEmitter();
    constructor(private http: Http) { }
    //组件参数
    private downloadList: any[] = [];   //下载列表

    /**
     * 接口参数
     */
    //下载列表
    private downloadListUrl = '/api/v1/exportList';
    //删除接口
    private deleteFileUrl = '/api/v1/export';
    //删除接口
    private clearUrl = '/api/v1/deleteExportList';

    ngOnInit(){
        this.getExportList();
    }

    refresh(){
        this.getExportList();
    }


    //获取显示下载列表
    getExportList(){
        this.http.get(this.downloadListUrl)
            .toPromise()
            .then(res => {
                let result = this.extractJson(res);
                if(result.code == '200' && result.data){
                    for(let record of result.data.recordList){
                        switch(record.status){
                            case 0:
                                record.statusStr = '未开始';
                                break;
                            case 1:
                                record.statusStr = '正在处理';
                                break;
                            case 2:
                                record.statusStr = '已完成';
                                break;
                            case -1:
                                record.statusStr = '失败';
                                break;
                            default:
                                record.statusStr = '未知状态';
                                break;
                        }
                    }
                    this.downloadList = result.data.recordList || [];
                }
            })
            .catch(this.handleError)
    }
    //去新窗口下载
    fnDownload(file: any){
        window.open('/api/v1/download?taskId=' + file.taskId + '&fileUrl=' + file.url);

        file.downloadTimes++;
    }
    //删除
    fnDelete(file: any, idx: number){
        this.http.delete(this.deleteFileUrl + '/' + file.taskId)
           .toPromise()
           .then(res => {
               let result = this.extractJson(res);
               if(result.code == '200' && result.data){
                   this.downloadList.splice(idx, 1);    //删除当前数据
                   alert('删除成功！');
               }
           })
           .catch(this.handleError);
    }

    //关闭下载列表窗口
    close(){
        this.closeWin.emit('');
    }


    @ViewChild(PromptComponent) promptComponent: PromptComponent;
    clear(){
        let that = this;
        this.promptComponent.prompt({
            itle: '确认',
            icon: 'question-2.svg',
            tip: '确认一键清空？',
            successCallback(){
                that.http.get(that.clearUrl)
                   .toPromise()
                   .then(res => {
                       let result = that.extractJson(res);
                       if(result.code == '200'){
                            // that.promptComponent.alert({
                            //    tip: '一键清空成功！',
                            //    icon: 'alert',
                            //    successCallback: function(){
                            //        that.downloadList = [];
                            //    }
                            // });
                            that.downloadList = [];
                       }
                   })
                   .catch(this.handleError);
            }
        });
    }
    /**
     * promise预处理
     */
    private extractJson(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || {};
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}