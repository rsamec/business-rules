///<reference path='../../../typings/moment/moment.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/node-form/node-form.d.ts'/>
"use strict";
module VacationApproval {

    /**
     *  It validates if passed date is week day, for weekends returns not acceptable.
     */
   export class IsWeekdayValidator implements Validation.IPropertyValidator {

        public isAcceptable(s:any) {
            //if date to compare is not specified - defaults to compare against now
            if (!_.isDate(s)) return false;

            var day = moment(s);

            return !(day.isoWeekday() == 6 || day.isoWeekday() == 7)

        }

        tagName = "isWeekday";
   }
}
