import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';


@Component({
	selector: 'confirm-component',
	template: `
		<div class="confirm-model flex column" *ngIf="isShowPrompt">
			<div class="prompt flex1">
				<h3 class="prompt-title">{{option.title}}</h3>
				<p class="prompt-explan">{{option.explan}}</p>
			</div>
			<div class="prompt-btns">
				<button type="button" class="btn btn-sm btn-primary" style="float:right;" (click)="verify()">确定</button>
				<button type="button" class="btn btn-sm btn-secondary" style="float:right;" (click)="cancel()">取消</button>
			</div>
		</div>
	`,
	styleUrls:[ 'confirm.component.css' ]
})

export class ConfirmComponent implements OnInit{
	@Input() option: any;
	@Input() isShowPrompt: boolean;
	@Output() handler = new EventEmitter();

    ngOnInit(){
    	
    }

	verify(){
		this.handler.emit(true);
	}
	cancel(){
		this.handler.emit(false);
	}
}