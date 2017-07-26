export class IptAuditPlanChoose {
    id: number; //方案id
    name: string = ''; //方案名，必填
    category: number = 1; //方案类型 1|门诊，2|住院
    userName: string; //患者名
    createdTime: number = new Date().getTime();
    updatedTime: number = new Date().getTime();
    //createdTime: string = new Date(+new Date()+8*3600*1000).toISOString();
    //updatedTime: string = new Date(+new Date()+8*3600*1000).toISOString();
    recipeSource: string = '全部'; //处方来源 0|全部，1|门诊，2|急诊，3|住院???
    deptId: string; //科室名
    docIds: string; //医生名
    diagName: string; //诊断名称
    onlyPivas: boolean = false;
    hospitalDays: number; //住院天数
    patientAge: number; //年龄
    medicalGroup: string; //医疗组
    onlyOuvas: boolean = true;
    drugProperty: string; //药品属性
    drugCategory: string; //药品分类
    payType: string; //费用类型
    infoList: any; //警示信息
    constructor() { }
}