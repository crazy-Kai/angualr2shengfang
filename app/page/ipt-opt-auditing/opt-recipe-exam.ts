import { OptRecipeExamIndicator } from './opt-recipe-exam-indicator';
export class OptRecipeExam {
    zoneId: number;
    eventNo: string;
    patientId: string;
    keyDate: number;
    reportId: string;
    examItemCode: string;
    examItemName: string;
    sampleCollectTime: number;
    sampleCode: string;
    sampleName: string;
    sampleCollectOpporunity: string;
    applyNo: string;
    applicantId: string;
    applicantName: string;
    applicantDeptId: string;
    applicantDeptName: string;
    reporterId: string;
    reporterName: string;
    reportTime: number;
    indicatorList: OptRecipeExamIndicator[] = [];
    constructor(){ }
}