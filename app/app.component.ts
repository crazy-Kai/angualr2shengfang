import { Component, OnInit, Input, trigger, state, style, transition, animate, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

import './rxjs-operators';

import { Menu, SubMenu } from './menu.service';
//引入Service 
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MenuService } from './menu.service';
//引入插件
import { DialogPlugin } from './plugin/ug-dialog/dialog.plugin';
import { UserService } from './user.service';
import { Md5Util } from './util/md5';
import { PromptComponent } from './page/common/prompt/prompt.component';

declare var Notification: any;

@Component({
    selector: 'my-app',
    template: require('./app.component.html'),
    styles: [require('../src/bootstrap/css/bootstrap.min.css') + "",
    require('../src/app.common.css') + "",
    require('./app.component.css') + "",
    require('../src/style-icon.css') + ""],
    providers: [
        CookieService,
        MenuService
    ]
})
export class AppComponent implements OnInit {
    selectMenu: any;
    selectSubmenu: any;
    navOpen: boolean = true;

    private title: string = '审方中心平台';
    private zoneTip: string = '院区';
    private userNameTip: string = '用户名';
    private passwordTip: string = '密码';
    private searchParam: any = {
        zoneId: '',
        name: '',
        password: ''
    };
    private lockPwd: boolean = false;
    private error: string = '';
    private zoneName: string = '';

    @ViewChild(PromptComponent) promptComponent: PromptComponent;

    constructor(
        private cookieService: CookieService,
        private menuService: MenuService,
        private userService: UserService,
        private router: Router,
        private md5Util: Md5Util,
        private http: Http
    ) { }

    ngAfterContentInit(){
        this.initNotification();
    }
    /**
     * 登录框中，密码输入后的回车事件
     */
    onEnterPressed($event: any) {
        this.onSubmit();
    }

    onSubmit() {
        // if ( !this.searchParam.zoneId ) {
        //     this.zoneTip = '请选择院区';
        //     return;
        // }

        if (!this.searchParam.name) {
            this.userNameTip = '请输入用户名';
            return;
        }

        if (!this.searchParam.password) {
            this.passwordTip = '请输入密码';
            return;
        }

        this.userService.getMagicno().then((json) => {
            if (json.code != 200) {
                this.promptComponent.alert(json.message);
                this.userService.isLogin = false;
                return;
            }
            let password = this.md5Util.md5(this.md5Util.md5(this.searchParam.password) + json.data);
            this.userService.login({ name: this.searchParam.name, password: password, zoneId: this.searchParam.zoneId }).then((res) => {
                if (res.code == 200) {
                    this.userService.isLogin = true;
                    // 登录成功调心跳
                    this.startMsgInterval();

                    this.userService.currentUser().then(() => {
                        this.router.initialNavigation();
                        this.router.navigate(['/page/audit-setting']);

                        this.selectMenu = this.menuService.menus[0];
                        this.selectSubmenu = this.selectMenu.subMenus[0];
                    });
                } else {
                    this.promptComponent.alert(res.message);
                }
            });
        });
    }

    fnZoneSelect($event) {
        this.searchParam.zoneId = $event.id || '';
        this.zoneName = $event.name;
    }

    logout() {
        this.userService.logout();
    }

    ngOnInit() {
        this.userService.isLogin = false;
        this.userService.currentUser().then((res) => {
            this.userService.isLogin = (res.code != 402);
            if (this.userService.isLogin) {
                this.router.initialNavigation();

                // 登录成功调心跳
                this.startMsgInterval();
            }
        });
    }

    msgInfo: any[] = [];
    workInfo: boolean = false;
    startMsgInterval(){
        let that = this;
        setInterval(function(){
            that.http.put('/api/v1/auditBeating',{})
                .toPromise()
                .then(res => {
                    let result = res.json();
                    // let result = {code: 200, data: [{type:'门诊',count:0},{type:'住院',count:0}]};
                    if(result.code == 200){
                        let arr = [];
                        if(result.data){
                            if(result.data.typeCounts){
                                for(let item of result.data.typeCounts){
                                    // item['name'] = (item.type == '1' ? '门诊' : '住院');
                                    item['url'] = (item.type == '门诊' ? '/page/opt-order-audit' : '/page/ipt-order-audit');
                                    if(item.count){
                                        arr.push(item);
                                    }
                                }
                            }
                            that.workInfo =  result.data.working;
                        }else{
                            that.workInfo =  false;
                        }
                        that.msgInfo = arr;
                    }
                });
        }, 2000);
    }
    goAudit(msg: any){
        //debugger
        this.router.navigate([msg.url]);
        this.selectMenu = this.menuService.menus[1];
        if(msg.type == '住院'){
            this.selectSubmenu = this.selectMenu.subMenus[1];
        }else{
            this.selectSubmenu = this.selectMenu.subMenus[0];
        }
    }

    //切换slide
    switchNavStatus() {
        this.navOpen = !this.navOpen;
        //this.selectedMenu = null;
    }
    //鼠标移入执行
    mouseoverSelectMenu(menu: any) {
        if (this.navOpen) {
            return
        } else {
            this.selectMenu = menu;
        }
    }
    //鼠标移出执行
    mouseoutSelectMenu(menu: any) {
        if (this.navOpen) {
            return
        } else {
            this.selectMenu = !menu;
        }
    }

    /**
     * 
     */
    initNotification(){
        setTimeout(()=>{
            if(Notification && Notification.permission !== 'granted'){
                Notification.requestPermission((status) => {

                })
            }else{
                if(document.hidden || document.visibilityState == 'hidden')
                    var n = new Notification('Hi!');
            }
        })
        
        
        //this.docTitle();
    }
    hasNewAudit(oldList:any, newList:any){

    }
    
    docTitle(tips?: string){
        let homeTitle = document.title;
        let tipsTitle = tips || '想在浏览器中展示HTML代码(高亮显示标签)';
        let counter = 0, totalLen = tipsTitle.length;
        document.title = tipsTitle;
        let scrollTitle = function() {
            if(counter == totalLen){
                tipsTitle = tips || '想在浏览器中展示HTML代码(高亮显示标签)';
                counter = 0;
            }
            tipsTitle = tipsTitle.substring(1, tipsTitle.length);
            document.title = tipsTitle;
            counter++;
        };

        setInterval(() => {
            scrollTitle();
        }, 250)
    }
}
