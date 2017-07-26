import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';

import { AuditPlanDrugProperty } from './audit-plan-drug-property';
import { AuditPlanDrugPropertyService } from './audit-plan-drug-property.service';

@Component({
    selector: 'audit-plan-drug-property',
    templateUrl: 'audit-plan-drug-property.component.html',
    styleUrls: [ 'audit-plan-drug-property.component.css', '../popup-add.css']
})

export class AuditPlanDrugPropertyComponent implements OnInit {
    private drugPropertyList: AuditPlanDrugProperty[] = [];
    private drugPropertyOrginList: AuditPlanDrugProperty[] = [];
    // private drugPropertyResult: any[] = [];
    private isPopupShow: boolean = false;
    private options: any = {};

    @Input() drugPropertyResult: any;
    @Output() drugPropertyUpdate = new EventEmitter();

    constructor(
        private auditPlanDrugPropertyService: AuditPlanDrugPropertyService
    ) { }

    private getChildren(node: any){
        return this.auditPlanDrugPropertyService.getChildrenList(node.data.id);
    }

    getDrugPropertyList(): void {
        this.auditPlanDrugPropertyService.getDrugPropertyList().then(drugPropertyList => {
            this.drugPropertyList = drugPropertyList;
            this.initDrugPropertyList();
            this.drugPropertyOrginList = this.drugPropertyList;
        });
    }
    searchDrugProperty(keyWord: string): void {
        if(keyWord.trim()){
            this.auditPlanDrugPropertyService.searchDrugProperty(keyWord).then(drugPropertyList => {
                this.drugPropertyList = drugPropertyList;
                this.initDrugPropertyList();
            });
        }
    }
    contain(id){
        for(let item of this.drugPropertyResult){
            if(item.id == id){
                return true;
            }
        }
    }
    delete(id){
        this.drugPropertyResult = this.drugPropertyResult.filter(result => result.id !== id);
    }
    initDrugPropertyList(): void {
        for(let drugProperty of this.drugPropertyList){
            if(this.contain(drugProperty.id)){
                drugProperty.checked = true;
            } else {
                drugProperty.checked = false;
            }
        }
    }
    getDrugPropertyResult(): void{
        // if(this.drugPropertyStr && this.drugPropertyStr.length > 0){
        //     try{
        //         this.drugPropertyResult = JSON.parse(this.drugPropertyStr);
        //     }catch(e){}
        // }
        // console.log('str:'+this.drugPropertyStr);
        // console.log(this.drugPropertyResult);

        // this.drugPropertyResult = this.drugPropertyArr;
    }
    chooseDrugPropertyItem(drugProperty: AuditPlanDrugProperty, $event): void {
        drugProperty.checked = !drugProperty.checked;
        if(drugProperty.checked && !this.contain(drugProperty.id)){
            this.drugPropertyResult.push({
                id: drugProperty.id,
                name: drugProperty.name
            });
        } else {
             this.delete(drugProperty.id);
        }
        this.drugPropertyUpdate.emit(this.drugPropertyResult);

        $event.stopPropagation();
    }
    deleteDrugProperty(event: MouseEvent ,value: string): void {
        event.stopPropagation();
        this.delete(value);
        // for(let drugProperty of this.drugPropertyList){
        //     if(drugProperty.id == value){
        //         drugProperty.checked = false;
        //     }
        // }
        this.changeDrugPropertyStatus(this.drugPropertyList, value);
        this.drugPropertyUpdate.emit(this.drugPropertyResult);
    }
    /**
     * 递归改变药品属性的选中状态
     * @param list => 递归列表
     * @param value => 用于匹配的关键字
     */
    changeDrugPropertyStatus(list: any[], value: string){
        for(let drugProperty of list){
            if(drugProperty.id == value){
                drugProperty.checked = false;
            }
            if(drugProperty.children && drugProperty.children.length > 0){
                this.changeDrugPropertyStatus(drugProperty.children, value);
            }
        }
    }

    selectClick(target: any): void {
        //if(target.tagName.toUpperCase() != 'SPAN'){
            this.isPopupShow = !this.isPopupShow;
        //}
        //每次隐藏浮层都重置 list
        if(!this.isPopupShow){
            this.drugPropertyList = this.drugPropertyOrginList;
            this.initDrugPropertyList();
        }
    }

    ngOnInit() {
        this.options.getChildren = this.getChildren.bind(this);
        this.getDrugPropertyResult();
        this.getDrugPropertyList();
    }

    ngOnChange(){
        this.getDrugPropertyResult();
    }

    stopPropagation($event){
        $event.stopPropagation();
    }

    @HostListener('document:click',[])
    onDocumentClick(){
        this.isPopupShow = false;
    }
}
