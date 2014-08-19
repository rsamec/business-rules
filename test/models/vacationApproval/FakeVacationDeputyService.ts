/**
 * Created by rsamec on 29.7.2014.
 */
///<reference path='../../../typings/node/node.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../../../typings/moment/moment.d.ts'/>

///<reference path='../../../dist/vacationApproval/business-rules.d.ts'/>

var _ = require('underscore');
import Q = require('q');

var moment = require('moment-range');

/**
 * @name Custom async property validator example
 * @description
 * Return true for valid BranchOfBusiness, otherwise return false.
 *
 * To create a async custom validator you have to implement IAsyncPropertyValidator interface.
 * Async custom validator must have property isAsync set to true;
 */
class FakeVacationDeputyService {

    /**
     * It checks first deputy in the vacation request with list of all approved vacations that they are not in conflict.
     * @param an {any} vacation request to check
     * @returns {boolean} return true for valid value, otherwise false
     */
    isAcceptable(data:VacationApproval.IVacationApprovalData):Q.Promise<boolean> {
        var deferred = Q.defer<boolean>();

        setTimeout(function () {

            //check if there is something to validate -> check required data for validation
            var namesAreValid = data.Deputy1 !== undefined && data.Deputy1.FirstName !== undefined && data.Deputy1.LastName !== undefined;
            var datesAreValid = _.isDate(data.Duration.From) && _.isDate(data.Duration.To);
            if (!namesAreValid || !datesAreValid) {
                //nothing to validate
                deferred.resolve(true);
                return;
            }

            //fetch items form somewhere - eg. db
            var items =
                [
                    { "approvedDays": [moment(), moment().add('days', 1).startOf('days')], "fullName": "John Smith" },
                    { "approvedDays": [moment().add('days', 1).startOf('days'), moment().add('days', 2).startOf('days')], "fullName": "Paul Neuman" },
                ];

            //find out range
            var durationRange = moment().range(data.Duration.From, data.Duration.To);

            //validation
            var hasSomeConflicts = _.some(items, function (item) {
                return (item.fullName == (data.Deputy1.FirstName + " " + data.Deputy1.LastName) &&
                    _.some(item.approvedDays, function (approvedDay) {
                        return durationRange.contains(approvedDay.startOf('days'));
                    }));
            });
            deferred.resolve(!hasSomeConflicts);
        }, 1000);

        return deferred.promise;
    }
}

export = FakeVacationDeputyService