import { Directive, HostListener, ElementRef, ComponentFactoryResolver, ComponentRef, ViewContainerRef, ComponentFactory, Output, EventEmitter, Renderer } from '@angular/core';
import { AutocompleteWindowComponent } from './autocomplete-window.component';
import { Position, layout } from '../../../util/position';

@Directive({
	selector: '[autocomplete]',
	host: {
		'(keyup)' :'onkeyup($event)',
		'(focus)' :'onkeyup($event)'
	}
})

export class AutocompleteDirective {
	private componentFactory: ComponentFactory<AutocompleteWindowComponent>;
	private componentRef: ComponentRef<AutocompleteWindowComponent>;
	private positionInfo: Object;
	private isShowList: boolean = false;
	private timeout: any;
	constructor(
		private el: ElementRef,
		componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
		private renderer: Renderer
	){
		this.el = el;
		this.componentFactory = componentFactoryResolver.resolveComponentFactory(AutocompleteWindowComponent);
		
		renderer.listenGlobal('document','click',($event)=>{
            if($event.target.nodeName != 'INPUT' && this.componentRef && this.componentRef.instance){
                this.componentRef.instance.isShowList = false;
            }
        });
	}

	@Output() onChoosed = new EventEmitter();

	onkeyup($event: any){
		if($event.keyCode == '8'){
			this.onChoosed.emit($event.target.value);
		}else{
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.open();
			}, 500)
		}
	}

	open() {
		this.destroyComponent().initComponent();

		return this.componentRef;
	}

	initComponent(){
		this.componentRef = this.viewContainerRef.createComponent(this.componentFactory);
		this.positionInfo = layout(this.el.nativeElement);

		this.componentRef.instance.option = {
			method: this.el.nativeElement.getAttribute('method'),
			keycode: this.el.nativeElement.getAttribute('default') ? '' : this.el.nativeElement.value,
			position: this.positionInfo,
			highlight: this.el.nativeElement.getAttribute('highlight') || false
		}
		this.componentRef.instance.isShowList = true;
		this.componentRef.instance.el = this.el.nativeElement;
		this.componentRef.instance.select.subscribe((result: any) => {
            this.onChoosed.emit(result);
        });

		return this;
	}

	destroyComponent(){
		if(this.componentRef){
			this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.componentRef.hostView));
		}

		return this;
	}

	close(){
		this.isShowList = false;
	}

	// @HostListener('document:click',[])
	// onDocumentClick(){
	// 	if(this.componentRef){
	// 		this.componentRef.instance.isShowList = false;
	// 	}
	// }
}