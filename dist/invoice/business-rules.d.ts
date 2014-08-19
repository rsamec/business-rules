/// <reference path="../../typings/q/q.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
/// <reference path="../../typings/node-form/node-form.d.ts" />
/// <reference path="../../typings/node-form/BasicValidators.d.ts" />
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
declare module Invoice {
    /**
    * Data structure for generic invoice.
    */
    interface IInvoiceData {
        /**
        * The unique invoice identifier.
        */
        Number: string;
        /**
        * The date when the invoice was issued.
        */
        Issued: Date;
        /**
        * Company information
        */
        Company: Shared.ICompany;
        /**
        * Project or work name.
        */
        Project: string;
        /**
        * The subject of invoice. List all items.
        */
        Subject: ISubject;
        /**
        * Optional comment.
        */
        Comment?: string;
        /**
        *  The data for the status of vacation approval.
        */
        Approval?: IApproval;
    }
    interface ISubject {
        /**
        * Items on invoice.
        */
        Items: IItem[];
        /**
        * Total invoice price.
        */
        Total: number;
    }
    interface IItem {
        /**
        * Description of work.
        */
        Work: string;
        /**
        * Quantity or hours of work.
        */
        Quantity: number;
        /**
        * Unit price.
        */
        UnitPrice: number;
        /**
        * Price = Quantity * unit price
        */
        SubTotal?: number;
    }
    /**
    * Data structure for payment terms.
    */
    interface IPaymentTerms {
        /**
        * Description of payment terms.
        */
        Description: string;
    }
    /**
    * Data structure for approval data.
    */
    interface IApproval {
        /**
        * Return true if invoice was approved, otherwise false
        */
        Approved: boolean;
        /**
        * Date when the invoice was approved.
        */
        ApprovedDate: Date;
        /**
        * Person that is responsible for invoice approval. Typically this is a manager.
        */
        ApprovedBy: Shared.IPerson;
    }
}
declare module Invoice {
    /**
    * Business rules for generic invoice.
    **/
    class BusinessRules {
        public Data: IInvoiceData;
        /**
        * All business rules for invoice.
        */
        public InvoiceValidator: any;
        /**
        * Return all invoice errors.
        */
        public ValidationResult: any;
        /**
        * Default ctor.
        * @param Data Invoice data
        */
        constructor(Data: IInvoiceData);
        /**
        * Executes all business rules.
        */
        public Validate(): Q.Promise<Validation.IValidationResult>;
        private createInvoiceValidator();
        private createSubjectValidator();
        private createItemValidator();
    }
}
