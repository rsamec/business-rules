///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../shared/Data.ts'/>

"use strict";
module Invoice {

    /**
     * Data structure for generic invoice.
     */
    export interface IInvoiceData {

        /**
         * The unique invoice identifier.
         */
        Number:string

        /**
         * The date when the invoice was issued.
         */
        Issued:Date;

        /**
         * Company information
         */
        Company:Shared.ICompany;

        /**
         * Project or work name.
         */
        Project:string;

        /**
         * The subject of invoice. List all items.
         */
        Subject:ISubject

        /**
         * Optional comment.
         */
        Comment?:string;

        /**
         *  The data for the status of vacation approval.
         */
        Approval?:IApproval;
    }

    export interface ISubject{

        /**
         * Items on invoice.
         */
        Items:Array<IItem>;

        /**
         * Total invoice price.
         */
        Total:number;

    }

    export interface IItem
    {
        /**
         * Description of work.
         */
        Work:string;

        /**
         * Quantity or hours of work.
         */
        Quantity:number;

        /**
         * Unit price.
         */
        UnitPrice:number

        /**
         * Price = Quantity * unit price
         */
        SubTotal?:number;

    }


    /**
     * Data structure for payment terms.
     */
    export interface IPaymentTerms {

        /**
         * Description of payment terms.
         */
        Description: string;
    }


    /**
     * Data structure for approval data.
     */
    export interface IApproval{

        /**
         * Return true if invoice was approved, otherwise false
         */
        Approved:boolean;

        /**
         * Date when the invoice was approved.
         */
        ApprovedDate:Date;

        /**
         * Person that is responsible for invoice approval. Typically this is a manager.
         */
        ApprovedBy:Shared.IPerson;
    }
}