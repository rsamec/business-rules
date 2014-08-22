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
///<reference path='Data.ts'/>
///<reference path='../shared/Data.ts'/>
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
            this.HobbiesNumberValidator = this.MainValidator.Validators["HobbiesCount"];
        }
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
                    args.TranslateArgs = { TranslateId: 'MinHobbies', MessageArgs: this.Hobbies.length };
                    return;
                }
                if (this.Hobbies.length > 4) {
                    args.HasError = true;
                    args.ErrorMessage = "'Do not be greedy. Four hobbies are probably enough!'";
                    args.TranslateArgs = { TranslateId: 'MaxHobbies', MessageArgs: this.Hobbies.length };
                    return;
                }
            };

            validator.Validation({ Name: "HobbiesCount", ValidationFce: hobbiesCountFce });

            return validator;
        };
        BusinessRules.prototype.createPersonValidator = function () {
            //create custom composite validator
            var personValidator = new Validation.AbstractValidator();

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
        };
        BusinessRules.prototype.createItemValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            var required = new Validators.RequiredValidator();
            validator.RuleFor("Name", required);

            return validator;
        };
        return BusinessRules;
    })();
    Hobbies.BusinessRules = BusinessRules;
})(Hobbies || (Hobbies = {}));

var moment = require('moment');
var _ = require('underscore');
var Q = require('q');
var Validation = require('business-rules-engine');
var Validators = require('business-rules-engine/commonjs/BasicValidators');
module.exports = Hobbies;