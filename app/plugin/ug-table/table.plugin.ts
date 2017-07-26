/**
 *  @author: anwen
 *  @Description:TODO(列表组件)
 */
import { Component, Input, Output, OnInit, OnChanges, EventEmitter, Directive, HostListener, Injectable, ViewChild, ElementRef, ContentChild, TemplateRef } from '@angular/core';
import { AdHocComponentFactoryCreator } from './adhoc-component-factory.service';
import { Http, Response } from '@angular/http';
import { TableOption } from './table';
import { TableModel } from './table.model';
import { ITableTemplate } from './tbody.content.plugin';
import { DialogPlugin } from '../ug-dialog/dialog';
import { InterceptorService } from 'ng2-interceptors';

@Directive({ selector: 'th[cell]' })
export class TChangeCell {
  tTD: any;//用来存储当前更改宽度的Table cell，避免快速移动鼠标的问题

  // @HostListener('mousedown', ['$event'])
  // onMouseDown($event: any) {
  //   let tcell = $event.target;
  //   while (tcell.tagName.toUpperCase() !== 'TH') {
  //     tcell = tcell.parentElement;
  //   }
  //   this.tTD = tcell;
  //   if ($event.offsetX > this.tTD.offsetWidth - 10) {
  //     this.tTD.mouseDown = true;
  //     this.tTD.oldX = $event.x;
  //     this.tTD.oldWidth = this.tTD.offsetWidth;
  //   }
  // }

  // @HostListener('mouseup', ['$event'])
  // onMouseUp($event: any) {
  //   let tcell = $event.target;
  //   while (tcell.tagName.toUpperCase() !== 'TH') {
  //     tcell = tcell.parentElement;
  //   }
  //   if (this.tTD == undefined)
  //     this.tTD = tcell;
  //   this.tTD.mouseDown = false;
  //   this.tTD.style.cursor = 'default';
  // }

  // @HostListener('mousemove', ['$event'])
  // onMouseMove($event: any) {
  //   let tcell = $event.target;
  //   while (tcell.tagName.toUpperCase() !== 'TH') {
  //     tcell = tcell.parentElement;
  //   }
  //   //更改鼠标样式
  //   if ($event.offsetX > tcell.offsetWidth - 10) {
  //     tcell.style.cursor = 'col-resize';
  //   }
  //   else
  //     tcell.style.cursor = 'default';

  //   //取出暂存的Table Cell
  //   if (this.tTD == undefined) this.tTD = tcell;

  //   //调整宽度
  //   if (this.tTD.mouseDown != null && this.tTD.mouseDown == true) {
  //     this.tTD.style.cursor = 'default';//默认
  //     if ((this.tTD.oldWidth + ($event.x - this.tTD.oldX)) > 0) {
  //       this.tTD.width = this.tTD.oldWidth + ($event.x - this.tTD.oldX);
  //     }
  //     this.tTD.style.width = this.tTD.width;
  //     this.tTD.style.cursor = 'col-resize';
  //   }
  // }
}

//用于设置url，快速获取列表数据
@Injectable()
class TableService {

  //testurl ="/api/v1/productList.json?numPerPage={pageSize}&pageNum={currentPage}";
  //pattern = /\{[A-Za-z]*\}/g;
  patternCurr = /\{currentPage\}/;
  patternSize = /\{pageSize\}/;

  constructor(
    private http: InterceptorService) { }

  loadDataByUrl(url: string, currentPage: number, pageSize: number) {
    url = this.setPageInfo(url, currentPage, pageSize);
    return this.http.get(url)
      .toPromise()
      .then(this.extractJson)
      .catch(this.handleError);
  }

  private setPageInfo(url: string, currentPage: number, pageSize: number): string {
    if (url) {
      url = url.replace(this.patternCurr, currentPage + "");
      url = url.replace(this.patternSize, pageSize + "");
    }
    return url;
  }

  private extractJson(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    // console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  isEmptyObject(obj: any) {
    for (var name in obj) {
      return false;
    }
    return true;
  }
}


@Component({
  selector: 'my-table',
  template: require('./table.plugin.html'),
  styles: [require('./table.plugin.css') + ""],
  providers: [
    TableService,
    TableModel
  ]
})
export class TablePlugin implements OnInit, OnChanges {
  @Input() notInit: boolean;
  @Input() table: TableOption = new TableOption();
  @Input() isFixedHeader: boolean;
  @Input() oriArrData: any[];
  @Input() idAttr: string;    //checkbox 初始化选中状态
  @Output() emitPagination = new EventEmitter();
  // @Input() options: any;
  @ContentChild('tableTemplate') tableTemplate: TemplateRef<ITableTemplate>;
  @ViewChild(DialogPlugin) dialogPlugin: DialogPlugin;
  blinkPage: number = 1;  //跳转页
  error: any;
  pagination: any = {}; //分页信息
  constructor(private tableService: TableService,
    public tableModel: TableModel,
    private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.table.elementRef = this.elementRef; //elementRef
  }

  ngOnInit() {
    this.table = this.tableModel.extend(new TableOption(), this.table); //设置默认值

    if (this.oriArrData) {
      this.tableModel.checkedRowsArr = this.oriArrData;
    }
    if (this.table.url && !this.notInit) {
      this.loadDataByUrl();
    }

    this.idAttr = this.idAttr ? this.idAttr : 'id';
  }

  /****判断是否是带有checkbox */
  hasCheckboxInTable(): boolean {
    for (let i = 0; i < this.table.title.length; i++) {
      if (this.table.title[i].type == 'checkbox')
        return true;
    }
    return false;
  }


