export class OptOrderAudit {
    zoneId: number;
    eventNo: string;
    patientId: number;  //
    keyDate: number = new Date().getTime();
    recipeId: string;   //处方1
    recipeNo: string;   //处方号
    recipeSource: string;      //急诊
    recipeCategory: string;
    recipeType: string;     //处方类型
    deptId: string;     //科室ID
    deptName: string;   //科室名称
    recipeDocId: string;    //处方医生ID
    recipeDocName: string;  //处方医生名称
    recipeDocTitle: string;     //处方医生头衔
    recipeTime: number = new Date().getTime();  //处方时间
    herbUnitPrice: string;
    herbPacketCount: string;
    herbAdminrouteName: string;
    herbDailyDose: string;
    herbTreatDuration: string;
    herbFormulationName: string;
    iscream: string;
    recipeFeeTotal: number;
    originalRecipeNo: string;
    recipeStatus: string;
    urgentFlag: number;
    diagnose: string;
    constructor() { }
}