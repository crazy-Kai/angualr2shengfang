import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {InterceptorService } from 'ng2-interceptors';

export class FileInfo {
    id: string;
    fileName: string;
    fileVersion: any;
    filePath: string;
}

@Injectable()
export class UploadService {
    hasProgress = false;
    fileList: FileInfo[] = [];
    progress: number;
    constructor(
        private http: InterceptorService) { }
    getOrgListUrl = '/api/v1/getOrgList';
    uploadUrl = '/api/v1/uploadFileOrg';
    updateOrgVersionUrl = '/api/v1/updateOrgVersion';
    deleteOrgUrl = '/api/v1/delOrg';
    downloadUrl = '/api/v1/downloadFile';

    getOrgList(typeId: string, uploadType: string) {
        let tempUrl = this.getOrgListUrl + "?typeId=" + typeId + "&uploadType=" + uploadType;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    //fileVersion = 1为过期，0为当前
    updateOrgVersion(index: number): Promise<any> {
        let fileData = this.fileList[index];
        let body = JSON.stringify(fileData);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(this.updateOrgVersionUrl, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    deleteOrg(index: number): Promise<any> {
        let tempUrl = this.deleteOrgUrl + "?filePath=" + this.fileList[index].filePath + "&id=" + this.fileList[index].id;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    // downloadFile(index: number): Promise<any> {
    //     let tempUrl = this.downloadUrl + "?fileName=" + this.fileList[index].fileName + "&filePath=" + this.fileList[index].filePath;
    //     return this.http.get(tempUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || {};
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