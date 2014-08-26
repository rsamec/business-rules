/// <reference path="../../typings/q/Q.d.ts" />
/// <reference path="../../typings/business-rules-engine/business-rules-engine.d.ts" />
/// <reference path="../../typings/business-rules-engine/BasicValidators.d.ts" />
declare module Shared {
    interface IBusinessRules {
        ValidationResult: Validation.IValidationResult;
        Validate(): Q.Promise<Validation.IValidationResult>;
        Name: string;
    }
}
declare module Shared {
    /**
    * Company information data structure.
    */
    interface ICompany {
        Name: string;
        Address: IAddress;
    }
    /**
    * Address data structure
    */
    interface IAddress {
        /**
        * Street name
        */
        Street: string;
        /**
        * Zip code for city
        */
        ZipCode?: string;
        /**
        * Name of city
        */
        City: string;
        /**
        * Name of state
        */
        State: string;
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
        * Permanent address.
        */
        Address?: IAddress;
        /**
        * Contact information.
        */
        Contact?: IContact;
    }
    interface IContact {
        /**
        * Email address.
        */
        Email?: string;
        /**
        * Work phone.
        */
        WorkPhone?: IPhone;
        /**
        * Mobile phone
        */
        Mobile?: IPhone;
    }
    interface IPhone {
        /**
        * Phone
        */
        Number: string;
    }
}
declare module Hobbies {
    /**
    * Data structure for generic invoice.
    */
    interface IHobbiesData {
        /**
        * Person identification
        */
        Person?: Shared.IPerson;
        /**
        *  The things you enjoy doing.
        */
        Hobbies?: IHobby[];
    }
    /**
    * The things you enjoy doing.
    */
    interface IHobby {
        /**
        * Description of your hobby.
        */
        HobbyName?: string;
        /**
        * How often do you participate in this hobby.
        */
        Frequency?: HobbyFrequency;
        /**
        * Return true if this is a paid hobby, otherwise false.
        */
        Paid?: boolean;
        /**
        * Return true if you would recommend this hobby to a friend, otherwise false.
        */
        Recommedation?: boolean;
    }
    /**
    * How often do you participate in this hobby.
    */
    enum HobbyFrequency {
        Daily = 0,
        Weekly = 1,
        Monthly = 2,
    }
}
declare module Hobbies {
    /**
    * Business rules for hobbies.
    **/
    class BusinessRules implements Shared.IBusinessRules {
        public Data: IHobbiesData;
        /**
        * Business rules name
        */
        public Name : string;
        /**
        * Hobbies number validator.
        */
        public HobbiesNumberValidator: any;
        /**
        * Hobbies main validator.
        */
        public MainValidator: any;
        /**
        * Return all hobbies errors.
        */
        public ValidationResult: any;
        /**
        * Default constructor.
        * @param data
        */
        constructor(Data: IHobbiesData);
        /**
        * Executes all business rules.
        */
        public Validate(): Q.Promise<Validation.IValidationResult>;
        private createMainValidator();
        private createPersonValidator();
        private createItemValidator();
    }
}
