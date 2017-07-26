import { Directive, ElementRef, HostListener, Input, Output, EventEmitter,
    Type,
  OnInit,
  Component,
  Injector,
  TemplateRef,
  ViewRef,
  ViewContainerRef,
  Renderer,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core';

enum Key {
  Tab = 9,
  Enter = 13,
  Escape = 27,
  ArrowUp = 38,
  ArrowDown = 40
}

export class ContentRef {
  constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}
}


@Component({
  selector: 'typeahead-window',
  exportAs: 'TypeaheadWindow',
  template: `
    <div class="typeahead-window" (click)="onClick()">
        {{ inputContent }}
    </div>
  `,
  styles: [`
    .typeahead-window {
        background-color:red;
        position:absolute;

    }
  `]
})
export class TypeaheadWindow implements OnInit {
    @Input("inputContent") inputContent: string;
    @Output("testEvent") testEvent = new EventEmitter();
    ngOnInit() { 

    }
    onClick() {
        this.testEvent.emit("测试下点击");
    }
}

@Directive({ 
    selector: 'input[typeahead]',
    host: {
        '(blur)': 'handleBlur()',
        // '[class.open]': 'isPopupOpen()',
        // '(document:click)': 'dismissPopup()',
        '(keyup)': 'onkeyup($event)'
        // 'autocomplete': 'off',
        // 'autocapitalize': 'off',
        // 'autocorrect': 'off'
    }
})
export class TypeaheadDirective {
    private _windowFactory: ComponentFactory<TypeaheadWindow>;
    private _windowRef: ComponentRef<TypeaheadWindow>;
    private _contentRef: ContentRef;
    private el: ElementRef;
    constructor(el: ElementRef, 
        // type: any, 
        private _injector: Injector, 
        private _viewContainerRef: ViewContainerRef, 
        private _renderer: Renderer,
        componentFactoryResolver: ComponentFactoryResolver) {
            this._windowFactory = componentFactoryResolver.resolveComponentFactory(TypeaheadWindow);
        
        this.el = el;
    }
    @Input('typeahead') typeahead: string;
    @Input('source') source: string;
    
    onkeyup($event : any) {
        this.open();

        console.dirxml(this.el);
        console.dirxml(this._windowRef);
        this._windowRef.instance.inputContent = this.el.nativeElement.value;
    }

    handleBlur() {
        // this.close();
    }

    open(): ComponentRef<TypeaheadWindow> {
        if (!this._windowRef) {
            this._windowRef = this._viewContainerRef.createComponent(this._windowFactory);
            this.el.nativeElement.style.backgroundColor = 'yellow';
            this._windowRef.instance.testEvent.subscribe((result: any) => {
                this.close();
            });
        }
        
        return this._windowRef;
    }

    close() {
        if (this._windowRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
            this._windowRef = null;
        }
        this.el.nativeElement.style.backgroundColor = 'white';
    }
}