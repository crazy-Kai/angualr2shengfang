export class PatientVitalSign {
    id: number;
    zoneId: number;
    eventNo: string;
    patientId: string;
    keyDate: number;
    vitalSignNo: string;
    vitalSignType: string; //
    testResult: string; //
    testResultUnit: string; //
    temperature: number;
    sbp: number;
    dbp: number;
    breathingRate: string;
    pulseRate: string;
    heartRate: string;
    painScore: string;
    hour24AmountIn: string;
    testTime: number;
    updateTime: number;
    constructor(){}
}