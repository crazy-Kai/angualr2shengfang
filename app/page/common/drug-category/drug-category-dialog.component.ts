/*
    codeby DemoXu
    options：封装参数
        chooseControl: 对选择节点进行控制(只能选择特定节点等)
        mutipleChoose: true or false or undefined等  是否可多选
        DRUG_ID: 药品ID
        choosedDrugs: 初始化选中的药品集合
*/
import { Component, Input, Output, ViewChild, EventEmitter, OnChanges } from '@angular/core';
import { DrugCategoryTree } from './drug-category-tree.component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

export class Options {
    chooseControl: Function;
    showControl: Function;
    mutipleChoose: boolean;
    showDialog: boolean;
}
export class ChoosedDrug {
    id: string;
    name: string;
    py: string;
}

@Component({
    selector: 'drug-category-dialog',
    templateUrl: 'drug-category-dialog.component.html',
    styleUrls: ['drug-category-dialog.component.css','../../common/popup-add.css']
})
export class DrugCategoryDialog implements OnChanges {
    private choosedDrugs: ChoosedDrug[] = [];
    private showDialog: boolean = false;
    // @ViewChild('tree')
	// private tree: DrugCategoryTree;
    ngAfterViewInit() {
        
    }

    @Input() options: any;
    @Output() onChooseDrugs: EventEmitter<any> = new EventEmitter();

    constructor() { }
    
    ngOnInit() {
        
	}

    private chooseDrugs($event: any) {
		var id = $event.node.data.id,
            name = $event.node.data.name,
            py = $event.node.data.py;
        
        //如果配置了选择控制
        if(this.options.chooseControl) {
            //如果没通过选择控制，则不产生选择效果
            if( ! this.options.chooseControl({id: id, name: name})) {
                return;
            }
        }
        //如果是多选，加入列表，如果是单选，覆盖列表
        if(this.options.mutipleChoose) {
            var contain = false;
            for(var i=0,len=this.choosedDrugs.length; i<len; i++){
                let _i = this.choosedDrugs.pop();
                if(_i.id == id){
                    contain = true;
                    continue;
                }
                this.choosedDrugs.unshift(_i);
            }
            if(!contain){
                this.choosedDrugs.push({id: id, name: name, py: py});
            }
        } else {
            this.choosedDrugs = [{id: id, name: name, py: py}];
        }
	}

    show() {
        this.showDialog = true;
    }

    private submit() {
        this.showDialog = false;
        //如果一个都没选中，不做处理
        // if(this.choosedDrugs.length == 0) {
        //     return;
        // }
        this.onChooseDrugs.emit(this.choosedDrugs);
        this.choosedDrugs = [];
    }
    
    private cancel() {
        this.showDialog = false;
        this.choosedDrugs = [];
    }

    ngOnChanges(changes : any) {
        // if(changes.options.showDialog.currentValue)
        //     console.log(changes.options.showDialog.currentValue);
        if(this.options && this.options.choosedDrugs){
            this.choosedDrugs = this.options.choosedDrugs;
        }
    }
}