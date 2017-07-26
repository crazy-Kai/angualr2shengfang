/*
* codeby DemoXu
* 适用于各种需要查询api获取数据来展示的下拉框，为了提高复用减少代码量 
* 传参option包括属性：
*    api
*   width 下拉框宽度
*  输出：select事件 广播选中节点
*  后续有需求继续添加属性
*/

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'select-comp',
	templateUrl: 'select.component.html',
    styleUrls: ['select.component.css']
})

export class SelectComponent {
	private list: any[] = [];
    private activeIdx: number = 0;

    @Input() active: string;
	@Input() option: Object;
    @Output() select = new EventEmitter();

	constructor(private http: Http){}

	ngOnInit(){
		this.getList();
	}

	private getList(){
		this.http.get( this.option['api'] )
            .toPromise()
            .then(response => {
                this.list = Array.isArray(this.extractData(response)) ? this.extractData(response) : [];

                this.list.unshift({
                    id:'',
                    name:'',
                    children:[]
                });

                if(this.active){
                    for(var i=0; i<this.list.length; i++){
                        if(this.list[i].name == this.active){
                            this.activeIdx = i;
                        }
                    }
                }
                this.optionClick();
            })
            .catch(this.handleError);
	}

	private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        
        return body.data || {};
    }

    private optionClick(){
        this.select.emit(this.list[this.activeIdx]);
    }
}