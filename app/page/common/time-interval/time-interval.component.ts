import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'time-interval',
    templateUrl: 'time-interval.component.html',
    styleUrls: ['time-interval.component.css']
})
export class TimeIntervalComponent implements OnInit{
    @Input() startTime: any;            //开始时间时间戳  数字 或 纯数字的字符串
    @Input() endTime: any;              //截止时间时间戳  数字 或 纯数字的字符串
    @Output() timeSetted = new EventEmitter();     //输出一个包含起止时间戳的对象
    @Input() static: boolean;
    /**
	 * 时间控件参数
	 */
    startDate: any;
	endDate: any;
	//minStartDate: any;
	maxStartDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
	minEndDate: any;
	maxEndDate:any = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};        //设定时间的最大值为今天string;

    outPutDate: any = {}

    ngOnInit(){
        if(this.startTime){
            if(typeof(this.startTime) == 'string'){
                this.startTime = parseInt(this.startTime);
            }
            this.startTime = this.flowDate(this.startTime);  
            this.outPutDate.startTime = this.startTime.toString();
            this.startDate = this.dateToObj(this.startTime);
        }
        this.startDate =  this.startDate || this.dateToObj((new Date()).getTime());
        // this.setEndInterval(this.startDate);

        if(this.endTime){
            if(typeof(this.endTime) == 'string'){
                this.endTime = parseInt(this.endTime);
            }
            this.endTime = this.ceilDate(this.endTime); 
            this.outPutDate.endTime = this.endTime.toString();
            this.endDate = this.dateToObj(this.endTime);
        }
        this.endDate = this.endDate || this.dateToObj((new Date()).getTime());
        // this.setStrartInterval(this.endDate);

        this.timeSetted.emit(this.outPutDate);
    }

    /**
	 * 时间控件与时间对象的相互转换
	 */
    dateToObj(date: number) {
        if(typeof(date) != 'number') return;
        let fullDate = new Date(date);
        let modifyTime:any = {};

        modifyTime.year = fullDate.getFullYear();
        modifyTime.month = fullDate.getMonth() + 1;
        modifyTime.day = fullDate.getDate();
        
        return modifyTime;
    }

    objToDate(oriDate: any) {
        let dateStr = oriDate.year + '-' + oriDate.month + '-' + oriDate.day;
        let date = new Date(dateStr);
        let timeStamp = date.getTime().toString();
        return timeStamp;
    }
    

	setEndInterval($event: any){
        if(!$event) {
            this.outPutDate.startTime = "";
            this.timeSetted.emit(this.outPutDate);
            return;
        }
        this.outPutDate.startTime = this.objToDate($event);
        this.timeSetted.emit(this.outPutDate);
 		this.minEndDate = $event;
    }
	setStrartInterval($event: any){
        if(!$event) {
            this.outPutDate.endTime = "";
            this.timeSetted.emit(this.outPutDate);
            return;
        }
        this.outPutDate.endTime = (parseInt(this.objToDate($event)) + 86399999).toString();    //结束时间为选中日期+1天
        this.timeSetted.emit(this.outPutDate);
		
		this.maxStartDate = $event;
    }

    ngOnChanges(){
        if(this.startTime){
            if(typeof(this.startTime) == 'string')
                this.startTime = parseInt(this.startTime);
            this.startDate = this.dateToObj(this.startTime);
        }

        if(this.endTime){
            if(typeof(this.endTime) == 'string')
                this.endTime = parseInt(this.endTime);
            this.endDate = this.dateToObj(this.endTime);
        }
    } 

    /**
     * 功能函数，将输入时间设置为输入日期的0点和23点59分59秒
     */
    flowDate(startTime: string){
        let fullDate = new Date(startTime);
        let dateStr = fullDate.getFullYear() + '/' + (fullDate.getMonth() + 1) + '/' + fullDate.getDate();

        return new Date(dateStr).getTime();
    }
    ceilDate(endTime: string){
        let fullDate = new Date(endTime);
        let dateStr = fullDate.getFullYear() + '/' + (fullDate.getMonth() + 1) + '/' + fullDate.getDate();

        return new Date(dateStr).getTime() + 86399999;
    }
    //切换逻辑
    startIns: any;
	endIns: any;
	toggleStart(timeIns: any){
		timeIns.toggle();
		if(timeIns.isOpen()){
			this.startIns = timeIns;
			if(this.endIns){
				this.endIns.close();
				this.endIns = null;
			}
		}else{
			this.startIns = null;
		}
	}

	toggleEnd(timeIns: any){
		timeIns.toggle();
		if(timeIns.isOpen()){
			this.endIns = timeIns;
			if(this.startIns){
				this.startIns.close();
				this.startIns = null;
			}
		}else{
			this.endIns = null;
		}
	}

	@HostListener('document:click',[])
	onDocumnentClick(){
		if(this.endIns){
			this.endIns.close();
			this.endIns = null;
		}
		if(this.startIns){
			this.startIns.close();
			this.startIns = null;
		}
	}
}