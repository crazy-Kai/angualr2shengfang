import { ElementRef } from '@angular/core';

export class TableOption {
    id: string;
    title: Array<any>;
    dataList: Array<any>;
    url: string;
    dataListPath: string;
    itemCountPath: string;
    pageCountPath: string;
    pageSize: number;
    currentPage: number;
    totalCount: number;
    totalPageCount: number;
    elementRef: ElementRef;

    constructor() {
        this.pageSize = 20;
        this.totalCount = 0;
        this.currentPage = 1;
        this.totalPageCount = 1;
        this.dataListPath = 'recordList';
        this.itemCountPath = 'recordCount';
        this.pageCountPath = 'pageCount';
    }
}