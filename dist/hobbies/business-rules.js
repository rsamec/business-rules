///<reference path='../../../typings/q/Q.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/q/q.d.ts'/>
"use strict";
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../shared/Data.ts'/>
"use strict";
var Hobbies;
(function (_Hobbies) {
    

    

    /**
    * How often do you participate in this hobby.
    */
    (function (HobbyFrequency) {
        HobbyFrequency[HobbyFrequency["Daily"] = 0] = "Daily";
        HobbyFrequency[HobbyFrequency["Weekly"] = 1] = "Weekly";
        HobbyFrequency[HobbyFrequency["Monthly"] = 2] = "Monthly";
    })(_Hobbies.HobbyFrequency || (_Hobbies.HobbyFrequency = {}));
    var HobbyFrequency = _Hobbies.HobbyFrequency;
})(Hobbies || (Hobbies = {}));
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/BasicValidators.d.ts'/>
///<reference path='../shared/BusinessRules.ts'/>
///<reference path='../shared/Data.ts'/>
///<reference path='Data.ts'/>
"use strict";
var Hobbies;
(function (Hobbies) {
    /**
    * Business rules for hobbies.
    **/
    var BusinessRules = (function () {
        /**
        * Default constructor.
        * @param data
        */
        function BusinessRules(Data) {
            this.Data = Data;
            this.MainValidator = this.createMainValidator().CreateRule("Data");

            this.ValidationResult = this.MainValidator.ValidationResult;
            this.HobbiesNumberValidator = this.MainValidator.Validators["Hobbies"];
        }
        Object.defineProperty(BusinessRules.prototype, "Name", {
            /**
            * Business rules name
            */
            get: function () {
                return "hobbies";
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(BusinessRules.prototype, "MainAbstractRule", {
            get: function () {
                return this.createMainValidator();
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Executes all business rules.
        */
        BusinessRules.prototype.Validate = function () {
            this.MainValidator.ValidateAll(this.Data);
            return this.MainValidator.ValidateAsync(this.Data);
        };

        BusinessRules.prototype.createMainValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            validator.ValidatorFor("Person", this.createPersonValidator());
            validator.ValidatorFor("Hobbies", this.createItemValidator(), true);

            var hobbiesCountFce = function (args) {
                args.HasError = false;
                args.ErrorMessage = "";

                if (this.Hobbies === undefined || this.Hobbies.length < 2) {
                    args.HasError = true;
                    args.ErrorMessage = "Come on, speak up. Tell us at least two things you enjoy doing";
                    args.TranslateArgs = { TranslateId: 'HobbiesCountMin', MessageArgs: this.Hobbies.length };
                    return;
                }
                if (this.Hobbies.length > 4) {
                    args.HasError = true;
                    args.ErrorMessage = "'Do not be greedy. Four hobbies are probably enough!'";
                    args.TranslateArgs = { TranslateId: 'HobbiesCountMax', MessageArgs: this.Hobbies.length };
                    return;
                }
            };

            validator.Validation({ Name: "Hobbies", ValidationFce: hobbiesCountFce });

            return validator;
        };
        BusinessRules.prototype.createPersonValidator = function () {
            //create custom composite validator
            var personValidator = new Validation.AbstractValidator();

            //create validators
            var required = new Validators.RequiredValidator();
            var maxLength = new Validators.MaxLengthValidator(15);

            //assign validators to properties
            personValidator.RuleFor("FirstName", required);
            personValidator.RuleFor("FirstName", maxLength);

            personValidator.RuleFor("LastName", required);
            personValidator.RuleFor("LastName", maxLength);

            personValidator.ValidatorFor("Contact", this.createContactValidator());

            return personValidator;
        };
        BusinessRules.prototype.createContactValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();
            validator.RuleFor("Email", new Validators.RequiredValidator());
            validator.RuleFor("Email", new Validators.MaxLengthValidator(100));
            validator.RuleFor("Email", new Validators.EmailValidator());
            return validator;
        };
        BusinessRules.prototype.createItemValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();
            validator.RuleFor("HobbyName", new Validators.RequiredValidator());
            return validator;
        };
        return BusinessRules;
    })();
    Hobbies.BusinessRules = BusinessRules;
})(Hobbies || (Hobbies = {}));
