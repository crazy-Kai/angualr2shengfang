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
var TableModel = (function () {
    function TableModel() {
        this.checkedRowsArr = new Array();
    }
    TableModel.prototype.setFocus = function (trow) {
        this.focusRow = trow;
    };
    //获取所有的选中的行
    TableModel.prototype.getCheckedRows = function () {
        return this.checkedRowsArr;
    };
    /***
     * 更换数据结构格式，获取数据路径List
     */
    TableModel.prototype.formatPath = function (path) {
        var paths = [];
        paths = path.split(/\//g);
        return paths;
    };
    /****
     * 拓展obj1
     * 如果obj2中有相同的属性，则覆盖obj1
     * 如果obj2中的属性obj1中不存在，则新增该属性
     */
    TableModel.prototype.extend = function (obj1, obj2) {
        for (var name_1 in obj2) {
            obj1[name_1] = obj2[name_1];
        }
        return obj1;
    };
    TableModel.prototype.getDataListFromResult = function (result, path) {
        var paths = this.formatPath(path);
        for (var i = 0; i < paths.length; i++) {
            if (paths[i] === "") {
                return result;
            }
            if (result) {
                result = result[paths[i]];
            }
        }
        return result;
    };
    TableModel.prototype.getCountFromResult = function (result, path) {
        var paths = this.formatPath(path);
        for (var i = 0; i < paths.length; i++) {
            if (paths[i] === "") {
                return result;
            }
            if (result) {
                result = result[paths[i]];
            }
        }
        return result;
    };
    TableModel.prototype.isEmptyObject = function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };
    TableModel = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TableModel);
    return TableModel;
}());
exports.TableModel = TableModel;
//# sourceMappingURL=table.model.js.map