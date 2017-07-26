import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { TreeModule } from 'angular2-tree-component';

import { AuditPlanDrugCategory } from './audit-plan-drug-category';
import { AuditPlanDrugCategoryService } from './audit-plan-drug-category.service';

@Component({
    selector: 'audit-plan-drug-category',
    templateUrl: 'audit-plan-drug-category.component.html',
    styleUrls: [ 'audit-plan-drug-category.component.css', '../popup-add.css']
})

export class AuditPlanDrugCategoryComponent implements OnInit{
    @Input() drugCategoryStr: string = '';
    @Output() drugCategoryUpdate = new EventEmitter();

    private drugCategoryChooseList: string[] = [];
    private drugCategoryList = [];
    private drugCategoryOrginList: AuditPlanDrugCategory[] = [];
    private drugCategoryResultList: string[] = [];
    private isPopupShow: boolean = false;
    private isAllChecked: boolean = true;
    
    constructor(
        private auditPlanDrugCategoryService: AuditPlanDrugCategoryService
    ) { }

    getDrugCategoryList(): void {
        this.auditPlanDrugCategoryService.getDrugCategoryList().then(drugCategoryList => {
            // for(let drugCategory of drugCategoryList){
            //     let childDrugCategory = [], parentChecked = true, childChecked = false;
            //     for(let child of drugCategory.childList){
            //         if(~this.drugCategoryResultList.indexOf(child.name)){
            //             childChecked = true;
            //         } else {
            //             parentChecked = false;
            //             this.isAllChecked = false;
            //         }
            //         childDrugCategory.push({
            //             id: child.id,
            //             name: child.name,
            //             checked: childChecked
            //         });
            //     }
            //     this.drugCategoryList.push({
            //         id: drugCategory.id,
            //         name: drugCategory.name,
            //         checked: parentChecked,
            //         children: childDrugCategory
            //     });
            // }
            this.drugCategoryOrginList = drugCategoryList;
            this.drugCategoryInit(this.drugCategoryOrginList);
        });
    }
    drugCategoryInit(drugCategoryList): void {
        this.drugCategoryList = [];
        for(let drugCategory of drugCategoryList){
            let childDrugCategory = [], parentChecked = true, childChecked = false;
            for(let child of drugCategory.childList){
                if(~this.drugCategoryChooseList.indexOf(child.name)){
                    childChecked = true;
                } else {
                    parentChecked = false;
                    this.isAllChecked = false;
                }
                childDrugCategory.push({
                    id: child.id,
                    name: child.name,
                    checked: childChecked
                });
            }
            this.drugCategoryList.push({
                id: drugCategory.id,
                name: drugCategory.name,
                checked: parentChecked,
                children: childDrugCategory
            });
        }
    }
    drugCategoryClick(checkBox: any): void {
        if(checkBox){
            //check one
            checkBox.data.checked = !checkBox.data.checked;
            if(checkBox.level == 1 && checkBox.data.hasOwnProperty('children') && checkBox.data.children.length > 0){
                this.childDrugCategoryChecked(checkBox.data);
            } else if(checkBox.level == 2 && !checkBox.data.checked){
                checkBox.parent.data.checked = false;
            }
            if(checkBox.data.checked){
                this.isAllChecked = true;
                for(let drug of this.drugCategoryList){
                    if(!drug.checked){
                        this.isAllChecked = false;
                        break;
                    }
                    for(let childDrug of drug.children){
                        if(!childDrug.checked){
                            this.isAllChecked = false;
                            break;
                        }
                    }
                }
                //选中的为二级类或者只有一级类
                if((checkBox.level == 2 || !checkBox.hasChildren) && !~this.drugCategoryChooseList.indexOf(checkBox.data.name)){
                    this.drugCategoryChooseList.push(checkBox.data.name);
                }
            } else {
                this.drugCategoryChooseList = this.drugCategoryChooseList.filter(item => item != checkBox.data.name);
            }
        } else {
            this.isAllChecked = !this.isAllChecked;
            if(this.isAllChecked){
                //all checked
                for(let drugCategory of this.drugCategoryList){
                    drugCategory.checked = true;
                    this.childDrugCategoryChecked(drugCategory);
                }
            } else {
                //all unchecked
                for(let drugCategory of this.drugCategoryList){
                    drugCategory.checked = false;
                    this.childDrugCategoryChecked(drugCategory);
                }
                this.drugCategoryChooseList = [];
            }
        }
    }
    childDrugCategoryChecked(parentNode: any): void {
       
        for(let child of parentNode.children){
            child.checked = parentNode.checked;
            if(child.checked){
                if(!~this.drugCategoryChooseList.indexOf(child.name)){
                    this.drugCategoryChooseList.push(child.name);
                }
            } else {
                this.isAllChecked = false;
                this.drugCategoryChooseList = this.drugCategoryChooseList.filter(item => item != child.name);
            }
        }
    }
    drugCategoryDelete(name: string): void {
       // drugCategoryChoose.checked = false;
        this.isAllChecked = false;
        for(let drug of this.drugCategoryList){
            if(drug.name == name){
                drug.checked = false;
            }
            for(let child of drug.children){
                if(child.name == name){
                    child.checked = false;
                    drug.checked = false;
                }
            }
        }
        this.drugCategoryChooseList = this.drugCategoryChooseList.filter(item => item !== name);
    }
    drugCategoryResultDelete(name: string){
        this.drugCategoryChooseList = this.drugCategoryChooseList.filter(item => item !== name);
        this.drugCategoryResultList = this.drugCategoryResultList.filter(item => item !== name);
        
        //change checked value in drugCategoryList
        for(let drug of this.drugCategoryList){
            if(drug.name == name){
                drug.checked = false;
            }
            for(let child of drug.children){
                if(child.name == name){
                    child.checked = false;
                    drug.checked = false;
                }
            }
        }
        this.isAllChecked = false;
        this.drugCategoryStr = this.drugCategoryResultList.join(';');
        this.drugCategoryUpdate.emit(this.drugCategoryStr);
    }
    searchDrugCategory(keyWord: string): void {
        if(keyWord.trim()){
            this.auditPlanDrugCategoryService.searchDrugCategory(keyWord).then(resultList => {
                this.drugCategoryInit(resultList);
            });
        }
    }
    canclePopup(): void{
        this.isPopupShow = false;
        //reset
        this.drugCategoryInit(this.drugCategoryOrginList);
    }
    submitPopup(): void{
        this.isPopupShow = false;
        this.drugCategoryResultList = [];
        for(let drug of this.drugCategoryChooseList){
            this.drugCategoryResultList.push(drug);
        }
        this.drugCategoryStr = this.drugCategoryResultList.join(';');
        this.drugCategoryUpdate.emit(this.drugCategoryStr);
        //reset
        this.drugCategoryInit(this.drugCategoryOrginList);
    }
    getDrugCategoryResult(): void {
        if(this.drugCategoryStr && this.drugCategoryStr.length > 0){
            this.drugCategoryResultList = this.drugCategoryStr.split(';');
            this.drugCategoryChooseList = this.drugCategoryResultList;
        }
    }
    ngOnInit() {
        this.getDrugCategoryResult();
        this.getDrugCategoryList();
    }
}