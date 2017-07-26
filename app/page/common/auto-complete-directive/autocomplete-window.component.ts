import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { AutocompleteService } from './autocomplete.service';

@Component({
	selector: 'autocomplete-window',
	template: `
		<ul class="acc-list" *ngIf="isShowList" [style.width]="option.position.width" [style.left]="option.position.left" [style.top]="option.position.top">
			<li *ngFor="let result of list" (click)="fnSelect(result)" [innerHtml]="result.fixName">
			</li>
		</ul>
	`,
	styleUrls:[ 'autocomplete-window.component.css' ]
})

export class AutocompleteWindowComponent implements OnInit{
	@Input() option: any;
	@Input() isShowList: boolean;
    @Input() el: any;
	@Output() select = new EventEmitter();

    private timeout: any;
    private list: any[];

    constructor(private service: AutocompleteService){}

    ngOnInit(){
    	this.getList();
    }

	getList(){
		// clearTimeout(this.timeout);
        // let _this = this;
        // this.timeout = setTimeout(function(){
            this.service[this.option['method']](this.option['keycode']).then(list => {
            	let reg = new RegExp(this.option['keycode'], 'g');
            	for(let item of list){
            		if(item.name && this.option.highlight && this.option.keycode){
            			let name = item.name.replace(reg,`<span class="red">${this.option['keycode']}</span>`);
            			item.fixName = name;
            		}else{
                        item.fixName = item.name;
                    }
            	}
            	this.list = list;
                
                this.el.setAttribute('default','');
            });
        //}, 500);
	}

	fnSelect(result){
		this.select.emit(result);
	}
}