///<reference path='../../../typings/q/q.d.ts'/>
"use strict";
module VacationApproval {

    /**
     * Data structure for vacation approval.
     */
    export interface IVacationApprovalData {

        /**
         * The person with request for vacation.
         */
        Employee?:IPerson;

        /**
         * The person that is deputy for employee on vacation.
         */
        Deputy1?:IPerson;

        /**
         * Alternative person that is deputy for employee on vacation.
         */
        Deputy2?:IPerson;

        /**
         * The interval, the days that the vacation lasts.
         */
        Duration?:IDuration;

        /**
         * Optional comment.
         */
        Comment?:string;
        /**
         *  The data for the status of vacation approval.
         */
        Approval?:IApproval;
    }

    /**
     * Data structure for vacation duration.
     */
    export interface IDuration {

        /**
         * Start of interval.
         */
        From:Date;

        /**
         * End of interval.
         */
        To:Date;

        /**
         * The number of days.
         */
        Days?:number;

        /**
         * The days that are explicitly excluded from the interval. E.g. holidays.
         */
        ExcludedDays?:Array<Date>;
    }

    /**
     * Data structure for person.
     */
    export interface IPerson {

        /**
         * Return true, if the person (its data) is optional, otherwise false.
         */
        Checked?:boolean;

        /**
         * First name.
         */
        FirstName:string;
        /**
         *Last name
         */
        LastName:string;
        /**
         * Email address.
         */
        Email?:string;
    }

    /**
     * Data structure for approval data.
     */
    export interface IApproval{

        /**
         * Return true if vacation was approved by manager, otherwise false
         */
        Approved:boolean;

        /**
         * Date when the vacation was approved.
         */
        ApprovedDate:Date;

        /**
         * Person that is responsible for vacation approval. Typically this is a direct manager.
         */
        ApprovedBy:IPerson;
    }


    /**
     * External service that return true if there is conflict with deputies approved days.
     */
    export interface IVacationDeputyService {

        /**
         * Return true, if there is no conflict among employees and its deputies on vacation.
         */
        isAcceptable(data:VacationApproval.IVacationApprovalData):Q.Promise<boolean>
    }

}