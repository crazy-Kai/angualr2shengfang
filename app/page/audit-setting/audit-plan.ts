export class AuditPlan {
    id: number; //方案id
    name: string = ''; //方案名，必填
    category: number = 1; //方案类型 1|门诊，2|住院
    userId: string;
    userName: string; //患者名
    createdTime: number = new Date().getTime();
    modifiedTime: number = new Date().getTime();
    //createdTime: string = new Date(+new Date()+8*3600*1000).toISOString();
    //updatedTime: string = new Date(+new Date()+8*3600*1000).toISOString();
    recipeSource: string = '0'; //处方来源 0|全部，1|门诊，2|急诊，3|住院???
    // deptIds: string; //科室名
    deptList: any[] = [];
    groupIds: string;
    doctorIds: string; //医生名
    doctorList: any;
    groupList: any;
    diagName: string; //诊断名称
    isOuvas: number = 0;
    isPivas: number = 0;
    minStay: number; //住院天数
    maxStay: number;
    minAge: number; //最小年龄
    maxAge: number; //最大年龄
    ageUnit: string = '岁'; //年龄单位
    costTypes: string = '';
    diagnoses: string;
    icd10: string;
    drugProperties: string = ''; //药品属性
    drugCategorys: string; //药品分类
    payType: string; //费用类型
    infoList: any; //警示信息
    displayInfoList: any; //新增警示信息
    patientCondition: any = ''; //患者
    iptWardList: any[] = []; //病区
    constructor() { }
}