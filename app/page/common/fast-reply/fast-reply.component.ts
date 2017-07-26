import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Position, layout } from '../../../util/position';
import { PromptComponent } from '../../../page/common/prompt/prompt.component';

import { FastReplyService } from '../../../page/common/fast-reply/fast-reply.server';





@Component({
	selector: 'fast-reply-component',
	template: `
<div class="btn-group btn-fast-reply" uib-dropdown is-open="status.isopen" #relydom>
    <img id="single-button" src="/app/images/reply-info.svg" class="img-fast-reply" uib-dropdown-toggle ng-disabled="disabled" (click)="fastReplySelect()"/>
	<div class="popup fast-reply-whole" *ngIf="isFastReplySelect" (click)="stopPropagation($event)">
		<div class="popup-case electronic-medical-record" id="popupCase">
			<div class="fast-reply-management">
				<div class="popup-body text-left popup-case-text">
					<ul *ngFor="let reply of replyTemplateList">
						<li (click)="replySelect(reply)" ng-mouseover="this.style.cursor='hand'">{{reply.replyTemplate}}</li>
					</ul>
					<span class="fast-reply-guide" (click)="fastReplyManagement()" is-open="status.isopen" ng-mouseover="this.style.cursor='hand'">管理快捷回复</span>
				</div>
				<div class="triangle"></div>
			</div>
		</div>
	</div>
</div>

<div class="fast-reply-management-model" *ngIf="isFastReplyManagement">
    <div class="fast-reply-management-model-body text-center">
        <div class="text-right"><img (click)="isFastReplyManagement=false" id="closeCase" class="closeCase" src="/app/images/close-1.svg" alt="关闭" ng-mouseover="this.style.cursor='hand'"></div>
        <div class="fast-reply-management-model-header">
            <span>快捷回复管理</span>
        </div>
        <div class="fast-reply-management-table">
            <table class="table table-bordered text-center table-striped">
                <tbody>
                    <tr *ngFor="let reply of replyTemplateList">
                        <td class="col-xs-8 td-one">{{reply.replyTemplate}}</td>
                        <td><span *ngIf="reply.userId!='0'" class="icon-delete" ng-mouseover="this.style.cursor='hand'" (click)="deleteReplyTemplate(reply)"></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <textarea rows="3" class="fast-reply-text form-control" #fastReplyText [(ngModel)]="replyTemplate" placeholder="请输入快捷回复，不多于50字"></textarea>
        <button class="fast-reply-add" (click)="addReplyTemplate(replyTemplate)">
			<span>添加</span>
		</button>
    </div>
</div>
<prompt-component></prompt-component>`,
	styleUrls: ['fast-reply.component.css']
})

export class FastReplyComponent implements OnInit {
	private isFastReplySelect: boolean = false;
	private isFastReplyManagement: boolean = false;

	private replyTemplateList: any;

	onReplyTemplate: {
		userId: "",
		replyTemplate: ""
	}

	// private replyTemplateList:any;
	_input: string;
	@Input()
	set input(v: string) {
		this._input = v;
	}

	get input(): string {
		return this._input;
	}


	@Output() onReplySelected = new EventEmitter();



	replySelect(reply) {
		let replyTemplate = reply.replyTemplate;
		this.onReplySelected.emit(replyTemplate);
		this.isFastReplySelect = false;
	}

	constructor(
		private fastReplyService: FastReplyService
	) { }
	position: Object = {
		right: 0,
		top: 0,
		width: 0
	};

	ngOnInit() {

	};

	ngOnChanges(changes) {
	};

	@ViewChild("relydom") relydom: any;
	@ViewChild("fastReplyText") fastReplyText: any;
	@ViewChild(PromptComponent) promptComponent: PromptComponent;


	setPosition() {
		// this.quickReply = quickReply;
		this.position = layout(this.relydom.nativeElement);
		// this.position['top'] = Math.floor(this.position['top']) + 219 + 'px';
		// this.position['left'] = Math.floor(this.position['left']) + 222 + 'px';
	}
	//快捷回复弹框隐藏显示
	fastReplySelect() {
		//this.setPosition();
		if (this.isFastReplySelect) {
			this.isFastReplySelect = false;
		} else {
			this.isFastReplySelect = true;
		}
		this.getReplyTemplateList();
	}

	//打开快捷回复model
	fastReplyManagement() {
		this.isFastReplyManagement = true;
		this.getReplyTemplateList();
	}

	stopPropagation($event) {
		$event.stopPropagation();
	}

	//获取快捷回复模板列表
	getReplyTemplateList() {
		this.fastReplyService.getReplyTemplateList().then(response => {
			let replyTemplateList = [];
			let replyTemplate, id, userId;
			for (let replyTempleElement of response.data) {
				replyTemplate = replyTempleElement.replyTemplate;
				id = replyTempleElement.id;
				userId = replyTempleElement.userId;
				replyTemplateList.push({ replyTemplate: replyTemplate, id: id, userId: userId });
			}
			this.replyTemplateList = replyTemplateList;
			// for(let reply of replyTemplateList)	{
			// }	
		})
	}

	//添加快捷回复
	addReplyTemplate(replyTemplate) {
		let params = { replyTemplate: replyTemplate }
		if (replyTemplate == "" || replyTemplate == null || replyTemplate == undefined) {
			this.promptComponent.alert("请输入快捷回复信息。");
		} else if (this.replyTemplateList.length != 0) {
			let flag = false;
			for (let onReplyTemplate of this.replyTemplateList) {
				if (replyTemplate == onReplyTemplate.replyTemplate) {
					this.promptComponent.alert("已存在相同名称的回复模板，请重新添加。");
					flag = true;
					break;
				}
			}
			if (flag == false) {
				this.fastReplyService.addReplyTemplateService(params).then(response => {
					this.getReplyTemplateList();//添加成功后重新获取list
				});
			}			
		} else {
			this.fastReplyService.addReplyTemplateService(params).then(response => {
				this.getReplyTemplateList();//添加成功后重新获取list
			});
		}
	}

	//删除快捷回复
	deleteReplyTemplate(reply) {
		let me = this;
		const params = { id: reply.id };
		this.promptComponent.prompt({
			title: '确认',
			icon: 'question-2.svg',
			tip: '是否确认删除快捷回复信息？',
			successCallback() {
				me.fastReplyService.deleteReplyTemplate(params).then(response => {
					me.getReplyTemplateList(); //删除成功后重新取快捷回复list
				})
			}
		});
	}
}