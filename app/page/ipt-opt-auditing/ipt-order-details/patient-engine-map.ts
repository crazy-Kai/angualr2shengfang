import { PatientEngineMessage } from './patient-engine-message';
import { AuditResult } from './audit-result';

export class PatientEngineMap {
    recipeId: string;
    recipeNo: string;
    recipeItemId: string;
    drugNo: string;
    drugName: string;
    messageList: PatientEngineMessage[] = [];
    auditResultList: AuditResult[] = [];
    recordCheckedMap: PatientEngineMessage[] = []
    constructor() {}
}