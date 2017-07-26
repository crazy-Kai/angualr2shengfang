"use strict";
var TableOption = (function () {
    function TableOption() {
        this.pageSize = 20;
        this.totalCount = 0;
        this.currentPage = 1;
        this.totalPageCount = 1;
        this.dataListPath = 'recordList';
        this.itemCountPath = 'recordCount';
        this.pageCountPath = 'pageCount';
    }
    return TableOption;
}());
exports.TableOption = TableOption;
//# sourceMappingURL=table.js.map