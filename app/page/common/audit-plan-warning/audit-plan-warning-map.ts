import { AuditPlanAnalysis } from './audit-plan-analysis';
import { AuditPlanAnalysisType } from './audit-plan-analysis-type';

export class AuditPlanWarningMap {
    analysis: AuditPlanAnalysis = new AuditPlanAnalysis();
    analysisType: AuditPlanAnalysisType = new AuditPlanAnalysisType();
    analysisStatus: string = '全部';
    warningLevelType: string = '>';
    warningLevel: string = '0';
    isAnalysisBoxShow: boolean = false;
    analysisTypeMap: AuditPlanAnalysisType[] = [];
}