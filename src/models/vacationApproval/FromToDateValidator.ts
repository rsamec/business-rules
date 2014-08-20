///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../typings/business-rules-engine/Utils.d.ts'/>

"use strict";
module VacationApproval {

    /**
     *  It validates passed date against constant from and to interval.
     *  You can check that passed date is greater than now and lower than one year for now.
     */
   export class FromToDateValidator implements Validation.IPropertyValidator {

        public isAcceptable(s:any) {
            //if date to compare is not specified - defaults to compare against now
            if (!_.isDate(s)) return false;

            var then = moment(s);

            if (this.From == undefined)  this.From = new Date();
            var now = moment(this.From);

            if (this.To == undefined)  this.To = new Date();
            var now2 = moment(this.To);
            var isValid = this.isValid(now, then, this.FromOperator) && this.isValid(now2, then, this.ToOperator);

            return isValid;
        }

        private isValid(now:any, then:any, compareOperator:Validation.CompareOperator) {
            var isValid = false;


            if (this.IgnoreTime) {
                then = then.startOf('day');
                now = now.startOf('day');
            }
            var diffs:number = then.diff(now);
            if (this.IgnoreTime) diffs = moment.duration(diffs).days();

            if (diffs < 0) {
                isValid = compareOperator == Validation.CompareOperator.LessThan
                    || compareOperator == Validation.CompareOperator.LessThanEqual
                    || compareOperator == Validation.CompareOperator.NotEqual;
            }
            else if (diffs > 0) {
                isValid = compareOperator == Validation.CompareOperator.GreaterThan
                    || compareOperator == Validation.CompareOperator.GreaterThanEqual
                    || compareOperator == Validation.CompareOperator.NotEqual;
            }
            else {
                isValid = compareOperator == Validation.CompareOperator.LessThanEqual
                    || compareOperator == Validation.CompareOperator.Equal
                    || compareOperator == Validation.CompareOperator.GreaterThanEqual;
            }
            return isValid;
        }

        /**
         * It formats error message.
         * @param config localization strings
         * @param args dynamic parameters
         * @returns {string} error message
         */
        public customMessage(config, args):string {
            args = _.clone(args);
            var msg = config["Msg"]

            var format = config["Format"];
            var msgArgs  =  args;
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

        }

        tagName = "dateCompareExt";

        /**
         *  Ignore time part of date when compare dates.
         */
        public IgnoreTime:boolean;

        /**
         * Set the time of compare between passed date and From date.
         */
        public FromOperator:Validation.CompareOperator;

        /**
         * Set the time of compare between passed date and From date.
         */
        public ToOperator:Validation.CompareOperator;

        /**
         * The datetime against the compare is done.
         * If From is not set, then comparison is done against actual datetime.
         */
        public From:Date;
        /**
         * The datetime against the compare is done.
         * If From is not set, then comparison is done against actual datetime.
         */
        public To:Date;
    }
}
