
///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/BasicValidators.d.ts'/>

///<reference path='../shared/BusinessRules.ts'/>
///<reference path='Data.ts'/>

"use strict";
module Invoice {
    /**
     * Business rules for generic invoice.
     **/
    export class BusinessRules implements Shared.IBusinessRules {

        /**
         * Business rules name
         */
        public get Name():string  {return "invoice";}

        /**
         * All business rules for invoice.
         */
        public InvoiceValidator;

        /**
         * Return all invoice errors.
         */
        public ValidationResult;


        /**
         * Default ctor.
         * @param Data Invoice data
         */
        constructor(public Data:IInvoiceData) {

            this.InvoiceValidator = this.createInvoiceValidator().CreateRule("Data");

            this.ValidationResult = this.InvoiceValidator.ValidationResult;
        }


        /**
         * Executes all business rules.
         */
        public Validate():Q.Promise<Validation.IValidationResult> {
            this.InvoiceValidator.ValidateAll(this.Data);
            return this.InvoiceValidator.ValidateAsync(this.Data);
        }

        private createInvoiceValidator():Validation.IAbstractValidator<IInvoiceData> {

            //create custom validator
            var validator = new Validation.AbstractValidator<IInvoiceData>();

            validator.ValidatorFor("Subject",this.createSubjectValidator());

            return validator;
        }
        private createSubjectValidator():Validation.IAbstractValidator<ISubject> {

            //create custom validator
            var validator = new Validation.AbstractValidator<ISubject>();

            //at least one item must be filled
            var anyItemFce = function (args:Validation.IError) {
                args.HasError = false;
                args.ErrorMessage = "";


                if (this.Items !== undefined && this.Items.length === 0) {
                    args.HasError = true;
                    args.ErrorMessage =  "At least one item must be on invoice.";
                    args.TranslateArgs = {TranslateId: "AnyItem", MessageArgs:undefined};
                    return;
                }
            }


            var anyItem = {Name: "AnyItem", ValidationFce: anyItemFce};
            validator.ValidationFor("AnyItem",anyItem);


            //basic items validations
            validator.ValidatorFor("Items",this.createItemValidator(),true);

            return validator;
        }

        private createItemValidator():Validation.IAbstractValidator<IItem> {


            //create custom validator
            var validator = new Validation.AbstractValidator<IItem>();

            var required = new Validators.RequiredValidator();

            validator.RuleFor("Work",required);
            validator.RuleFor("Quantity",required);
            validator.RuleFor("UnitPrice",required);

            var signedDigit = new Validators.SignedDigitValidator();
            var number  = new Validators.NumberValidator();

            validator.RuleFor("Quantity",signedDigit);
            validator.RuleFor("UnitPrice",number);



            return validator;
        }
    }
}