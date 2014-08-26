///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../shared/Data.ts'/>

"use strict";
module Hobbies {

    /**
     * Data structure for generic invoice.
     */
    export interface IHobbiesData {

        /**
         * Person identification
         */
        Person?:Shared.IPerson

        /**
         *  The things you enjoy doing.
         */
        Hobbies?:Array<IHobby>;
    }


    /**
     * The things you enjoy doing.
     */
    export interface IHobby
    {
        /**
         * Description of your hobby.
         */
        HobbyName:string;

        /**
         * How often do you participate in this hobby.
         */
        Frequency?:HobbyFrequency;

        /**
         * Return true if this is a paid hobby, otherwise false.
         */
        Paid?:boolean;


        /**
         * Return true if you would recommend this hobby to a friend, otherwise false.
         */
        Recommedation?:boolean;

    }

    /**
     * How often do you participate in this hobby.
     */
    export enum HobbyFrequency {
        Daily, Weekly, Monthly

    }
}