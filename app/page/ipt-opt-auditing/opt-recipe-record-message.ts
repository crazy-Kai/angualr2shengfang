import { OptRecipeRecordMessageOpt } from './opt-recipe-record-message-opt';

export class OptRecipeRecordMessage {
    prescriptionItemNoSet: any[] = [];
    messageId: string;
    graphId: string;
    source: string;
    sourceId: string;
    ruleType: string;
    severity: number;
    message: string;
    advice: string;
    isEnabled: number;
    applyRange: string;
    applyObject: string;
    analysisType: string;
    analysisResultType: string;
    ownerType: number;
    msgOperationRecordList: OptRecipeRecordMessageOpt[] = [];
    msgId: string;
    drug_no: string;
    drugName: string;
    cautionStatus: string;
    applyStatus: string;
    operateStatus: any;
    
    constructor(){ };
}