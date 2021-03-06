///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/BasicValidators.d.ts'/>

///<reference path='../shared/BusinessRules.ts'/>
///<reference path='../shared/Data.ts'/>
///<reference path='Data.ts'/>

"use strict";
module Hobbies {
    /**
     * Business rules for hobbies.
     **/
    export class BusinessRules implements Shared.IBusinessRules{


        /**
         * Business rules name
         */
        public get Name():string  {return "hobbies";}

        /**
         * Hobbies number validator.
         */
        public HobbiesNumberValidator;


        /**
         * Hobbies main validator.
         */
        public MainValidator;

        /**
         * Return all hobbies errors.
         */
        public ValidationResult;


        /**
         * Default constructor.
         * @param data
         */
        constructor(public Data:IHobbiesData) {

            this.MainValidator = this.createMainValidator().CreateRule("Data");

            this.ValidationResult = this.MainValidator.ValidationResult;
            this.HobbiesNumberValidator = this.MainValidator.Validators["Hobbies"];
        }
        public get MainAbstractRule(){return this.createMainValidator();}

        /**
         * Executes all business rules.
         */
        public Validate():Q.Promise<Validation.IValidationResult> {
            this.MainValidator.ValidateAll(this.Data);
            return this.MainValidator.ValidateAsync(this.Data);
        }

        private createMainValidator():Validation.IAbstractValidator<IHobbiesData> {

            //create custom validator
            var validator = new Validation.AbstractValidator<IHobbiesData>();

            validator.ValidatorFor("Person",this.createPersonValidator());
            validator.ValidatorFor("Hobbies",this.createItemValidator(),true);

            var hobbiesCountFce:Validation.IValidate = function(args:Validation.IError){
                args.HasError = false;
                args.ErrorMessage = "";

                if (this.Hobbies === undefined || this.Hobbies.length < 2){
                    args.HasError = true;
                    args.ErrorMessage = "Come on, speak up. Tell us at least two things you enjoy doing";
                    args.TranslateArgs = {TranslateId:'HobbiesCountMin', MessageArgs:this.Hobbies.length};
                    return;
                }
                if (this.Hobbies.length > 4){
                    args.HasError = true;
                    args.ErrorMessage = "'Do not be greedy. Four hobbies are probably enough!'";
                    args.TranslateArgs = {TranslateId:'HobbiesCountMax',MessageArgs:this.Hobbies.length};
                    return;
                }
            };

            validator.Validation({Name:"Hobbies",ValidationFce:hobbiesCountFce});

            return validator;
        }
        private createPersonValidator():Validation.IAbstractValidator<Shared.IPerson> {

            //create custom composite validator
            var personValidator = new Validation.AbstractValidator<Shared.IPerson>();

            //create validators
            var required = new Validators.RequiredValidator();
            var maxLength = new Validators.MaxLengthValidator(15);

            //assign validators to properties
            personValidator.RuleFor("FirstName", required);
            personValidator.RuleFor("FirstName", maxLength);

            personValidator.RuleFor("LastName", required);
            personValidator.RuleFor("LastName", maxLength);

            personValidator.ValidatorFor("Contact",this.createContactValidator());

            return personValidator;
        }
        private createContactValidator():Validation.IAbstractValidator<Shared.IContact> {

            //create custom validator
            var validator = new Validation.AbstractValidator<Shared.IContact>();
            validator.RuleFor("Email",new Validators.RequiredValidator());
            validator.RuleFor("Email", new Validators.MaxLengthValidator(100));
            validator.RuleFor("Email", new Validators.EmailValidator());
            return validator;
        }
        private createItemValidator():Validation.IAbstractValidator<IHobby> {

            //create custom validator
            var validator = new Validation.AbstractValidator<IHobby>();
            validator.RuleFor("HobbyName",new Validators.RequiredValidator());
            return validator;
        }
    }
}