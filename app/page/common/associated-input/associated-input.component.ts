import { Component, OnInit, OnChanges, Input, Output, ChangeDetectionStrategy, EventEmitter} from '@angular/core';
import { Observable }    from 'rxjs/Observable';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'associated-input',
    templateUrl: 'associated-input.component.html',
    styleUrls: ['associated-input.component.css']
})
export class AssociatedInputComponent implements OnInit{
    @Input() key: string;
    @Input() itemsList: any[];                              //输入 select 属性集合
    @Output() propertyUpdate = new EventEmitter();          //输出 select 选择

    ngOnInit(){
        if(!this.itemsList)
            this.itemsList = [];
        if(!this.key)
            this.key = 'name';
    }

    ngOnChanges(changes: any){
        
    }

    changeProperty($event: any): void{
        if(!$event){
            this.propertyUpdate.emit('');
            return;
        };
        
        if(typeof($event) == 'object'){
            this.propertyUpdate.emit($event[this.key]);
        }else if(typeof($event) == 'string'){
            this.propertyUpdate.emit($event);
        }
    }

    auditByModel: any;                      //指定审核人下拉联想框绑定值
    // auditPermissionOwnerList: any[];        //有权限审核的人员列表
    searchAuditBy = (text$: Observable<string>) =>
        text$.debounceTime(200).distinctUntilChanged()
        .map(term => term.length < 1 ? []
            : this.itemsList.filter(v => new RegExp(term, 'gi').test(v[this.key])).splice(0, 10));
    searchAuditByFormatter = (x: any) => x[this.key];
}