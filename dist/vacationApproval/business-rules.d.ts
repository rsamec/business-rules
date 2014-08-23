/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
/// <reference path="../../typings/business-rules-engine/business-rules-engine.d.ts" />
/// <reference path="../../typings/business-rules-engine/Utils.d.ts" />
/// <reference path="../../typings/q/Q.d.ts" />
/// <reference path="../../typings/business-rules-engine/BasicValidators.d.ts" />
declare module VacationApproval {
    /**
    *  It validates passed date against constant from and to interval.
    *  You can check that passed date is greater than now and lower than one year for now.
    */
    class FromToDateValidator implements Validation.IPropertyValidator {
        public isAcceptable(s: any): boolean;
        private isValid(now, then, compareOperator);
        /**
        * It formats error message.
        * @param config localization strings
        * @param args dynamic parameters
        * @returns {string} error message
        */
        public customMessage(config: any, args: any): string;
        public tagName: string;
        /**
        *  Ignore time part of date when compare dates.
        */
        public IgnoreTime: boolean;
        /**
        * Set the time of compare between passed date and From date.
        */
        public FromOperator: Validation.CompareOperator;
        /**
        * Set the time of compare between passed date and From date.
        */
        public ToOperator: Validation.CompareOperator;
        /**
        * The datetime against the compare is done.
        * If From is not set, then comparison is done against actual datetime.
        */
        public From: Date;
        /**
        * The datetime against the compare is done.
        * If From is not set, then comparison is done against actual datetime.
        */
        public To: Date;
    }
}
declare module VacationApproval {
    /**
    * Data structure for vacation approval.
    */
    interface IVacationApprovalData {
        /**
        * The person with request for vacation.
        */
        Employee?: IPerson;
        /**
        * The person that is deputy for employee on vacation.
        */
        Deputy1?: IPerson;
        /**
        * Alternative person that is deputy for employee on vacation.
        */
        Deputy2?: IPerson;
        /**
        * The interval, the days that the vacation lasts.
        */
        Duration?: IDuration;
        /**
        * Optional comment.
        */
        Comment?: string;
        /**
        *  The data for the status of vacation approval.
        */
        Approval?: IApproval;
    }
    /**
    * Data structure for vacation duration.
    */
    interface IDuration {
        /**
        * Start of interval.
        */
        From: Date;
        /**
        * End of interval.
        */
        To: Date;
        /**
        * The number of days.
        */
        Days?: number;
        /**
        * The days that are explicitly excluded from the interval. E.g. holidays.
        */
        ExcludedDays?: Date[];
    }
    /**
    * Data structure for person.
    */
    interface IPerson {
        /**
        * Return true, if the person (its data) is optional, otherwise false.
        */
        Checked?: boolean;
        /**
        * First name.
        */
        FirstName: string;
        /**
        *Last name
        */
        LastName: string;
        /**
        * Email address.
        */
        Email?: string;
    }
    /**
    * Data structure for approval data.
    */
    interface IApproval {
        /**
        * Return true if vacation was approved by manager, otherwise false
        */
        Approved: boolean;
        /**
        * Date when the vacation was approved.
        */
        ApprovedDate: Date;
        /**
        * Person that is responsible for vacation approval. Typically this is a direct manager.
        */
        ApprovedBy: IPerson;
    }
    /**
    * External service that return true if there is conflict with deputies approved days.
    */
    interface IVacationDeputyService {
        /**
        * Return true, if there is no conflict among employees and its deputies on vacation.
        */
        isAcceptable(data: IVacationApprovalData): Q.Promise<boolean>;
    }
}
declare module VacationApproval {
    /**
    *  It validates if passed date is week day, for weekends returns not acceptable.
    */
    class IsWeekdayValidator implements Validation.IPropertyValidator {
        public isAcceptable(s: any): boolean;
        public tagName: string;
    }
}
declare module VacationApproval {
    class Duration {
        public DataProvider: IVacationApprovalData;
        public Data : IDuration;
        constructor(DataProvider: IVacationApprovalData);
        private FromDatePart;
        private ToDatePart;
        private FromRange;
        private MaxDiffs;
        private MAX_DAYS_DIFF;
        public IsOverLimitRange : boolean;
        private ExcludedDaysDatePart;
        private RangeDaysCount;
        private RangeDays;
        private ExcludedWeekdaysCount;
        private ExcludedWeekdays;
        /**
        * Return the number of days of vacation.
        */
        public RangeWeekdaysCount : number;
        /**
        * Return days of vacation.
        */
        public RangeWeekdays : Moment[];
        /**
        * Return the number of days excluded out of vacation.
        */
        public ExcludedDaysCount : number;
        /**
        * Return days excluded out of vacation.
        */
        public ExcludedDays : Moment[];
        /**
        * Return the number of days of vacation without explicitly excluded days.
        */
        public VacationDaysCount : number;
        /**
        * Return days of vacation without explicitly excluded days.
        */
        public VacationDays : Moment[];
        public createDurationValidator(): Validation.IAbstractValidator<IDuration>;
    }
}
declare module VacationApproval {
    /**
    * Business rules for vacation approval.
    *
    * @class
    * @constructor
    **/
    class BusinessRules {
        public Data: IVacationApprovalData;
        private vacationDeputyService;
        /**
        * Business rules for employee requested the vacation.
        */
        public EmployeeValidator: any;
        /**
        * Business rules for first deputy for employee having the vacation.
        */
        public Deputy1Validator: any;
        /**
        * Business rules for second deputy for employee having the vacation.
        */
        public Deputy2Validator: any;
        /**
        * Business rules for duration of vacation.
        */
        public DurationValidator: any;
        /**
        * Business rules for manager that is responsible for approval of vacation request.
        */
        public ApprovedByValidator: any;
        /**
        *  Deputy conflict - employee that have approved vacation and its someones's deputy at the same days.
        */
        public DeputyConflictsValidator: any;
        /**
        * All business rules for the vacation request.
        */
        public VacationRequestValidator: any;
        /**
        * All business rules for the vacation approval.
        */
        public VacationApprovalValidator: any;
        /**
        * Return vacation request errors.
        */
        public Errors : Validation.IValidationResult;
        /**
        * Return vacation request errors.
        */
        public ValidationResult: Validation.IValidationResult;
        /**
        * Return vacation approval errors.
        */
        public VacationApprovalErrors: any;
        public Duration: Duration;
        constructor(Data: IVacationApprovalData, vacationDeputyService: IVacationDeputyService);
        /**
        * Executes all business rules for validation request.
        */
        public Validate(): Q.Promise<Validation.IValidationResult>;
        /**
        * Executes all business rules for validation approval.
        */
        public ValidateApproval(): Q.Promise<Validation.IValidationResult>;
        private createApprovalValidator();
        private createApprovedByValidator();
        private createVacationRequestValidator();
        private createPersonValidator();
    }
}
