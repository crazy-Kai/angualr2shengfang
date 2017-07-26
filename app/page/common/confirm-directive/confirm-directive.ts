import { Directive, HostListener, ElementRef, ComponentFactoryResolver, ComponentRef, ViewContainerRef, ComponentFactory, Output, EventEmitter } from '@angular/core';
import { ConfirmComponent } from './confirm.component';

@Directive({
	selector: '[confirm-direc]',
	host: {
		'(click)' :'open($event)'
	}
})

export class ConfirmDirective {
	private componentFactory: ComponentFactory<ConfirmComponent>;
	private componentRef: ComponentRef<ConfirmComponent>;
	private positionInfo: Object;
	private isShowPrompt: boolean = false;
	
	constructor(
		private el: ElementRef,
		componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef
	){
		this.el = el;
		this.componentFactory = componentFactoryResolver.resolveComponentFactory(ConfirmComponent);
	}

	@Output() handler = new EventEmitter();


	open() {
		if(this.componentRef){
			this.componentRef.instance.isShowPrompt = true;
		}else{
			this.initComponent();
		}

		return this.componentRef;
	}

	initComponent(){
		this.componentRef = this.viewContainerRef.createComponent(this.componentFactory);
		this.componentRef.instance.option = {
			title: this.el.nativeElement.getAttribute('title'),
			explain: this.el.nativeElement.getAttribute('explain'),
		}
		this.componentRef.instance.isShowPrompt = true;
		this.componentRef.instance.handler.subscribe((result: any) => {
			this.componentRef.instance.isShowPrompt = false;
            this.handler.emit(result);
        });

		return this;
	}

}