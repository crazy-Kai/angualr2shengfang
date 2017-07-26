/**
 *  @author: anwen
 *  @Description:TODO(用户模块涉及的接口)     
 */

import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {InterceptorService } from 'ng2-interceptors';
import {User}           from './user';

class ActiveAuditPlan {
    id: string;
    status: boolean;

    constructor(){
        this.status = false;
    }
}

@Injectable()
export class UserService {
    isLogin = false;
    user = new User();
    constructor(private http: InterceptorService ) { }

    // userInfoUrl = '/api/v1/currentUser.json';  // URL to web API
    // authGroupUrl = '/api/v1/authGroup';//基本信息
    // authGroupListUrl = '/api/v1/authGroupList';
    // authGroupUserUrl = '/api/v1/authGroupUser';//用户授权
    // authGroupMenuUrl = '/api/v1/authGroupMenu';//用户授权--修改
    // authInfoUrl = '/api/v1/authGroupDetail';
    // authResourceUrl = '/api/v1/checkedResource';
    // auditPermissionOwnerListUrl = '/api/v1/permissionUsers?permission='; //根据权限获取用户列表
    // createPermissionOwnerListUrl = '/api/v1/authUserDtos'
    magicnoUrl = '/api/v1/magicno';
    loginUrl = '/api/v1/login';
    currentUserUrl = '/api/v1/currentUser';
    logoutUrl = '/api/v1/logout';
    /**
     * 当前角色正在进行的审方方案
     */
    activeAuditPlan: ActiveAuditPlan = new ActiveAuditPlan();


    getMagicno(): Promise<any>{
        return this.http.get(this.magicnoUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    login(param): Promise<any>{
        return this.http.post(this.loginUrl+'?name='+param.name+'&password='+param.password+'&zoneId='+param.zoneId,{})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    currentUser(): Promise<any>{
        return this.http.get(this.currentUserUrl)
            .toPromise()
            .then(res => {
                let data = this.extractData(res);
                this.user = data.data;
                return data;
            })
            .catch(this.handleError);
    }

    logout(): Promise<any>{
        return this.http.post(this.logoutUrl, {})
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    // getAuditPermissionOwnerList(permission: string): Promise<any> {
    //     let tempUrl = this.auditPermissionOwnerListUrl + permission;
    //     return this.http.get(tempUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // };

    // getCreatePermissionOwnerList(): Promise<any> {
    //     return this.http.get(this.createPermissionOwnerListUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }

    // getUserInfo(): Promise<User> {
    //     return this.http.get(this.userInfoUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // };

    // logout() {
    //     return this.http.delete(this.userInfoUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // };

    // login(username: string, password: string): Promise<User> {
    //     let data = {
    //         "username": username,
    //         "password": password
    //     }
    //     let body = JSON.stringify(data);
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(this.userInfoUrl, body, options)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // };

    // getAuthGroupList(): Promise<any> {
    //     return this.http.get(this.authGroupListUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }

    // //判断是否能使用该权限
    // hasJurisdiction(juri: string, debug?: boolean) {
    //     if (debug) {
    //         console.log("权限校验字符：" + juri);
    //         console.log("当前角色的权限表:");
    //         console.dir(this.user.userResources);
    //     }

    //     if (this.user.username =='admin')
    //         return true;
    //     if (!this.user.userResources)
    //         return false;
            
    //     return this.user.userResources.indexOf(juri) != -1 ? true : false;
    // }

    // /****基本信息 authGroup
    //  * -putAuthInfo
    //  *  修改用户组基本信息
    //  * -postAuthInfo
    //  *  新增用户组基本信息
    //  * -deleteAuthGroup
    //  *  删除用户组
    //  */
    // putAuthInfo(auth: any) {
    //     let body = JSON.stringify(auth);
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.put(this.authGroupUrl, body, options)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }
    // postAuthInfo(auth: any) {
    //     let body = JSON.stringify(auth);
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(this.authGroupUrl, body, options)
    //         .toPromise()
    //         .then(this.extractJson)
    //         .catch(this.handleError);
    // }
    // deleteAuthGroup(authId: string) {
    //     let tempUrl = this.authGroupUrl + "?authGroupId=" + authId;
    //     return this.http.delete(tempUrl)
    //         .toPromise()
    //         .then(this.extractJson)
    //         .catch(this.handleError);

    // }
    // //根据id获取用户组基本信息
    // getAuthInfo(id: string): Promise<any> {
    //     let tempUrl = this.authInfoUrl + '?authGroupId=' + id;
    //     return this.http.get(tempUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }

    // /********功能权限
    //  *  -getAuthResource
    //  *   根据id获取功能权限
    //  * - postAuthGroupMenu
    //  *   保存功能权限
    //  */

    // //根据id获取功能权限
    // getAuthResource(id: string): Promise<any> {
    //     let tempUrl = this.authResourceUrl + '?groups=' + id;
    //     return this.http.get(tempUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }

    // putAuthGroupMenu(authGroupId: string, menus: any[]) {
    //     let tempUrl = this.authGroupMenuUrl + "?authGroupId=" + authGroupId;
    //     for (let i = 0; i < menus.length; i++) {
    //         tempUrl += '&menus=' + menus[i].id;
    //     }
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.put(tempUrl, options)
    //         .toPromise()
    //         .then(this.extractJson)
    //         .catch(this.handleError);
    // }

    // /****用户授权
    //  * -addAuthGroupUser
    //  *  新增用户
    //  * -deleteAuthGroupUser
    //  *  删除用户
    //  */
    // addAuthGroupUser(authGroupId: string, authUserId: string) {
    //     let tempUrl = this.authGroupUserUrl + "?authGroupId=" + authGroupId + "&authUserId=" + authUserId;
    //     let headers = new Headers({ 'Content-Type': 'application/json' });
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(tempUrl, options)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }
    // deleteAuthGroupUser(authGroupId: string, authUserId: string) {
    //     let tempUrl = this.authGroupUserUrl + "?authGroupId=" + authGroupId + "&authUserId=" + authUserId;
    //     return this.http.delete(tempUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: any;
        try {
            body = res.json();
        } catch (error) {
            return {};
        } 

        if(body.code==500) this.isLogin = false;
        return body || {};
    }
    //返回带message的结果
    private extractJson(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: any;
        try {
            body = res.json();
        } catch (error) {
            return {};    
        }

        if(body.code==500) this.isLogin = false;
        return body || {};
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    isEmptyObject(obj: any) {
        for (var name in obj) {
            return false;
        }
        return true;
    }

}
