import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'multi-choosen',
	templateUrl: 'multi-choosen.component.html',
    styleUrls: [ 'multi-choosen.component.css' ]
})

export class MultiChoosenComponent {
	private list: any[] = [];           //ajax返回的药师列表
    private choosenList: any[] = [];    //当前选中的药师列表
	private keycode: string = '';
    private timeout: any;
    private isShowList: boolean = false;
    
	constructor(private http: Http){}

    @Input() dataOpt: any;
    @Input() static: any;
    @Output() select = new EventEmitter();

	ngOnInit(){
		
	}
   
	getList(){
        clearTimeout(this.timeout);
        let _this = this;
        this.timeout = setTimeout(function(){
            _this.http.get(_this.dataOpt.api + '?keyword=' + encodeURIComponent(_this.keycode || ''))
                .toPromise()
                .then(response => {
                    _this.list = _this.extractData(response);
                    _this.list = _this.sortByChoosen(_this.list, _this.choosenList);
                    _this.isShowList = true;
                })
                .catch(_this.handleError);
        }, 250);
	}


    open($event: any){
        if(this.static) return;

        if(!this.dataOpt || !this.dataOpt.api){
            console.log('error: 缺少必要参数！');
            return;
        };
        this.isShowList = !this.isShowList;
        if(this.isShowList)
            this.getList();
        $event.stopPropagation();
    }

    initList(idList: any){
        if(idList && idList.length > 0){
            this.http.get(this.dataOpt.api + '?keyword=' + encodeURIComponent(this.keycode || ''))
                .toPromise()
                .then(response => {
                    this.list = this.extractData(response);
                    for(let _id of idList){
                        this.list.forEach(element => {
                            if(_id == element.id){
                                this.choosenList.push(element);
                            }
                        });
                    }
                })
                .catch(this.handleError);
        }
    }

    chooseItem(item: any){
        if(this.isChecked(item)){
            this.deleteItem(item);
            return;
        }
        this.choosenList.push(item);
        this.select.emit(this.choosenList);
    }

    deleteItem(item: any, $event?: any){
        for(let i = 0; i < this.choosenList.length; i++){
            if(item.id == this.choosenList[i].id){
                this.choosenList.splice(i, 1);
            }
        }
        this.select.emit(this.choosenList);
        if($event)
            $event.stopPropagation();
    }

    isChecked(item: any){
        for(let choosen of this.choosenList){
            if(item.id == choosen.id){
                return true;
            }
        }
        return false;
    }
    /**
     * 对ajax数据进行排序，已经被选中的数据排在前面
     * @param choosenList 
     */
    sortByChoosen(list: any[], choosenList: any[]){
        let tepList: any[] = [];
        for(let choosen of choosenList){
            for(let i = 0; i < list.length; i++){
                if(choosen.id == list[i].id){
                    tepList.push(list[i]);
                    list.splice(i, 1);
                }
            }
        }
        
        return Array.prototype.concat(tepList, list);
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

        return body.data || [];
    }

    @HostListener('document:click', [])
    onDocumentClick(){
        this.isShowList = false;
        this.keycode = "";
    }
}