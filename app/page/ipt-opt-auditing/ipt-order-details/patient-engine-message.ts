import { PatientEngineMessageOpt } from './patient-engine-message-opt';

export class PatientEngineMessage {
    runEngineId: number;
    productId: string;
    messageId: number; 
    type: string;
    analysisType: string;
    analysisResultType: string;
    severity: number;
    message: string;
    source: string;
    advice: string;
    drugCategoryCode: string;
    engineMsgId: number;
    orderId: number;
    orderType: number;
    hisOrderId: string;
    auditStatus: number;
    rejectStatus: string;
    drugId: string;
    drugName: string;
    notReject: boolean;
    constructor(){ };
}