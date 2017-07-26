import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'associated-select',
    templateUrl: 'associated-select.component.html',
})
export class AssociatedSelectComponent implements OnInit{
    @Input() title: string;                                 //输入 select 属性名
    @Input() propertyList: any[];                           //输入 select 属性集合
    @Output() propertyUpdate = new EventEmitter();          //输出 select 选择

    ngOnInit(){
        if(!this.propertyList)
            this.propertyList = [];
    }

    changeProperty(value: string): void{
        this.propertyUpdate.emit(value);
    }
}