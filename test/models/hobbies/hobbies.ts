///<reference path='../../../typings/mocha/mocha.d.ts'/>
///<reference path='../../../typings/node/node.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../dist/hobbies/business-rules.d.ts'/>

var Validation = require('business-rules-engine');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');


var moment = require('moment');
var Hobbies = require('../../../dist/hobbies/node-business-rules.js');

describe('business rules for hobbies', function () {
    //create test data
    var data:Hobbies.IHobbiesData;

    //business rules for vacation approval
    var businessRules;

    beforeEach(function () {
        //setup
        data = {};
        businessRules = new Hobbies.BusinessRules(data);
    });

    describe('hobbies', function () {

        describe('first name + last name', function () {

            it('fill no names', function () {
                //when

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.ValidationResult.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.ValidationResult.Errors["Person"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill empty names', function () {
                //when
                data.Person = {
                    FirstName: '',
                    LastName: ''
                };
                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.ValidationResult.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.ValidationResult.Errors["Person"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill long names', function () {
                //when
                data.Person = {
                    FirstName: 'too looooooooooooong first name',
                    LastName: 'too looooooooooooong last name'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.ValidationResult.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.ValidationResult.Errors["Person"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill some names', function () {
                //when
                data.Person = {
                    FirstName: 'John',
                    LastName: 'Smith'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.ValidationResult.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(false);
                expect(businessRules.ValidationResult.Errors["Person"].Errors["LastName"].HasErrors).to.equal(false);
            });
        });

        describe('items', function () {

            it('fill no item', function () {
                //when
                data.Hobbies = [];

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.HobbiesNumberValidator.HasError).to.equal(true);
            });

            it('fill two items', function () {
                //when
                data.Hobbies = [
                    {Name:"Skiing"}, {Name:'Chess'}
                ]

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.HobbiesNumberValidator.HasError).to.equal(false)
            });

            it('fill five items', function () {
                //when
                data.Hobbies = [
                    {Name:"Skiing"}, {Name:'Chess'}, {Name:"Skiing 2"}, {Name:'Chess 2'}, {Name:"Skiing 3"}
                ]

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.HobbiesNumberValidator.HasError).to.equal(true)
            });

        });
    });
});
