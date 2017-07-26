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
var upload_service_1 = require('./upload.service');
var dialog_1 = require('../ug-dialog/dialog');
var UploadPlugin = (function () {
    function UploadPlugin(uploadService) {
        this.uploadService = uploadService;
        this.UPLOADFILE_INSTRUCTION = "instruction";
        this.UPLOADFILE_DRUGARTICLE = "drugArticle";
        this.UPLOADFILE_COMPANYARTICLE = "companyArticle";
        this.UPLOADFILE_COLLECT = "collect";
        this.UPLOADFILE_LITERATURE = "literature";
        this.UPLOADFILE_NETINFO = "netinfo";
        this.UPLOADFILE_DATADOC = "datadoc";
        this.uploadComplete = new core_1.EventEmitter();
        this.compileData = [];
    }
    UploadPlugin.prototype.ngOnInit = function () {
        if (this.typeId) {
            this.getOrgList();
        }
    };
    UploadPlugin.prototype.ngOnChanges = function (changes) {
        if (changes.typeId) {
            this.typeId = changes.typeId.currentValue;
            this.getOrgList();
        }
    };
    UploadPlugin.prototype.getOrgList = function () {
        var _this = this;
        this.uploadService.getOrgList(this.typeId, this.uploadType)
            .then(function (fileData) {
            if (!_this.uploadService.isEmptyObject(fileData)) {
                _this.uploadService.fileList = fileData;
                _this.len = fileData.length;
            }
        }, function (error) { return _this.error = error; });
    };
    UploadPlugin.prototype.addFile = function (file) {
        var uploadfile = file.files[0];
        this.uploadService.hasProgress = true;
        this.makeFileRequest(uploadfile, this.uploadType);
    };
    UploadPlugin.prototype.updateOrgVersion = function (index, $event) {
        var _this = this;
        var text = $event.target.innerHTML;
        var fileVersion = 0;
        if (text == "过期") {
            fileVersion = 1;
        }
        this.uploadService.fileList[index].fileVersion = fileVersion;
        this.uploadService.updateOrgVersion(index)
            .then(function (fileData) {
            if (text == "过期") {
                $event.target.innerHTML = "恢复";
                $event.target.previousElementSibling.innerHTML = "过期版本";
            }
            else {
                $event.target.innerHTML = "过期";
                $event.target.previousElementSibling.innerHTML = "当前版本";
            }
        }, function (error) { return _this.error = error; });
    };
    UploadPlugin.prototype.deleteOrg = function (index) {
        var _this = this;
        if (this.uploadService.fileList[index].id) {
            this.uploadService.deleteOrg(index)
                .then(function (fileData) {
                _this.uploadService.fileList.splice(index, 1);
                _this.len--;
            }, function (error) { return _this.error = error; });
        }
        else {
            this.uploadService.fileList.splice(index, 1);
            this.compileData.splice((index - this.len), 1);
        }
    };
    UploadPlugin.prototype.openFile = function (index) {
        if (!this.uploadService.fileList[index].id)
            return false;
        var url = "/api/v1/orgFileOpen?filePath=" + this.uploadService.fileList[index].filePath + "&fileName=" + this.uploadService.fileList[index].fileName;
        window.open(url, '_blank');
    };
    UploadPlugin.prototype.downloadFile = function (index) {
        if (!this.uploadService.fileList[index].id)
            return false;
        var url = "/api/v1/downloadFile?filePath=" + this.uploadService.fileList[index].filePath + "&fileName=" + this.uploadService.fileList[index].fileName;
        window.open(url, '_blank');
    };
    UploadPlugin.prototype.makeFileRequest = function (file, uploadType) {
        var formData = new FormData(), fileData = new upload_service_1.FileInfo();
        fileData.fileName = file.name;
        this.uploadService.fileList.push(fileData);
        formData.append("file", file);
        formData.append("uploadType", uploadType);
        //formData.append("fileName", fileData.fileName);
        this.compileData.push(formData);
    };
    UploadPlugin.prototype.uploadFiles = function (typeId) {
        var _this = this;
        if (this.compileData) {
            console.log(this.compileData);
            var newFilesNum_1 = 0, totalNum_1 = 0, successNum_1 = 0;
            this.compileData.forEach(function (formData, idx) {
                if (formData.typeId)
                    return; //有id 是之前上传的文件  跳过
                _this.dialogPlugin.loading("文件上传中，请勿关闭窗口。");
                newFilesNum_1++;
                formData.append("typeId", typeId);
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var body = JSON.parse(xhr.response);
                            var fileData = body.data;
                            if (body.code == 200) {
                                _this.dialogPlugin.tip(fileData.fileName + '上传成功');
                                successNum_1++;
                            }
                            else {
                                _this.dialogPlugin.tip(fileData.fileName + '上传失败');
                            }
                            _this.uploadService.hasProgress = false;
                        }
                        else {
                        }
                        totalNum_1++;
                        if (newFilesNum_1 == totalNum_1) {
                            var tips_1 = "";
                            tips_1 = successNum_1 == totalNum_1 ? "成功上传 " + successNum_1 + " 个文件" : "成功上传 " + successNum_1 + " 个文件，失败 " + (totalNum_1 - successNum_1) + " 个文件。";
                            setTimeout(function () {
                                _this.dialogPlugin.tip(tips_1, true);
                                setTimeout(function () {
                                    //history.back()
                                    _this.uploadComplete.emit("complete");
                                }, 2000);
                            }, 1000);
                        }
                    }
                };
                xhr.open('POST', _this.uploadService.uploadUrl, true);
                xhr.send(formData);
            });
            if (newFilesNum_1 == 0) {
                //history.back();
                this.uploadComplete.emit("complete");
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UploadPlugin.prototype, "uploadType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], UploadPlugin.prototype, "typeId", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], UploadPlugin.prototype, "uploadComplete", void 0);
    __decorate([
        core_1.ViewChild(dialog_1.DialogPlugin), 
        __metadata('design:type', dialog_1.DialogPlugin)
    ], UploadPlugin.prototype, "dialogPlugin", void 0);
    UploadPlugin = __decorate([
        core_1.Component({
            selector: 'my-upload',
            template: require('./upload.plugin.html'),
            providers: [upload_service_1.UploadService]
        }), 
        __metadata('design:paramtypes', [upload_service_1.UploadService])
    ], UploadPlugin);
    return UploadPlugin;
}());
exports.UploadPlugin = UploadPlugin;
//# sourceMappingURL=upload.plugin.js.map