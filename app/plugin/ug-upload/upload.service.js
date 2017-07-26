"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var ng2_interceptors_1 = require('ng2-interceptors');
var FileInfo = (function () {
    function FileInfo() {
    }
    return FileInfo;
}());
exports.FileInfo = FileInfo;
var UploadService = (function () {
    function UploadService(http) {
        this.http = http;
        this.hasProgress = false;
        this.fileList = [];
        this.getOrgListUrl = '/api/v1/getOrgList';
        this.uploadUrl = '/api/v1/uploadFileOrg';
        this.updateOrgVersionUrl = '/api/v1/updateOrgVersion';
        this.deleteOrgUrl = '/api/v1/delOrg';
        this.downloadUrl = '/api/v1/downloadFile';
    }
    UploadService.prototype.getOrgList = function (typeId, uploadType) {
        var tempUrl = this.getOrgListUrl + "?typeId=" + typeId + "&uploadType=" + uploadType;
        return this.http.get(tempUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    //fileVersion = 1为过期，0为当前
    UploadService.prototype.updateOrgVersion = function (index) {
        var fileData = this.fileList[index];
        var body = JSON.stringify(fileData);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(this.updateOrgVersionUrl, body, options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    UploadService.prototype.deleteOrg = function (index) {
        var tempUrl = this.deleteOrgUrl + "?filePath=" + this.fileList[index].filePath + "&id=" + this.fileList[index].id;
        return this.http.delete(tempUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    // downloadFile(index: number): Promise<any> {
    //     let tempUrl = this.downloadUrl + "?fileName=" + this.fileList[index].fileName + "&filePath=" + this.fileList[index].filePath;
    //     return this.http.get(tempUrl)
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }
    UploadService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        return body.data || {};
    };
    UploadService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    UploadService.prototype.isEmptyObject = function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };
    UploadService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [ng2_interceptors_1.InterceptorService])
    ], UploadService);
    return UploadService;
}());
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map