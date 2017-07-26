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
/**
 *  @author: anwen
 *  @Description:TODO(列表组件)
 */
var core_1 = require('@angular/core');
var table_1 = require('./table');
var table_model_1 = require('./table.model');
var dialog_1 = require('../ug-dialog/dialog');
var ng2_interceptors_1 = require('ng2-interceptors');
var TChangeCell = (function () {
    function TChangeCell() {
    }
    TChangeCell.prototype.onMouseDown = function ($event) {
        var tcell = $event.target;
        while (tcell.tagName.toUpperCase() !== 'TH') {
            tcell = tcell.parentElement;
        }
        this.tTD = tcell;
        if ($event.offsetX > this.tTD.offsetWidth - 10) {
            this.tTD.mouseDown = true;
            this.tTD.oldX = $event.x;
            this.tTD.oldWidth = this.tTD.offsetWidth;
        }
    };
    TChangeCell.prototype.onMouseUp = function ($event) {
        var tcell = $event.target;
        while (tcell.tagName.toUpperCase() !== 'TH') {
            tcell = tcell.parentElement;
        }
        if (this.tTD == undefined)
            this.tTD = tcell;
        this.tTD.mouseDown = false;
        this.tTD.style.cursor = 'default';
    };
    TChangeCell.prototype.onMouseMove = function ($event) {
        var tcell = $event.target;
        while (tcell.tagName.toUpperCase() !== 'TH') {
            tcell = tcell.parentElement;
        }
        //更改鼠标样式
        if ($event.offsetX > tcell.offsetWidth - 10) {
            tcell.style.cursor = 'col-resize';
        }
        else
            tcell.style.cursor = 'default';
        //取出暂存的Table Cell
        if (this.tTD == undefined)
            this.tTD = tcell;
        //调整宽度
        if (this.tTD.mouseDown != null && this.tTD.mouseDown == true) {
            this.tTD.style.cursor = 'default'; //默认
            if ((this.tTD.oldWidth + ($event.x - this.tTD.oldX)) > 0) {
                this.tTD.width = this.tTD.oldWidth + ($event.x - this.tTD.oldX);
            }
            this.tTD.style.width = this.tTD.width;
            this.tTD.style.cursor = 'col-resize';
        }
    };
    __decorate([
        //用来存储当前更改宽度的Table cell，避免快速移动鼠标的问题
        core_1.HostListener('mousedown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TChangeCell.prototype, "onMouseDown", null);
    __decorate([
        core_1.HostListener('mouseup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TChangeCell.prototype, "onMouseUp", null);
    __decorate([
        core_1.HostListener('mousemove', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], TChangeCell.prototype, "onMouseMove", null);
    TChangeCell = __decorate([
        core_1.Directive({ selector: 'th[cell]' }), 
        __metadata('design:paramtypes', [])
    ], TChangeCell);
    return TChangeCell;
}());
exports.TChangeCell = TChangeCell;
//用于设置url，快速获取列表数据
var TableService = (function () {
    function TableService(http) {
        this.http = http;
        //testurl ="/api/v1/productList.json?numPerPage={pageSize}&pageNum={currentPage}";
        //pattern = /\{[A-Za-z]*\}/g;
        this.patternCurr = /\{currentPage\}/;
        this.patternSize = /\{pageSize\}/;
    }
    TableService.prototype.loadDataByUrl = function (url, currentPage, pageSize) {
        url = this.setPageInfo(url, currentPage, pageSize);
        return this.http.get(url)
            .toPromise()
            .then(this.extractJson)
            .catch(this.handleError);
    };
    TableService.prototype.setPageInfo = function (url, currentPage, pageSize) {
        if (url) {
            url = url.replace(this.patternCurr, currentPage + "");
            url = url.replace(this.patternSize, pageSize + "");
        }
        return url;
    };
    TableService.prototype.extractJson = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        return body || {};
    };
    TableService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    TableService.prototype.isEmptyObject = function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };
    TableService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [ng2_interceptors_1.InterceptorService])
    ], TableService);
    return TableService;
}());
var TablePlugin = (function () {
    function TablePlugin(tableService, tableModel, elementRef) {
        this.tableService = tableService;
        this.tableModel = tableModel;
        this.elementRef = elementRef;
        this.table = new table_1.TableOption();
        this.emitPagination = new core_1.EventEmitter();
        this.blinkPage = 1; //跳转页
        this.pagination = {}; //分页信息
        this.onClick = new core_1.EventEmitter();
        this.onDblClick = new core_1.EventEmitter();
        this.onCheck = new core_1.EventEmitter(); //type
    }
    TablePlugin.prototype.ngAfterViewInit = function () {
        this.table.elementRef = this.elementRef; //elementRef
    };
    TablePlugin.prototype.ngOnInit = function () {
        this.table = this.tableModel.extend(new table_1.TableOption(), this.table); //设置默认值
        if (this.oriArrData) {
            this.tableModel.checkedRowsArr = this.oriArrData;
        }
        if (this.table.url && !this.notInit) {
            this.loadDataByUrl();
        }
        this.idAttr = this.idAttr ? this.idAttr : 'id';
    };
    /****判断是否是带有checkbox */
    TablePlugin.prototype.hasCheckboxInTable = function () {
        for (var i = 0; i < this.table.title.length; i++) {
            if (this.table.title[i].type == 'checkbox')
                return true;
        }
        return false;
    };
    TablePlugin.prototype.loadDataByUrl = function (url, isSearch) {
        var _this = this;
        var params = arguments;
        if (arguments.length > 0) {
            for (var i = 0; i < arguments.length; i++) {
                if (typeof (arguments[i]) == 'string') {
                    this.table.url = url;
                }
                else if (typeof (arguments[i]) == 'boolean' && arguments[i]) {
                    this.table.currentPage = 1;
                }
            }
        }
        this.pagination.pageSize = this.table.pageSize;
        this.pagination.currentPage = this.table.currentPage;
        this.emitPagination.emit(this.pagination);
        this.tableService.loadDataByUrl(this.table.url, this.table.currentPage, this.table.pageSize)
            .then(function (response) {
            var result = response.data;
            if (response.code != 200 && response.code != 410) {
                _this.dialogPlugin.tip(response.message);
                return;
            }
            _this.table.dataList = _this.tableModel.getDataListFromResult(result, _this.table.dataListPath);
            if (_this.tableService.isEmptyObject(_this.table.dataList)) {
                _this.table.currentPage = 1;
                _this.table.totalCount = 0;
                _this.table.totalPageCount = 0;
            }
            else {
                _this.table.totalCount = _this.tableModel.getCountFromResult(result, _this.table.itemCountPath);
                _this.table.totalPageCount = _this.tableModel.getCountFromResult(result, _this.table.pageCountPath)
                    ? _this.tableModel.getCountFromResult(result, _this.table.pageCountPath) : Math.ceil(_this.table.totalCount / _this.table.pageSize);
                if (_this.table.currentPage > _this.table.totalPageCount) {
                    _this.table.currentPage = _this.table.totalPageCount;
                    _this.loadDataByUrl();
                }
            }
        }, function (error) { return _this.error = error; });
    };
    //页面点击跳转事件
    TablePlugin.prototype.prePage = function () {
        this.table.currentPage--;
        this.loadDataByUrl();
    };
    TablePlugin.prototype.nextPage = function () {
        this.table.currentPage++;
        this.loadDataByUrl();
    };
    TablePlugin.prototype.turnToHomePage = function () {
        this.table.currentPage = 1;
        this.loadDataByUrl();
    };
    TablePlugin.prototype.turnToEndPage = function () {
        this.table.currentPage = this.table.totalPageCount;
        this.loadDataByUrl();
    };
    TablePlugin.prototype.setFocus = function (trow) {
        this.tableModel.setFocus(trow);
    };
    TablePlugin.prototype.specificPage = function (currentPage) {
        var _currentPage = currentPage ? currentPage : this.blinkPage;
        if (_currentPage < 1) {
            if (!currentPage)
                this.blinkPage = 1;
            this.table.currentPage = 1;
        }
        else if (_currentPage > this.table.totalPageCount) {
            if (!currentPage)
                this.blinkPage = this.table.totalPageCount;
            this.table.currentPage = this.table.totalPageCount;
        }
        else {
            this.table.currentPage = _currentPage;
        }
        this.loadDataByUrl();
    };
    TablePlugin.prototype.onRowClick = function (rowData) {
        this.onClick.emit(rowData);
        this.setFocus(rowData);
        if (this.hasCheckboxInTable())
            this.checkBox(!this.isContains(rowData), rowData);
    };
    TablePlugin.prototype.onRowDblClick = function (rowData) {
        this.onDblClick.emit(rowData);
    };
    TablePlugin.prototype.onChangePageSize = function () {
        this.loadDataByUrl();
    };
    //捕获变化
    TablePlugin.prototype.ngOnChanges = function (changes) {
        this.table = this.tableModel.extend(this.table, changes.table && changes.table.currentValue);
    };
    TablePlugin.prototype.updateUrl = function (url) {
        this.table.url = url;
        this.loadDataByUrl();
    };
    /**********多选框点击全选****** */
    TablePlugin.prototype.checkBoxes = function (checked) {
        this.tableModel.checkedRowsArr = [];
        if (checked) {
            this.tableModel.checkedRowsArr = this.table.dataList.concat();
        }
        else {
            this.tableModel.checkedRowsArr = [];
        }
        this.onCheck.emit(this.tableModel.checkedRowsArr);
    };
    /*************点击多选框选择行*****
     * @Param checked:该行是否被选中，true选中，false未选中
     *        data:改行附带的数据
     */
    TablePlugin.prototype.checkBox = function (checked, data) {
        if (checked) {
            this.tableModel.checkedRowsArr.push(data);
        }
        else {
            this.removeObjFromArr(data);
        }
        this.onCheck.emit(this.tableModel.checkedRowsArr);
    };
    TablePlugin.prototype.isAllChecked = function () {
        var currentSize = this.table.pageSize > this.table.totalCount ? this.table.totalCount : this.table.pageSize;
        return this.tableModel.checkedRowsArr.length == currentSize; //length
    };
    TablePlugin.prototype.isChecked = function (data) {
        return this.isContains(data);
    };
    //样式调整，聚焦focused，checked
    TablePlugin.prototype.isFocus = function (data) {
        return data == this.tableModel.focusRow;
    };
    /********** 数组相关操作 ******
     *
    */
    //判断元素obj是否存在在该数组arr中
    TablePlugin.prototype.isContains = function (obj) {
        for (var index = 0; index < this.tableModel.checkedRowsArr.length; index++) {
            if (this.tableModel.checkedRowsArr[index][this.idAttr] == obj.id) {
                return true;
            }
            if (this.tableModel.checkedRowsArr[index].id == obj.id) {
                return true;
            }
        }
        return false;
    };
    TablePlugin.prototype.removeObjFromArr = function (obj) {
        this.tableModel.checkedRowsArr.splice(this.tableModel.checkedRowsArr.indexOf(obj), 1);
        return true;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TablePlugin.prototype, "notInit", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', table_1.TableOption)
    ], TablePlugin.prototype, "table", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TablePlugin.prototype, "isFixedHeader", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], TablePlugin.prototype, "oriArrData", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TablePlugin.prototype, "idAttr", void 0);
    __decorate([
        //checkbox 初始化选中状态
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TablePlugin.prototype, "emitPagination", void 0);
    __decorate([
        core_1.ContentChild('tableTemplate'), 
        __metadata('design:type', core_1.TemplateRef)
    ], TablePlugin.prototype, "tableTemplate", void 0);
    __decorate([
        core_1.ViewChild(dialog_1.DialogPlugin), 
        __metadata('design:type', dialog_1.DialogPlugin)
    ], TablePlugin.prototype, "dialogPlugin", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TablePlugin.prototype, "onClick", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TablePlugin.prototype, "onDblClick", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], TablePlugin.prototype, "onCheck", void 0);
    TablePlugin = __decorate([
        core_1.Component({
            selector: 'my-table',
            template: require('./table.plugin.html'),
            styles: [require('./table.plugin.css') + ""],
            providers: [
                TableService,
                table_model_1.TableModel
            ]
        }), 
        __metadata('design:paramtypes', [TableService, table_model_1.TableModel, core_1.ElementRef])
    ], TablePlugin);
    return TablePlugin;
}());
exports.TablePlugin = TablePlugin;
//# sourceMappingURL=table.plugin.js.map