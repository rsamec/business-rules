///<reference path='../../../typings/q/q.d.ts'/>
"use strict";
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../shared/Data.ts'/>
"use strict";
///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/BasicValidators.d.ts'/>
///<reference path='Data.ts'/>
"use strict";
var Invoice;
(function (Invoice) {
    /**
    * Business rules for generic invoice.
    **/
    var BusinessRules = (function () {
        /**
        * Default ctor.
        * @param Data Invoice data
        */
        function BusinessRules(Data) {
            this.Data = Data;
            this.InvoiceValidator = this.createInvoiceValidator().CreateRule("Data");

            this.ValidationResult = this.InvoiceValidator.ValidationResult;
        }
        /**
        * Executes all business rules.
        */
        BusinessRules.prototype.Validate = function () {
            this.InvoiceValidator.ValidateAll(this.Data);
            return this.InvoiceValidator.ValidateAsync(this.Data);
        };

        BusinessRules.prototype.createInvoiceValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            validator.ValidatorFor("Subject", this.createSubjectValidator());

            return validator;
        };
        BusinessRules.prototype.createSubjectValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            //at least one item must be filled
            var anyItemFce = function (args) {
                args.HasError = false;
                args.ErrorMessage = "";

                if (this.Items !== undefined && this.Items.length === 0) {
                    args.HasError = true;
                    args.ErrorMessage = "At least one item must be on invoice.";
                    args.TranslateArgs = { TranslateId: "AnyItem", MessageArgs: undefined };
                    return;
                }
            };

            var anyItem = { Name: "AnyItem", ValidationFce: anyItemFce };
            validator.ValidationFor("AnyItem", anyItem);

            //basic items validations
            validator.ValidatorFor("Items", this.createItemValidator(), true);

            return validator;
        };

        BusinessRules.prototype.createItemValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            var required = new Validators.RequiredValidator();

            validator.RuleFor("Work", required);
            validator.RuleFor("Quantity", required);
            validator.RuleFor("UnitPrice", required);

            var signedDigit = new Validators.SignedDigitValidator();
            var number = new Validators.NumberValidator();

            validator.RuleFor("Quantity", signedDigit);
            validator.RuleFor("UnitPrice", number);

            return validator;
        };
        return BusinessRules;
    })();
    Invoice.BusinessRules = BusinessRules;
})(Invoice || (Invoice = {}));

var moment = require('moment');
var _ = require('underscore');
var Q = require('q');
var Validation = require('business-rules-engine');
var Validators = require('business-rules-engine/commonjs/BasicValidators');
var Utils = require('business-rules-engine/commonjs/Utils');
module.exports = Invoice;