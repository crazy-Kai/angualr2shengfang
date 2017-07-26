import { Component, OnInit,Directive,HostListener} from '@angular/core';

@Directive({
    selector: 'document'
})
@HostListener('mousedown', ['$event'])
class HostSample {
    onMouseDown($event:any){
        alert('host listener');
    }
}


@Component({
    selector: 'test-svg',
    template: require('./test-line-chart.component.html'),
    styles: [require('./test-line-chart.component.css') + ""],
})
export class TestLineChartComponent implements OnInit {
    // width: number = document.getElementsByTagName('table')[0].offsetWidth - document.getElementsByTagName('th')[0].offsetWidth;
    option: any = {
        param: {
            height: 100,//画板的高度
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

    data1: any[] = [[new Date(2016, 10, 2), 35.5], [new Date(2016, 10, 4), 37.5], [new Date(2016, 10, 5), 36]];
    data2: any[] = [[new Date(2016, 10, 3), 36], [new Date(2016, 10, 4), 38], [new Date(2016, 10, 5), 40]];

    dialog: any = {
        show: false
    };

    positionArr: any[] = [];
    positionStr: string = '';
    barWidth: number;
    handleWidth: number;
    handlePos: string = '0px';

    constructor() { }

    ngOnInit() {
        this.barWidth = document.getElementById('container').offsetWidth;
        this.handleWidth = document.getElementById('handle').offsetWidth;
        this.option.param.width = document.getElementsByTagName('table')[0].offsetWidth - document.getElementsByTagName('th')[0].offsetWidth;
        this.option.param.height = document.getElementsByTagName('td')[0].offsetHeight;
        this.getPositionArr();
    }

    /**
     * 返回位置数列
     */
    getPositionArr() {
        let dataArr = this.option.series.data;
        this.positionArr = [];
        this.positionStr = '';
        let spacingY: number = this.option.param.height * 1.0 / (this.option.maxDataY - this.option.minDataY);
        let spacingX: number = this.option.param.width * 1.0 / (this.option.maxDataX - this.option.minDataX);
        for (let i = 0; i < this.option.series.data.length; i++) {
            let data: any = {};
            data.y = this.option.param.height - (this.option.series.data[i][1] - this.option.minDataY) * spacingY;
            data.x = (this.option.series.data[i][0] - this.option.minDataX) * spacingX;
            this.positionStr += data.x + ',' + data.y + ' ';
            this.positionArr.push(data);
        }
    }

    /**
     * 显示展现详情
     * data:坐标位置
     * i:index
     */
    showDetail(data: any, i: number) {
        this.dialog.x = data.x + 153 + "px";
        this.dialog.y = data.y - 59 + "px";
        this.dialog.msg = this.option.series.name + ":" + this.option.series.data[i][1] + "°C " + this.option.series.data[i][0].toString();
        this.dialog.show = true;
    }

    hideDetail() {
        this.dialog.show = false;
    }

    /***
     * 滑动事件
     */
    mouseDown($event: any) {
        let disX = document.getElementById('container').offsetLeft;

        document.onmousemove = ($event: any) => {
            let L = $event.clientX - disX;
            if (L < 0) {
                L = 0;  //最短距离
            }
            else if (L > this.barWidth - this.handleWidth) {
                L = this.barWidth - this.handleWidth;  //最长距离
            } else { //总比例
                // L / (this.barWidth - this.handleWidth);
                if (L > 300) {
                    this.option.series.data = this.data2;
                }
                else {
                    this.option.series.data = this.data1;
                }

            }
            document.getElementById('handle').style.left = L + "px";
        }

        document.onmouseup = () => {
            this.getPositionArr();
            document.onmousemove = null;
        }

        return false;

    }

}
