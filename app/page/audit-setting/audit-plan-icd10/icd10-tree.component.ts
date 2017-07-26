import { Component, Input, Output, ViewChild, EventEmitter, OnChanges } from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { InterceptorService } from 'ng2-interceptors';

export class Options {
    
}

@Component({
    selector: 'icd10-tree',
    template: `
        <Tree #tree [nodes]="icd10Nodes" [options]="options" (onActivate)="activate($event)"></Tree>
    `,
    styles: [`
       
    `]
})
export class ICD10Tree implements OnChanges {
    @ViewChild('tree')
	private tree: TreeComponent;
    ngAfterViewInit() {
        
    }

    @Input() nodes: any;
    @Input() options: any;
    @Input() keyword: String;
    @Output() onActivate: EventEmitter<any> = new EventEmitter();

    defaultOptions = new Options();
	icd10Nodes: any[] = [];
    icd10ListUrl = '/api/v1/icd10';
    icd10ChildListUrl = '/api/v1/childIcd10';

    testArray: any[] = [];
    timeout: any = {};

    constructor(private http: InterceptorService) { }
    
    ngOnInit() {
        this.options.getChildren = this.getChildren.bind(this);
        // if(this.options.ICD10_ID && this.options.ICD10_ID.length > 0){
        //     this.getChildren(this.options.ICD10_ID).then(icd10Nodes => {
        //         this.icd10Nodes = icd10Nodes;
        //     });
        // }else{
            this.getICD10().then(icd10Nodes => {
                this.icd10Nodes = icd10Nodes;
            });
        // }
	}

    private activate($event: any) {
		var id = $event.node.data.id;
		var name = $event.node.data.name;
        this.onActivate.emit($event);
	}

    private getICD10(): Promise<any[]> {
        this.clearExpandNode();
        return this.http.get(this.icd10ListUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    private getChildren(node: any): Promise<any[]> {
		let tempUrl = this.icd10ChildListUrl + "?parentId=" + ( (node.data&&node.data.id) || node );
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
	}
    private searchICD10(keyword: string): any {
        let tempUrl = this.icd10ListUrl  + '?keyword=' + encodeURIComponent(keyword);
        this.clearExpandNode();
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .then(icd10Nodes => {
                this.setExpanded(icd10Nodes);
                this.icd10Nodes = icd10Nodes;
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
                this.searchICD10(changes.keyword.currentValue);
            }else {
                this.getICD10().then(icd10Nodes => {
                    this.icd10Nodes = icd10Nodes;
                });
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