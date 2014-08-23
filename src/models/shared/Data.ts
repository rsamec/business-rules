///<reference path='../../../typings/q/q.d.ts'/>
"use strict";
module Shared {



    /**
     * Company information data structure.
     */
    export interface ICompany{
        Name:string;
        Address:IAddress;
    }

    /**
     * Address data structure
     */
    export interface  IAddress{
        /**
         * Street name
         */
        Street:string

        /**
         * Zip code for city
         */
        ZipCode?:string;

        /**
         * Name of city
         */
        City:string;

        /**
         * Name of state
         */
        State:string;
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
         * Permanent address.
         */
        Address?:IAddress;

        /**
         * Contact information.
         */
        Contact?:IContact;
    }

    export interface IContact {

        /**
         * Email address.
         */
        Email?:string;

        /**
         * Work phone.
         */
        WorkPhone?:IPhone;

        /**
         * Mobile phone
         */
        Mobile?:IPhone;

    }

    export interface IPhone{

        /**
         * Phone
         */
        Number: string;
    }


}