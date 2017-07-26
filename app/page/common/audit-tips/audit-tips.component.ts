import 'rxjs/add/operator/switchMap';
import { Component, OnInit, Input }      from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

@Component({
    selector: 'audit-tips',
    templateUrl: 'audit-tips.component.html',
    styleUrls: [ 'audit-tips.component.css' ]
})
export class AutidTipsComponent implements OnInit{
    @Input() options: any;
    //@Input() data: any;

    private agreeResult: any;
    private refuseResult: any;
    private type: number;
    ngOnInit(){

    }
    
}