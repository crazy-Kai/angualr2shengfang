import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { TreeModule, TreeNode, TreeComponent } from 'angular2-tree-component';
import { Http } from '@angular/http';

@Component({
	selector: 'dept-component',
	templateUrl: './dept.component.html',
	styleUrls: [ './dept.component.css', '../../popup-add.css']
})

export class DeptComponent implements OnInit{
	private api: Object = {
        'getDataList': '/api/v1/deptTree',
        'getChildNodes': '/api/v1/childrenDept'
    };
	private deptKeyword: string = '';
	private dataList: any[];
    private options: any = {};

    @ViewChild('tree')
    private tree: TreeComponent;
    private timeout: any = {};
    private allNodeIds: any[] = [];
    private activeNodeIds: any = {};
    private nodeMap: any = {};

	@Input() zone: Object = {};
    @Input() deptList: any[];
    @Input() type: any;
    @Output() deptNodeClick = new EventEmitter();
    @Output() checkAll = new EventEmitter();

	constructor(private http: Http){}

	ngOnInit(){
        if(!this.dataList || !this.deptList.length){
            this.getDataList();
        }

        this.options.getChildren = this.getChildren.bind(this);
	}

    ngOnChanges(){
        this.getDataList();
    }

	getDataList(){
        this.clearExpandNode();
		// this.http.get(this.api['getDataList'] + '?keyword=' + encodeURIComponent(this.deptKeyword || '') +'&type=' + (this.type || ''))
  //           .toPromise()
  //           .then(response => {
  //               let list = this.extractData(response);
  //               if(this.deptKeyword){
  //                   this.allExpanded(list);
  //               }
  //               this.dataList = list;
  //           })
  //           .catch(this.handleError);

        if( !(this.zone&&this.zone['id']) ){
            return;
        }
        
        this.http.get(this.api['getDataList'] + '?zoneId=' + ((this.zone&&this.zone['id']) || '') + '&keyword=' + encodeURIComponent(this.deptKeyword || '') +'&type=' + (this.type || '') )
            .toPromise()
            .then(response => {
                let list = this.extractData(response);
                if(this.deptKeyword){
                    this.allExpanded(list);
                }
                this.dataList = list;
            })
            .catch(this.handleError);
	}

