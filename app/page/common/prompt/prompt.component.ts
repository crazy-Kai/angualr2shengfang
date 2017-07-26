import { Component } from '@angular/core';

@Component({
	selector: 'prompt-component',
	template: `
		<div class="prompt" *ngIf="show">
			<div class="dialog flex column" [class.showing]="show" [class.hiding]="hiding">
				<!--<div class="dialog-header">
					<button class="close" (click)="close()">×</button>
					<span class="dialog-title">
						{{title}}
					</span>
				</div>-->
				<div class="dialog-body flex1">
					<img class="dialog-icon" src="app/images/{{icon}}">
					<div class="dialog-content">
						<h3>{{tip}}</h3>
						<div *ngIf="otherTip" style="font-size:12px; color:#999;">
							{{otherTip}}
						</div>
					</div>
				</div>
				<div class="dialog-footer" [class.align-left]="!isAlert">
					<button class="btn btn-sm btn-primary" (click)="fnHandle('successCallback')">确认</button>
					<button class="btn btn-sm btn-secondary ml10" *ngIf="!isAlert" (click)="fnHandle('closeCallback')">取消</button>
				</div>
			</div>
		</div>
	`,
	styleUrls: [ 'prompt.component.css' ]
})

export class PromptComponent {
	private show: boolean = false;
	private hiding: boolean = false;
	private title: string = '提示';
	private tip: string = '提示内容';
	private otherTip: string = '';
	private successCallback: any = function(){};
	private closeCallback: any = function(){};
	private icon: string = 'save-fail.svg';
	private isAlert: boolean = true;

	alert(tip){
		this.show = true;
		if(typeof tip == 'string'){
			this.tip = tip;
		}else{
			for(let prop in tip){
				if(tip.hasOwnProperty(prop)){
					this[prop] = tip[prop];
				}
			}
		}
		
		this.isAlert = true;
	}

	close(){
		this.hiding = true;
		setTimeout(() => {
			this.show = false;
			this.hiding = false;
			this.tip = '提示内容';
			this.otherTip = '';
		}, 350)
	}

	prompt(param){
		this.show = true;
		this.isAlert = false;
		for(let prop in param){
			if(param.hasOwnProperty(prop)){
				this[prop] = param[prop];
			}
		}
	}

	fnHandle(method){
		this[method]();

		this.close();

		this.initFn();
	}

	initFn(){
		this.successCallback = function(){};
		this.closeCallback = function(){};
	}
}