/*
    codeby DemoXu
    options： 主要是接收DRUG_ID 药品ID,用于查询部分分类
*/
import { Component, Input, Output, ViewChild, EventEmitter, OnChanges } from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

export class Options {
    
}

@Component({
    selector: 'drug-category-tree',
    template: `
        <Tree #tree [nodes]="drugNodes" [options]="options" (onActivate)="activate($event)"></Tree>
    `,
    styles: [`
       
    `]
})
export class DrugCategoryTree implements OnChanges {
    @ViewChild('tree')
	private tree: TreeComponent;
    ngAfterViewInit() {
        
    }

    @Input() nodes: any;
    @Input() options: any;
    @Input() keyword: String;
    @Output() onActivate: EventEmitter<any> = new EventEmitter();

    defaultOptions = new Options();
	drugNodes: any[] = [];
    drugCategoryUrl = '/api/v1/drugCategory';
    childDrugCategory = '/api/v1/childDrugCategory';
    timeout: any = {};
    

    constructor(private http: InterceptorService) { }
    
    ngOnInit() {
        // this.options = {
        //     getChildren: this.getChildren.bind(this),
        //     idField:'id'
        // };
        this.options.getChildren = this.getChildren.bind(this);
        this.options.idField = 'id';
        
        if(this.options.DRUG_ID){
            this.getChildren(this.options.DRUG_ID).then(drugNodes => {
                this.drugNodes = drugNodes;
            });
        }else{
            this.getDrugCategory().then(drugNodes => {
                this.drugNodes = drugNodes;
            });
        }
	}

    private activate($event: any) {
		var id = $event.node.data.id;
		var name = $event.node.data.name;
        this.onActivate.emit($event);
	}

    private getDrugCategory(): Promise<any[]> {
        this.clearExpandNode();
        return this.http.get(this.drugCategoryUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    private getChildren(node: any): Promise<any[]> {
		let tempUrl = this.childDrugCategory + "?parentId=" + ( (node.data&&node.data.id) || node );
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
	}
    private searchByDrugName(drugName: string): any {
        let tempUrl = this.drugCategoryUrl  + '?keyword=' + encodeURIComponent(drugName);
        this.clearExpandNode();
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .then(drugNodes => {
                this.setExpanded(drugNodes);
                this.drugNodes = drugNodes;
            })
            .catch(this.handleError);
    }
    private clearExpandNode(){
        for(let prop in this.tree.treeModel.expandedNodeIds){
            if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
                delete this.tree.treeModel.expandedNodeIds[prop];
            }
        }
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        //后端返回的是hasChild,需要hasChildren字段
        body.data.forEach(function(item){
            item.hasChildren = item.hasChild;
        });
        return body.data || {};
    }
    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    ngOnChanges(changes : any) {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            if(changes.keyword.currentValue){
                this.searchByDrugName(changes.keyword.currentValue);
            }else {
                if(this.options.DRUG_ID){
                    this.getChildren(this.options.DRUG_ID).then(drugNodes => {
                        this.drugNodes = drugNodes;
                    });
                }else{
                    this.getDrugCategory().then(drugNodes => {
                        this.drugNodes = drugNodes;
                    });
                }
            }
        },500);
    }

    setExpanded(arr: any[]) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].open && arr[i].hasChild){
				this.tree.treeModel.expandedNodeIds[arr[i].id] = true;
			}
			if (arr[i].hasChild && arr[i].children)
				this.setExpanded(arr[i].children);
		}
	}
}