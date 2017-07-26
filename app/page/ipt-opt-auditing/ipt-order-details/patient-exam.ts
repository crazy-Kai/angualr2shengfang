import { PatientExamIndicator } from './patient-exam-indicator';

export class PatientExam {
    id: number;
    zoneId: number;
    age: number;
    patientName: string;
    sex: string;
    diagnose: string;
    keyDate: number;
    eventNo: string;
    patientId: string;
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
    updateTime: number;
    itemList: PatientExamIndicator[];
    constructor(){}
}