import { Injectable, Component, Input } from '@angular/core';

@Injectable()
export class TableModel {
    // options: any;
    focusRow: any;
    checkedRowsArr = new Array<any>();

    setFocus(trow: any) {
        this.focusRow = trow;
    }

    //获取所有的选中的行
    getCheckedRows(): any[] {
        return this.checkedRowsArr;
    }

    /***
     * 更换数据结构格式，获取数据路径List
     */
    formatPath(path: string): string[] {
        let paths: string[] = [];
        paths = path.split(/\//g);
        return paths;
    }

    /****
     * 拓展obj1
     * 如果obj2中有相同的属性，则覆盖obj1
     * 如果obj2中的属性obj1中不存在，则新增该属性
     */
    extend(obj1: any, obj2: any): any {
        for (let name in obj2) {
            obj1[name] = obj2[name];
        }
        return obj1;
    }

    getDataListFromResult(result: any, path: string):any[] {
        let paths:string[] = this.formatPath(path);
        for (let i = 0; i < paths.length; i++) {
            if (paths[i] === "") {
                return result;
            }
            if (result) {
                result = result[paths[i]];
            }
        }
        return result;
    }

    getCountFromResult(result: any, path: string):number {
        let paths:string[] = this.formatPath(path);
        for (let i = 0; i < paths.length; i++) {
            if (paths[i] === "") {
                return result;
            }
            if (result) {
                result = result[paths[i]];
            }
        }
        return result;
    }

    private isEmptyObject(obj: any): boolean {
        for (var name in obj) {
            return false;
        }
        return true;
    }

}