  loadDataByUrl(url?: string, isSearch?: boolean) {
    let params = arguments;
    if (arguments.length > 0) {
      for (let i = 0; i < arguments.length; i++) {
        if (typeof (arguments[i]) == 'string') {
          this.table.url = url;
        } else if (typeof (arguments[i]) == 'boolean' && arguments[i]) {
          this.table.currentPage = 1;
        }
      }
    }
    this.pagination.pageSize = this.table.pageSize;
    this.pagination.currentPage = this.table.currentPage;
    this.emitPagination.emit(this.pagination);

    this.tableService.loadDataByUrl(this.table.url, this.table.currentPage, this.table.pageSize)
      .then(response => {
        let result = response.data;
        this.onload.emit(response)
        if (response.code != 200 && response.code != 410) {
          this.dialogPlugin.tip(response.message);
          return;
        }

        this.table.dataList = this.tableModel.getDataListFromResult(result, this.table.dataListPath);
        
        if (this.tableService.isEmptyObject(this.table.dataList)) {
          this.table.currentPage = 1;
          // this.table.currentPage = this.table.totalPageCount;
          this.table.totalCount = 0;
          this.table.totalPageCount = 0;
        }
        else {
          this.table.totalCount = this.tableModel.getCountFromResult(result, this.table.itemCountPath);
          this.table.totalPageCount = this.tableModel.getCountFromResult(result, this.table.pageCountPath)
            ? this.tableModel.getCountFromResult(result, this.table.pageCountPath) : Math.ceil(this.table.totalCount / this.table.pageSize);
          if (this.table.currentPage > this.table.totalPageCount) {
            this.table.currentPage = this.table.totalPageCount;
            this.loadDataByUrl();
          }
        }

      },
      error => this.error = error);
  }

  @Output() onload: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Output() onDblClick: EventEmitter<any> = new EventEmitter();
  @Output() onCheck: EventEmitter<any> = new EventEmitter();//type

  //页面点击跳转事件
  prePage() {
    this.table.currentPage--;
    this.loadDataByUrl();
  }

  nextPage() {
    this.table.currentPage++;
    this.loadDataByUrl();
  }

  turnToHomePage() {
    this.table.currentPage = 1;
    this.loadDataByUrl();
  }

  turnToEndPage() {
    this.table.currentPage = this.table.totalPageCount;
    this.loadDataByUrl();
  }

  setFocus(trow: any) {
    this.tableModel.setFocus(trow);
  }

  specificPage(currentPage?: number) {
    let _currentPage = currentPage ? currentPage : this.blinkPage;
    if (_currentPage < 1) {
      if (!currentPage)
        this.blinkPage = 1;
      this.table.currentPage = 1;
    } else if (_currentPage > this.table.totalPageCount) {
      if (!currentPage)
        this.blinkPage = this.table.totalPageCount;
      this.table.currentPage = this.table.totalPageCount;
    } else {
      this.table.currentPage = _currentPage;
    }
    this.loadDataByUrl();
  }

  setPage(page){
    this.table.currentPage = page;
  }

  setPageSize(pageSize){
    this.table.pageSize = pageSize;
  }

  onRowClick(rowData: any) {
    this.onClick.emit(rowData);
    this.setFocus(rowData);
    if (this.hasCheckboxInTable())
      this.checkBox(!this.isContains(rowData), rowData);
  }
  onRowDblClick(rowData: any) {
    this.onDblClick.emit(rowData);
  }

  onChangePageSize() {
    this.specificPage();
    this.loadDataByUrl();
  }

  //捕获变化
  ngOnChanges(changes: any) {
    this.table = this.tableModel.extend(this.table, changes.table && changes.table.currentValue);
  }

  updateUrl(url: string) {
    this.table.url = url;
    this.loadDataByUrl();
  }

  /**********多选框点击全选****** */
  checkBoxes(checked: boolean) {
    this.tableModel.checkedRowsArr = [];
    if (checked) {
      this.tableModel.checkedRowsArr = this.table.dataList.concat();
    } else {
      this.tableModel.checkedRowsArr = [];
    }
    this.onCheck.emit(this.tableModel.checkedRowsArr);
  }

  /*************点击多选框选择行*****
   * @Param checked:该行是否被选中，true选中，false未选中
   *        data:改行附带的数据
   */
  checkBox(checked: boolean, data: any) {
    if (checked) {
      this.tableModel.checkedRowsArr.push(data);
    } else {
      this.removeObjFromArr(data);
    }
    this.onCheck.emit(this.tableModel.checkedRowsArr);
  }

  isAllChecked(): boolean {
    let currentSize = this.table.pageSize > this.table.totalCount ? this.table.totalCount : this.table.pageSize;
    return this.tableModel.checkedRowsArr.length == currentSize; //length
  }

  isChecked(data: any): boolean {
    return this.isContains(data);
  }

  //样式调整，聚焦focused，checked
  isFocus(data: any): boolean {
    return data == this.tableModel.focusRow;
  }

  /********** 数组相关操作 ******
   * 
  */
  //判断元素obj是否存在在该数组arr中
  private isContains(obj: any): boolean {
    for (let index = 0; index < this.tableModel.checkedRowsArr.length; index++) {
      if (this.tableModel.checkedRowsArr[index][this.idAttr] == obj.id) {
        return true;
      }
      if (this.tableModel.checkedRowsArr[index].id == obj.id) {
        return true;
      }
    }
    return false;
  }

  private removeObjFromArr(obj: any) {
    this.tableModel.checkedRowsArr.splice(this.tableModel.checkedRowsArr.indexOf(obj), 1);
    return true;
  }
}

