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
var HostSample = (function () {
    function HostSample() {
    }
    HostSample.prototype.onMouseDown = function ($event) {
        alert('host listener');
    };
    HostSample = __decorate([
        core_1.Directive({
            selector: 'document'
        }),
        core_1.HostListener('mousedown', ['$event']), 
        __metadata('design:paramtypes', [])
    ], HostSample);
    return HostSample;
}());
var TestLineChartComponent = (function () {
    function TestLineChartComponent() {
        // width: number = document.getElementsByTagName('table')[0].offsetWidth - document.getElementsByTagName('th')[0].offsetWidth;
        this.option = {
            param: {
                height: 100,
                width: 700 //画板的宽度
            },
            series: {
                name: "体温",
                data: [[new Date(2016, 10, 2), 35.5], [new Date(2016, 10, 4), 37.5], [new Date(2016, 10, 5), 36]],
            },
            maxDataY: 42,
            minDataY: 35,
            maxDataX: new Date(2016, 10, 7),
            minDataX: new Date(2016, 10, 2)
        };
        this.data1 = [[new Date(2016, 10, 2), 35.5], [new Date(2016, 10, 4), 37.5], [new Date(2016, 10, 5), 36]];
        this.data2 = [[new Date(2016, 10, 3), 36], [new Date(2016, 10, 4), 38], [new Date(2016, 10, 5), 40]];
        this.dialog = {
            show: false
        };
        this.positionArr = [];
        this.positionStr = '';
        this.handlePos = '0px';
    }
    TestLineChartComponent.prototype.ngOnInit = function () {
        this.barWidth = document.getElementById('container').offsetWidth;
        this.handleWidth = document.getElementById('handle').offsetWidth;
        this.option.param.width = document.getElementsByTagName('table')[0].offsetWidth - document.getElementsByTagName('th')[0].offsetWidth;
        this.option.param.height = document.getElementsByTagName('td')[0].offsetHeight;
        this.getPositionArr();
    };
    /**
     * 返回位置数列
     */
    TestLineChartComponent.prototype.getPositionArr = function () {
        var dataArr = this.option.series.data;
        this.positionArr = [];
        this.positionStr = '';
        var spacingY = this.option.param.height * 1.0 / (this.option.maxDataY - this.option.minDataY);
        var spacingX = this.option.param.width * 1.0 / (this.option.maxDataX - this.option.minDataX);
        for (var i = 0; i < this.option.series.data.length; i++) {
            var data = {};
            data.y = this.option.param.height - (this.option.series.data[i][1] - this.option.minDataY) * spacingY;
            data.x = (this.option.series.data[i][0] - this.option.minDataX) * spacingX;
            console.log(this.option.param.height);
            this.positionStr += data.x + ',' + data.y + ' ';
            this.positionArr.push(data);
        }
    };
    /**
     * 显示展现详情
     * data:坐标位置
     * i:index
     */
    TestLineChartComponent.prototype.showDetail = function (data, i) {
        this.dialog.x = data.x + 153 + "px";
        this.dialog.y = data.y - 59 + "px";
        this.dialog.msg = this.option.series.name + ":" + this.option.series.data[i][1] + "°C " + this.option.series.data[i][0].toString();
        this.dialog.show = true;
    };
    TestLineChartComponent.prototype.hideDetail = function () {
        this.dialog.show = false;
    };
    /***
     * 滑动事件
     */
    TestLineChartComponent.prototype.mouseDown = function ($event) {
        var _this = this;
        var disX = document.getElementById('container').offsetLeft;
        document.onmousemove = function ($event) {
            var L = $event.clientX - disX;
            if (L < 0) {
                L = 0; //最短距离
            }
            else if (L > _this.barWidth - _this.handleWidth) {
                L = _this.barWidth - _this.handleWidth; //最长距离
            }
            else {
                // L / (this.barWidth - this.handleWidth);
                if (L > 300) {
                    _this.option.series.data = _this.data2;
                }
                else {
                    _this.option.series.data = _this.data1;
                }
            }
            document.getElementById('handle').style.left = L + "px";
        };
        document.onmouseup = function () {
            _this.getPositionArr();
            document.onmousemove = null;
        };
        return false;
    };
    TestLineChartComponent = __decorate([
        core_1.Component({
            selector: 'test-svg',
            template: require('./test-line-chart.component.html'),
            styles: [require('./test-line-chart.component.css') + ""],
        }), 
        __metadata('design:paramtypes', [])
    ], TestLineChartComponent);
    return TestLineChartComponent;
}());
exports.TestLineChartComponent = TestLineChartComponent;
//# sourceMappingURL=test-line-chart.component.js.map