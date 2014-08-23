///<reference path='../../../typings/q/Q.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>

module Shared
{
    export interface IBusinessRules{
        ValidationResult:Validation.IValidationResult;
        Validate():Q.Promise<Validation.IValidationResult>;
        Name:string;
    }
}
