import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { UploadService,FileInfo } from './upload.service';
import { DialogPlugin } from '../ug-dialog/dialog';

@Component({
    selector: 'my-upload',
    template: require('./upload.plugin.html'),
    providers: [UploadService]
})
export class UploadPlugin implements OnInit, OnChanges {
    UPLOADFILE_INSTRUCTION = "instruction";
    UPLOADFILE_DRUGARTICLE = "drugArticle";
    UPLOADFILE_COMPANYARTICLE = "companyArticle";
    UPLOADFILE_COLLECT = "collect";
    UPLOADFILE_LITERATURE = "literature";
    UPLOADFILE_NETINFO = "netinfo";
    UPLOADFILE_DATADOC = "datadoc";
    error: any;
    @Input() uploadType: string;
    @Input() typeId: string;
    @Output() uploadComplete: EventEmitter<any> = new EventEmitter();
    @ViewChild(DialogPlugin) dialogPlugin:DialogPlugin
    constructor(private uploadService: UploadService) { }

    len: number;   //之前上传的文件个数
    
    compileData: FormData[] = [];

    ngOnInit() {
        if (this.typeId) {
            this.getOrgList();
        }
    }
    ngOnChanges(changes: any){
        if(changes.typeId){
            this.typeId = changes.typeId.currentValue;
            this.getOrgList();
        }
    }
    getOrgList() {
        this.uploadService.getOrgList(this.typeId, this.uploadType)
            .then(fileData => {
                if(!this.uploadService.isEmptyObject(fileData)){
                    this.uploadService.fileList = fileData;
                    this.len = fileData.length;
                }
            },
            error => this.error = <any>error
            );
    }

    addFile(file: any) {
        let uploadfile = file.files[0];
        this.uploadService.hasProgress = true;
        this.makeFileRequest(uploadfile, this.uploadType);
    }

    updateOrgVersion(index: number, $event: any) {
        let text = $event.target.innerHTML;
        let fileVersion = 0;
        if (text == "过期") {
            fileVersion = 1;
        }
        this.uploadService.fileList[index].fileVersion = fileVersion;
        this.uploadService.updateOrgVersion(index)
            .then(fileData => {
                if (text == "过期") {
                    $event.target.innerHTML = "恢复";
                    $event.target.previousElementSibling.innerHTML = "过期版本";
                }
                else {
                    $event.target.innerHTML = "过期";
                    $event.target.previousElementSibling.innerHTML = "当前版本";
                }
            },
            error => this.error = <any>error
            );
    }

    deleteOrg(index: number) {
        if(this.uploadService.fileList[index].id){
            this.uploadService.deleteOrg(index)
                .then(fileData => {
                    this.uploadService.fileList.splice(index, 1);
                    this.len--;
                },
                error => this.error = <any>error
                );
        }else{
            this.uploadService.fileList.splice(index, 1);
            this.compileData.splice((index - this.len), 1);
        }
    }

    openFile(index: number) {
        if(!this.uploadService.fileList[index].id) return false;
        let url = "/api/v1/orgFileOpen?filePath=" + this.uploadService.fileList[index].filePath + "&fileName=" + this.uploadService.fileList[index].fileName;
        window.open(url, '_blank');
    }
    downloadFile(index: number){
        if(!this.uploadService.fileList[index].id) return false;
        let url = "/api/v1/downloadFile?filePath=" + this.uploadService.fileList[index].filePath + "&fileName=" + this.uploadService.fileList[index].fileName;
        window.open(url, '_blank');
    }

    makeFileRequest(file: File, uploadType: string) {
        
        let formData: FormData = new FormData(),
            fileData: FileInfo = new FileInfo();
        fileData.fileName = file.name;
        this.uploadService.fileList.push(fileData);
        formData.append("file", file);
        formData.append("uploadType", uploadType);
        
        //formData.append("fileName", fileData.fileName);
        this.compileData.push(formData);
    }

    uploadFiles(typeId: any){
        if(this.compileData){
            let newFilesNum: number = 0,
                totalNum: number = 0,
                successNum: number = 0;
            this.compileData.forEach((formData:any, idx:any) => {
                if(formData.typeId) return; //有id 是之前上传的文件  跳过
                this.dialogPlugin.loading("文件上传中，请勿关闭窗口。");
                newFilesNum++;
                formData.append("typeId", typeId);
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            
                            let body = JSON.parse(xhr.response);
                            let fileData = body.data;
                            if (body.code == 200) {
                                this.dialogPlugin.tip(fileData.fileName + '上传成功');
                                successNum++;
                            } else {
                                this.dialogPlugin.tip(fileData.fileName + '上传失败');
                            }
                            this.uploadService.hasProgress = false;
                        } else {
                            // observer.error(xhr.response);
                        }
                        totalNum++;

                        if(newFilesNum == totalNum){
                            let tips: string = "";
                            tips = successNum == totalNum ? "成功上传 " + successNum + " 个文件" : "成功上传 " + successNum + " 个文件，失败 " + (totalNum - successNum) + " 个文件。"
                            setTimeout(() => {
                                this.dialogPlugin.tip(tips, true);
                                setTimeout(() => {
                                    //history.back()
                                    this.uploadComplete.emit("complete");
                                }, 2000);
                            }, 1000)
                            
                         }
                    }
                };
                xhr.open('POST', this.uploadService.uploadUrl, true);
                xhr.send(formData);
            });

            if(newFilesNum == 0){   //没有新上传的文件，立即跳转
                //history.back();
                this.uploadComplete.emit("complete");
            }
        }
    }
}