    keydown($event){
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            this.getDataList();
        },500);
    }

    private clearExpandNode(){
        for(let prop in this.tree.treeModel.expandedNodeIds){
            if(this.tree.treeModel.expandedNodeIds.hasOwnProperty(prop)){
                delete this.tree.treeModel.expandedNodeIds[prop];
            }
        }
    }

    allExpanded(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
            this.tree.treeModel.expandedNodeIds[arr[i].id] = true;
            if (arr[i].hasChild && arr[i].children)
                this.setExpanded(arr[i].children);
        }
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

    private getChildren(node: any){
        let tempUrl = this.api['getChildNodes'] + "?parentId=" + node.data.id;
        return this.http.get(tempUrl)
            .toPromise()
            .then(response => {
                let result = this.extractData(response);

                //如果父节点勾选了，子节点需全部勾选
                if(node.data.checked){
                    for(let _r of result){
                        _r.checked = node.data.checked;
                    }    
                }

                for(let _r of result){
                    _r.parentId = node.data.id;

                    this.nodeMap[node.data.id] = result;
                }

                return result;
            })
            .catch(this.handleError);
    }

    private nodeCBoxClick(node){
        //设置当前节点及其子节点是否选中
        this.setNodeChecked(node, !node.checked);
        
        //对其父节点的控制
        let isAllBroCheck = true;
        if(this.nodeMap && this.nodeMap[node.parentId]){
            for(let brother of this.nodeMap[node.parentId]){
                if(!brother.checked){
                    isAllBroCheck = false;
                }
            }

            let nodeIds = [];
            this.getParentNodeIds(nodeIds, node.id);
            
            this.setParentChecked(this.dataList, nodeIds, isAllBroCheck);
        }

        //广播当前选中节点
        let isAllChecked = this.isAllChecked();
        for(var i=0,len=this.deptList.length; i<len; i++){
            if(this.deptList[i].zoneId == this.zone['id']){
                this.deptList[i].checked = isAllChecked;
            }
        }

        this.deptNodeClick.emit(this.deptList);
        
        //广播是否节点全部选中－－为了对院区有所操作
        this.checkAll.emit({
            id: this.zone['id'],
            checked: isAllChecked
        });
    }

    //获取当前节点所有直接和间接父节点
    private getParentNodeIds(pNodeIds, currentId){
        for(let pid in this.nodeMap){
            let sons = this.nodeMap[pid];
            for(let son of sons){
                if(son.id == currentId){
                    pNodeIds.push(pid);
                    this.getParentNodeIds(pNodeIds, pid);
                }
            }
        }
    }

    private setParentChecked(list, nodeIds, isAllSonCheck){
        for(let node of list){
            for(let nodeId of nodeIds){
                if(node.id == nodeId){
                    node.checked = isAllSonCheck;

                    //父节点取消或者勾选－需要对数据也保持一致
                    for(let zone of this.deptList){
                        if(zone.zoneId == this.zone['id']){
                            if(isAllSonCheck){
                                zone.idNamePairs[nodeId] = node.name;
                            }else{
                                delete zone.idNamePairs[nodeId];
                            }
                        }
                    }
                }
            }
            if(node.hasChild && node.children){
                this.setParentChecked(node.children, nodeIds, isAllSonCheck);
            }
        }
    }

    private isAllChecked(){
        this.allNodeIds = [];
        this.activeNodeIds = {};
        this.collectIds(this.dataList);
        
        let allCheck = true;
        for(let id of this.allNodeIds){
            if(!this.activeNodeIds[id]){
                allCheck = false;
            }
        }

        return allCheck;
    }

    private collectIds(list){
        for(let item of list){
            if(!~this.allNodeIds.indexOf(item.id)){
                this.allNodeIds.push(item.id);
            }
            if(!this.activeNodeIds[item.id] && item.checked){
                this.activeNodeIds[item.id] = true;
            }
            if(item.hasChild && item.children){
                this.collectIds(item.children);
            }
        }
    }

    setNodeChecked(node, isCheck){
        node.checked = isCheck;

        if(node.checked){
            //院区没有选择的情况
            if(!this.deptList.length){
                this.deptList.push({
                    zoneId: this.zone['id'],
                    zoneName: this.zone['name'],
                    checked: false,
                    idNamePairs: {}
                });
            }
            this.deptList.forEach((_zone)=>{
                if(_zone.zoneId == this.zone['id']){
                    _zone.idNamePairs[node.id] = node.name;
                }
            });
        }else{
            this.deptList.forEach((_zone)=>{
                if(_zone.zoneId == this.zone['id']){
                    delete _zone.idNamePairs[node.id];
                }
            });
        }
        if(node.children){
            for(let child of node.children){
                this.setNodeChecked(child,node.checked);
            } 
        }
    }

	private extractData(res: any) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json(),
            _this = this;
        //后端返回的是hasChild,需要hasChildren字段
        body.data.forEach(function(item){
            item.hasChildren = item.hasChild;

            _this.deptList.forEach((_zone)=>{
                if(_zone.idNamePairs){
                    for(let prop in _zone.idNamePairs){
                        if(prop == item.id){
                            item.checked = true;
                        }
                    }
                }
            });

            if(_this.zone['checked']){
                item.checked = true;
                _this.deptList.forEach((_zone)=>{
                    if(_zone.zoneId == _this.zone['id']){
                        _zone.idNamePairs[item.id] = item.name;
                    }
                });
            }
        });
        return body.data || {};
    }

	private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
