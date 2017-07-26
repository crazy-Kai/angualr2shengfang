import { Component } from '@angular/core';
import { UserService } from '../../user.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Router } from '@angular/router';

@Component({
	selector: 'login',
	templateUrl: 'login.component.html',
	styleUrls: [ 'login.component.css' ]
})

export class LoginComponent {
	private title: string = '审方中心';
    private zoneTip: string = '院区';
	private userNameTip: string = '用户名';
    private passwordTip: string = '密码';
    private zone: string = '';
    private username: string = '';
    private password: string = '';
    private lockPwd: boolean = false;
    private error: string = '';

    constructor(
        private cookieService: CookieService,
        private userService: UserService,
        private router: Router
    ){}

	/**
     * 登录框中，密码输入后的回车事件
     */
    // onEnterPressed($event:any) {
    //     if ( !this.username ) {
    //         this.userNameTip = '请输入用户名';
    //         return;
    //     }

    //     if ( !this.password ) {
    //         this.passwordTip = '请输入密码';
    //         return;
    //     }


    onSubmit() {
        // let self = this;
        // this.userService.login(this.username, this.password)
        //     .then(user => {
        //         this.userService.user = user;
        //         if (this.userService.isEmptyObject(this.userService.user)) {
        //             // self.dialogPlugin.tip('用户名或者密码错误');
        //         } else {
        //             this.userService.isLogin = true;

        //             //cookie
        //             if(this.lockPwd){
        //                 this.cookieService.put('username', this.username);
        //                 this.cookieService.put('password', this.password);
        //             }else{
        //                 this.username = "";
        //                 this.password = "";

        //                 this.cookieService.remove('username');
        //                 this.cookieService.remove('password');
        //             }
        //         }
        //     },
        //     error => this.error = <any>error);
        this.userService.isLogin = true;
        this.router.navigate(['/page/audit-setting']);
    }

    fnZoneSelect($event){
        this.zone = $event.name;
    }
}