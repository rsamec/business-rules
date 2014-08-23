///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/Utils.d.ts'/>
"use strict";
var VacationApproval;
(function (VacationApproval) {
    /**
    *  It validates passed date against constant from and to interval.
    *  You can check that passed date is greater than now and lower than one year for now.
    */
    var FromToDateValidator = (function () {
        function FromToDateValidator() {
            this.tagName = "dateCompareExt";
        }
        FromToDateValidator.prototype.isAcceptable = function (s) {
            //if date to compare is not specified - defaults to compare against now
            if (!_.isDate(s))
                return false;

            var then = moment(s);

            if (this.From == undefined)
                this.From = new Date();
            var now = moment(this.From);

            if (this.To == undefined)
                this.To = new Date();
            var now2 = moment(this.To);
            var isValid = this.isValid(now, then, this.FromOperator) && this.isValid(now2, then, this.ToOperator);

            return isValid;
        };

        FromToDateValidator.prototype.isValid = function (now, then, compareOperator) {
            var isValid = false;

            if (this.IgnoreTime) {
                then = then.startOf('day');
                now = now.startOf('day');
            }
            var diffs = then.diff(now);
            if (this.IgnoreTime)
                diffs = moment.duration(diffs).days();

            if (diffs < 0) {
                isValid = compareOperator == 0 /* LessThan */ || compareOperator == 1 /* LessThanEqual */ || compareOperator == 3 /* NotEqual */;
            } else if (diffs > 0) {
                isValid = compareOperator == 5 /* GreaterThan */ || compareOperator == 4 /* GreaterThanEqual */ || compareOperator == 3 /* NotEqual */;
            } else {
                isValid = compareOperator == 1 /* LessThanEqual */ || compareOperator == 2 /* Equal */ || compareOperator == 4 /* GreaterThanEqual */;
            }
            return isValid;
        };

        /**
        * It formats error message.
        * @param config localization strings
        * @param args dynamic parameters
        * @returns {string} error message
        */
        FromToDateValidator.prototype.customMessage = function (config, args) {
            args = _.clone(args);
            var msg = config["Msg"];

            var format = config["Format"];
            var msgArgs = args;
            if (format != undefined) {
                msgArgs = {
                    FormatedFrom: moment(args.From).format(format),
                    FormatedTo: moment(args.To).format(format),
                    FormatedAttemptedValue: moment(args.AttemptedValue).format(format)
                };
            }

            msg = msg.replace('From', 'FormatedFrom');
            msg = msg.replace('To', 'FormatedTo');
            msg = msg.replace('AttemptedValue', 'FormatedAttemptedValue');

            return Utils.StringFce.format(msg, msgArgs);
        };
        return FromToDateValidator;
    })();
    VacationApproval.FromToDateValidator = FromToDateValidator;
})(VacationApproval || (VacationApproval = {}));
///<reference path='../../../typings/q/q.d.ts'/>
"use strict";
///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
"use strict";
var VacationApproval;
(function (VacationApproval) {
    /**
    *  It validates if passed date is week day, for weekends returns not acceptable.
    */
    var IsWeekdayValidator = (function () {
        function IsWeekdayValidator() {
            this.tagName = "isWeekday";
        }
        IsWeekdayValidator.prototype.isAcceptable = function (s) {
            //if date to compare is not specified - defaults to compare against now
            if (!_.isDate(s))
                return false;

            var day = moment(s);

            return !(day.isoWeekday() == 6 || day.isoWeekday() == 7);
        };
        return IsWeekdayValidator;
    })();
    VacationApproval.IsWeekdayValidator = IsWeekdayValidator;
})(VacationApproval || (VacationApproval = {}));
///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/BasicValidators.d.ts'/>
///<reference path='FromToDateValidator.ts'/>
///<reference path='IsWeekdayValidator.ts'/>
///<reference path='Data.ts'/>
"use strict";
var VacationApproval;
(function (VacationApproval) {
    var Duration = (function () {
        function Duration(DataProvider) {
            this.DataProvider = DataProvider;
            this.MAX_DAYS_DIFF = 35;
            _.mixin({
                //returns true if source has all the properties(nested) of target.
                contains: function (obj, target) {
                    if (obj == null)
                        return false;
                    if (obj.length !== +obj.length)
                        obj = _.values(obj);

                    if (_.every(obj, function (item) {
                        return moment.isMoment(item);
                    })) {
                        return _.any(obj, function (item) {
                            return item.isSame(target);
                        });
                    } else {
                        return _.indexOf(obj, target) >= 0;
                    }
                }
            });
        }
        Object.defineProperty(Duration.prototype, "Data", {
            get: function () {
                return this.DataProvider.Duration;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "FromDatePart", {
            get: function () {
                return moment(this.Data.From).startOf('days');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Duration.prototype, "ToDatePart", {
            get: function () {
                return moment(this.Data.To).startOf('days');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Duration.prototype, "FromRange", {
            get: function () {
                return moment()["range"](this.FromDatePart, this.ToDatePart);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Duration.prototype, "MaxDiffs", {
            get: function () {
                return this.ToDatePart.diff(this.FromDatePart, 'days');
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "IsOverLimitRange", {
            get: function () {
                return this.MaxDiffs > this.MAX_DAYS_DIFF;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "ExcludedDaysDatePart", {
            get: function () {
                return _.map(this.Data.ExcludedDays, function (item) {
                    return moment(item).startOf('days');
                });
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "RangeDaysCount", {
            get: function () {
                return this.RangeDays.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Duration.prototype, "RangeDays", {
            get: function () {
                var days = [];

                //limit maximal range - performance reason
                if (this.IsOverLimitRange)
                    return days;

                this.FromRange.by('days', function (day) {
                    days.push(day);
                });
                return days;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Duration.prototype, "ExcludedWeekdaysCount", {
            get: function () {
                return this.ExcludedWeekdays.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Duration.prototype, "ExcludedWeekdays", {
            get: function () {
                var weekends = [];

                //limit maximal range - performance reason
                if (this.IsOverLimitRange)
                    return weekends;
                this.FromRange.by('days', function (day) {
                    if (day.isoWeekday() == 6 || day.isoWeekday() == 7)
                        weekends.push(day);
                });
                return weekends;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "RangeWeekdaysCount", {
            /**
            * Return the number of days of vacation.
            */
            get: function () {
                return this.RangeWeekdays.length;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "RangeWeekdays", {
            /**
            * Return days of vacation.
            */
            get: function () {
                return _.difference(this.RangeDays, this.ExcludedWeekdays);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "ExcludedDaysCount", {
            /**
            * Return the number of days excluded out of vacation.
            */
            get: function () {
                return this.ExcludedDays.length;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "ExcludedDays", {
            /**
            * Return days excluded out of vacation.
            */
            get: function () {
                if (this.Data.ExcludedDays == undefined || this.Data.ExcludedDays.length == 0)
                    return this.ExcludedWeekdays;
                return _.union(this.ExcludedWeekdays, this.ExcludedDaysDatePart);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "VacationDaysCount", {
            /**
            * Return the number of days of vacation without explicitly excluded days.
            */
            get: function () {
                if (this.IsOverLimitRange)
                    return this.MaxDiffs;
                return this.VacationDays.length;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Duration.prototype, "VacationDays", {
            /**
            * Return days of vacation without explicitly excluded days.
            */
            get: function () {
                return _.difference(this.RangeDays, this.ExcludedDays);
            },
            enumerable: true,
            configurable: true
        });

        Duration.prototype.createDurationValidator = function () {
            //create custom composite validator
            var validator = new Validation.AbstractValidator();

            //create validators
            var required = new Validators.RequiredValidator();
            var weekDay = new VacationApproval.IsWeekdayValidator();
            var greaterThanToday = new VacationApproval.FromToDateValidator();
            greaterThanToday.FromOperator = 4 /* GreaterThanEqual */;
            greaterThanToday.From = new Date();
            greaterThanToday.ToOperator = 1 /* LessThanEqual */;
            greaterThanToday.To = moment(new Date()).add({ year: 1 }).toDate();
            greaterThanToday.IgnoreTime = true;

            //assign validators to properties
            validator.RuleFor("From", required);
            validator.RuleFor("To", required);

            validator.RuleFor("From", weekDay);
            validator.RuleFor("To", weekDay);

            validator.RuleFor("From", greaterThanToday);
            validator.RuleFor("To", greaterThanToday);

            //create custom message for validation
            var customErrorMessage = function (config, args) {
                var msg = config["Msg"];

                var format = config["Format"];
                if (format != undefined) {
                    _.extend(args, {
                        FormatedFrom: moment(args.From).format(format),
                        FormatedTo: moment(args.To).format(format),
                        FormatedAttemptedValue: moment(args.AttemptedValue).format(format)
                    });
                }

                msg = msg.replace('From', 'FormatedFrom');
                msg = msg.replace('To', 'FormatedTo');
                msg = msg.replace('AttemptedValue', 'FormatedAttemptedValue');
                return Utils.StringFce.format(msg, args);
            };

            var self = this;

            //create validator function
            var vacationDurationFce = function (args) {
                args.HasError = false;
                args.ErrorMessage = "";

                //no dates - > nothing to validate
                if (!_.isDate(this.From) || !_.isDate(this.To))
                    return;

                if (self.FromDatePart.isAfter(self.ToDatePart)) {
                    args.HasError = true;
                    args.ErrorMessage = customErrorMessage({ Msg: "Date from '{From}' must be before date to '{To}'.", Format: 'MM/DD/YYYY' }, this);
                    args.TranslateArgs = { TranslateId: 'BeforeDate', MessageArgs: this, CustomMessage: customErrorMessage };
                    return;
                }

                var minDays = 1;
                var maxDays = 25;

                //maximal duration
                if (self.IsOverLimitRange || (self.VacationDaysCount > maxDays || self.VacationDaysCount < minDays)) {
                    args.HasError = true;
                    var messageArgs = { MaxDays: maxDays, MinDays: minDays };
                    args.ErrorMessage = Utils.StringFce.format("Vacation duration value must be between {MinDays] and {MaxDays} days.", messageArgs);
                    args.TranslateArgs = { TranslateId: 'RangeDuration', MessageArgs: messageArgs };
                    return;
                }

                var diff = _.difference(self.ExcludedDaysDatePart, self.RangeDays);
                if (diff.length != 0) {
                    args.HasError = true;
                    var messageArgs2 = { ExcludedDates: _.reduce(diff, function (memo, item) {
                            return memo + item.format("MM/DD/YYYY");
                        }) };
                    args.ErrorMessage = Utils.StringFce.format("Excluded days are not in range. '{ExcludedDates}'.", messageArgs2);
                    args.TranslateArgs = { TranslateId: 'ExcludedDaysMsg', MessageArgs: messageArgs2 };
                    return;
                }
            };

            //wrap validator function to named shared validation
            var validatorFce = { Name: "VacationDuration", ValidationFce: vacationDurationFce };

            //assigned shared validation to properties
            validator.ValidationFor("From", validatorFce);
            validator.ValidationFor("To", validatorFce);

            return validator;
        };
        return Duration;
    })();
    VacationApproval.Duration = Duration;
})(VacationApproval || (VacationApproval = {}));
///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/BasicValidators.d.ts'/>
///<reference path='FromToDateValidator.ts'/>
///<reference path='Data.ts'/>
///<reference path='Duration.ts'/>
"use strict";
var VacationApproval;
(function (VacationApproval) {
    /**
    * Business rules for vacation approval.
    *
    * @class
    * @constructor
    **/
    var BusinessRules = (function () {
        function BusinessRules(Data, vacationDeputyService) {
            this.Data = Data;
            this.vacationDeputyService = vacationDeputyService;
            this.Duration = new VacationApproval.Duration(this.Data);

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
            this.Deputy1Validator.SetOptional(function () {
                return this.Approval == undefined || this.Approval.ApprovedBy.Checked;
            }.bind(this.Data));

            this.Deputy2Validator.SetOptional(function () {
                return this.Deputy2 == undefined || !this.Deputy2.Checked;
            }.bind(this.Data));

            this.VacationApprovalErrors = this.VacationApprovalValidator.ValidationResult.Errors;
            this.ValidationResult = this.VacationRequestValidator.ValidationResult;
        }
        Object.defineProperty(BusinessRules.prototype, "Errors", {
            /**
            * Return vacation request errors.
            */
            get: function () {
                return this.ValidationResult;
            },
            enumerable: true,
            configurable: true
        });

        /**
        * Executes all business rules for validation request.
        */
        BusinessRules.prototype.Validate = function () {
            this.VacationRequestValidator.ValidateAll(this.Data);
            return this.DeputyConflictsValidator.ValidateAsync(this.Data);
        };

        /**
        * Executes all business rules for validation approval.
        */
        BusinessRules.prototype.ValidateApproval = function () {
            this.VacationApprovalValidator.ValidateAll(this.Data);
            return this.DeputyConflictsValidator.ValidateAsync(this.Data);
        };

        BusinessRules.prototype.createApprovalValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            //create approvedBy validator
            validator.ValidatorFor("Approval", this.createApprovedByValidator());

            //add custom validation
            var validateApprovedByLessThanEqualFormFce = function (args) {
                args.HasError = false;
                args.ErrorMessage = "";

                var greaterThanToday = new VacationApproval.FromToDateValidator();
                greaterThanToday.FromOperator = 4 /* GreaterThanEqual */;
                greaterThanToday.From = new Date();
                greaterThanToday.ToOperator = 1 /* LessThanEqual */;
                greaterThanToday.To = this.Duration.From;
                greaterThanToday.IgnoreTime = true;

                if (!greaterThanToday.isAcceptable(this.Approval.ApprovedDate)) {
                    args.HasError = true;
                    args.ErrorMessage = greaterThanToday.customMessage({
                        "Format": "MM/DD/YYYY",
                        "Msg": "Date must be between ('{From}' - '{To}')."
                    }, greaterThanToday);
                    args.TranslateArgs = { TranslateId: greaterThanToday.tagName, MessageArgs: greaterThanToday, CustomMessage: greaterThanToday.customMessage };
                    return;
                }
            };

            var approvedByLessThanEqualForm = { Name: "ApprovedByLessThanEqualFrom", ValidationFce: validateApprovedByLessThanEqualFormFce };
            validator.ValidationFor("ApprovedByLessThanEqualFrom", approvedByLessThanEqualForm);

            return validator;
        };

        BusinessRules.prototype.createApprovedByValidator = function () {
            var approvalValidator = new Validation.AbstractValidator();
            approvalValidator.ValidatorFor("ApprovedBy", this.createPersonValidator());
            return approvalValidator;
        };
        BusinessRules.prototype.createVacationRequestValidator = function () {
            //create custom validator
            var validator = new Validation.AbstractValidator();

            var personValidator = this.createPersonValidator();
            validator.ValidatorFor("Employee", personValidator);
            validator.ValidatorFor("Approval", this.createApprovedByValidator());
            validator.ValidatorFor("Deputy1", personValidator);
            validator.ValidatorFor("Deputy2", personValidator);

            var durationValidator = this.Duration.createDurationValidator();
            validator.ValidatorFor("Duration", durationValidator);

            var selfService = this.vacationDeputyService;
            var deputyConflictFce = function (args) {
                var deferred = Q.defer();

                selfService.isAcceptable(this).then(function (result) {
                    args.HasError = false;
                    args.ErrorMessage = "";

                    if (!result) {
                        args.HasError = true;
                        args.ErrorMessage = "Deputies conflict. Select another deputy.";
                    }
                    deferred.resolve(undefined);
                });

                return deferred.promise;
            };

            var diffNames = { Name: "DeputyConflict", AsyncValidationFce: deputyConflictFce };

            //shared validation
            validator.ValidationFor("DeputyConflict", diffNames);

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
        return BusinessRules;
    })();
    VacationApproval.BusinessRules = BusinessRules;
})(VacationApproval || (VacationApproval = {}));
//var moment = require('moment-range');
//var _ = require('underscore');
//var Q = require('q');
//var Validation = require('business-rules-engine');
//module.exports = VacationApproval;

var moment = require('moment-range');
var _ = require('underscore');
var Q = require('q');
var Validation = require('business-rules-engine');
var Validators = require('business-rules-engine/commonjs/BasicValidators');
var Utils = require('business-rules-engine/commonjs/Utils');
module.exports = VacationApproval;