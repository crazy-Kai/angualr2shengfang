export class AlertMessageDetails {
    id: number;     //id;
    runEngineId: number;    //运行引擎ID？
    zoneId: number;     //区ID
    eventNo: string;    //事件No
    patientId: string;  //病人ID
    keyDate: number = new Date().getTime();     //关键时间
    orderDate: number = new Date().getTime();   //订单时间
    hisDrugId: string;      //药物ID
    hisDrugName: string;    //药物名称
    productId: string;      //产品ID 
    messageId: number;      //信息ID
    type: string;           //类型
    analysisType: string;   //分析类型
    analysisResultType: string;     //分析结果类型
    severity: number;       //严重
    message: string;        //信息
    source: string;         //来源
    advice: string;         //建议
    drugCategoryCode: string;       //药物类别代码
    updateTime: number = new Date().getTime();      //更新时间
    auditStatus: number;    //处方状态
    isReject: number;       //是否拒绝？
    constructor() { }


    // eventNo: string;
    // name: string;
    // sex: string;
    // idType: string;
    // idNo: string;
    // birthWeight: string;
    // birthday: number = new Date().getTime();
    // ethnicGroup: string;
    // nativePlace: string;
    // race: string;
    // keyDate: number = new Date().getTime();
    // zoneId: number;
    // patientId: string;
    // medcardNo: string;
    // eventTime: number = new Date().getTime();
    // deptId: string;
    // deptName: string;
    // payType: string;
    // isPregnant: string;
    // pregWeeks: number;
    // isLactation: string;
    // height: string;
    // weight: string;
    // address: string;
    // phoneNo: string;
    // dialysis: string;
    // marital: string;
    // occupation: string;
    // visitType: string;
    // age: number;
    // bsa: string

    
}