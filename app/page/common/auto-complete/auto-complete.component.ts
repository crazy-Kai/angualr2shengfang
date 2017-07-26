/*
* codeby DemoXu
* 适用于各种自动填充的组件，为了提高复用减少代码量 
* 传参option包括属性：
*    api
*   placeholder 文本框提示信息
*  后续有需求继续添加属性,目前比较僵硬的是宽度在css定义了，最好样式什么也可以在option中可个性化
*/
import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'auto-complete',
	templateUrl: 'auto-complete.component.html',
	styleUrls: [ 'auto-complete.component.css' ]
})

export class AutoCompleteComponent {
	private list: any[] = [];
	private keycode: string = '';
    private timeout: any;
    private isShowList: boolean = false;
    private active: Object;
	constructor(private http: Http){}

    @Input() option: any;
    @Output() select = new EventEmitter();

	ngOnInit(){
		
	}

	getList(){
        clearTimeout(this.timeout);
        let _this = this;
        this.timeout = setTimeout(function(){
            _this.http.get(_this.option['api'] + '?keyword=' + encodeURIComponent(_this.keycode || '') + (_this.option['variable'] && _this.option['variable'].value ? ("&" + _this.option['variable'].key + '=' + _this.option['variable'].value) : ''))
                .toPromise()
                .then(response => {
                    _this.list = _this.extractData(response);
                    _this.isShowList = true;
                })
                .catch(_this.handleError);
        },150);
	}

    private clearLayer(){
        this.isShowList = false;
    }

    private fnSelect(result){
        this.active = result;
        this.keycode = result.name;

        this.select.emit(result);

        this.clearLayer();
    }

	private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json(),
            _this = this;

        return body.data || {};
    }

    @HostListener('document:click', [])
    onDocumentClick(){
        this.isShowList = false;
    }
}