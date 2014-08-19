
///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/node-form/node-form.d.ts'/>
///<reference path='../../../typings/node-form/BasicValidators.d.ts'/>

///<reference path='FromToDateValidator.ts'/>
///<reference path='Data.ts'/>
///<reference path='Duration.ts'/>
"use strict";
module VacationApproval {
    /**
     * Business rules for vacation approval.
     *
     * @class
     * @constructor
     **/
    export class BusinessRules {



        /**
         * Business rules for employee requested the vacation.
         */
        public EmployeeValidator;

        /**
         * Business rules for first deputy for employee having the vacation.
         */
        public Deputy1Validator;


        /**
         * Business rules for second deputy for employee having the vacation.
         */
        public Deputy2Validator;

        /**
         * Business rules for duration of vacation.
         */
        public DurationValidator;

        /**
         * Business rules for manager that is responsible for approval of vacation request.
         */
        public ApprovedByValidator;


        /**
         *  Deputy conflict - employee that have approved vacation and its someones's deputy at the same days.
         */
        public DeputyConflictsValidator;


        /**
         * All business rules for the vacation request.
         */
        public VacationRequestValidator;

        /**
         * All business rules for the vacation approval.
         */
        public VacationApprovalValidator;

        /**
         * Return vacation request erros.
         */
        public Errors;

        /**
         * Return vacation approval errors.
         */
        public VacationApprovalErrors;

        public Duration:Duration;

        constructor(public Data:IVacationApprovalData, private vacationDeputyService:IVacationDeputyService) {

            this.Duration = new Duration(this.Data);

            //assign rule to data context
            this.VacationRequestValidator = this.createVacationRequestValidator().CreateRule("Data");
            this.VacationApprovalValidator = this.createApprovalValidator().CreateRule("Data");


            this.EmployeeValidator = this.VacationRequestValidator.Children["Employee"];
            this.Deputy1Validator = this.VacationRequestValidator.Children["Deputy1"];
            this.Deputy2Validator = this.VacationRequestValidator.Children["Deputy2"];
            this.DurationValidator = this.VacationRequestValidator.Children["Duration"];
            this.ApprovedByValidator = this.VacationRequestValidator.Children["Approval"].Children["ApprovedBy"];

            this.DeputyConflictsValidator = this.VacationRequestValidator.Validators["DeputyConflict"];

            //enable optional on the upper level
            this.EmployeeValidator.Rules["Email"].Optional = function () {
                return true;
            }.bind(this.Data.Employee);

//            this.Deputy1Validator.SetOptional(function () {
//                return this.Deputy1 == undefined || !this.Deputy1.Checked
//            }.bind(this.Data));


            this.Deputy2Validator.SetOptional(function () {
                return this.Deputy2 == undefined || !this.Deputy2.Checked
            }.bind(this.Data))


            this.VacationApprovalErrors = this.VacationApprovalValidator.ValidationResult.Errors;
            this.Errors = this.VacationRequestValidator.ValidationResult;
        }


        /**
         * Executes all business rules for validation request.
         */
        public Validate():Q.Promise<Validation.IValidationResult> {
            this.VacationRequestValidator.ValidateAll(this.Data);
            return this.DeputyConflictsValidator.ValidateAsync(this.Data);
        }

        /**
         * Executes all business rules for validation approval.
         */
        public ValidateApproval():Q.Promise<Validation.IValidationResult> {
            this.VacationApprovalValidator.ValidateAll(this.Data);
            return this.DeputyConflictsValidator.ValidateAsync(this.Data);
        }

        private createApprovalValidator():Validation.IAbstractValidator<IVacationApprovalData> {

            //create custom validator
            var validator = new Validation.AbstractValidator<IVacationApprovalData>();

            //create approvedBy validator
            validator.ValidatorFor("Approval",this.createApprovedByValidator());


            //add custom validation
            var validateApprovedByLessThanEqualFormFce = function (args:Validation.IError) {
                args.HasError = false;
                args.ErrorMessage = "";


                var greaterThanToday = new FromToDateValidator();
                greaterThanToday.FromOperator = Validation.CompareOperator.GreaterThanEqual;
                greaterThanToday.From = new Date();
                greaterThanToday.ToOperator = Validation.CompareOperator.LessThanEqual;
                greaterThanToday.To = this.Duration.From;
                greaterThanToday.IgnoreTime = true;

                if (!greaterThanToday.isAcceptable(this.Approval.ApprovedDate)) {
                    args.HasError = true;
                    args.ErrorMessage =  greaterThanToday.customMessage({
                        "Format": "MM/DD/YYYY",
                            "Msg": "Date must be between ('{From}' - '{To}')."
                    },greaterThanToday);
                    args.TranslateArgs = {TranslateId: greaterThanToday.tagName, MessageArgs: greaterThanToday, CustomMessage: greaterThanToday.customMessage};
                    return;
                }
            }


            var approvedByLessThanEqualForm = {Name: "ApprovedByLessThanEqualFrom", ValidationFce: validateApprovedByLessThanEqualFormFce};
            validator.ValidationFor("ApprovedByLessThanEqualFrom",approvedByLessThanEqualForm);

            return validator;
        }

        private createApprovedByValidator():Validation.IAbstractValidator<IApproval>{
            var approvalValidator = new Validation.AbstractValidator<IApproval>();
            approvalValidator.ValidatorFor("ApprovedBy", this.createPersonValidator());
            return approvalValidator;
        }
        private createVacationRequestValidator():Validation.IAbstractValidator<IVacationApprovalData> {

            //create custom validator
            var validator = new Validation.AbstractValidator<IVacationApprovalData>();

            var personValidator = this.createPersonValidator();
            validator.ValidatorFor("Employee", personValidator);
            validator.ValidatorFor("Deputy1", personValidator);
            validator.ValidatorFor("Deputy2", personValidator);
            validator.ValidatorFor("Approval",this.createApprovedByValidator());



            var durationValidator = this.Duration.createDurationValidator();
            validator.ValidatorFor("Duration", durationValidator);

            var selfService = this.vacationDeputyService;
            var deputyConflictFce = function(args:Validation.IError){
                var deferred = Q.defer();

                selfService.isAcceptable(this).then(
                    function(result){
                        args.HasError = false;
                        args.ErrorMessage = "";

                        if (!result){
                            args.HasError = true;
                            args.ErrorMessage = "Deputies conflict. Select another deputy.";
                        }
                        deferred.resolve(undefined);
                    });


                 return deferred.promise;
            }

            var diffNames = {Name: "DeputyConflict", AsyncValidationFce: deputyConflictFce};

            //shared validation
            validator.ValidationFor("DeputyConflict", diffNames);


            return validator;
        }



        private createPersonValidator():Validation.IAbstractValidator<IPerson> {

            //create custom composite validator
            var personValidator = new Validation.AbstractValidator<IPerson>();

            //create validators
            var required = new Validators.RequiredValidator();
            var email = new Validators.EmailValidator();
            var maxLength = new Validators.MaxLengthValidator();
            maxLength.MaxLength = 15;

            //assign validators to properties
            personValidator.RuleFor("FirstName", required);
            personValidator.RuleFor("FirstName", maxLength);

            personValidator.RuleFor("LastName", required);
            personValidator.RuleFor("LastName", maxLength);

            personValidator.RuleFor("Email", required);
            personValidator.RuleFor("Email", email);

            return personValidator;
        }

    }
}

//var moment = require('moment-range');
//var _ = require('underscore');
//var Q = require('q');
//var Validation = require('node-form');
//module.exports = VacationApproval;
