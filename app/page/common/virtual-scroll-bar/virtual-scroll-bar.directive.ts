import { Directive, HostListener, ElementRef, ComponentFactoryResolver, ComponentRef, ViewContainerRef, ComponentFactory, Output, EventEmitter, OnInit } from '@angular/core';
import { VirtualScrollBarComponent } from './virtual-scroll-bar.component';

@Directive({
	selector: '[virtual-scroll-bar]',
	host: {
		
	}
})

export class VirtualScrollBarDirective {
	private componentFactory: ComponentFactory<VirtualScrollBarComponent>;
	private componentRef: ComponentRef<VirtualScrollBarComponent>;
	private positionInfo: Object;
	private isShowPrompt: boolean = false;
	
	constructor(
		private el: ElementRef,
		componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef
	){
		this.el = el;
		this.componentFactory = componentFactoryResolver.resolveComponentFactory(VirtualScrollBarComponent);
	}

	@Output() handler = new EventEmitter();

    ngOnInit(){
        this.initComponent();
    }

	ngAfterViewInit(){
		this.initComponent();
	}
	initComponent(){
		this.componentRef = this.viewContainerRef.createComponent(this.componentFactory);
		this.componentRef.instance.offsetH = this.el.nativeElement.getBoundingClientRect();
		
		this.componentRef.instance.handler.subscribe((result: any) => {
			this.handler.emit(result);
        });

		return this;
	}

}