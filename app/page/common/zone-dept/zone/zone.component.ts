import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'zone-component',
	templateUrl: './zone.component.html',
	styleUrls: [ '../../popup-add.css' ]
})

export class ZoneComponent implements OnInit{
	private api: string = '/api/v1/zoneList';
	private zoneKeyword: string;
	private zoneList: any[];
    private timeout: any = {};

    @Input() deptList : any[];
    @Input() deptAllCheckZone: any;
    @Output() zoneClick = new EventEmitter();
    @Output() activeZoneClick = new EventEmitter();

	constructor(private http: Http){}

	ngOnInit(){
		this.getZoneList();
	}

    ngOnChanges(){
        if( this.deptAllCheckZone && this.deptAllCheckZone.id && this.zoneList){
            for(let zone of this.zoneList){
                if(zone.id == this.deptAllCheckZone.id){
                    zone.checked = this.deptAllCheckZone.checked;
                }
            }
        }
    }

	getZoneList(){
		this.http.get(this.api + '?keyword=' + encodeURIComponent(this.zoneKeyword || '') )
            .toPromise()
            .then(response => {
                this.zoneList = this.extractData(response);

                if(this.zoneList && this.zoneList.length){
                    this.fnZoneNameClick(this.zoneList[0]);
                }
            })
            .catch(this.handleError);
	}

    keydown($event){
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => {
            this.getZoneList();
        },500);
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
            _this.deptList.forEach(function(_zone){
                if(_zone.zoneId == item.id && _zone.checked){
                    item.checked = true;
                }
            });
        });
        return body.data || {};
    }

	private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private fnZoneClick(checked,zone){
        if(checked){
            let exist = false;
            for(let _zone of this.deptList){
                if(_zone.zoneId == zone.id){
                    _zone.checked = exist = true;
                }
            }

            if(!exist){
                this.deptList.push({
                    zoneId: zone.id,
                    zoneName: zone.name,
                    checked: true,
                    idNamePairs: {}
                });
            }
        }else{
            for(var i=0,len=this.deptList.length; i<len; i++){
                if(this.deptList[i].zoneId == zone.id){
                    this.deptList.splice(i,1);
                }
            }
        }
        
        this.zoneClick.emit(this.deptList);

        this.activeZoneClick.emit({
            id: zone.id,
            name: zone.name,
            checked: checked
        });
    }

    private fnZoneNameClick(zone){
        this.activeZoneClick.emit(zone);
    }
}
