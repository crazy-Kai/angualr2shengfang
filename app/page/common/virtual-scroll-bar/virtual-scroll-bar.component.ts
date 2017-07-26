import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
	selector: 'virtual-scroll-bar',
	template: `
		<div class="virtual-scroll flex column">
			<span class="arrows-up"></span>
            <div class="flex1 virtual-track" style='overflow: auto;position: relative;'>
                <span class="virtual-block"></span>
            </div>
            <span class="arrows-down"></span>
		</div>
	`,
	styleUrls:[ 'virtual-scroll-bar.component.css' ]
})

export class VirtualScrollBarComponent implements OnInit{
	@Input() offsetH: any;
	@Output() handler = new EventEmitter();

    ngOnInit(){
    	
    }
    // ngAfterViewInit(){
    //     console.log(this.offsetH)
    // }

	// verify(){
	// 	this.handler.emit(true);
	// }
	// cancel(){
	// 	this.handler.emit(false);
	// }
}