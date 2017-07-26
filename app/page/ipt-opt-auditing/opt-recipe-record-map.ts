import { OptRecipeRecordMessage } from './opt-recipe-record-message';
import { OptRecipeAuditResult } from './opt-recipe-audit-result';

export class OptRecipeRecordMap {
    recipeId: string;
    recipeNo: string;
    recipeItemId: string;
    drugNo: string;
    drugName: string;
    auditResult: string;
    messageList: OptRecipeRecordMessage[] = [];
    auditResultList: OptRecipeAuditResult[] = [];
    recordCheckedMap: OptRecipeRecordMessage[] = []
    constructor() {}
}